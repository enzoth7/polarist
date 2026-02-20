import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type ShowcaseExample = {
  beforeSrc: string;
  afterSrc: string;
  beforeAltKey: string;
  afterAltKey: string;
};

const showcaseExamples: ShowcaseExample[] = [
  {
    beforeSrc: "/products/cake_before.jpeg",
    afterSrc: "/products/cake_after.jpeg",
    beforeAltKey: "landing.showcase.examples.cakeBeforeAlt",
    afterAltKey: "landing.showcase.examples.cakeAfterAlt",
  },
  {
    beforeSrc: "/products/taco_before.jpeg",
    afterSrc: "/products/taco_after.jpeg",
    beforeAltKey: "landing.showcase.examples.tacoBeforeAlt",
    afterAltKey: "landing.showcase.examples.tacoAfterAlt",
  },
];

const BeforeAfterSlider = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [splitPosition, setSplitPosition] = useState(50);

  useEffect(() => {
    setSplitPosition(50);
  }, [activeIndex]);

  const showPreviousExample = () => {
    setActiveIndex((previous) => (previous - 1 + showcaseExamples.length) % showcaseExamples.length);
  };

  const showNextExample = () => {
    setActiveIndex((previous) => (previous + 1) % showcaseExamples.length);
  };

  const activeExample = showcaseExamples[activeIndex];

  return (
    <section className="mx-auto w-full max-w-[58rem]">
      <div className="mb-6 flex flex-col items-center gap-2 md:mb-7">
        <p className="font-heading text-sm uppercase tracking-[0.22em] text-foreground/85 md:text-base">
          {t("landing.showcase.title")}
        </p>
        <span className="h-px w-20 bg-border/80" />
      </div>

      <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-[1.6rem]">
        <img
          src={activeExample.beforeSrc}
          alt={t(activeExample.beforeAltKey)}
          className="absolute inset-0 h-full w-full select-none object-cover"
          draggable={false}
        />

        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}>
          <img
            src={activeExample.afterSrc}
            alt={t(activeExample.afterAltKey)}
            className="h-full w-full select-none object-cover"
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
          aria-label={t("landing.showcase.comparatorAriaLabel", { index: activeIndex + 1 })}
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

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
    </section>
  );
};

export default BeforeAfterSlider;
