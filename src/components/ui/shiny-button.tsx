import type React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function ShinyButton({ asChild = false, children, className = "", ...props }: ShinyButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: #f6f6f6;
          inherits: false;
        }

        .polarist-shiny-cta {
          --shiny-cta-bg: var(--polarist-green, #CAFE5B);
          --shiny-cta-bg-subtle: rgba(1, 1, 1, 0.18);
          --shiny-cta-fg: var(--polarist-black, #010101);
          --shiny-cta-highlight: rgba(246, 246, 246, 0.95);
          --shiny-cta-highlight-subtle: rgba(202, 254, 91, 0.75);
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          border: 1px solid transparent;
          border-radius: var(--r-pill, 999px);
          color: var(--shiny-cta-fg);
          background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
            conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              var(--shiny-cta-highlight) var(--gradient-percent),
              var(--gradient-shine) calc(var(--gradient-percent) * 2),
              var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            ) border-box;
          box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle), 0 18px 42px rgba(202, 254, 91, 0.16);
          transition: var(--transition);
          transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine, transform, opacity;
        }

        .polarist-shiny-cta::before,
        .polarist-shiny-cta::after,
        .polarist-shiny-cta span::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        .polarist-shiny-cta:active {
          translate: 0 1px;
        }

        .polarist-shiny-cta::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
            circle at var(--position) var(--position),
            rgba(1, 1, 1, 0.34) calc(var(--position) / 4),
            transparent 0
          ) padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.28;
          z-index: -1;
        }

        .polarist-shiny-cta::after {
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(-50deg, transparent, rgba(246, 246, 246, 0.55), transparent);
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.44;
        }

        .polarist-shiny-cta span {
          position: relative;
          z-index: 1;
        }

        .polarist-shiny-cta span::before {
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px rgba(246, 246, 246, 0.36);
          opacity: 0;
          transition: opacity var(--transition);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        .polarist-shiny-cta,
        .polarist-shiny-cta::before,
        .polarist-shiny-cta::after {
          animation: var(--animation) var(--duration),
            var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        .polarist-shiny-cta:is(:hover, :focus-visible) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--shiny-cta-highlight-subtle);
          transform: scale(1.04);
        }

        .polarist-shiny-cta:is(:hover, :focus-visible),
        .polarist-shiny-cta:is(:hover, :focus-visible)::before,
        .polarist-shiny-cta:is(:hover, :focus-visible)::after {
          animation-play-state: running;
        }

        .polarist-shiny-cta:is(:hover, :focus-visible) span::before {
          opacity: 1;
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        @keyframes shimmer {
          to {
            rotate: 360deg;
          }
        }

        @keyframes breathe {
          from, to {
            scale: 1;
          }
          50% {
            scale: 1.2;
          }
        }
      `}</style>

      <Comp className={cn("polarist-shiny-cta", className)} {...props}>
        <span>{children}</span>
      </Comp>
    </>
  );
}
