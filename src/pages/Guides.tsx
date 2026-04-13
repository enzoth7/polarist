import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { conceptosBasicos } from "@/components/education/ConceptosBasicos";
import { FolderDetailView } from "@/components/guides/FolderDetailView";
import { guideFoldersCatalog, type GuideFolderCard } from "@/data/guideFoldersCatalog";
import { cn } from "@/lib/utils";

const slatTransition = [
  "flex-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
].join(", ");

const folderTones = [
  { fill: "#D8CCB5", ink: "#413F3E" },
  { fill: "#C4C4C2", ink: "#413F3E" },
  { fill: "#8C7F72", ink: "#F4EFE6" },
  { fill: "#6A5E54", ink: "#F4EFE6" },
  { fill: "#8C7F72", ink: "#F3EEE6" },
  { fill: "#413F3E", ink: "#F2ECE3" },
] as const;

const folderTexture = (isDark: boolean) =>
  `repeating-linear-gradient(
    180deg,
    ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.14)"} 0px,
    ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.14)"} 1px,
    ${isDark ? "rgba(0,0,0,0.045)" : "rgba(0,0,0,0.03)"} 1px,
    ${isDark ? "rgba(0,0,0,0.045)" : "rgba(0,0,0,0.03)"} 2px
  )`;

const Guides = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);

  const coverCards = useMemo<GuideFolderCard[]>(
    () =>
      guideFoldersCatalog.map((card) =>
        card.id === "recursos" ?
          { ...card, description: card.description.replace("{count}", String(conceptosBasicos.length)) }
        : card,
      ),
    [],
  );

  const expandedIndex = hoveredIndex ?? activeIndex;

  if (openedFolderId) {
    return (
      <FolderDetailView
        folderId={openedFolderId}
        onClose={() => setOpenedFolderId(null)}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#F0F2F6] px-4 pb-24 pt-8 md:px-8 md:pb-16 md:pt-10">
      <div className="mx-auto w-full max-w-[95vw] 2xl:max-w-[1400px]">
        <div className="mb-10 flex flex-col items-center justify-center px-2 md:mb-14">
          <h1 className="text-center text-4xl font-black tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-7xl" style={{ letterSpacing: "-0.03em" }}>
            Recursos
          </h1>
        </div>

        <div
          className="relative flex flex-col gap-3 pt-2 md:h-[520px] md:flex-row md:pt-4"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {coverCards.map((card, index) => {
            const isExpanded = index === expandedIndex;
            const tone = folderTones[index % folderTones.length];
            const isDarkTone = tone.ink !== "#413F3E";
            const tabPositionStyle = { left: "8%" };
            const tabClipPath = "polygon(0 0, 75% 0, 85% 26%, 100% 26%, 100% 100%, 0 100%)";
            const tabShapeStyle = {
              ...tabPositionStyle,
              top: 0,
              width: "min(70%,140px)",
              height: 44,
              clipPath: tabClipPath,
            };
            const bodyTop = 28;
            const paperSurfaceStyle = {
              backgroundColor: tone.fill,
              backgroundImage: folderTexture(isDarkTone),
            };
            const mutedInk = isDarkTone ? "rgba(244,239,230,0.74)" : "rgba(65,63,62,0.74)";
            const fadedInk = isDarkTone ? "rgba(244,239,230,0.55)" : "rgba(65,63,62,0.56)";
            const ctaBackground = isDarkTone ? "rgba(244,239,230,0.16)" : "rgba(65,63,62,0.1)";
            const ctaBorder = isDarkTone ? "rgba(244,239,230,0.34)" : "rgba(65,63,62,0.24)";

            return (
              <article
                id={`guide-${card.id}`}
                key={card.id}
                tabIndex={0}
                aria-expanded={isExpanded}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setActiveIndex(index)}
                style={{ flexGrow: isExpanded ? 10 : 1, transition: slatTransition }}
                className={cn(
                  "group relative min-h-[170px] min-w-0 overflow-visible border border-transparent p-0",
                  "md:basis-0 md:cursor-pointer",
                  isExpanded ? "z-20 -translate-y-0.5" : "z-10",
                )}
                aria-label={`Carpeta ${card.title}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    filter: isExpanded ?
                        "drop-shadow(0 32px 48px rgba(0,0,0,0.15)) drop-shadow(0 12px 24px rgba(0,0,0,0.08))"
                      : "drop-shadow(0 16px 36px rgba(0,0,0,0.07)) drop-shadow(0 8px 16px rgba(0,0,0,0.04))",
                  }}
                >
                  <div
                    className="absolute shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.5),inset_-1px_-1px_3px_rgba(0,0,0,0.08)]"
                    style={{
                      ...tabShapeStyle,
                      ...paperSurfaceStyle,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.5),inset_-1.5px_-2.5px_4px_rgba(0,0,0,0.1)]"
                    style={{
                      top: bodyTop,
                      ...paperSurfaceStyle,
                      borderRadius: 16,
                    }}
                  />
                </div>

                <div className="relative z-40 flex h-full min-h-[170px] flex-col overflow-hidden p-5 pt-[4.9rem] md:min-h-0 md:p-6 md:pt-[5.25rem]">
                  <span
                    className={cn(
                      "absolute left-5 top-[38px] md:left-6 md:top-[42px] text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                      isExpanded ? "opacity-100 delay-150 duration-300" : "opacity-0 duration-[50ms]"
                    )}
                    style={{ color: mutedInk }}
                  >
                    {card.eyebrow}
                  </span>
                  <h2
                    className={cn(
                      "pointer-events-none absolute bottom-6 left-8 hidden max-h-[80%] overflow-hidden whitespace-nowrap text-[0.82rem] font-semibold uppercase tracking-[0.22em] [text-orientation:mixed] [writing-mode:vertical-rl] md:block",
                      isExpanded ? "opacity-0" : "opacity-100",
                    )}
                    style={{
                      transition: isExpanded ? "opacity 0.05s ease" : "opacity 0.5s ease 0.4s",
                      color: mutedInk,
                    }}
                  >
                    {card.title}
                  </h2>

                  <h2
                    className={cn(
                      "mt-3 text-balance text-[1.02rem] font-semibold leading-tight transition-[max-height,opacity] duration-300 md:hidden",
                      isExpanded ? "max-h-0 opacity-0" : "max-h-20 opacity-100",
                    )}
                    style={{ color: tone.ink }}
                  >
                    {card.title}
                  </h2>

                  <div
                    className={cn(
                      "mt-auto min-w-[280px] w-full max-w-[36ch] shrink-0 text-left transition-all",
                      isExpanded ? "translate-y-0 opacity-100 delay-[150ms] duration-500" : "pointer-events-none translate-y-6 opacity-0 delay-0 duration-[50ms]",
                    )}
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    <h3 className="text-balance text-[1.12rem] font-semibold leading-[1.14] md:text-[1.5rem]" style={{ color: tone.ink }}>
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-[38ch] text-pretty text-[0.84rem] leading-relaxed md:text-[0.93rem]" style={{ color: fadedInk }}>
                      {card.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenedFolderId(card.id);
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-[11.5px] font-bold uppercase tracking-[0.20em] transition-all hover:scale-105 active:scale-95 shadow-sm"
                      style={{
                        borderColor: ctaBorder,
                        backgroundColor: ctaBackground,
                        color: mutedInk,
                      }}
                    >
                      Comenzar
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Guides;
