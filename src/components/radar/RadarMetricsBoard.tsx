import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useArtificialAnalysis,
  type RadarMetricCard,
  type RadarMetricKey,
  type RadarMetricPoint,
} from "@/hooks/useArtificialAnalysis";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const CARD_THEMES: Record<
  RadarMetricKey,
  {
    accent: string;
    secondary: string;
    glow: string;
  }
> = {
  intelligence: {
    accent: "278 100% 69%",
    secondary: "178 100% 61%",
    glow: "286 100% 73%",
  },
  speed: {
    accent: "192 100% 63%",
    secondary: "92 100% 62%",
    glow: "188 100% 72%",
  },
  price: {
    accent: "24 100% 63%",
    secondary: "344 100% 68%",
    glow: "18 100% 72%",
  },
};

const LOADING_CARD_TITLES = ["INTELIGENCIA", "VELOCIDAD", "PRECIO"] as const;
const LOADING_BAR_HEIGHTS = [20, 35, 52, 78, 46, 88, 61, 40, 70, 55] as const;

const isBestPoint = (card: RadarMetricCard, value: number) => {
  const values = card.points.map((point) => point.value);
  const bestValue = card.better === "higher" ? Math.max(...values) : Math.min(...values);

  return value === bestValue;
};

const formatUpdatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

function ModelAvatar({
  point,
  size = "sm",
}: {
  point: RadarMetricPoint;
  size?: "sm" | "md";
}) {
  const dimensionClassName = size === "md" ? "h-10 w-10 rounded-2xl" : "h-8 w-8 rounded-xl";
  const imageClassName = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const fallbackClassName = size === "md" ? "text-xs" : "text-[10px]";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-white/12 bg-black/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]",
        dimensionClassName,
      )}
      style={{
        background: `linear-gradient(180deg, hsl(${point.visual.accentFrom} / 0.22) 0%, hsl(225 28% 10% / 0.92) 100%)`,
        boxShadow: `0 0 0 1px hsl(${point.visual.glow} / 0.16) inset, 0 18px 36px -28px hsl(${point.visual.glow} / 0.75)`,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at top, hsl(${point.visual.glow} / 0.32) 0%, transparent 72%)`,
        }}
      />
      {point.visual.iconSrc ? (
        <img
          src={point.visual.iconSrc}
          alt={point.creatorName}
          className={cn("relative z-10 object-contain", imageClassName)}
          loading="lazy"
        />
      ) : (
        <span
          className={cn(
            "relative z-10 font-black uppercase tracking-[0.16em] text-white/92",
            fallbackClassName,
          )}
        >
          {point.visual.fallbackLabel}
        </span>
      )}
    </div>
  );
}

function LoadingMetricCard({ title }: { title: string }) {
  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#060b11]/80 p-5 shadow-[0_28px_64px_-34px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_32%,rgba(5,8,13,0.92)_100%)]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative z-10">
        <Skeleton className="h-6 w-40 rounded-full bg-white/10" />
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/38">{title}</p>

        <div className="mt-6 h-52">
          <div className="grid h-full grid-cols-10 items-end gap-2">
            {LOADING_BAR_HEIGHTS.map((height, index) => (
              <div key={`${title}-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
                <Skeleton className="h-3 w-8 rounded-full bg-white/8" />
                <Skeleton
                  className="w-full rounded-t-[12px] bg-white/10"
                  style={{ height: `${height}%` }}
                />
                <Skeleton className="h-2 w-4 rounded-full bg-white/8" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`${title}-legend-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-3 py-2"
            >
              <Skeleton className="h-5 w-7 rounded-lg bg-white/10" />
              <Skeleton className="h-8 w-8 rounded-xl bg-white/10" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-3 w-full rounded-full bg-white/10" />
                <Skeleton className="h-2.5 w-2/3 rounded-full bg-white/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function RadarMetricsBoard() {
  const prefersReducedMotion = useReducedMotion();
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
    <section className="space-y-6 pb-3 pt-2 md:space-y-7 md:pb-4 md:pt-3">
      <header className="space-y-4 py-3 text-center md:space-y-5 md:py-5">
        <div className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/62 backdrop-blur-xl">
          Radar en tiempo real
        </div>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
          Analisis de modelos de IA
        </h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Rendimiento, velocidad y costo en una sola vista, con datos cargados al montar el componente.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/46">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl">
            Top 10 por metrica
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl">
            Fuente: Artificial Analysis
          </span>
          {updatedAtLabel ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl">
              Actualizado {updatedAtLabel}
            </span>
          ) : null}
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Actualizando
            </span>
          ) : null}
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {LOADING_CARD_TITLES.map((title) => (
            <LoadingMetricCard key={title} title={title} />
          ))}
        </div>
      ) : null}

      {!isLoading && isError ? (
        <article className="relative overflow-hidden rounded-[30px] border border-rose-400/20 bg-[#060b11]/90 p-6 text-center shadow-[0_28px_64px_-34px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_32%,rgba(5,8,13,0.92)_100%)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-56 -translate-x-1/2 rounded-full bg-rose-400/18 blur-3xl" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-400/10 text-rose-200">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-[-0.02em] text-white md:text-2xl">
                No se pudo conectar con Artificial Analysis
              </h3>
              <p className="text-sm leading-relaxed text-white/66 md:text-base">{errorMessage}</p>
            </div>
            <Button
              onClick={() => void refetch()}
              className="rounded-full bg-white text-black hover:bg-white/90"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching ? "animate-spin" : "")} />
              Reintentar
            </Button>
          </div>
        </article>
      ) : null}

      {!isLoading && !isError && metricCards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {metricCards.map((card, cardIndex) => {
            const theme = CARD_THEMES[card.key];
            const maxValue = Math.max(...card.points.map((point) => point.value));

            return (
              <motion.article
                key={card.key}
                className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#060b11]/85 p-5 shadow-[0_28px_72px_-34px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: cardIndex * 0.06 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_32%,rgba(5,8,13,0.92)_100%)]" />
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, hsl(${theme.glow} / 0.24) 0%, transparent 72%)`,
                  }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, hsl(${theme.secondary} / 0.18) 0%, transparent 72%)`,
                  }}
                />
                <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-white/16" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68 backdrop-blur-xl">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: `hsl(${theme.accent})`,
                            boxShadow: `0 0 18px hsl(${theme.glow} / 0.85)`,
                          }}
                        />
                        {card.title}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/74">{card.subtitle}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                          {card.better === "higher" ? "Mayor es mejor" : "Menor es mejor"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/52">
                      Top 10
                    </div>
                  </div>

                  <div className="mt-6 h-52">
                    <div className="grid h-full grid-cols-10 items-end gap-2">
                      {card.points.map((point, index) => {
                        const height = Math.max((point.value / maxValue) * 100, 12);
                        const highlight = isBestPoint(card, point.value);

                        return (
                          <Tooltip key={`${card.key}-${point.slug}-${index}`}>
                            <TooltipTrigger asChild>
                              <div className="group flex h-full cursor-default flex-col items-center justify-end gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-semibold tracking-wide transition-colors",
                                    highlight ? "text-white" : "text-white/74",
                                  )}
                                >
                                  {point.displayValue}
                                </span>

                                <div className="relative flex h-full w-full items-end">
                                  <motion.div
                                    className="relative w-full overflow-hidden rounded-t-[14px] border border-white/12 bg-black/10"
                                    initial={prefersReducedMotion ? false : { height: 0, opacity: 0.55 }}
                                    animate={prefersReducedMotion ? undefined : { height: `${height}%`, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 120,
                                      damping: 20,
                                      delay: index * 0.04,
                                    }}
                                    style={{
                                      height: `${height}%`,
                                      background: `linear-gradient(180deg, hsl(${point.visual.accentFrom}) 0%, hsl(${point.visual.accentTo}) 100%)`,
                                      boxShadow: highlight
                                        ? `0 0 28px hsl(${point.visual.glow} / 0.42)`
                                        : `0 18px 36px -22px hsl(${point.visual.glow} / 0.55)`,
                                    }}
                                  >
                                    <span className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0))] opacity-70" />
                                    <span
                                      className="pointer-events-none absolute inset-x-0 bottom-0 h-full opacity-60"
                                      style={{
                                        background: `linear-gradient(180deg, transparent 0%, hsl(${point.visual.glow} / 0.28) 100%)`,
                                      }}
                                    />
                                    {!prefersReducedMotion ? (
                                      <motion.span
                                        className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/90"
                                        animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.4, 1] }}
                                        transition={{
                                          duration: 1.9,
                                          repeat: Number.POSITIVE_INFINITY,
                                          delay: index * 0.12,
                                        }}
                                      />
                                    ) : null}
                                  </motion.div>
                                </div>

                                <span
                                  className={cn(
                                    "text-[9px] font-semibold tracking-[0.16em]",
                                    highlight ? "text-white/86" : "text-white/46",
                                  )}
                                >
                                  {String(point.rank).padStart(2, "0")}
                                </span>
                              </div>
                            </TooltipTrigger>

                            <TooltipContent className="max-w-[240px] rounded-2xl border-white/10 bg-[#030712]/90 px-3 py-3 text-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                              <div className="flex items-center gap-3">
                                <ModelAvatar point={point} size="md" />
                                <div className="min-w-0">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                                    {point.creatorName}
                                  </p>
                                  <p className="truncate text-sm font-semibold text-white">{point.label}</p>
                                  <p
                                    className="mt-1 text-xs font-semibold"
                                    style={{ color: `hsl(${point.visual.glow})` }}
                                  >
                                    {point.detailValue}
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.035] p-3 sm:grid-cols-2">
                    {card.points.map((point) => (
                      <div
                        key={`${card.key}-${point.slug}-legend`}
                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-3 py-2"
                      >
                        <span
                          className={cn(
                            "inline-flex h-6 min-w-8 items-center justify-center rounded-xl border px-2 text-[10px] font-semibold uppercase tracking-[0.14em]",
                            point.rank === 1
                              ? "border-transparent bg-white text-black"
                              : "border-white/10 bg-white/[0.05] text-white/72",
                          )}
                        >
                          {String(point.rank).padStart(2, "0")}
                        </span>
                        <ModelAvatar point={point} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold text-white/88">{point.label}</p>
                          <p className="truncate text-[10px] uppercase tracking-[0.14em] text-white/38">
                            {point.creatorName}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-white/72">{point.displayValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : null}

      {!isLoading && !isError && metricCards.length === 0 ? (
        <article className="rounded-[30px] border border-white/10 bg-[#060b11]/85 p-6 text-center shadow-[0_28px_72px_-34px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
          <h3 className="text-xl font-black tracking-[-0.02em] text-white">No hay metricas disponibles</h3>
          <p className="mt-2 text-sm text-white/62">
            La API no devolvio suficientes datos para construir el radar en este momento.
          </p>
        </article>
      ) : null}

      <div className="flex justify-center pt-2">
        <Button asChild className="rounded-full px-6">
          <Link to={routes.appTools}>
            Ver Herramientas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
