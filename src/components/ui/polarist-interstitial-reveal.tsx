"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MaskedSlideReveal } from "@/components/ui/masked-slide-reveal";

interface PolaristInterstitialRevealProps {
  title: string;
  description: string;
  className?: string;
  singleLine?: boolean;
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
  singleLine = false,
}: PolaristInterstitialRevealProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleLines = useMemo(() => {
    if (singleLine) return [title];
    return splitTitle(title);
  }, [title, singleLine]);
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
        "relative isolate overflow-hidden bg-[#010101] px-6 pb-24 pt-24 sm:px-10 sm:pb-28 sm:pt-28 lg:px-16 lg:pb-32 lg:pt-32",
        className,
      )}
    >
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2
          className={cn(
            "max-w-5xl font-semibold leading-[0.8] tracking-[-0.08em] !text-[#F6F6F6]",
            singleLine ? "text-[clamp(2.2rem,4.8vw,4.5rem)]" : "text-[clamp(3.1rem,7.4vw,6.5rem)]"
          )}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {titleLines.map((line, lineIndex) => {
            const currentDelay = wordDelay;
            wordDelay += line.split(/\s+/).length * 0.08 + 0.28;

            return (
              <div key={`${line}-${lineIndex}`} className={lineIndex > 0 ? "-mt-2 md:-mt-5 lg:-mt-7" : ""}>
                <MaskedSlideReveal
                  text={line}
                  delay={currentDelay}
                  animateOnce={hasEnteredView}
                  className={cn(
                    "justify-center !text-[#CAFE5B]",
                    singleLine && "md:flex-nowrap md:whitespace-nowrap"
                  )}
                />
              </div>
            );
          })}
        </h2>

        <div className="mt-16 md:mt-20 flex flex-col gap-6 w-full">
          {description.split(". ").map((line, index, array) => {
            const lineText = index < array.length - 1 ? line + "." : line;
            return (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={hasEnteredView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                className="max-w-2xl md:max-w-5xl mx-auto text-balance text-[1.05rem] leading-relaxed md:text-[1.3rem] md:leading-[1.65] !text-[#F6F6F6]/85"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                {lineText}
              </motion.p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
