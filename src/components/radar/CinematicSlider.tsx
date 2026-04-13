import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

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

type SlideTarget = {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  interactive: boolean;
};

const AUTOPLAY_MS = 3000;
const TRANSITION_DURATION = 1.05;
const TRANSITION_EASE = "elastic.out(0.78, 0.8)";

const getWrappedOffset = (index: number, activeIndex: number, total: number) => {
  let offset = index - activeIndex;
  const half = total / 2;

  if (offset > half) {
    offset -= total;
  }

  if (offset < -half) {
    offset += total;
  }

  return offset;
};

const getSlideTarget = (offset: number, stageWidth: number): SlideTarget => {
  const primaryOffset = Math.min(Math.max(stageWidth * 0.31, 240), 420);
  const secondaryOffset = Math.min(Math.max(stageWidth * 0.52, 420), 680);
  const direction = offset < 0 ? -1 : 1;

  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      zIndex: 50,
      interactive: true,
    };
  }

  if (Math.abs(offset) === 1) {
    return {
      x: direction * primaryOffset,
      y: 6,
      z: -180,
      rotateY: direction < 0 ? 25 : -25,
      scale: 0.8,
      opacity: 0.94,
      zIndex: 30,
      interactive: true,
    };
  }

  if (Math.abs(offset) === 2) {
    return {
      x: direction * secondaryOffset,
      y: 16,
      z: -360,
      rotateY: direction < 0 ? 33 : -33,
      scale: 0.66,
      opacity: 0.42,
      zIndex: 18,
      interactive: false,
    };
  }

  return {
    x: direction * (secondaryOffset + 220),
    y: 22,
    z: -520,
    rotateY: direction < 0 ? 35 : -35,
    scale: 0.52,
    opacity: 0,
    zIndex: 5,
    interactive: false,
  };
};

export function CinematicSlider({ items }: CinematicSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const autoplayRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  const canNavigate = items.length > 1;

  const userControlledRef = useRef(false);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleArrow = useCallback(
    (direction: "next" | "prev") => {
      userControlledRef.current = true;
      stopAutoplay();
      if (direction === "next") goToNext();
      else goToPrev();
    },
    [goToNext, goToPrev, stopAutoplay],
  );

  const startAutoplay = useCallback(() => {
    if (!canNavigate || userControlledRef.current) {
      return;
    }

    stopAutoplay();
    autoplayRef.current = window.setInterval(goToNext, AUTOPLAY_MS);
  }, [canNavigate, goToNext, stopAutoplay]);

  const positionSlides = useCallback(
    (animate: boolean) => {
      const stageWidth = stageRef.current?.clientWidth ?? window.innerWidth;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) {
          return;
        }

        const offset = getWrappedOffset(index, activeIndex, items.length);
        const target = getSlideTarget(offset, stageWidth);

        const tween = {
          xPercent: -50,
          yPercent: -50,
          x: target.x,
          y: target.y,
          z: target.z,
          rotateY: target.rotateY,
          scale: target.scale,
          autoAlpha: target.opacity,
          zIndex: target.zIndex,
          pointerEvents: target.interactive ? "auto" : "none",
          transformOrigin: "center center",
          force3D: true,
        };

        if (animate) {
          gsap.to(slide, {
            ...tween,
            duration: TRANSITION_DURATION,
            ease: TRANSITION_EASE,
          });
          return;
        }

        gsap.set(slide, tween);
      });
    },
    [activeIndex, items.length],
  );

  const setSlideRef = useCallback((index: number) => {
    return (node: HTMLDivElement | null) => {
      slideRefs.current[index] = node;
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const shouldAnimate = initializedRef.current;
    positionSlides(shouldAnimate);
    initializedRef.current = true;
  }, [items.length, positionSlides]);

  useEffect(() => {
    if (!canNavigate) {
      stopAutoplay();
      return;
    }

    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [canNavigate, startAutoplay, stopAutoplay]);

  useEffect(() => {
    const handleResize = () => {
      positionSlides(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [positionSlides]);

  useEffect(() => {
    return () => {
      stopAutoplay();
      slideRefs.current.forEach((slide) => {
        if (slide) {
          gsap.killTweensOf(slide);
        }
      });
    };
  }, [stopAutoplay]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="relative isolate flex h-[clamp(500px,85vh,900px)] flex-col overflow-x-clip text-white"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {items.map((item, index) => (
          <div
            key={`radar-bg-${item.title}`}
            className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out"
            style={{
              backgroundImage: `url(${item.image})`,
              filter: "blur(50px)",
              transform: "scale(1.12)",
              opacity: activeIndex === index ? 0.55 : 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div
          ref={stageRef}
          className="relative h-[clamp(420px,72vh,760px)] w-full [perspective:2000px] [transform-style:preserve-3d]"
        >
          {items.map((item, index) => (
            <div
              key={item.title}
              ref={setSlideRef(index)}
              className="absolute left-1/2 top-1/2 aspect-[9/16] w-[clamp(220px,24vw,330px)] will-change-transform [transform-style:preserve-3d]"
              onClick={() => {
                if (index !== activeIndex) {
                  setActiveIndex(index);
                }
              }}
            >
              <article className="radar-card group relative h-full w-full overflow-hidden rounded-3xl border border-white/16 bg-black/20 shadow-[0_30px_85px_-35px_rgba(0,0,0,0.95)]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/28 to-black/10" />
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_30%,rgba(255,255,255,0)_66%)]" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h2 className="text-balance text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                    {item.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-[0.86rem] leading-relaxed text-white/78 md:text-[0.92rem]">
                    {item.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Flechas de navegación */}
      {canNavigate && (
        <>
          {/* Flecha izquierda */}
          <button
            id="slider-prev"
            aria-label="Anterior"
            onClick={() => handleArrow("prev")}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 md:left-8 md:h-13 md:w-13"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            id="slider-next"
            aria-label="Siguiente"
            onClick={() => handleArrow("next")}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 md:right-8 md:h-13 md:w-13"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}

export type { CinematicSliderItem };
