import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type ShowcaseExample = {
  beforeSrc: string;
  afterSrc: string;
  beforeAltKey: string;
  afterAltKey: string;
};

const showcaseExamples: ShowcaseExample[] = [
  {
    beforeSrc: "/products/burger.jpeg",
    afterSrc: "/products/buger_photo.jpeg",
    beforeAltKey: "landing.showcase.examples.burgerAlt",
    afterAltKey: "landing.showcase.examples.burgerphotoAlt",
  },
  {
    beforeSrc: "/products/burger.jpeg",
    afterSrc: "/products/burger_design.png",
    beforeAltKey: "landing.showcase.examples.burgerAlt",
    afterAltKey: "landing.showcase.examples.burgerdesignAlt",
  },
];

interface BeforeAfterSliderProps {
  examples?: ShowcaseExample[];
  showHeader?: boolean;
  showControls?: boolean;
  className?: string;
  aspectClassName?: string;
  beforeImageClassName?: string;
  afterImageClassName?: string;
  titleKey?: string;
  ariaLabel?: string;
}

const BeforeAfterSlider = ({
  examples,
  showHeader = true,
  showControls,
  className,
  aspectClassName,
  beforeImageClassName,
  afterImageClassName,
  titleKey = "landing.showcase.title",
  ariaLabel,
}: BeforeAfterSliderProps) => {
  const { t } = useTranslation();
  const sliderExamples = useMemo(() => (examples && examples.length > 0 ? examples : showcaseExamples), [examples]);
  const examplesKey = useMemo(
    () => sliderExamples.map((example) => `${example.beforeSrc}|${example.afterSrc}`).join("::"),
    [sliderExamples],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [splitPosition, setSplitPosition] = useState(50);

  useEffect(() => {
    setSplitPosition(50);
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(0);
    setSplitPosition(50);
  }, [examplesKey]);

  const showPreviousExample = () => {
    setActiveIndex((previous) => (previous - 1 + sliderExamples.length) % sliderExamples.length);
  };

  const showNextExample = () => {
    setActiveIndex((previous) => (previous + 1) % sliderExamples.length);
  };

  const activeExample = sliderExamples[activeIndex] ?? sliderExamples[0];
  const controlsEnabled = showControls ?? sliderExamples.length > 1;
  const comparatorLabel = ariaLabel ?? t("landing.showcase.comparatorAriaLabel", { index: activeIndex + 1 });

  return (
    <section className={cn("mx-auto w-full max-w-[58rem]", className)}>
      {showHeader && (
        <div className="mb-6 flex flex-col items-center gap-2 md:mb-7">
          <p className="font-heading text-sm uppercase tracking-[0.22em] text-foreground/85 md:text-base">
            {t(titleKey)}
          </p>
          <span className="h-px w-20 bg-border/80" />
        </div>
      )}

      <div className={cn("relative mx-auto w-full overflow-hidden rounded-[1.6rem] aspect-[16/9]", aspectClassName)}>
        <img
          src={activeExample.beforeSrc}
          alt={t(activeExample.beforeAltKey)}
          className={cn("absolute inset-0 h-full w-full select-none object-cover", beforeImageClassName)}
          draggable={false}
        />

        <div className="absolute inset-0 bg-background" style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}>
          <img
            src={activeExample.afterSrc}
            alt={t(activeExample.afterAltKey)}
            className={cn("h-full w-full select-none object-cover", afterImageClassName)}
            draggable={false}
          />
        </div>

        <div className="pointer-events-none absolute inset-y-0 z-20" style={{ left: `${splitPosition}%` }}>
          <div className="relative h-full">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground/65" />
            <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 shadow-soft" />
          </div>
        </div>

        <input
          type="range"
          min={5}
          max={95}
          value={splitPosition}
          onChange={(event) => setSplitPosition(Number(event.target.value))}
          aria-label={comparatorLabel}
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      {controlsEnabled && (
        <div className="mt-4 flex items-center justify-center gap-2 md:mt-5">
          <button
            type="button"
            onClick={showPreviousExample}
            aria-label={t("landing.showcase.previousExample")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground/70 transition-colors hover:border-foreground/35 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={showNextExample}
            aria-label={t("landing.showcase.nextExample")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground/70 transition-colors hover:border-foreground/35 hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      )}
    </section>
  );
};

export default BeforeAfterSlider;
