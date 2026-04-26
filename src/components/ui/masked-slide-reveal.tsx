"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MaskedSlideRevealProps {
  text: string;
  staggerDelay?: number;
  className?: string;
  delay?: number;
}

export function MaskedSlideReveal({
  text,
  staggerDelay = 0.08,
  className,
  delay = 0,
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
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
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
