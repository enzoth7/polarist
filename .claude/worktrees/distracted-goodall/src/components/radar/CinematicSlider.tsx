import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
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

const AUTOPLAY_MS = 6800;
const TRANSITION_GUARD_MS = 760;

const wrapIndex = (length: number, index: number) => ((index % length) + length) % length;

export function CinematicSlider({ items }: CinematicSliderProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [remainingMs, setRemainingMs] = useState(AUTOPLAY_MS);

  const canNavigate = items.length > 1;
  const isAutoPlayEnabled = canNavigate && !prefersReducedMotion;

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
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNavDirection(1);
      setActiveIndex(wrapIndex(items.length, activeIndex + 1));
      setIsTransitioning(true);
      setRemainingMs(AUTOPLAY_MS);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isAutoPlayEnabled, items.length, remainingMs]);

  useEffect(() => {
    setRemainingMs(AUTOPLAY_MS);
  }, [activeIndex]);

  if (items.length === 0) {
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

  const getVisibleCards = () => {
    const visibleCount = isMobile ? 3 : 5;
    const half = Math.floor(visibleCount / 2);
    const cards: Array<{
      item: CinematicSliderItem;
      originalIndex: number;
      offset: number;
      isActive: boolean;
    }> = [];

    for (let i = -half; i <= half; i++) {
      const index = wrapIndex(items.length, activeIndex + i);
      cards.push({
        item: items[index],
        originalIndex: index,
        offset: i,
        isActive: i === 0,
      });
    }

    return cards;
  };

  return (
    <section className="relative isolate flex h-[clamp(500px,85vh,900px)] flex-col overflow-x-clip bg-transparent text-white">
      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative flex h-full w-full items-center justify-center overflow-visible">
          <AnimatePresence initial={false} mode="popLayout">
            {getVisibleCards().map((card) => (
              <motion.div
                key={card.item.title}
                layout
                className="absolute cursor-pointer"
                style={{
                  width: card.isActive
                    ? "clamp(300px, 36vw, 480px)"
                    : Math.abs(card.offset) === 1
                      ? "clamp(250px, 28vw, 380px)"
                      : "clamp(210px, 23vw, 300px)",
                  zIndex: card.isActive ? 10 : Math.abs(card.offset) === 1 ? 8 : 6,
                }}
                initial={{
                  x:
                    card.offset === 0
                      ? 0
                      : card.offset * (isMobile ? 220 : Math.abs(card.offset) === 1 ? 380 : 350),
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  x:
                    card.offset === 0
                      ? 0
                      : card.offset * (isMobile ? 220 : Math.abs(card.offset) === 1 ? 380 : 350),
                  opacity: card.isActive ? 1 : Math.abs(card.offset) === 1 ? 0.8 : 0.55,
                  scale: card.isActive ? 1 : Math.abs(card.offset) === 1 ? 0.92 : 0.85,
                  filter: card.isActive
                    ? "brightness(1)"
                    : `brightness(${Math.abs(card.offset) === 1 ? 0.75 : 0.5})`,
                }}
                exit={{
                  x: navDirection * -600,
                  opacity: 0,
                  scale: 0.6,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                        mass: 1,
                      }
                }
                onClick={() => {
                  if (!card.isActive) {
                    goTo(card.originalIndex, card.offset > 0 ? 1 : -1);
                  }
                }}
                drag={card.isActive && canNavigate ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={card.isActive ? handleHeroDragEnd : undefined}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
                  <img
                    src={card.item.image}
                    alt={card.item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {card.isActive && (
                    <motion.div
                      className="absolute inset-x-0 bottom-0 p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    >
                      <h2 className="text-balance text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                        {card.item.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/75">
                        {card.item.description}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export type { CinematicSliderItem };
