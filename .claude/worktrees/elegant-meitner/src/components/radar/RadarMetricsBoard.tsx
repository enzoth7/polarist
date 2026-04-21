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

/* ─────────────────────────── constants ─────────────────────────── */

const SERIF_TITLE_STYLE = {
  fontFamily: "'Arno Pro Display', 'Arno Pro', Georgia, serif",
} as const;

const CARD_CONFIG: Record<
  RadarMetricKey,
  { title: string; subtitle: string; accentClassName: string }
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
  openai:    "#6b7280",
  anthropic: "#d97757",
  google:    "#5cb85c",
  deepseek:  "#4f86f7",
  xai:       "#8b5cf6",
  meta:      "#2563eb",
  nvidia:    "#84cc16",
  mistral:   "#f59e0b",
  alibaba:   "#ef4444",
  cohere:    "#0f766e",
  zhipu:     "#60a5fa",
};

const LOADING_CARD_KEYS: RadarMetricKey[] = ["intelligence", "speed", "price"];
const LOADING_BAR_HEIGHTS = [26, 44, 58, 72, 84, 60, 42, 68, 52, 76] as const;

/* ─────────────────────────── types ─────────────────────────── */

type ChartDatum = RadarMetricPoint & {
  color: string;
  tickLabel: string;
};

type ModelTickProps = {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
  pointsBySlug: Map<string, ChartDatum>;
};

/* ─────────────────────────── helpers ─────────────────────────── */

const formatUpdatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit" }).format(timestamp);

const getBarColor = (point: RadarMetricPoint) =>
  PROVIDER_BAR_COLORS[point.creatorSlug] ?? "#94a3b8";

const truncateLabel = (label: string, max = 9) =>
  label.length <= max ? label : `${label.slice(0, max - 1)}…`;

const buildChartData = (card: RadarMetricCard): ChartDatum[] =>
  card.points.map((point) => ({
    ...point,
    color: getBarColor(point),
    tickLabel: point.label,
  }));

/* ─────────────────────────── ModelTick ─────────────────────────── */
/* Renders ONLY the provider logo — text is handled by the HTML grid below */

function ModelTick({ x = 0, y = 0, payload, pointsBySlug }: ModelTickProps) {
  const slug  = payload?.value != null ? String(payload.value) : "";
  const point = pointsBySlug.get(slug);

  if (!point) return null;

  return (
    <g transform={`translate(${x}, ${y + 5})`}>
      {/* subtle rounded background */}
      <rect x={-9} y={0} width={18} height={18} rx={3} fill="#f9fafb" stroke="#e5e7eb" strokeWidth={0.5} />
      {point.visual.iconSrc ? (
        <image
          href={point.visual.iconSrc}
          x={-7} y={2}
          width={14} height={14}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <text
          x={0} y={13}
          textAnchor="middle"
          fontSize={6}
          fontWeight={700}
          fill="#94a3b8"
        >
          {point.visual.fallbackLabel.slice(0, 2)}
        </text>
      )}
    </g>
  );
}

/* ─────────────────────────── MetricCardSkeleton ─────────────────────────── */

function MetricCardSkeleton({ metricKey }: { metricKey: RadarMetricKey }) {
  const config = CARD_CONFIG[metricKey];

  return (
    <article
      className="flex flex-col rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]"
      style={{ aspectRatio: "5 / 4" }}
    >
      {/* header */}
      <div className="flex flex-none items-start gap-3 px-6 pt-6 pb-3">
        <div className={cn("mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 bg-gray-100" />
          <Skeleton className="h-4 w-64 bg-gray-100" />
        </div>
      </div>

      {/* chart area */}
      <div className="flex flex-1 flex-col px-4 pb-5 min-h-0">
        <div className="relative flex-1 min-h-0">
          {/* grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`${metricKey}-line-${i}`}
              className="absolute inset-x-0 border-t border-gray-100"
              style={{ top: `${i * 33}%` }}
            />
          ))}
          {/* bars */}
          <div className="absolute inset-0 grid grid-cols-10 items-end gap-3 pb-0">
            {LOADING_BAR_HEIGHTS.map((h, i) => (
              <div key={`${metricKey}-bar-${i}`} className="flex flex-col items-center justify-end h-full">
                <Skeleton className="mb-2 h-2.5 w-6 bg-gray-100" />
                <Skeleton
                  className="w-full max-w-[22px] rounded-[2px] bg-gray-200"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* logo row skeleton */}
        <div className="mt-2 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`${metricKey}-logo-${i}`} className="flex justify-center">
              <Skeleton className="h-[18px] w-[18px] rounded-[3px] bg-gray-100" />
            </div>
          ))}
        </div>

        {/* name row skeleton */}
        <div className="mt-1 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`${metricKey}-name-${i}`} className="flex justify-center">
              <Skeleton className="h-[7px] w-[80%] bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────── MetricCard ─────────────────────────── */

function MetricCard({ card }: { card: RadarMetricCard }) {
  const config      = CARD_CONFIG[card.key];
  const chartData   = buildChartData(card);

  /* key: slug — same dataKey used by XAxis */
  const pointsBySlug = new Map<string, ChartDatum>(
    chartData.map((point) => [point.slug, point])
  );

  return (
    <article
      className="flex flex-col rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]"
      style={{ aspectRatio: "5 / 4" }}
    >
      {/* ── Header ── */}
      <div className="flex flex-none items-start gap-3 px-6 pt-6 pb-3">
        <div className={cn("mt-[7px] h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="min-w-0">
          <h3
            className="text-[2rem] leading-none tracking-[-0.02em] text-gray-900"
            style={SERIF_TITLE_STYLE}
          >
            {config.title}
          </h3>
          <p className="mt-2 max-w-[320px] text-[12px] leading-5 text-gray-400">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* ── Chart + labels ── */}
      <div className="flex flex-1 flex-col px-4 pb-4 min-h-0">

        {/* Recharts: barras + logos en XAxis (sin texto) */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 18, left: 0, right: 0, bottom: 26 }}
              barCategoryGap="40%"
            >
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="slug"
                interval={0}
                tickLine={false}
                axisLine={false}
                height={28}
                tick={(props) => (
                  <ModelTick
                    {...(props as { x: number; y: number; payload: { value?: string | number } })}
                    pointsBySlug={pointsBySlug}
                  />
                )}
              />
              {/* width={0} elimina el padding izquierdo reservado para el eje */}
              <YAxis hide width={0} domain={[0, "auto"]} />
              <Bar
                dataKey="value"
                barSize={22}
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  fill="#6b7280"
                  fontSize={10}
                  fontWeight={500}
                  offset={6}
                />
                {chartData.map((entry) => (
                  <Cell key={`${card.key}-${entry.slug}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Nombres: elemento HTML separado, grid alineado con barras ── */}
        <div
          className="mt-0.5"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${chartData.length}, 1fr)`,
          }}
        >
          {chartData.map((point) => (
            <div
              key={point.slug}
              className="flex items-start justify-center"
              title={point.label}
            >
              <span
                className="block text-center text-gray-600"
                style={{
                  fontSize: "7px",
                  lineHeight: "1.2",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 500,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                }}
              >
                {truncateLabel(point.label)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </article>
  );
}

/* ─────────────────────────── RadarMetricsBoard ─────────────────────────── */

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
    error instanceof Error
      ? error.message
      : "No se pudieron cargar las metricas de Artificial Analysis.";

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

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
            {LOADING_CARD_KEYS.map((k) => (
              <MetricCardSkeleton key={k} metricKey={k} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
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
        )}

        {/* Data */}
        {!isLoading && !isError && metricCards.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
            {metricCards.map((card) => (
              <MetricCard key={card.key} card={card} />
            ))}
          </div>
        )}

        {/* Vacío — text-gray-600 forzado */}
        {!isLoading && !isError && metricCards.length === 0 && (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-gray-100 bg-white p-8 text-center shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            <h3 className="text-2xl text-gray-900" style={SERIF_TITLE_STYLE}>
              No hay métricas disponibles
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              La API no devolvió suficientes datos para construir el radar en este momento.
            </p>
          </article>
        )}

        <div className="flex justify-center pt-1">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/6 hover:text-white"
          >
            <Link to={routes.appTools}>
              Ver Herramientas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
