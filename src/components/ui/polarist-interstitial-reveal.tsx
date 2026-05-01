"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MaskedSlideReveal } from "@/components/ui/masked-slide-reveal";

interface PolaristInterstitialRevealProps {
  title: string;
  description: string;
  className?: string;
}

const splitTitle = (title: string) => {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) {
    return [title];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
};

export function PolaristInterstitialReveal({
  title,
  description,
  className,
}: PolaristInterstitialRevealProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleLines = useMemo(() => splitTitle(title), [title]);
  const descriptionLines = useMemo(() => {
    const midpoint = Math.ceil(description.length / 2);
    const splitIndex = description.indexOf(" ", midpoint);

    if (splitIndex === -1) {
      return [description];
    }

    return [description.slice(0, splitIndex), description.slice(splitIndex + 1)];
  }, [description]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const ripple = { id: Date.now(), x: event.clientX, y: event.clientY };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== ripple.id));
      }, 900);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || hasEnteredView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasEnteredView]);

  let wordDelay = 0.25;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate overflow-hidden bg-[#010101] px-6 pb-12 pt-24 sm:px-10 sm:pb-14 sm:pt-28 lg:px-16 lg:pb-16 lg:pt-32",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#CAFE5B]/10 via-[#CAFE5B]/4 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CAFE5B]/[0.05] blur-3xl" />
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" aria-hidden="true">
        <defs>
          <pattern id="polarist-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(202,254,91,0.12)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#polarist-grid)" />
        <line x1="15%" y1="0" x2="15%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 10" />
        <line x1="85%" y1="0" x2="85%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 10" />
        <line x1="0" y1="28%" x2="100%" y2="28%" stroke="rgba(255,255,255,0.05)" strokeDasharray="6 10" />
        <line x1="0" y1="72%" x2="100%" y2="72%" stroke="rgba(255,255,255,0.05)" strokeDasharray="6 10" />
      </svg>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2
          className="max-w-5xl text-[clamp(3.1rem,7.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] !text-[#F6F6F6]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {titleLines.map((line, lineIndex) => {
            const currentDelay = wordDelay;
            wordDelay += line.split(/\s+/).length * 0.08 + 0.28;

            return (
              <div key={`${line}-${lineIndex}`} className={lineIndex > 0 ? "mt-2 md:mt-3" : ""}>
                <MaskedSlideReveal
                  text={line}
                  delay={currentDelay}
                  animateOnce={hasEnteredView}
                  className="justify-center !text-[#CAFE5B]"
                />
              </div>
            );
          })}
        </h2>

        <div
          className="mt-10 max-w-6xl text-balance text-[1.12rem] leading-8 !text-[#F6F6F6] md:text-[1.5rem] md:leading-[1.55] lg:max-w-[86rem]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {description.split(". ").map((line, index, array) => {
            const lineText = index < array.length - 1 ? line + "." : line;
            const lineDelay = wordDelay + index * 0.4; // Slightly more delay for the second paragraph

            return (
              <div key={index} className={index > 0 ? "mt-6" : ""}>
                <MaskedSlideReveal
                  text={lineText}
                  delay={lineDelay}
                  animateOnce={hasEnteredView}
                  className="justify-center !text-[#F6F6F6]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
