"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type NavHeaderItem = {
  id: string;
  label: string;
  meta?: React.ReactNode;
};

type CursorState = {
  left: number;
  width: number;
  opacity: number;
};

type NavHeaderProps = {
  activeId: string;
  className?: string;
  cursorClassName?: string;
  itemClassName?: string;
  items: NavHeaderItem[];
  onChange: (id: string) => void;
};

export default function NavHeader({
  activeId,
  className,
  cursorClassName,
  itemClassName,
  items,
  onChange,
}: NavHeaderProps) {
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [position, setPosition] = useState<CursorState>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId, items],
  );

  useLayoutEffect(() => {
    if (!activeItem) {
      return;
    }

    const activeElement = itemRefs.current[activeItem.id];
    if (!activeElement) {
      return;
    }

    setPosition({
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth,
      opacity: 1,
    });
  }, [activeItem, items]);

  return (
    <ul
      className={cn(
        "relative flex w-max flex-nowrap rounded-full border border-black/10 bg-[#f3f3f3] p-1",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          ref={(node) => {
            itemRefs.current[item.id] = node;
          }}
          className="relative z-10"
        >
          <button
            type="button"
            onClick={() => onChange(item.id)}
            onMouseEnter={() => {
              const currentElement = itemRefs.current[item.id];
              if (!currentElement) {
                return;
              }

              setPosition({
                left: currentElement.offsetLeft,
                width: currentElement.offsetWidth,
                opacity: 1,
              });
            }}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[#010101] transition-colors",
              itemClassName,
            )}
          >
            <span className={cn("relative z-10", activeId === item.id && "font-bold")}>
              {item.label}
            </span>
            {item.meta ? <span className="relative z-10 opacity-70">{item.meta}</span> : null}
          </button>
        </li>
      ))}

      <motion.li
        animate={position}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        className={cn(
          "pointer-events-none absolute inset-y-1 z-0 rounded-full bg-white shadow-[0_10px_26px_rgba(0,0,0,0.08)]",
          cursorClassName,
        )}
      />
    </ul>
  );
}
