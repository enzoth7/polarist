import { useQuery } from "@tanstack/react-query";

import { getModelVisual, type ModelVisual } from "@/lib/modelIcons";

const ARTIFICIAL_ANALYSIS_API_URL = "/api/metrics";
const RADAR_MODELS_LIMIT = 10;

type BetterDirection = "higher" | "lower";

export type ArtificialAnalysisModel = {
  id: string;
  name: string;
  slug: string;
  model_creator: {
    name: string;
    slug: string;
  };
  evaluations?: {
    artificial_analysis_intelligence_index?: number | null;
  } | null;
  pricing?: {
    price_1m_blended_3_to_1?: number | null;
  } | null;
  median_output_tokens_per_second?: number | null;
};

type ArtificialAnalysisResponse = {
  data?: ArtificialAnalysisModel[];
  error?: string;
  details?: string;
  message?: string;
  upstreamStatus?: number;
};

export type RadarMetricKey = "intelligence" | "speed" | "price";

export type RadarMetricPoint = {
  id: string;
  rank: number;
  label: string;
  slug: string;
  creatorName: string;
  creatorSlug: string;
  value: number;
  displayValue: string;
  detailValue: string;
  visual: ModelVisual;
};

export type RadarMetricCard = {
  key: RadarMetricKey;
  title: string;
  subtitle: string;
  better: BetterDirection;
  points: RadarMetricPoint[];
};

type MetricDefinition = {
  key: RadarMetricKey;
  title: string;
  subtitle: string;
  better: BetterDirection;
  getValue: (model: ArtificialAnalysisModel) => number | null | undefined;
};

const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: "intelligence",
    title: "INTELIGENCIA",
    subtitle: "Artificial Analysis Intelligence Index",
    better: "higher",
    getValue: (model) => model.evaluations?.artificial_analysis_intelligence_index,
  },
  {
    key: "speed",
    title: "VELOCIDAD",
    subtitle: "Mediana de tokens de salida por segundo",
    better: "higher",
    getValue: (model) => model.median_output_tokens_per_second,
  },
  {
    key: "price",
    title: "PRECIO",
    subtitle: "Costo blended por 1M de tokens",
    better: "lower",
    getValue: (model) => model.pricing?.price_1m_blended_3_to_1,
  },
];

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const compactPriceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

const isFinitePositiveNumber = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const formatMetricValue = (metricKey: RadarMetricKey, value: number) => {
  if (metricKey === "price") {
    return value < 1 ? value.toFixed(2) : compactPriceFormatter.format(value);
  }

  return numberFormatter.format(Math.round(value));
};

const formatMetricDetailValue = (metricKey: RadarMetricKey, value: number) => {
  if (metricKey === "price") {
    return `US$ ${decimalFormatter.format(value)} / 1M tok`;
  }

  if (metricKey === "speed") {
    return `${numberFormatter.format(Math.round(value))} tok/s`;
  }

  return `${numberFormatter.format(Math.round(value))} pts`;
};

export function buildRadarMetricCards(models: ArtificialAnalysisModel[], limit = RADAR_MODELS_LIMIT) {
  return METRIC_DEFINITIONS.map((metric) => {
    const points = models
      .map((model) => {
        const value = metric.getValue(model);

        if (!isFinitePositiveNumber(value)) {
          return null;
        }

        return {
          id: model.id,
          rank: 0,
          label: model.name,
          slug: model.slug,
          creatorName: model.model_creator?.name ?? "Proveedor desconocido",
          creatorSlug: model.model_creator?.slug ?? "",
          value,
          displayValue: formatMetricValue(metric.key, value),
          detailValue: formatMetricDetailValue(metric.key, value),
          visual: getModelVisual(model.slug, model.model_creator?.slug),
        } satisfies RadarMetricPoint;
      })
      .filter((point): point is RadarMetricPoint => Boolean(point))
      .sort((left, right) => {
        if (metric.better === "higher") {
          return right.value - left.value;
        }

        return left.value - right.value;
      })
      .slice(0, limit)
      .map((point, index) => ({
        ...point,
        rank: index + 1,
      }));

    return {
      key: metric.key,
      title: metric.title,
      subtitle: metric.subtitle,
      better: metric.better,
      points,
    } satisfies RadarMetricCard;
  }).filter((card) => card.points.length > 0);
}

export async function fetchArtificialAnalysisModels(signal?: AbortSignal) {
  const response = await fetch(ARTIFICIAL_ANALYSIS_API_URL, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const payload = (await response.json().catch(() => null)) as ArtificialAnalysisResponse | null;

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
    throw new Error("Artificial Analysis no devolvio una lista de modelos valida.");
  }

  return payload.data;
}

export function useArtificialAnalysis(limit = RADAR_MODELS_LIMIT) {
  return useQuery({
    queryKey: ["artificial-analysis", "radar-metrics", limit],
    queryFn: ({ signal }) => fetchArtificialAnalysisModels(signal),
    select: (models) => buildRadarMetricCards(models, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
