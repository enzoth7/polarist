export const config = { runtime: 'nodejs' };

const ARTIFICIAL_ANALYSIS_API_URL = "https://artificialanalysis.ai/api/v2/data/llms/models";
const SUCCESS_CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=600";
const NO_STORE_CACHE_CONTROL = "no-store";
const REQUEST_TIMEOUT_MS = 9_000; // Al límite de Vercel Hobby (10s)

const parseJsonSafely = (value: string): unknown => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const getPayloadMessage = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  if ("message" in payload && typeof payload.message === "string") {
    return payload.message;
  }

  return null;
};

const createJsonResponse = (
  body: unknown,
  {
    status = 200,
    cacheControl = SUCCESS_CACHE_CONTROL,
    headers,
  }: {
    status?: number;
    cacheControl?: string;
    headers?: HeadersInit;
  } = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": cacheControl,
      "Vercel-CDN-Cache-Control": cacheControl,
      ...headers,
    },
  });

async function handleMetricsRequest(request: Request) {
  if (request.method !== "GET") {
    return createJsonResponse(
      {
        error: "Method not allowed. Use GET /api/metrics.",
      },
      {
        status: 405,
        cacheControl: NO_STORE_CACHE_CONTROL,
        headers: {
          Allow: "GET",
        },
      },
    );
  }

  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY?.trim();

  if (!apiKey) {
    return createJsonResponse(
      {
        error: "ARTIFICIAL_ANALYSIS_API_KEY is not configured on the server.",
      },
      {
        status: 500,
        cacheControl: NO_STORE_CACHE_CONTROL,
      },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(ARTIFICIAL_ANALYSIS_API_URL, {
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      signal: controller.signal,
    });

    const rawBody = await upstreamResponse.text();
    const parsedBody = parseJsonSafely(rawBody);

    if (!upstreamResponse.ok) {
      return createJsonResponse(
        {
          error: `Artificial Analysis responded with ${upstreamResponse.status}.`,
          details:
            getPayloadMessage(parsedBody) ??
            rawBody.slice(0, 500) ??
            "The upstream API returned an unknown error.",
          upstreamStatus: upstreamResponse.status,
        },
        {
          status: 502,
          cacheControl: NO_STORE_CACHE_CONTROL,
        },
      );
    }

    if (!parsedBody || typeof parsedBody !== "object") {
      return createJsonResponse(
        {
          error: "Artificial Analysis returned an invalid JSON payload.",
        },
        {
          status: 502,
          cacheControl: NO_STORE_CACHE_CONTROL,
        },
      );
    }

    // Normalizar la respuesta: el hook espera { data: ArtificialAnalysisModel[] }.
    // La API puede devolver: array directo, { data: [] }, { models: [] }, u otro objeto.
    const body = parsedBody as Record<string, unknown>;
    let models: unknown;

    if (Array.isArray(parsedBody)) {
      // Caso: [...models]
      models = parsedBody;
    } else if (Array.isArray(body["data"])) {
      // Caso más común: { data: [...] }
      models = body["data"];
    } else if (Array.isArray(body["models"])) {
      // Alternativo: { models: [...] }
      models = body["models"];
    } else {
      // Fallback: pasar el objeto crudo y dejar que el hook lo valide
      models = parsedBody;
    }

    return createJsonResponse({ data: models });
  } catch (error) {
    // AbortError puede venir como DOMException (Edge) o Error genérico (Node.js)
    const isAbortError =
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError");

    if (isAbortError) {
      return createJsonResponse(
        {
          error: "Timed out while contacting Artificial Analysis (8s).",
        },
        {
          status: 504,
          cacheControl: NO_STORE_CACHE_CONTROL,
        },
      );
    }

    return createJsonResponse(
      {
        error: "The metrics proxy failed to reach Artificial Analysis.",
        details: error instanceof Error ? error.message : "Unknown proxy error.",
        stack: error instanceof Error ? error.stack?.slice(0, 200) : undefined,
      },
      {
        status: 502,
        cacheControl: NO_STORE_CACHE_CONTROL,
      },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(request: Request) {
  try {
    return await handleMetricsRequest(request);
  } catch (error) {
    return createJsonResponse(
      {
        error: "The metrics proxy crashed before completing the request.",
        details: error instanceof Error ? error.message : "Unknown proxy error.",
      },
      {
        status: 500,
        cacheControl: NO_STORE_CACHE_CONTROL,
      },
    );
  }
}
