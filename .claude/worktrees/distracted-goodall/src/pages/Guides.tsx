import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Clock3,
  LibraryBig,
  Megaphone,
  PenTool,
  Workflow,
} from "lucide-react";

import { conceptosBasicos } from "@/components/education/ConceptosBasicos";
import { guideFoldersCatalog, type GuideFolderCard, type GuideFolderKind } from "@/data/guideFoldersCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { showBubbleToast } from "@/lib/showBubbleToast";
import { cn } from "@/lib/utils";

const iconToneByKind: Record<GuideFolderKind, string> = {
  stats: "text-[#ccff00]",
  marketing: "text-[#c9ffd8]",
  prompts: "text-[#ccff00]",
  timeline: "text-[#d9ffa5]",
  design: "text-[#c7ffe5]",
  automation: "text-[#d2e9ff]",
};

const iconByKind: Record<GuideFolderKind, LucideIcon> = {
  stats: LibraryBig,
  marketing: Megaphone,
  prompts: Bot,
  timeline: Clock3,
  design: PenTool,
  automation: Workflow,
};

const Guides = () => {
  const { status, user } = useAuth();
  const { isSaved, toggleSavedFolder } = useSavedGuideFolders(user?.id);
  const coverCards: GuideFolderCard[] = guideFoldersCatalog.map((card) =>
    card.id === "recursos" ?
      { ...card, description: card.description.replace("{count}", String(conceptosBasicos.length)) }
    : card,
  );

  const handleFolderSave = (card: GuideFolderCard) => {
    if (status !== "authenticated") {
      showBubbleToast({
        title: "Inicia sesión para guardar recursos",
        description: "Guardá carpetas para verlas después en tu perfil.",
        tone: "neutral",
      });
      return;
    }

    const shouldBeSaved = toggleSavedFolder(card.id);
    showBubbleToast({
      title: shouldBeSaved ? "Carpeta guardada" : "Carpeta quitada",
      description: shouldBeSaved ? "La guardamos en tu perfil, dentro de Recursos." : "La sacamos de tu perfil.",
      tone: shouldBeSaved ? "success" : "danger",
      durationMs: 3200,
    });
  };

  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-8 md:px-8 md:pb-16 md:pt-10">
      <div className="relative mx-auto w-full max-w-[1240px]">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_14%_4%,rgba(184,219,77,0.18),transparent_36%),radial-gradient(circle_at_84%_94%,rgba(145,198,171,0.14),transparent_40%),linear-gradient(180deg,rgba(6,11,8,0.95)_0%,rgba(4,7,5,1)_100%)]" />

        {/* Desktop — Horizontal Expanding Slat Accordion */}
        <section
          className="hidden h-[560px] gap-2.5 md:flex"
          aria-label="Catálogo de recursos"
        >
          {coverCards.map((card) => {
            const CardIcon = iconByKind[card.kind];
            const iconTone = iconToneByKind[card.kind];
            const saved = isSaved(card.id);

            return (
              <article
                key={card.id}
                className={cn(
                  "group relative min-w-[76px] flex-1 cursor-pointer overflow-hidden rounded-[24px]",
                  "border border-white/10 bg-neutral-950",
                  "transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "hover:flex-[4] hover:border-white/20 focus-within:flex-[4]",
                )}
                tabIndex={0}
              >
                {/* Glass / gradient layers */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_35%,transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.08),transparent_46%),radial-gradient(circle_at_82%_100%,rgba(204,255,0,0.09),transparent_50%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/15" />

                {/* Save toggle — appears on expansion */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFolderSave(card);
                  }}
                  aria-pressed={saved}
                  aria-label={saved ? `Quitar ${card.eyebrow} de guardados` : `Guardar ${card.eyebrow}`}
                  className={cn(
                    "absolute right-4 top-4 z-20 inline-flex h-6 w-[44px] items-center rounded-full border p-0",
                    "opacity-0 transition-all duration-300 delay-150 group-hover:opacity-100 focus-within:opacity-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    saved
                      ? "border-[#CCFF00]/70 bg-[#CCFF00]/30"
                      : "border-white/20 bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "h-[18px] w-[18px] rounded-full bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.65)] transition-transform duration-300",
                      saved ? "translate-x-[20px]" : "translate-x-[1px]",
                    )}
                  />
                </button>

                {/* Icon — top-center of slat */}
                <div
                  className={cn(
                    "absolute left-1/2 top-8 -translate-x-1/2",
                    "transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover:left-8 group-hover:translate-x-0",
                    iconTone,
                  )}
                >
                  <CardIcon className="h-9 w-9 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]" />
                </div>

                {/* Vertical title — visible when collapsed, fades on expand */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-10 flex justify-center",
                    "transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover:opacity-0",
                  )}
                >
                  <span
                    className="block whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.32em] text-white [writing-mode:vertical-rl] rotate-180"
                  >
                    {card.eyebrow}
                  </span>
                </div>

                {/* Horizontal expanded content — fades + slides up */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-8 bottom-8 max-w-[440px]",
                    "translate-y-4 opacity-0",
                    "transition-all duration-500 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100",
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ccff00]">
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-2 text-[1.35rem] font-bold leading-[1.18] text-white">
                    {card.title}
                  </h2>
                  <p className="mt-3 max-w-[42ch] text-[0.83rem] leading-[1.55] text-white/70">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    className={cn(
                      "mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2",
                      "text-[10px] font-bold uppercase tracking-[0.14em] text-white/90",
                      "transition-all duration-300 hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-[#0f1402] hover:shadow-[0_0_30px_-4px_rgba(204,255,0,0.55)]",
                    )}
                  >
                    Preview →
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Mobile fallback — vertical stack of dark glass cards */}
        <section className="grid grid-cols-1 gap-3 md:hidden" aria-label="Catálogo de recursos">
          {coverCards.map((card) => {
            const CardIcon = iconByKind[card.kind];
            const iconTone = iconToneByKind[card.kind];
            const saved = isSaved(card.id);

            return (
              <article
                key={card.id}
                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-neutral-950 p-6"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_35%,transparent_70%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/15" />

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFolderSave(card);
                  }}
                  aria-pressed={saved}
                  aria-label={saved ? `Quitar ${card.eyebrow} de guardados` : `Guardar ${card.eyebrow}`}
                  className={cn(
                    "absolute right-4 top-4 z-20 inline-flex h-6 w-[44px] items-center rounded-full border p-0 transition-all",
                    saved
                      ? "border-[#CCFF00]/70 bg-[#CCFF00]/30"
                      : "border-white/20 bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "h-[18px] w-[18px] rounded-full bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.65)] transition-transform duration-300",
                      saved ? "translate-x-[20px]" : "translate-x-[1px]",
                    )}
                  />
                </button>

                <div className="relative z-10 flex items-start gap-4">
                  <div className={cn("shrink-0", iconTone)}>
                    <CardIcon className="h-9 w-9 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]" />
                  </div>
                  <div className="min-w-0 pr-12">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ccff00]">
                      {card.eyebrow}
                    </p>
                    <h2 className="mt-1.5 text-[1.1rem] font-bold leading-snug text-white">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-[0.82rem] leading-[1.55] text-white/70">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Guides;
