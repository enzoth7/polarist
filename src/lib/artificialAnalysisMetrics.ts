import { getModelVisual, type ModelVisual } from "./modelIcons.ts";
import type { AIBenchmarkRow } from "@/hooks/useAIBenchmarks";

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
  return true; // Quitamos el filtro para que utilice esta lista exacta sin perder a Muse ni a los modificados.
};

export const RADAR_MOCK_MODELS: ArtificialAnalysisModel[] = [
  {
    id: "claude-opus-4",
    name: "Claude Opus 4.7 (max)",
    slug: "claude-opus-4",
    model_creator: { name: "Anthropic", slug: "anthropic" },
    evaluations: { artificial_analysis_intelligence_index: 57 },
    pricing: { price_1m_blended_3_to_1: 10.0 },
    median_output_tokens_per_second: 42,
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3.1 Pro Preview",
    slug: "gemini-3-pro",
    model_creator: { name: "Google", slug: "google" },
    evaluations: { artificial_analysis_intelligence_index: 57 },
    pricing: { price_1m_blended_3_to_1: 4.5 },
    median_output_tokens_per_second: 121,
  },
  {
    id: "gpt-5-4",
    name: "GPT-5.4 (xhigh)",
    slug: "gpt-5-4",
    model_creator: { name: "OpenAI", slug: "openai" },
    evaluations: { artificial_analysis_intelligence_index: 57 },
    pricing: { price_1m_blended_3_to_1: 5.6 },
    median_output_tokens_per_second: 74,
  },
  {
    id: "kimi-k2-6",
    name: "Kimi K2.6",
    slug: "kimi-k2-6",
    model_creator: { name: "Kimi", slug: "kimi" },
    evaluations: { artificial_analysis_intelligence_index: 54 },
    pricing: { price_1m_blended_3_to_1: 1.7 },
    median_output_tokens_per_second: 134,
  },
  {
    id: "muse-spark",
    name: "Muse Spark",
    slug: "muse-spark",
    model_creator: { name: "Meta", slug: "meta" },
    evaluations: { artificial_analysis_intelligence_index: 52 },
    pricing: null, /* No aparece en precio ni vel pero sí en inteligencia */
    median_output_tokens_per_second: null,
  },
  {
    id: "glm-5-1",
    name: "GLM-5.1",
    slug: "glm-5-1",
    model_creator: { name: "Zhipu", slug: "zhipu" },
    evaluations: { artificial_analysis_intelligence_index: 51 },
    pricing: { price_1m_blended_3_to_1: 2.1 },
    median_output_tokens_per_second: 44,
  },
  {
    id: "grok-4-20",
    name: "Grok 4.20 0309 v2",
    slug: "grok-4-20",
    model_creator: { name: "xAI", slug: "xai" },
    evaluations: { artificial_analysis_intelligence_index: 49 },
    pricing: { price_1m_blended_3_to_1: 3.0 },
    median_output_tokens_per_second: 181,
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    slug: "gemini-3-flash",
    model_creator: { name: "Google", slug: "google" },
    evaluations: { artificial_analysis_intelligence_index: 46 },
    pricing: { price_1m_blended_3_to_1: 1.1 },
    median_output_tokens_per_second: 160,
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek V3.2",
    slug: "deepseek-v3-2",
    model_creator: { name: "DeepSeek", slug: "deepseek" },
    evaluations: { artificial_analysis_intelligence_index: 42 },
    pricing: { price_1m_blended_3_to_1: 0.3 },
    median_output_tokens_per_second: 31,
  },
  {
    id: "nemotron-3-super",
    name: "NVIDIA Nemotron 3 Super",
    slug: "nemotron-3-super",
    model_creator: { name: "NVIDIA", slug: "nvidia" },
    evaluations: { artificial_analysis_intelligence_index: 36 },
    pricing: { price_1m_blended_3_to_1: 0.4 },
    median_output_tokens_per_second: 154,
  },
  {
    id: "gpt-oss-120b",
    name: "gpt-oss-120B (high)",
    slug: "gpt-oss-120b",
    model_creator: { name: "OpenAI", slug: "openai" },
    evaluations: { artificial_analysis_intelligence_index: 33 },
    pricing: { price_1m_blended_3_to_1: 0.3 },
    median_output_tokens_per_second: 215,
  }
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
  const validModels = models.filter((m) => typeof m.evaluations?.artificial_analysis_intelligence_index === 'number');

  const providerGroups: Record<string, ArtificialAnalysisModel[]> = {};
  
  validModels.forEach((model) => {
    const visual = getModelVisual(model.slug, model.model_creator?.slug);
    
    // Si no tenemos ícono o es el genérico ("AI"), lo saltamos para mantener la estética premium
    if (!visual.iconSrc || visual.fallbackLabel === "AI") return;

    const creator = model.model_creator?.slug?.toLowerCase() || "unknown";
    
    if (!providerGroups[creator]) {
      providerGroups[creator] = [];
    }
    providerGroups[creator].push(model);
  });

  const PREMIUM_PROVIDERS = ["openai", "anthropic", "google"];
  const curatedSelection: ArtificialAnalysisModel[] = [];

  Object.entries(providerGroups).forEach(([creator, creatorModels]) => {
    creatorModels.sort((a, b) => 
      (b.evaluations?.artificial_analysis_intelligence_index ?? 0) - 
      (a.evaluations?.artificial_analysis_intelligence_index ?? 0)
    );

    const quota = PREMIUM_PROVIDERS.includes(creator) ? 2 : 1;
    curatedSelection.push(...creatorModels.slice(0, quota));
  });

  return METRIC_DEFINITIONS.map((metric) => {
    const points = curatedSelection
      .map((model) => {
        const value = metric.getValue(model);
        if (!isFinitePositiveNumber(value)) return null;

        return {
          id: model.id,
          rank: 0,
          label: model.name,
          slug: model.slug,
          creatorName: model.model_creator?.name ?? "Proveedor desconocido",
          creatorSlug: model.model_creator?.slug ?? "",
          value,
          displayValue: "", // Se llenará post-marketing
          detailValue: "",
          visual: getModelVisual(model.slug, model.model_creator?.slug),
        } satisfies RadarMetricPoint;
      })
      .filter((point): point is RadarMetricPoint => Boolean(point))
      .sort((left, right) => {
        if (metric.better === "higher") return right.value - left.value;
        return left.value - right.value;
      })
      .slice(0, limit);

    // Actualizar ranks, formats y re-aplicar formato
    const finalizedPoints = points.map((point, index) => {
      point.rank = index + 1;
      point.displayValue = formatMetricValue(metric.key, point.value);
      point.detailValue = formatMetricDetailValue(metric.key, point.value);
      return point;
    });

    return {
      key: metric.key,
      title: metric.title,
      subtitle: metric.subtitle,
      better: metric.better,
      points: finalizedPoints,
    } satisfies RadarMetricCard;
  }).filter((card) => card.points.length > 0);
}

export function buildRadarMetricCardsFromSupabase(rows: AIBenchmarkRow[]): RadarMetricCard[] {
  return METRIC_DEFINITIONS.map((metric) => {
    const points = rows
      .map((row) => {
        const value = Number(row[metric.key]);
        if (!Number.isFinite(value) || value <= 0) return null;

        const slug = String(row.id);

        return {
          id: slug,
          rank: 0,
          label: row.name,
          slug,
          creatorName: "",
          creatorSlug: "",
          value,
          displayValue: "",
          detailValue: "",
          visual: {
            iconSrc: row.icon_filename ? `/logos/ai/${row.icon_filename}` : null,
            fallbackLabel: row.name.slice(0, 2).toUpperCase(),
            accentFrom: "185 81% 58%",
            accentTo: "317 87% 71%",
            glow: "191 100% 74%",
          },
        } satisfies RadarMetricPoint;
      })
      .filter((point): point is RadarMetricPoint => Boolean(point))
      .sort((a, b) => (metric.better === "higher" ? b.value - a.value : a.value - b.value))
      .slice(0, 10);

    const finalizedPoints = points.map((point, i) => ({
      ...point,
      rank: i + 1,
      displayValue: formatMetricValue(metric.key, point.value),
      detailValue: formatMetricDetailValue(metric.key, point.value),
    }));

    return {
      key: metric.key,
      title: metric.title,
      subtitle: metric.subtitle,
      better: metric.better,
      points: finalizedPoints,
    } satisfies RadarMetricCard;
  }).filter((card) => card.points.length > 0);
}
