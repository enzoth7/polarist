import { AlertTriangle, RefreshCw } from "lucide-react";
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
import { cn } from "@/lib/utils";



const CARD_CONFIG: Record<
  RadarMetricKey,
  {
    title: string;
    subtitle: string;
    accentClassName: string;
  }
> = {
  intelligence: {
    title: "Inteligencia",
    subtitle: "Más alto es mejor",
    accentClassName: "bg-violet-600",
  },
  speed: {
    title: "Velocidad",
    subtitle: "Más alto es mejor",
    accentClassName: "bg-amber-400",
  },
  price: {
    title: "Precio",
    subtitle: "Más bajo es mejor",
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
const METRIC_CARD_CLASS =
  "rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_18px_42px_-30px_rgba(1,1,1,0.16)]";

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
    <g transform={`translate(${x - 5}, ${y + 2}) rotate(-50)`} overflow="visible">
      {/* Contra-rotación +50° sobre el centro del ícono (0, 9) → queda horizontal */}
      <g transform="rotate(50, 0, 9)">
        <rect x={-9} y={0} width={18} height={18} rx={3} fill="#ffffff" stroke="#d4d4d8" />
        {point.visual.iconSrc ? (
          <image
            href={point.visual.iconSrc}
            x={-7}
            y={2}
            width={14}
            height={14}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <text
            x={0}
            y={13}
            textAnchor="middle"
            fontSize={7}
            fontWeight={700}
            fill="#525252"
          >
            {point.visual.fallbackLabel.slice(0, 2)}
          </text>
        )}
      </g>

      {/* El texto del modelo hereda rotate(-50) del padre → sigue inclinado */}
      <text
        x={-12}
        y={28}
        textAnchor="end"
        fontSize={13}
        fontWeight={500}
        fill="#525252"
      >
        {point.tickLabel}
      </text>
    </g>
  );
}

function MetricCardSkeleton({ metricKey }: { metricKey: RadarMetricKey }) {
  const config = CARD_CONFIG[metricKey];

  return (
    <article className={METRIC_CARD_CLASS}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 bg-black/6" />
          <Skeleton className="h-4 w-64 bg-black/6" />
        </div>
      </div>

      <div className="mt-8 h-[320px]">
        <div className="relative h-full overflow-visible">
          <div className="absolute inset-x-0 top-0 bottom-[110px]">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={`${metricKey}-line-${line}`}
                className="absolute inset-x-0 border-t border-black/6"
                style={{ top: `${line * 33.33}%` }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 border-t border-black/10" />

            <div className="grid h-full grid-cols-10 items-end gap-4">
              {LOADING_BAR_HEIGHTS.map((height, index) => (
                <div
                  key={`${metricKey}-bar-${index}`}
                  className="relative flex h-full flex-col items-center justify-end"
                >
                  <Skeleton className="mb-3 h-3 w-8 bg-black/6" />
                  <Skeleton
                    className="w-full max-w-[26px] rounded-[2px] bg-black/10"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[110px]">
            <div className="grid h-full grid-cols-10 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={`${metricKey}-tick-${index}`} className="relative">
                  <div className="absolute left-1/2 top-5">
                    <div className="origin-top-left -rotate-[60deg]">
                      <div className="flex items-start gap-2">
                        <Skeleton className="h-[14px] w-[14px] rounded-sm bg-black/6" />
                        <Skeleton className="mt-[2px] h-[10px] w-20 bg-black/6" />
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
    <article className={METRIC_CARD_CLASS}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-[7px] h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="min-w-0">
          <h3
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '24px', letterSpacing: '-0.5px', lineHeight: 1.1, color: 'var(--polarist-black, #010101)' }}
          >
            {config.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '13px', lineHeight: 1, color: 'rgba(1,1,1,0.55)' }} className="mt-1 whitespace-nowrap">
            {config.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 h-[320px] overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, left: 45, right: 25, bottom: 90 }}
            style={{ overflow: "visible" }}
          >
            <CartesianGrid vertical={false} stroke="#ececec" />
            <XAxis
              dataKey="slug"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: "#d4d4d8" }}
              height={110}
              tickMargin={10}
              style={{ overflow: "visible" }}
              tick={(props) => <ModelTick {...props} pointsBySlug={pointsBySlug} />}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="value" barSize={26} radius={[2, 2, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="displayValue"
                position="top"
                fill="#525252"
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
    <section className="w-full space-y-10 bg-[#F6F6F6] pb-4 pt-4">
      <div className="mx-auto w-full max-w-[2000px] space-y-10 px-4 md:px-10 lg:px-14 xl:px-16">
        <header className="space-y-3 text-center">
          <h2
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--polarist-black, #010101)' }}
          >
            Radar de modelos de IA
          </h2>
          <p
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '16px', lineHeight: 1.55, color: 'rgba(1,1,1,0.55)' }}
            className="mx-auto max-w-3xl"
          >
            Benchmarks comparativos de inteligencia, velocidad y precio, con una lectura visual limpia.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', color: 'rgba(1,1,1,0.35)', textTransform: 'uppercase' }} className="mt-4">
            Fuente: Artificial Analysis
            {updatedAtLabel ? ` | Actualizado ${updatedAtLabel}` : ""}
            {isFetching && !isLoading ? " | Actualizando" : ""}
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:gap-7">
            {LOADING_CARD_KEYS.map((metricKey) => (
              <MetricCardSkeleton key={metricKey} metricKey={metricKey} />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-rose-200 bg-white p-8 text-center shadow-[0_18px_42px_-30px_rgba(1,1,1,0.16)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '24px', letterSpacing: '-0.5px', color: 'var(--polarist-black, #010101)' }} className="mt-4">
              Metrics unavailable
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/55">{errorMessage}</p>
            <Button
              onClick={() => void refetch()}
              variant="outline"
              className="mt-6 rounded-full border-black/10 bg-white text-black/70 hover:bg-black/[0.03]"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching ? "animate-spin" : "")} />
              Reintentar
            </Button>
          </article>
        ) : null}

        {!isLoading && !isError && metricCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:gap-7">
            {metricCards.map((card) => (
              <MetricCard key={card.key} card={card} />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && metricCards.length === 0 ? (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-[0_18px_42px_-30px_rgba(1,1,1,0.16)]">
            <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '24px', letterSpacing: '-0.5px', color: 'var(--polarist-black, #010101)' }}>
              No hay métricas disponibles
            </h3>
            <p className="mt-3 text-sm leading-6 text-black/55">
              La API no devolvio suficientes datos para construir el radar en este momento.
            </p>
          </article>
        ) : null}

      </div>
    </section>
  );
}
