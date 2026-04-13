import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArtificialAnalysis,
  type RadarMetricCard,
  type RadarMetricKey,
  type RadarMetricPoint,
} from "@/hooks/useArtificialAnalysis";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const SERIF_TITLE_STYLE = {
  fontFamily: '"Playfair Display", serif',
  fontWeight: 600,
};

const CARD_CONFIG: Record<
  RadarMetricKey,
  {
    title: string;
    subtitle: string;
    accentClassName: string;
  }
> = {
  intelligence: {
    title: "Intelligence",
    subtitle: "Artificial Analysis Intelligence Index; Higher is better",
    accentClassName: "bg-violet-600",
  },
  speed: {
    title: "Speed",
    subtitle: "Median output tokens per second; Higher is better",
    accentClassName: "bg-amber-400",
  },
  price: {
    title: "Price",
    subtitle: "Price, blended 3:1 input/output ($/1M tokens); Lower is better",
    accentClassName: "bg-orange-500",
  },
};

const PROVIDER_BAR_COLORS: Record<string, string> = {
  openai: "#6b7280",
  anthropic: "#d97757",
  google: "#5cb85c",
  deepseek: "#4f86f7",
  xai: "#8b5cf6",
  meta: "#2563eb",
  nvidia: "#84cc16",
  mistral: "#f59e0b",
  alibaba: "#ef4444",
  cohere: "#0f766e",
  zhipu: "#60a5fa",
};

const LOADING_CARD_KEYS: RadarMetricKey[] = ["intelligence", "speed", "price"];
const LOADING_BAR_HEIGHTS = [26, 44, 58, 72, 84, 60, 42, 68, 52, 76] as const;

type ChartDatum = RadarMetricPoint & {
  color: string;
  tickLabel: string;
};

type ModelTickPayload = {
  value?: string | number;
};

type ModelTickProps = {
  x?: number;
  y?: number;
  payload?: ModelTickPayload;
  pointsBySlug: Map<string, ChartDatum>;
};

const formatUpdatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

const getBarColor = (point: RadarMetricPoint) =>
  PROVIDER_BAR_COLORS[point.creatorSlug] ?? "#94a3b8";

const truncateTickLabel = (label: string, maxLength = 18) =>
  label.length <= maxLength ? label : `${label.slice(0, maxLength - 3)}...`;

const buildChartData = (card: RadarMetricCard): ChartDatum[] =>
  card.points.map((point) => ({
    ...point,
    color: getBarColor(point),
    tickLabel: truncateTickLabel(point.label),
  }));

function ModelTick({ x = 0, y = 0, payload, pointsBySlug }: ModelTickProps) {
  const point = payload?.value ? pointsBySlug.get(String(payload.value)) : null;

  if (!point) {
    return null;
  }

  return (
    <g transform={`translate(${x}, ${y + 12}) rotate(-60)`} overflow="visible">
      <rect x={0} y={0} width={14} height={14} rx={2} fill="#ffffff" stroke="#e5e7eb" />
      {point.visual.iconSrc ? (
        <image
          href={point.visual.iconSrc}
          x={2}
          y={2}
          width={10}
          height={10}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <text
          x={7}
          y={9}
          textAnchor="middle"
          fontSize={5.5}
          fontWeight={700}
          fill="#666"
        >
          {point.visual.fallbackLabel.slice(0, 2)}
        </text>
      )}
      <text
        x={20}
        y={12}
        textAnchor="start"
        fontSize={10}
        fontWeight={500}
        fill="#666"
      >
        {point.tickLabel}
      </text>
    </g>
  );
}

function MetricCardSkeleton({ metricKey }: { metricKey: RadarMetricKey }) {
  const config = CARD_CONFIG[metricKey];

  return (
    <article className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className={cn("mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 bg-gray-100" />
          <Skeleton className="h-4 w-64 bg-gray-100" />
        </div>
      </div>

      <div className="mt-8 h-[400px]">
        <div className="relative h-full overflow-visible">
          <div className="absolute inset-x-0 top-0 bottom-[140px]">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={`${metricKey}-line-${line}`}
                className="absolute inset-x-0 border-t border-gray-100"
                style={{ top: `${line * 33.33}%` }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 border-t border-gray-200" />

            <div className="grid h-full grid-cols-10 items-end gap-4">
              {LOADING_BAR_HEIGHTS.map((height, index) => (
                <div
                  key={`${metricKey}-bar-${index}`}
                  className="relative flex h-full flex-col items-center justify-end"
                >
                  <Skeleton className="mb-3 h-3 w-8 bg-gray-100" />
                  <Skeleton
                    className="w-full max-w-[26px] rounded-[2px] bg-gray-200"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[140px]">
            <div className="grid h-full grid-cols-10 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={`${metricKey}-tick-${index}`} className="relative">
                  <div className="absolute left-1/2 top-5">
                    <div className="origin-top-left -rotate-[60deg]">
                      <div className="flex items-start gap-2">
                        <Skeleton className="h-[14px] w-[14px] rounded-sm bg-gray-100" />
                        <Skeleton className="mt-[2px] h-[10px] w-20 bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetricCard({ card }: { card: RadarMetricCard }) {
  const config = CARD_CONFIG[card.key];
  const chartData = buildChartData(card);
  const pointsBySlug = new Map(chartData.map((point) => [point.slug, point]));

  return (
    <article className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className={cn("mt-[7px] h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="min-w-0">
          <h3
            className="text-[2rem] leading-none tracking-[-0.02em] text-gray-900"
          >
            {config.title}
          </h3>
          <p className="mt-2 max-w-[320px] text-[12px] leading-5 text-gray-400">
            {config.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 h-[400px] overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, left: 20, right: 20, bottom: 132 }}
            style={{ overflow: "visible" }}
          >
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="slug"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              height={148}
              tickMargin={10}
              style={{ overflow: "visible" }}
              tick={(props) => <ModelTick {...props} pointsBySlug={pointsBySlug} />}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="value" barSize={26} radius={[2, 2, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="displayValue"
                position="top"
                fill="#6b7280"
                fontSize={11}
                fontWeight={500}
                offset={8}
              />
              {chartData.map((entry) => (
                <Cell key={`${card.key}-${entry.slug}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export function RadarMetricsBoard() {
  const {
    data: metricCards = [],
    dataUpdatedAt,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useArtificialAnalysis();

  const updatedAtLabel = dataUpdatedAt ? formatUpdatedAt(dataUpdatedAt) : null;
  const errorMessage =
    error instanceof Error ? error.message : "No se pudieron cargar las metricas de Artificial Analysis.";

  return (
    <section className="w-full space-y-10 px-1 pb-4 pt-4 md:px-0">
      <div className="mx-auto w-full max-w-[1400px] space-y-10">
        <header className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            Radar de modelos de IA
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/62 md:text-base">
            Benchmarks comparativos de inteligencia, velocidad y precio, con una lectura visual limpia.
          </p>
          <p className="text-[12px] text-white/42">
            Fuente: Artificial Analysis
            {updatedAtLabel ? ` | Actualizado ${updatedAtLabel}` : ""}
            {isFetching && !isLoading ? " | Actualizando" : ""}
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
            {LOADING_CARD_KEYS.map((metricKey) => (
              <MetricCardSkeleton key={metricKey} metricKey={metricKey} />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-rose-100 bg-white p-8 text-center shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-2xl text-gray-900" style={SERIF_TITLE_STYLE}>
              Metrics unavailable
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">{errorMessage}</p>
            <Button
              onClick={() => void refetch()}
              variant="outline"
              className="mt-6 rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching ? "animate-spin" : "")} />
              Reintentar
            </Button>
          </article>
        ) : null}

        {!isLoading && !isError && metricCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
            {metricCards.map((card) => (
              <MetricCard key={card.key} card={card} />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && metricCards.length === 0 ? (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-gray-100 bg-white p-8 text-center shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            <h3 className="text-2xl text-gray-900" style={SERIF_TITLE_STYLE}>
              No hay metricas disponibles
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              La API no devolvio suficientes datos para construir el radar en este momento.
            </p>
          </article>
        ) : null}

      </div>
    </section>
  );
}
