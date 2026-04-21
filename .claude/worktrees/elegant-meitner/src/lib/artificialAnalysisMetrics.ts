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

export const RADAR_MOCK_MODELS: ArtificialAnalysisModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    slug: "gpt-4o",
    model_creator: {
      name: "OpenAI",
      slug: "openai",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 58,
    },
    pricing: {
      price_1m_blended_3_to_1: 5.4,
    },
    median_output_tokens_per_second: 78,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    slug: "claude-3-5-sonnet",
    model_creator: {
      name: "Anthropic",
      slug: "anthropic",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 55,
    },
    pricing: {
      price_1m_blended_3_to_1: 6,
    },
    median_output_tokens_per_second: 66,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    slug: "gemini-1.5-pro",
    model_creator: {
      name: "Google",
      slug: "google",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 54,
    },
    pricing: {
      price_1m_blended_3_to_1: 4.4,
    },
    median_output_tokens_per_second: 124,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    slug: "gemini-1.5-flash",
    model_creator: {
      name: "Google",
      slug: "google",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 46,
    },
    pricing: {
      price_1m_blended_3_to_1: 1.2,
    },
    median_output_tokens_per_second: 186,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    slug: "deepseek-v3",
    model_creator: {
      name: "DeepSeek",
      slug: "deepseek",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 45,
    },
    pricing: {
      price_1m_blended_3_to_1: 0.3,
    },
    median_output_tokens_per_second: 92,
  },
  {
    id: "grok-2",
    name: "Grok 2",
    slug: "grok-2",
    model_creator: {
      name: "xAI",
      slug: "xai",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 48,
    },
    pricing: {
      price_1m_blended_3_to_1: 3.2,
    },
    median_output_tokens_per_second: 210,
  },
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    slug: "llama-3.1-405b",
    model_creator: {
      name: "Meta",
      slug: "meta",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 43,
    },
    pricing: {
      price_1m_blended_3_to_1: 2.9,
    },
    median_output_tokens_per_second: 61,
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    slug: "mistral-large-2",
    model_creator: {
      name: "Mistral",
      slug: "mistral",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 41,
    },
    pricing: {
      price_1m_blended_3_to_1: 4.8,
    },
    median_output_tokens_per_second: 54,
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    slug: "command-r-plus",
    model_creator: {
      name: "Cohere",
      slug: "cohere",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 39,
    },
    pricing: {
      price_1m_blended_3_to_1: 2.6,
    },
    median_output_tokens_per_second: 102,
  },
  {
    id: "nemotron-4-340b",
    name: "Nemotron 4 340B",
    slug: "nemotron-4-340b",
    model_creator: {
      name: "NVIDIA",
      slug: "nvidia",
    },
    evaluations: {
      artificial_analysis_intelligence_index: 37,
    },
    pricing: {
      price_1m_blended_3_to_1: 0.8,
    },
    median_output_tokens_per_second: 149,
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
