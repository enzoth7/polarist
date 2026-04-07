import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

type CinematicSliderItem = {
  title: string;
  description: string;
  image: string;
  accent: string;
  glow: string;
};

type CinematicSliderProps = {
  items: readonly CinematicSliderItem[];
};

type OrderedSliderItem = CinematicSliderItem & {
  originalIndex: number;
};

const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const AUTOPLAY_MS = 6800;
const TRANSITION_GUARD_MS = 760;
const TRAIL_FADE_MS = 1160;

const CONTENT_VARIANTS = {
  enter: {
    opacity: 0,
    y: 14,
    x: 12,
  },
  center: {
    opacity: 1,
    y: 0,
    x: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
    x: -10,
  },
};

const wrapIndex = (length: number, index: number) => ((index % length) + length) % length;

const buildPreviewIndices = (length: number, activeIndex: number, direction: 1 | -1, maxItems = 4) => {
  const targetCount = Math.min(maxItems, Math.max(length - 1, 0));

  if (targetCount === 0) {
    return [];
  }

  const candidates =
    direction === 1
      ? [activeIndex + 1, activeIndex + 2, activeIndex + 3, activeIndex + 4, activeIndex - 1, activeIndex - 2]
      : [activeIndex - 1, activeIndex + 1, activeIndex - 2, activeIndex + 2, activeIndex + 3, activeIndex + 4];

  const seen = new Set<number>();
  const result: number[] = [];

  for (const candidate of candidates) {
    const normalizedIndex = wrapIndex(length, candidate);

    if (normalizedIndex === activeIndex || seen.has(normalizedIndex)) {
      continue;
    }

    seen.add(normalizedIndex);
    result.push(normalizedIndex);

    if (result.length >= targetCount) {
      break;
    }
  }

  return result;
};

export function CinematicSlider({ items }: CinematicSliderProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingMs, setRemainingMs] = useState(AUTOPLAY_MS);
  const autoplayStartedAtRef = useRef<number | null>(null);

  const activeItem = items[activeIndex];
  const previousItem = previousIndex !== null ? items[previousIndex] : null;

  const previewItems = useMemo<OrderedSliderItem[]>(
    () =>
      buildPreviewIndices(items.length, activeIndex, navDirection).map((originalIndex) => ({
        ...items[originalIndex],
        originalIndex,
      })),
    [activeIndex, items, navDirection],
  );
  const canNavigate = items.length > 1;
  const isAutoPlayEnabled = canNavigate && !prefersReducedMotion && !isPaused;
  const manualProgressWidth = `${((activeIndex + 1) / Math.max(items.length, 1)) * 100}%`;
  const timedProgressWidth = `${Math.min(100, ((AUTOPLAY_MS - remainingMs) / AUTOPLAY_MS) * 100)}%`;
  const activeLayoutScope = isMobile ? "mobile" : "desktop";
  const getSlideLayoutId = (title: string) => `radar-slide-${activeLayoutScope}-${title}`;

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setPreviousIndex(null),
      prefersReducedMotion ? 0 : TRAIL_FADE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [prefersReducedMotion, previousIndex]);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setIsTransitioning(false),
      prefersReducedMotion ? 0 : TRANSITION_GUARD_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [isTransitioning, prefersReducedMotion]);

  useEffect(() => {
    if (!isAutoPlayEnabled) {
      autoplayStartedAtRef.current = null;
      return;
    }

    autoplayStartedAtRef.current = performance.now();
    const timeoutId = window.setTimeout(() => {
      setNavDirection(1);
      setPreviousIndex(activeIndex);
      setActiveIndex(wrapIndex(items.length, activeIndex + 1));
      setIsTransitioning(true);
      setRemainingMs(AUTOPLAY_MS);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isAutoPlayEnabled, items.length, remainingMs]);

  useEffect(() => {
    setRemainingMs(AUTOPLAY_MS);
  }, [activeIndex]);

  if (!activeItem || items.length === 0) {
    return null;
  }

  const goTo = (nextIndex: number, directionHint?: 1 | -1) => {
    if (isTransitioning) {
      return;
    }

    const normalizedIndex = wrapIndex(items.length, nextIndex);

    if (normalizedIndex === activeIndex) {
      return;
    }

    const resolvedDirection =
      directionHint ??
      (() => {
        const forwardDistance = wrapIndex(items.length, normalizedIndex - activeIndex);
        const backwardDistance = wrapIndex(items.length, activeIndex - normalizedIndex);
        return forwardDistance <= backwardDistance ? 1 : -1;
      })();

    setNavDirection(resolvedDirection);
    setPreviousIndex(activeIndex);
    setActiveIndex(normalizedIndex);
    setIsTransitioning(true);
    setRemainingMs(AUTOPLAY_MS);
  };

  const handleHeroDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!canNavigate) {
      return;
    }

    if (info.offset.x <= -50) {
      goTo(activeIndex + 1, 1);
      return;
    }

    if (info.offset.x >= 50) {
      goTo(activeIndex - 1, -1);
    }
  };

  const togglePaused = () => {
    if (!canNavigate || prefersReducedMotion) {
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      return;
    }

    const startedAt = autoplayStartedAtRef.current;
    if (startedAt !== null) {
      const elapsedMs = performance.now() - startedAt;
      setRemainingMs((currentRemaining) => Math.max(0, currentRemaining - elapsedMs));
    }

    setIsPaused(true);
  };

  return (
    <LayoutGroup id="radar-cinematic-slider">
      <section className="relative isolate h-[clamp(530px,72vh,740px)] overflow-hidden rounded-[34px] border border-white/16 bg-[#0b1117] text-white shadow-[0_38px_96px_-52px_rgba(0,0,0,0.75)]">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(165deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_24%,rgba(255,255,255,0.01)_48%,rgba(8,14,20,0.34)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.2),transparent_42%),radial-gradient(circle_at_82%_92%,rgba(204,255,0,0.08),transparent_40%)]" />
        <div className="pointer-events-none absolute left-6 right-6 top-0 z-[2] h-px bg-white/30" />
        {canNavigate ? (
          <button
            type="button"
            onClick={togglePaused}
            aria-label={isPaused ? "Reanudar reproducción automática" : "Pausar reproducción automática"}
            title={isPaused ? "Continuar" : "Pausar"}
            className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/22 bg-white/10 text-white shadow-[0_16px_34px_-24px_rgba(0,0,0,0.66)] backdrop-blur-md transition-colors hover:bg-white/18 sm:right-6 sm:top-6"
          >
            {isPaused ? <Play className="h-[18px] w-[18px]" /> : <Pause className="h-[18px] w-[18px]" />}
            <span className="sr-only">{isPaused ? "Continuar" : "Pausar"}</span>
          </button>
        ) : null}

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0b1117]" />

          <AnimatePresence initial={false}>
            {previousItem ? (
              <motion.div
                key={`trail-${previousItem.title}-${activeItem.title}`}
                className="absolute inset-0"
                initial={{ opacity: prefersReducedMotion ? 0 : 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : TRAIL_FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={previousItem.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div
            layoutId={getSlideLayoutId(activeItem.title)}
            transition={SPRING}
            className="absolute inset-0 overflow-hidden"
            drag={canNavigate ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleHeroDragEnd}
          >
            <motion.img
              key={`hero-${activeItem.title}`}
              src={activeItem.image}
              alt={activeItem.title}
              className="h-full w-full object-cover"
              initial={prefersReducedMotion ? false : { scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-black/42" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,20,0.78)_0%,rgba(8,14,20,0.62)_30%,rgba(8,14,20,0.2)_65%,rgba(8,14,20,0.48)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent_0%,rgba(8,14,20,0.82)_100%)]" />
          </motion.div>
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-7 pt-8 sm:px-7 sm:pb-8 sm:pt-10 lg:px-10 lg:pb-9 lg:pt-10 xl:px-12">
          <div className="grid h-full items-end gap-8 pb-3 lg:grid-cols-[minmax(0,1fr)_minmax(620px,720px)] lg:gap-10 lg:pb-7">
            <div className="flex h-full flex-col justify-end pb-1 lg:pb-5">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeItem.title}
                  variants={CONTENT_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={SPRING}
                  className="max-w-[38rem]"
                >
                  <h2 className="text-balance text-[2rem] font-black leading-[0.98] tracking-[-0.035em] text-white sm:text-[2.7rem] lg:text-[3.25rem] xl:text-[3.7rem]">
                    {activeItem.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[0.92rem] leading-7 text-white/80 sm:text-[0.97rem]">
                    {activeItem.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {isMobile ? (
              <div className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2">
                {previewItems.slice(0, 3).map((item) => (
                  <button
                    key={`mobile-${item.title}`}
                    type="button"
                    onClick={() => {
                      const forwardDistance = wrapIndex(items.length, item.originalIndex - activeIndex);
                      const backwardDistance = wrapIndex(items.length, activeIndex - item.originalIndex);
                      goTo(item.originalIndex, forwardDistance <= backwardDistance ? 1 : -1);
                    }}
                    className="w-[11.2rem] shrink-0 overflow-hidden rounded-[22px] border border-white/16 bg-white/[0.08] text-left shadow-[0_14px_30px_-24px_rgba(0,0,0,0.52)] backdrop-blur-[10px] outline-none"
                  >
                    <motion.div layoutId={getSlideLayoutId(item.title)} transition={SPRING} className="relative h-[15.4rem]">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.5)_100%)]" />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.28),transparent_44%)]" />
                      <div className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-white/30" />
                    </motion.div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 lg:mt-0 lg:h-full lg:items-end lg:justify-end lg:gap-4 lg:overflow-visible lg:px-0 xl:pb-3">
                {previewItems.map((item) => {
                  return (
                    <motion.button
                      key={item.title}
                      layout
                      type="button"
                      onClick={() => {
                        const forwardDistance = wrapIndex(items.length, item.originalIndex - activeIndex);
                        const backwardDistance = wrapIndex(items.length, activeIndex - item.originalIndex);
                        goTo(item.originalIndex, forwardDistance <= backwardDistance ? 1 : -1);
                      }}
                      whileHover={canNavigate ? { y: -2 } : undefined}
                      transition={SPRING}
                      className="w-[10.75rem] shrink-0 text-left xl:w-[11.2rem]"
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.div
                        layoutId={getSlideLayoutId(item.title)}
                        transition={SPRING}
                        className="relative h-[16.9rem] overflow-hidden rounded-[22px] border border-white/16 bg-white/[0.08] shadow-[0_22px_44px_-30px_rgba(0,0,0,0.58)] backdrop-blur-[10px] xl:h-[17.6rem]"
                      >
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/58" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.48)_100%)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.28),transparent_44%)]" />
                        <div className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-white/30" />
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid items-center gap-4 border-t border-white/12 pt-5 sm:grid-cols-[auto,1fr,auto]">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1, -1)}
              disabled={!canNavigate}
              aria-label="Ir a la noticia anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-white/56">
                <span>Anterior</span>
                <span>Siguiente</span>
              </div>
              <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/16">
                {!prefersReducedMotion ? (
                  <motion.div
                    key={`autoplay-progress-${activeIndex}`}
                    className="h-full rounded-full bg-[#CCFF00]"
                    initial={{ width: timedProgressWidth }}
                    animate={{ width: isAutoPlayEnabled ? "100%" : timedProgressWidth }}
                    transition={{ duration: isAutoPlayEnabled ? remainingMs / 1000 : 0, ease: "linear" }}
                  />
                ) : (
                  <motion.div
                    className="h-full rounded-full bg-[#CCFF00]"
                    animate={{ width: manualProgressWidth }}
                    transition={SPRING}
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1, 1)}
              disabled={!canNavigate}
              aria-label="Ir a la siguiente noticia"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-40 sm:justify-self-end"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </LayoutGroup>
  );
}

export type { CinematicSliderItem };
