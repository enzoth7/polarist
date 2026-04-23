import { useQuery } from "@tanstack/react-query";

import {
  RADAR_MOCK_MODELS,
  buildRadarMetricCards,
  type ArtificialAnalysisModel,
  type RadarMetricCard,
  type RadarMetricKey,
  type RadarMetricPoint,
} from "@/lib/artificialAnalysisMetrics";

const ARTIFICIAL_ANALYSIS_API_URL = "/api/metrics";
const RADAR_MODELS_LIMIT = 10;
const CLIENT_FETCH_TIMEOUT_MS = 20_000;

type ArtificialAnalysisResponse = {
  data?: ArtificialAnalysisModel[];
  error?: string;
  details?: string;
  message?: string;
  upstreamStatus?: number;
};

const parseJsonSafely = <T>(value: string) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const buildInvalidPayloadErrorMessage = (rawPayload: string) => {
  const trimmedPayload = rawPayload.trim();

  if (trimmedPayload.startsWith("<!DOCTYPE") || trimmedPayload.startsWith("<html")) {
    return "El proxy devolvio HTML en lugar de JSON. Usa `vercel dev` o se activara el mock local.";
  }

  return "Artificial Analysis no devolvio una lista de modelos valida.";
};

async function fetchArtificialAnalysisModelsFromProxy(signal?: AbortSignal) {
  const response = await fetch(ARTIFICIAL_ANALYSIS_API_URL, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const rawPayload = await response.text();
  const payload = parseJsonSafely<ArtificialAnalysisResponse>(rawPayload);

  if (!response.ok) {
    const detail =
      payload?.error ||
      payload?.details ||
      payload?.message ||
      response.statusText ||
      "error desconocido";

    throw new Error(`No se pudieron cargar las metricas desde /api/metrics (${response.status}): ${detail}.`);
  }

  if (!payload?.data || !Array.isArray(payload.data)) {
    throw new Error(buildInvalidPayloadErrorMessage(rawPayload));
  }

  return payload.data;
}

const isAbortError = (error: unknown) =>
  error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";

export async function fetchArtificialAnalysisModels(signal?: AbortSignal) {
  // Timeout del cliente para no depender del servidor
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);

  try {
    const models = await fetchArtificialAnalysisModelsFromProxy(controller.signal);
    return models;
  } catch (error) {
    // Si react-query canceló la query (unmount), propagar
    if (isAbortError(error) && signal?.aborted) {
      throw error;
    }
    // Cualquier otro fallo: timeout, API caída, key no configurada → mock
    console.warn(
      "[useArtificialAnalysis] API no disponible, usando mock data.",
      error instanceof Error ? error.message : error,
    );
    return RADAR_MOCK_MODELS;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Datos placeholder pre-calculados: se muestran instantáneamente mientras carga la API
const PLACEHOLDER_METRIC_CARDS = buildRadarMetricCards(RADAR_MOCK_MODELS);

export function useArtificialAnalysis(limit = RADAR_MODELS_LIMIT) {
  return useQuery({
    queryKey: ["artificial-analysis", "radar-metrics", limit],
    queryFn: ({ signal }) => fetchArtificialAnalysisModels(signal),
    select: (models) => buildRadarMetricCards(models, limit),
    // placeholderData: muestra mock inmediatamente → isLoading es false desde el render 1.
    // Si la API real responde, reemplaza. Si falla, el mock queda visible. Skeleton nunca se cuelga.
    placeholderData: PLACEHOLDER_METRIC_CARDS,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export type {
  ArtificialAnalysisModel,
  RadarMetricCard,
  RadarMetricKey,
  RadarMetricPoint,
} from "@/lib/artificialAnalysisMetrics";

export { RADAR_MOCK_MODELS, buildRadarMetricCards } from "@/lib/artificialAnalysisMetrics";
