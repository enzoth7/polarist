import { useRef, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

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

// Brand Kit B — único conjunto de colores para las barras
const BAR_COLORS = ["#CAFE5B", "#F6F6F6", "#4a4a4a"] as const;

const LOADING_CARD_KEYS: RadarMetricKey[] = ["intelligence", "speed", "price"];
const LOADING_BAR_HEIGHTS = [26, 44, 58, 72, 84, 60, 42, 68, 52, 76] as const;
const METRIC_CARD_CLASS =
  "rounded-[24px] border border-white/10 bg-[#010101] p-6 shadow-[0_20px_48px_-24px_rgba(0,0,0,0.6)]";

type ChartDatum = RadarMetricPoint & {
  color: string;
};

const formatUpdatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

const getBarColor = (_point: RadarMetricPoint, index: number) =>
  BAR_COLORS[index % BAR_COLORS.length];

const buildChartData = (card: RadarMetricCard): ChartDatum[] =>
  card.points.map((point, index) => ({
    ...point,
    color: getBarColor(point, index),
  }));

// ── Gráfico custom HTML con hover ────────────────────────────────────────
function MetricBarChart({ chartData }: { chartData: ChartDatum[] }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Área de barras ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, position: 'relative', minHeight: 0 }}>
        {/* Línea base */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.18)', zIndex: 0 }} />

        {chartData.map((entry) => {
          const isHovered = hoveredSlug === entry.slug;
          const pct = (entry.value / maxValue) * 100;

          return (
            <div
              key={entry.slug}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', height: '100%', padding: '0 3px' }}
            >
              {/* Número encima — siempre visible */}
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(246,246,246,0.6)',
                fontFamily: 'var(--font-sans)',
                marginBottom: 5,
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}>
                {entry.displayValue}
              </span>

              {/* Barra */}
              <div 
                onMouseEnter={() => setHoveredSlug(entry.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  width: '100%',
                  height: `${pct}%`,
                  backgroundColor: entry.color,
                  borderRadius: '5px 5px 0 0',
                  cursor: 'pointer',
                  transition: 'height 0.25s cubic-bezier(0.16,1,0.3,1)',
                  opacity: 1,
                  transform: 'scaleX(1)',
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* ── Logos + nombre expandible ── */}
      <div style={{ display: 'flex', gap: 4, paddingTop: 10, position: 'relative' }}>
        {chartData.map((entry) => {
          const isHovered = hoveredSlug === entry.slug;
          return (
            <div
              key={entry.slug}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              {/* Badge logo */}
              <div 
                onMouseEnter={() => setHoveredSlug(entry.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 4,
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'none',
                  transform: 'scale(1)',
                  boxShadow: 'none',
                }}
              >
                {entry.visual.iconSrc ? (
                  <img src={entry.visual.iconSrc} alt={entry.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 7, fontWeight: 700, color: '#010101' }}>
                    {entry.visual.fallbackLabel.slice(0, 2)}
                  </span>
                )}
              </div>

              {/* Nombre — aparece en hover, se extiende horizontalmente sin límite */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 6,
                whiteSpace: 'nowrap',
                background: '#ffffff',
                border: 'none',
                borderRadius: 6,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                color: '#010101',
                letterSpacing: '0.01em',
                pointerEvents: 'none',
                zIndex: 50,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.18s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                {entry.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Espacio para el nombre expandido */}
      <div style={{ height: 36 }} />
    </div>
  );
}


function MetricCardSkeleton({ metricKey }: { metricKey: RadarMetricKey }) {
  const config = CARD_CONFIG[metricKey];

  return (
    <article className={METRIC_CARD_CLASS}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px]", config.accentClassName)} />
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 bg-white/8" />
          <Skeleton className="h-4 w-64 bg-white/8" />
        </div>
      </div>

      <div className="mt-8 h-[320px]">
        <div className="relative h-full overflow-visible">
          <div className="absolute inset-x-0 top-0 bottom-[110px]">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={`${metricKey}-line-${line}`}
                className="absolute inset-x-0 border-t border-white/8"
                style={{ top: `${line * 33.33}%` }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 border-t border-white/12" />

            <div className="grid h-full grid-cols-10 items-end gap-4">
              {LOADING_BAR_HEIGHTS.map((height, index) => (
                <div
                  key={`${metricKey}-bar-${index}`}
                  className="relative flex h-full flex-col items-center justify-end"
                >
                  <Skeleton className="mb-3 h-3 w-8 bg-white/8" />
                  <Skeleton
                    className="w-full max-w-[26px] rounded-[2px] bg-white/12"
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
                        <Skeleton className="h-[14px] w-[14px] rounded-sm bg-white/8" />
                        <Skeleton className="mt-[2px] h-[10px] w-20 bg-white/8" />
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

  return (
    <article
      className={cn(METRIC_CARD_CLASS, "cursor-default transition-colors duration-300 hover:border-[#CAFE5B]/30")}
    >
      {/* Header centrado */}
      <div className="flex flex-col items-center text-center gap-1">
        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '36px', letterSpacing: '-1px', lineHeight: 1.05, color: '#F6F6F6' }}>
          {config.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '13px', lineHeight: 1, color: '#F6F6F6' }} className="mt-1">
          {config.subtitle}
        </p>
      </div>

      {/* Gráfico custom */}
      <div className="mt-6" style={{ height: 340 }}>
        <MetricBarChart chartData={chartData} />
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
    <section className="w-full space-y-24 bg-[#010101] pb-16 pt-0" style={{ perspective: "1200px" }}>
      <div className="mx-auto w-full max-w-[2000px] space-y-24 px-4 md:px-10 lg:px-14 xl:px-16">
        <header className="space-y-3 text-center">
          <h2
            style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: 700, 
              fontSize: 'clamp(28px, 4vw, 44px)', 
              letterSpacing: '-1px', 
              lineHeight: 1.1, 
              color: '#F6F6F6' 
            }}
          >
            Empresas tecnológicas que llevan el liderazgo
          </h2>
          <p
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '16px', lineHeight: 1.55, color: '#F6F6F6' }}
            className="mx-auto max-w-3xl"
          >
            Cuadros comparativos de inteligencia, velocidad y precio que ofrece cada motor de IA.
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
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:gap-7">
              {metricCards.map((card) => (
                <MetricCard key={card.key} card={card} />
              ))}
            </div>
            {/* Fuente debajo de los cards */}
            <p
              className="text-center"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', color: 'rgba(246,246,246,0.5)', textTransform: 'uppercase' }}
            >
              Fuente: Artificial Analysis
              {updatedAtLabel ? ` · Actualizado ${updatedAtLabel}` : ""}
              {isFetching && !isLoading ? " · Actualizando" : ""}
            </p>
          </>
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
