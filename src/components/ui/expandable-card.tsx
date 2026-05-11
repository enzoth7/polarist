"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  src: string;
  description: string;
  media?: React.ReactNode;
  hideExpandedMedia?: boolean;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  disableSharedLayout?: boolean;
  expandedHeaderActions?: React.ReactNode;
}

export function ExpandableCard({
  title,
  src,
  description,
  media,
  hideExpandedMedia = false,
  children,
  className,
  classNameExpanded,
  disableSharedLayout = false,
  expandedHeaderActions,
  style,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
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

  React.useEffect(() => {
    if (!active) {
      return;
    }

    scrollAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [active]);

  const expandedOverlay = (
    <>
      <AnimatePresence initial={false}>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] h-full w-full bg-black/55 backdrop-blur-md"
            onClick={() => setActive(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {active ? (
          <div className="pointer-events-none fixed inset-0 z-[201] grid place-items-center p-4 sm:p-6 lg:p-10">
            <motion.div
              layoutId={disableSharedLayout ? undefined : `card-${title}-${id}`}
              initial={disableSharedLayout ? { opacity: 0, y: 80 } : undefined}
              animate={disableSharedLayout ? { opacity: 1, y: 0 } : undefined}
              exit={disableSharedLayout ? { opacity: 0, y: 80 } : undefined}
              transition={cardTransition}
              ref={cardRef}
              className={cn(
                "tools-modal-sequel pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#010101] font-sequel shadow-[0_28px_90px_rgba(0,0,0,0.55)] sm:h-full sm:max-h-[min(92dvh,960px)] sm:max-w-[920px] sm:rounded-[2rem]",
                "max-h-[88dvh]",
                classNameExpanded,
              )}
              style={sequelStyle}
              {...props}
            >
              <div className="sticky top-0 z-30 flex items-center justify-end gap-2 border-b border-white/10 bg-[#010101]/95 px-4 pb-3 pt-4 backdrop-blur sm:px-6 sm:pt-5 sm:pb-3">
                {expandedHeaderActions ? (
                  <div className="mr-auto flex min-w-0 items-center gap-1.5 overflow-hidden">
                    {expandedHeaderActions}
                  </div>
                ) : null}
                <button
                  type="button"
                  aria-label="Cerrar tarjeta"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/75 transition-colors duration-300 hover:bg-white/20 hover:text-white focus:outline-none sm:h-11 sm:w-11"
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

              {!hideExpandedMedia ? (
                <div className="relative before:absolute before:inset-x-0 before:bottom-[-1px] before:z-10 before:h-24 before:bg-gradient-to-t before:from-[#010101] before:to-transparent">
                  {media ?? (
                    <img
                      src={src}
                      alt={title}
                      className="h-56 w-full object-cover object-center sm:h-96"
                    />
                  )}
                </div>
              ) : null}

              <div
                ref={scrollAreaRef}
                className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
              >
                <div className="relative flex min-h-full flex-col">
                  <div className="flex items-center gap-6 px-5 pb-4 pt-3 sm:px-8 sm:pb-6 sm:pt-4">
                    <div className="min-w-0 flex-1">
                      {description ? (
                        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#cafe5b]/75">
                          {description}
                        </p>
                      ) : null}
                      <h3
                        id={`card-title-${id}`}
                        className={cn(
                          "font-semibold tracking-[-0.04em] text-white",
                          description ? "mt-2 text-2xl sm:text-3xl" : "text-2xl sm:text-4xl md:text-5xl",
                        )}
                      >
                        {title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-8 sm:pb-10">
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
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {typeof document !== "undefined" ? createPortal(expandedOverlay, document.body) : null}

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
          "tools-modal-sequel group flex w-full cursor-pointer flex-col overflow-hidden rounded-[1.6rem] border border-[#e7e7eb] bg-[#f8f8f9] p-2.5 font-sequel shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-500 md:hover:-translate-y-1",
          className,
        )}
        style={sequelStyle}
      >
        <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-2.5">
          <div className="min-h-0">
            {media ?? (
              <img
                src={src}
                alt={title}
                className="h-full w-full rounded-[1.25rem] object-cover object-center"
              />
            )}
          </div>

          <div className="flex min-h-[3.45rem] items-end justify-between gap-2 px-1 pb-2.5 sm:min-h-[3.8rem] sm:pb-2">
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
                  description ? "mt-1 text-[0.94rem] leading-[1.02] sm:text-[1.05rem] md:text-[1.16rem]" : "text-[0.94rem] leading-[1.02] sm:text-[1.05rem] md:text-[1.16rem]",
                )}
              >
                {title}
              </h3>
            </div>

            <button
              type="button"
              aria-label="Abrir tarjeta"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e0e2e8] bg-[#f8f8f9] text-[#333641] transition-colors duration-300 group-hover:border-[#caced8] group-hover:bg-white focus:outline-none sm:h-8 sm:w-8"
            >
              <motion.div
                animate={{ rotate: active ? 45 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.8} />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
