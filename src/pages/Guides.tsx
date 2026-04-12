import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { conceptosBasicos } from "@/components/education/ConceptosBasicos";
import { guideFoldersCatalog, type GuideFolderCard } from "@/data/guideFoldersCatalog";
import { cn } from "@/lib/utils";

const slatTransition = [
  "flex-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
].join(", ");

const Guides = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  return (
    <div className="min-h-full bg-[#020202] px-4 pb-24 pt-8 md:px-8 md:pb-16 md:pt-10">
      <div className="relative mx-auto w-full max-w-[1240px]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black p-3 md:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_14%,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_90%_84%,rgba(255,255,255,0.06),transparent_44%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_22%,rgba(255,255,255,0)_68%)]" />

          <div className="relative z-10 mb-5 px-2 md:mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Guides</p>
            <h1 className="mt-2 text-[1.55rem] font-semibold leading-[1.08] text-white md:text-[2rem]">
              Horizontal Expanding Slat Accordion
            </h1>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-white/65 md:text-[0.95rem]">
              Hover para expandir cada slat. En móvil, tocá una tarjeta para abrir su contenido.
            </p>
          </div>

          <div
            className="relative z-10 flex flex-col gap-3 md:h-[520px] md:flex-row"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {coverCards.map((card, index) => {
              const isExpanded = index === expandedIndex;

              return (
                <article
                  id={`guide-${card.id}`}
                  key={card.id}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  style={{ flexGrow: isExpanded ? 4 : 1, transition: slatTransition }}
                  className={cn(
                    "group relative min-h-[170px] min-w-0 overflow-hidden rounded-[24px] border bg-white/[0.03] p-0 backdrop-blur-[14px]",
                    "md:basis-0 md:cursor-pointer",
                    isExpanded ? "border-white/35 bg-white/[0.09]" : "border-white/20 bg-white/[0.04]",
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_34%,rgba(255,255,255,0)_72%)]" />
                  <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-white/30" />

                  <div className="relative flex h-full min-h-[170px] flex-col p-5 md:min-h-0 md:p-6">
                    <p className="w-fit rounded-full border border-white/14 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/78">
                      {card.eyebrow}
                    </p>

                    <h2
                      className={cn(
                        "pointer-events-none absolute bottom-5 left-1/2 hidden max-h-[80%] -translate-x-1/2 overflow-hidden whitespace-nowrap text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-white/88 [text-orientation:mixed] [writing-mode:vertical-rl] md:block",
                        isExpanded ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100",
                      )}
                      style={{ transition: "opacity 0.45s ease, transform 0.45s ease" }}
                    >
                      {card.title}
                    </h2>

                    <h2
                      className={cn(
                        "mt-3 text-balance text-[1.02rem] font-semibold leading-tight text-white transition-[max-height,opacity] duration-300 md:hidden",
                        isExpanded ? "max-h-0 opacity-0" : "max-h-20 opacity-100",
                      )}
                    >
                      {card.title}
                    </h2>

                    <div
                      className={cn(
                        "mt-auto max-w-[36ch] text-left transition-all duration-500",
                        isExpanded ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-6 opacity-0 delay-0",
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <h3 className="text-balance text-[1.12rem] font-semibold leading-[1.14] text-white md:text-[1.5rem]">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-[38ch] text-pretty text-[0.84rem] leading-relaxed text-white/72 md:text-[0.93rem]">
                        {card.description}
                      </p>

                      <a
                        href={`#guide-${card.id}`}
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/60 hover:bg-white/[0.16]"
                      >
                        Preview
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guides;
