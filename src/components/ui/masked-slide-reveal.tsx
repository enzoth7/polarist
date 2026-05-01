"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MaskedSlideRevealProps {
  text: string;
  staggerDelay?: number;
  className?: string;
  delay?: number;
  triggerOnView?: boolean;
  viewportAmount?: number;
  animateOnce?: boolean;
}

export function MaskedSlideReveal({
  text,
  staggerDelay = 0.08,
  className,
  delay = 0,
  triggerOnView = false,
  viewportAmount = 0.6,
  animateOnce = false,
}: MaskedSlideRevealProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            lineHeight: 1.1,
            marginRight: "0.2em",
            paddingBottom: "0.1em",
            paddingRight: "0.05em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={animateOnce || !triggerOnView ? { y: "0%" } : undefined}
            whileInView={triggerOnView ? { y: "0%" } : undefined}
            viewport={triggerOnView ? { once: true, amount: viewportAmount } : undefined}
            transition={{
              type: "spring",
              damping: 14,
              stiffness: 100,
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
