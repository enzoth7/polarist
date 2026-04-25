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
  { fill: "#1A1A1A", ink: "#F6F6F6" },
  { fill: "#0A0A0A", ink: "#F6F6F6" },
  { fill: "#141414", ink: "#F6F6F6" },
  { fill: "#111111", ink: "#F6F6F6" },
  { fill: "#121212", ink: "#F6F6F6" },
  { fill: "#161616", ink: "#F6F6F6" },
] as const;

const folderTexture = (isDark: boolean) =>
  `repeating-linear-gradient(
    180deg,
    ${isDark ? "rgba(255,255,255,0.018)" : "rgba(1,1,1,0.02)"} 0px,
    ${isDark ? "rgba(255,255,255,0.018)" : "rgba(1,1,1,0.02)"} 1px,
    ${isDark ? "rgba(0,0,0,0.012)" : "rgba(255,255,255,0.012)"} 1px,
    ${isDark ? "rgba(0,0,0,0.012)" : "rgba(255,255,255,0.012)"} 2px
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
    <div className="min-h-fit bg-[#010101] px-4 pb-4 pt-6 md:px-8 md:pb-6 md:pt-8">
      <div className="mx-auto w-full max-w-[95vw] 2xl:max-w-[1400px]">
        <div className="mb-6 flex flex-col items-center justify-center px-2 md:mb-8">
          <h1 className="text-center text-4xl font-black tracking-tight text-[#F6F6F6] sm:text-5xl lg:text-7xl" style={{ letterSpacing: "-0.04em", fontFamily: "var(--font-sequel, sans-serif)" }}>
            Recursos
          </h1>
        </div>

        <div
          className="relative flex flex-col gap-3 pt-2 md:h-[520px] md:flex-row md:pt-4"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {coverCards.map((card, index) => {
            const isExpanded = index === expandedIndex;
            const baseTone = folderTones[index % folderTones.length];
            const tone = isExpanded ? { fill: "#FFFFFF", ink: "#010101" } : baseTone;
            const isDarkTone = tone.ink === "#F6F6F6";
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
            const mutedInk = isDarkTone ? "rgba(246,246,246,0.78)" : "rgba(1,1,1,0.74)";
            const fadedInk = isDarkTone ? "rgba(246,246,246,0.58)" : "rgba(1,1,1,0.58)";
            const ctaBackground = isDarkTone ? "rgba(246,246,246,0.03)" : "rgba(1,1,1,0.045)";
            const ctaBorder = isDarkTone ? "rgba(246,246,246,0.14)" : "rgba(1,1,1,0.14)";

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
                        "drop-shadow(0 24px 44px rgba(0,0,0,0.42)) drop-shadow(0 10px 20px rgba(0,0,0,0.22))"
                      : "drop-shadow(0 14px 28px rgba(0,0,0,0.28)) drop-shadow(0 6px 12px rgba(0,0,0,0.14))",
                  }}
                >
                  <div
                    className="absolute shadow-[inset_0_1px_0_rgba(255,255,255,0.018),inset_0_-1px_0_rgba(0,0,0,0.32)]"
                    style={{
                      ...tabShapeStyle,
                      ...paperSurfaceStyle,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.016),inset_0_-1px_0_rgba(0,0,0,0.34)]"
                    style={{
                      top: bodyTop,
                      ...paperSurfaceStyle,
                      borderRadius: 16,
                    }}
                  />
                </div>

                <div className="relative z-40 flex h-full min-h-[170px] flex-col overflow-hidden p-5 pt-[4.2rem] md:min-h-0 md:p-6 md:pt-[4.5rem]">
                  <h2
                    className={cn(
                      "pointer-events-none absolute bottom-6 left-8 hidden max-h-[80%] overflow-hidden whitespace-nowrap text-[0.85rem] font-bold uppercase tracking-[0.25em] [text-orientation:mixed] [writing-mode:vertical-rl] md:block",
                      isExpanded ? "opacity-0" : "opacity-100",
                    )}
                    style={{
                      transition: isExpanded ? "opacity 0.05s ease" : "opacity 0.5s ease 0.4s",
                      color: mutedInk,
                      fontFamily: "var(--font-sequel, sans-serif)"
                    }}
                  >
                    {card.title}
                  </h2>

                  <h2
                    className={cn(
                      "mt-3 text-balance text-[1.02rem] font-semibold leading-tight transition-[max-height,opacity] duration-300 md:hidden",
                      isExpanded ? "max-h-0 opacity-0" : "max-h-20 opacity-100",
                    )}
                    style={{ color: tone.ink, fontFamily: "var(--font-serif)", fontWeight: 700 }}
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
                    <h3
                      className="text-balance text-[1.12rem] leading-[1.14] md:text-[1.5rem]"
                      style={{ color: tone.ink, fontFamily: "var(--font-serif)", fontWeight: 700 }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-3 max-w-[38ch] text-pretty text-[0.92rem] leading-relaxed md:text-[1rem]"
                      style={{ color: fadedInk, fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      {card.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenedFolderId(card.id);
                      }}
                      className="mt-6 inline-flex items-center justify-center rounded-full border px-8 py-3 text-[11px] font-bold uppercase tracking-[0.25em] transition-all hover:scale-105 active:scale-95 shadow-sm"
                      style={{
                        borderColor: ctaBorder,
                        backgroundColor: ctaBackground,
                        color: mutedInk,
                        fontFamily: "var(--font-sequel, sans-serif)"
                      }}
                    >
                      COMENZAR
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
