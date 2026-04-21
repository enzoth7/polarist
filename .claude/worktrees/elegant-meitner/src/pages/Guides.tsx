import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Clock3,
  LibraryBig,
  Megaphone,
  PenTool,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

import { conceptosBasicos } from "@/components/education/ConceptosBasicos";
import { guideFoldersCatalog, type GuideFolderCard, type GuideFolderKind } from "@/data/guideFoldersCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { showBubbleToast } from "@/lib/showBubbleToast";
import { cn } from "@/lib/utils";

const coverCardMotion = {
  rest: { y: 0, boxShadow: "0 18px 36px -26px rgba(0,0,0,0.72)" },
  hover: { y: -6, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" },
};

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

const renderCoverVisual = (kind: GuideFolderKind, Icon: LucideIcon) => {
  const iconTone = iconToneByKind[kind];

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.05, rotate: -2 } }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={iconTone}
      >
        <Icon className="h-14 w-14 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]" />
      </motion.div>
    </div>
  );
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
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_14%_4%,rgba(184,219,77,0.28),transparent_34%),radial-gradient(circle_at_84%_94%,rgba(145,198,171,0.2),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(243,240,234,0.96)_100%)] dark:bg-[radial-gradient(circle_at_14%_4%,rgba(204,255,0,0.16),transparent_34%),radial-gradient(circle_at_84%_94%,rgba(129,255,190,0.11),transparent_38%),linear-gradient(180deg,rgba(8,15,11,0.95)_0%,rgba(6,11,8,1)_100%)]" />
        <section className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
          {coverCards.map((card) => {
            const CardIcon = iconByKind[card.kind];
            const saved = isSaved(card.id);

            return (
              <motion.article
                key={card.id}
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={coverCardMotion}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="relative h-[320px] overflow-hidden rounded-[30px] border border-black/12 bg-white/55 p-7 text-foreground backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white md:h-[340px] md:p-8"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_28%,rgba(255,255,255,0.08)_56%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.58),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(177,215,66,0.18),transparent_44%)] dark:bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.18),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(204,255,0,0.09),transparent_44%)]" />
                <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/12 dark:bg-white/30" />

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
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    saved ?
                      "border-[#CCFF00]/70 bg-[#CCFF00]/30"
                    : "border-black/20 bg-black/10 dark:border-white/20 dark:bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "h-[18px] w-[18px] rounded-full bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.65)] transition-transform duration-300",
                      saved ? "translate-x-[20px]" : "translate-x-[1px]",
                    )}
                  />
                </button>

                <div className="relative z-10 flex h-full flex-col gap-4">
                  <motion.div
                    variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="mx-auto h-[88px] w-full max-w-[245px]"
                  >
                    {renderCoverVisual(card.kind, CardIcon)}
                  </motion.div>

                  <div className="mx-auto w-full max-w-[270px] space-y-2 px-1 text-center">
                    <p className="inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ccff00]">
                      {card.eyebrow}
                    </p>
                    <h2 className="mx-auto max-w-[22ch] text-[1.17rem] font-bold leading-[1.18] md:text-[1.28rem]">
                      {card.title}
                    </h2>
                    <p className="mx-auto max-w-[33ch] text-[0.81rem] leading-[1.5] text-foreground/72 dark:text-white/70">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-black/15 bg-black/5 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/90 dark:border-white/20 dark:bg-white/10 dark:text-white/90"
                    >
                      Leer más
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Guides;
