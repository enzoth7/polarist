import { useState } from "react";

import { cn } from "@/lib/utils";

interface BubbleTextProps {
  text?: string;
  className?: string;
}

export const BubbleText = ({ text = "Bubbbbbbbble text", className }: BubbleTextProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <span
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn("inline-block text-center font-bold text-[#F6F6F6]", className)}
    >
      {text.split("").map((char, idx) => {
        const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;
        let classes = "inline-block transition-all duration-300 ease-in-out cursor-default";

        switch (distance) {
          case 0:
            classes += " font-black text-[#CAFE5B] drop-shadow-[0_0_16px_rgba(202,254,91,0.45)]";
            break;
          case 1:
            classes += " font-extrabold text-[#DFFF8C] drop-shadow-[0_0_10px_rgba(202,254,91,0.28)]";
            break;
          case 2:
            classes += " font-bold text-[#F6F6F6]";
            break;
          default:
            break;
        }

        return (
          <span key={`${char}-${idx}`} onMouseEnter={() => setHoveredIndex(idx)} className={classes}>
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
};
