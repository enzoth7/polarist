import { getModelVisual, type ModelVisual } from "./modelIcons.ts";

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

// Slugs (o prefijos) que el radar oficial de Polarist debe mostrar.
// Cualquier modelo de la API que no coincida con alguno de estos prefijos
// es descartado antes del renderizado.
export const RADAR_SLUG_WHITELIST: ReadonlyArray<string> = [
  "claude-opus-4",
  "gpt-5",
  "gpt-oss-120b",
  "gemini-3",
  "kimi-k2",
  "grok-4",
  "llama-",
  "glm-5",
  "deepseek-v3",
  "nemotron-",
];

export const isInRadarWhitelist = (slug: string): boolean => {
  const normalized = slug.trim().toLowerCase();
  return RADAR_SLUG_WHITELIST.some((prefix) => normalized.startsWith(prefix));
};

export const RADAR_MOCK_MODELS: ArtificialAnalysisModel[] = [
  {
    id: "claude-opus-4",
    name: "Claude Opus 4.7",
    slug: "claude-opus-4",
    model_creator: { name: "Anthropic", slug: "anthropic" },
    evaluations: { artificial_analysis_intelligence_index: 82 },
    pricing: { price_1m_blended_3_to_1: 18.0 },
    median_output_tokens_per_second: 58,
  },
  {
    id: "gpt-5",
    name: "GPT-5.4",
    slug: "gpt-5",
    model_creator: { name: "OpenAI", slug: "openai" },
    evaluations: { artificial_analysis_intelligence_index: 79 },
    pricing: { price_1m_blended_3_to_1: 15.0 },
    median_output_tokens_per_second: 72,
  },
  {
    id: "gemini-3.0-pro",
    name: "Gemini 3.1 Pro Preview",
    slug: "gemini-3.0-pro",
    model_creator: { name: "Google", slug: "google" },
    evaluations: { artificial_analysis_intelligence_index: 76 },
    pricing: { price_1m_blended_3_to_1: 10.0 },
    median_output_tokens_per_second: 140,
  },
  {
    id: "kimi-k2",
    name: "Kimi K2.6",
    slug: "kimi-k2",
    model_creator: { name: "Kimi", slug: "kimi" },
    evaluations: { artificial_analysis_intelligence_index: 71 },
    pricing: { price_1m_blended_3_to_1: 4.5 },
    median_output_tokens_per_second: 105,
  },
  {
    id: "grok-4",
    name: "Grok 4.20",
    slug: "grok-4",
    model_creator: { name: "xAI", slug: "xai" },
    evaluations: { artificial_analysis_intelligence_index: 68 },
    pricing: { price_1m_blended_3_to_1: 6.0 },
    median_output_tokens_per_second: 220,
  },
  {
    id: "llama-4-maverick",
    name: "Meta Llama 4",
    slug: "llama-4-maverick",
    model_creator: { name: "Meta", slug: "meta" },
    evaluations: { artificial_analysis_intelligence_index: 63 },
    pricing: { price_1m_blended_3_to_1: 2.0 },
    median_output_tokens_per_second: 95,
  },
  {
    id: "glm-5",
    name: "GLM-5.1",
    slug: "glm-5",
    model_creator: { name: "Zhipu", slug: "zhipu" },
    evaluations: { artificial_analysis_intelligence_index: 58 },
    pricing: { price_1m_blended_3_to_1: 1.8 },
    median_output_tokens_per_second: 88,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3.2",
    slug: "deepseek-v3",
    model_creator: { name: "DeepSeek", slug: "deepseek" },
    evaluations: { artificial_analysis_intelligence_index: 55 },
    pricing: { price_1m_blended_3_to_1: 0.3 },
    median_output_tokens_per_second: 110,
  },
  {
    id: "nemotron-3",
    name: "NVIDIA Nemotron 3",
    slug: "nemotron-3",
    model_creator: { name: "NVIDIA", slug: "nvidia" },
    evaluations: { artificial_analysis_intelligence_index: 50 },
    pricing: { price_1m_blended_3_to_1: 1.2 },
    median_output_tokens_per_second: 160,
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B",
    slug: "gpt-oss-120b",
    model_creator: { name: "OpenAI", slug: "openai" },
    evaluations: { artificial_analysis_intelligence_index: 46 },
    pricing: { price_1m_blended_3_to_1: 0.5 },
    median_output_tokens_per_second: 185,
  },
];

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
  const whitelisted = models.filter((m) => isInRadarWhitelist(m.slug));

  return METRIC_DEFINITIONS.map((metric) => {
    const points = whitelisted
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
