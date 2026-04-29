"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  src: string;
  description: string;
  media?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  disableSharedLayout?: boolean;
}

export function ExpandableCard({
  title,
  src,
  description,
  media,
  children,
  className,
  classNameExpanded,
  disableSharedLayout = false,
  style,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const sequelStyle: React.CSSProperties = {
    ...style,
    fontFamily: "Sequel Sans",
  };
  const cardTransition = {
    type: "spring",
    stiffness: 220,
    damping: 30,
    mass: 1,
  } as const;

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      <AnimatePresence initial={false}>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 h-full w-full bg-black/55 backdrop-blur-md"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {active ? (
          <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6 lg:p-10">
            <motion.div
              layoutId={disableSharedLayout ? undefined : `card-${title}-${id}`}
              initial={disableSharedLayout ? { opacity: 0, scale: 0.98, y: 12 } : undefined}
              animate={disableSharedLayout ? { opacity: 1, scale: 1, y: 0 } : undefined}
              exit={disableSharedLayout ? { opacity: 0, scale: 0.98, y: 12 } : undefined}
              transition={cardTransition}
              ref={cardRef}
              className={cn(
                "tools-modal-sequel relative flex h-full max-h-[min(92vh,960px)] w-full max-w-[920px] flex-col overflow-auto rounded-[2rem] border border-white/10 bg-[#010101] font-sequel shadow-[0_28px_90px_rgba(0,0,0,0.55)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]",
                classNameExpanded,
              )}
              style={sequelStyle}
              {...props}
            >
              <div>
                <div className="relative before:absolute before:inset-x-0 before:bottom-[-1px] before:z-10 before:h-24 before:bg-gradient-to-t before:from-[#010101] before:to-transparent">
                  {media ?? (
                    <img
                      src={src}
                      alt={title}
                      className="h-72 w-full object-cover object-center sm:h-96"
                    />
                  )}
                </div>
              </div>

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-6 p-6 sm:p-8">
                  <div>
                    {description ? (
                      <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#cafe5b]/75">
                        {description}
                      </p>
                    ) : null}
                    <h3
                      id={`card-title-${id}`}
                      className={cn(
                        "font-semibold tracking-[-0.04em] text-white sm:text-4xl",
                        description ? "mt-2 text-3xl" : "text-4xl sm:text-5xl",
                      )}
                    >
                      {title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="Cerrar tarjeta"
                    className="absolute right-8 top-0 flex shrink-0 items-center justify-center text-white/75 transition-colors duration-300 hover:text-white focus:outline-none"
                    onClick={() => setActive(false)}
                  >
                    <motion.div
                      animate={{ rotate: active ? 45 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Plus className="h-5 w-5" />
                    </motion.div>
                  </button>
                </div>

                <div className="px-6 pb-8 sm:px-8 sm:pb-10">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex flex-col items-start gap-4 text-sm leading-7 text-white/72 sm:text-base"
                  >
                    {children}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        role="button"
        tabIndex={0}
        aria-labelledby={`card-title-${id}`}
        aria-haspopup="dialog"
        layoutId={disableSharedLayout ? undefined : `card-${title}-${id}`}
        transition={cardTransition}
        onClick={() => setActive(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setActive(true);
          }
        }}
        className={cn(
          "tools-modal-sequel group flex w-full cursor-pointer flex-col overflow-hidden rounded-[1.9rem] border border-[#e7e7eb] bg-[#f8f8f9] p-4 font-sequel shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-500 hover:-translate-y-1",
          className,
        )}
        style={sequelStyle}
      >
        <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-4">
          <div className="min-h-0">
            {media ?? (
              <img
                src={src}
                alt={title}
                className="h-full w-full rounded-[1.5rem] object-cover object-center"
              />
            )}
          </div>

          <div className="flex min-h-[5.25rem] items-end justify-between gap-4 px-2 pb-1">
            <div className="min-w-0 flex-1">
              {description ? (
                <p className="text-sm font-semibold tracking-normal text-[#777986] sm:text-[0.95rem]">
                  {description}
                </p>
              ) : null}
              <h3
                id={`card-title-${id}`}
                className={cn(
                  "font-semibold tracking-normal text-[#050507]",
                  description ? "mt-1 text-[1.45rem] leading-[1.02] sm:text-[1.65rem]" : "text-[1.55rem] leading-[1.02] sm:text-[1.75rem]",
                )}
              >
                {title}
              </h3>
            </div>

            <button
              type="button"
              aria-label="Abrir tarjeta"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e0e2e8] bg-[#f8f8f9] text-[#333641] transition-colors duration-300 group-hover:border-[#caced8] group-hover:bg-white focus:outline-none sm:h-12 sm:w-12"
            >
              <motion.div
                animate={{ rotate: active ? 45 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
