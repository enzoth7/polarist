import { useState } from "react";
import { motion } from "framer-motion";
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

const BAR_COLOR = "#CAFE5B";
const DEFAULT_BAR_COLOR = "rgba(202,254,91,0.24)";
const ADJACENT_BAR_COLOR = "rgba(202,254,91,0.56)";

const LOADING_CARD_KEYS: RadarMetricKey[] = ["intelligence", "speed", "price"];
const LOADING_BAR_HEIGHTS = [26, 44, 58, 72, 84, 60, 42, 68, 52, 76] as const;
const METRIC_CARD_CLASS =
  "rounded-[24px] border border-white/10 bg-[#010101] p-4 md:p-6 shadow-[0_20px_48px_-24px_rgba(0,0,0,0.6)]";

type ChartDatum = RadarMetricPoint & {
  color: string;
};

function MetricLogoBadge({ entry }: { entry: ChartDatum }) {
  const [hasError, setHasError] = useState(false);

  if (!entry.visual.iconSrc || hasError) {
    return (
      <span style={{ fontSize: 7, fontWeight: 700, color: "#010101" }}>
        {entry.visual.fallbackLabel.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={entry.visual.iconSrc}
      alt={entry.label}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      onError={() => setHasError(true)}
    />
  );
}

const getBarColor = () => BAR_COLOR;

const buildChartData = (card: RadarMetricCard): ChartDatum[] =>
  card.points.map((point, index) => ({
    ...point,
    color: getBarColor(point, index),
  }));

// ── Gráfico custom HTML con hover ────────────────────────────────────────
function MetricBarChart({
  chartData,
  hoveredSlug,
  setHoveredSlug,
}: {
  chartData: ChartDatum[];
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
}) {
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);
  const hoveredIndex = chartData.findIndex((entry) => entry.slug === hoveredSlug);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Área de barras ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, position: 'relative', minHeight: 0 }}>
        {/* Línea base */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.18)', zIndex: 0 }} />

        {chartData.map((entry, index) => {
          const isHovered = hoveredSlug === entry.slug;
          const isAdjacent = hoveredIndex !== -1 && Math.abs(hoveredIndex - index) === 1;
          const pct = (entry.value / maxValue) * 100;

          return (
            <div
              key={entry.slug}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', height: '100%', padding: '0 clamp(1px, 0.5vw, 3px)' }}
            >
              {/* Barra */}
              <motion.div 
                onMouseEnter={() => setHoveredSlug(entry.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  width: '100%',
                  height: `${pct}%`,
                  borderRadius: '5px 5px 0 0',
                  cursor: 'pointer',
                }} 
                initial={{ backgroundColor: "rgba(246,246,246,0.16)", scaleX: 1 }}
                animate={{
                  backgroundColor: isHovered
                    ? entry.color
                    : isAdjacent
                      ? ADJACENT_BAR_COLOR
                      : DEFAULT_BAR_COLOR,
                  scaleX: isHovered ? 1.08 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  width: 'clamp(14px, 4vw, 32px)',
                  height: 'clamp(14px, 4vw, 32px)',
                  borderRadius: 'clamp(4px, 1.5vw, 7px)',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 'clamp(1px, 0.5vw, 4px)',
                  cursor: 'pointer',
                  transition: 'none',
                  transform: 'scale(1)',
                  boxShadow: 'none',
                }}
              >
                <MetricLogoBadge entry={entry} />
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
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredEntry = chartData.find((entry) => entry.slug === hoveredSlug);

  return (
    <article
      className={cn(METRIC_CARD_CLASS, "relative cursor-default transition-colors duration-300 hover:border-[#CAFE5B]/30")}
    >
      <div
        className="absolute top-4 right-4 md:top-6 md:right-6"
        style={{
          minWidth: 'clamp(40px, 8vw, 56px)',
          height: 'clamp(22px, 5vw, 30px)',
          borderRadius: 8,
          border: '1px solid rgba(202,254,91,0.24)',
          background: 'rgba(1,1,1,0.72)',
          color: hoveredEntry ? '#CAFE5B' : 'rgba(246,246,246,0.42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(9px, 2.5vw, 12px)',
          fontWeight: 800,
          fontFamily: 'var(--font-sans)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          pointerEvents: 'none',
          zIndex: 3,
          boxShadow: hoveredEntry ? '0 10px 28px rgba(202,254,91,0.14)' : 'none',
          transition: 'color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        {hoveredEntry?.displayValue ?? '—'}
      </div>

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
        <MetricBarChart chartData={chartData} hoveredSlug={hoveredSlug} setHoveredSlug={setHoveredSlug} />
      </div>
    </article>
  );
}

export function RadarMetricsBoard() {
  const {
    data: metricCards = [],
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useArtificialAnalysis();
  const errorMessage =
    error instanceof Error ? error.message : "No se pudieron cargar las métricas.";
  return (
    <section className="w-full space-y-24 bg-[#010101] pb-16 pt-0" style={{ perspective: "1200px" }}>
      <div className="mx-auto w-full max-w-[2000px] space-y-24 px-4 md:px-10 lg:px-14 xl:px-16">
        <header className="space-y-5 text-center">
          <h2
            style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: 700, 
              fontSize: 'clamp(24px, 6vw, 44px)', 
              letterSpacing: '-1px', 
              lineHeight: 1.1, 
              color: '#F6F6F6',
              textWrap: 'balance'
            }}
          >
            Empresas tecnológicas que llevan el liderazgo
          </h2>
          <p
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: 1.55, color: '#F6F6F6', textWrap: 'balance' }}
            className="mx-auto max-w-3xl px-4"
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
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/55">
              {errorMessage}
            </p>
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
            <p
              className="text-center"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', color: 'rgba(246,246,246,0.5)', textTransform: 'uppercase' }}
            >
              Fuente:{" "}
              <a
                href="https://artificialanalysis.ai/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(246,246,246,0.5)', textDecoration: 'underline' }}
              >
                artificialanalysis.ai
              </a>
            </p>
          </>
        ) : null}

        {!isLoading && !isError && metricCards.length === 0 ? (
          <article className="mx-auto max-w-3xl rounded-[24px] border border-white/10 bg-[#0A0A0A] p-8 text-center">
            <p className="text-sm text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>
              No hay datos cargados todavía.
            </p>
          </article>
        ) : null}

      </div>
    </section>
  );
}
