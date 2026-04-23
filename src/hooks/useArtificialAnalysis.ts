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
const CLIENT_FETCH_TIMEOUT_MS = 7_000;

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
  // Timeout propio del cliente para no depender solo del servidor
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);

  // Combinar la señal externa (react-query) con la de timeout
  const combinedSignal = signal
    ? AbortSignal.any
      ? AbortSignal.any([signal, controller.signal])
      : controller.signal
    : controller.signal;

  try {
    const models = await fetchArtificialAnalysisModelsFromProxy(combinedSignal);
    return models;
  } catch (error) {
    // Si react-query cancela la query (unmount), propagar
    if (isAbortError(error) && signal?.aborted) {
      throw error;
    }

    // En cualquier otro caso (timeout, API caída, key no configurada)
    // usar mock data para que la página siempre muestre algo
    console.warn(
      "[useArtificialAnalysis] API no disponible, usando mock data.",
      error instanceof Error ? error.message : error,
    );
    return RADAR_MOCK_MODELS;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useArtificialAnalysis(limit = RADAR_MODELS_LIMIT) {
  return useQuery({
    queryKey: ["artificial-analysis", "radar-metrics", limit],
    queryFn: ({ signal }) => fetchArtificialAnalysisModels(signal),
    select: (models) => buildRadarMetricCards(models, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false, // el fallback a mock ya está en fetchArtificialAnalysisModels
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
