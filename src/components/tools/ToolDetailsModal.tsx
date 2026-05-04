import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, Heart, Plus } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { getToolHref, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

type ToolDetailsModalProps = {
  selectedTool: ToolItem | null;
  isOpen: boolean;
  onClose: () => void;
};

type ToolInteractions = ReturnType<typeof useToolInteractions>;

type DetailSection = {
  id: string;
  number: string;
  title: string;
  description: string;
};

const sequelStyle = { fontFamily: "var(--font-sequel, sans-serif)" } as const;

const normalizeText = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const buildToolDetailSections = (tool: ToolItem): DetailSection[] => {
  const sections: Omit<DetailSection, "number">[] = [];
  const baseId = normalizeText(tool.name);

  const realPurpose = tool.whatIsItReallyFor?.trim();
  if (realPurpose) {
    sections.push({
      id: `${baseId}-purpose`,
      title: "Para qué sirve realmente",
      description: realPurpose,
    });
  }

  const audience = tool.whoIsItFor?.trim();
  if (audience) {
    sections.push({
      id: `${baseId}-who`,
      title: "Para quién es",
      description: audience,
    });
  }

  const otherUses = tool.otrosUsos?.trim();
  if (otherUses) {
    sections.push({
      id: `${baseId}-uses`,
      title: "Otros usos",
      description: otherUses,
    });
  }

  if (sections.length === 0) {
    sections.push({
      id: `${baseId}-about`,
      title: "Qué es",
      description: tool.description?.trim() || "Información en redacción.",
    });
  }

  return sections.map((section, index) => ({
    ...section,
    number: String(index + 1).padStart(2, "0"),
  }));
};

function ToolHeaderActions({
  toolName,
  interactions,
}: {
  toolName: string;
  interactions: ToolInteractions;
}) {
  const navigate = useNavigate();
  const { status } = useAuth();
  const isFavorited = interactions.isFavorited(toolName);
  const isSaved = interactions.isSaved(toolName);
  const favoriteCount = interactions.getFavoriteCount(toolName);
  const isFavoritePending = interactions.isFavoritePending(toolName);
  const isSavePending = interactions.isSavePending(toolName);
  const requiresLogin = status !== "authenticated";

  const handleFavorite = async () => {
    if (requiresLogin) {
      navigate(routes.login);
      return;
    }

    try {
      await interactions.toggleFavorite(toolName);
    } catch (error) {
      if ((error as Error).message === "AUTH_REQUIRED") {
        navigate(routes.login);
      }
    }
  };

  const handleSave = async () => {
    if (requiresLogin) {
      navigate(routes.login);
      return;
    }

    try {
      await interactions.toggleSave(toolName);
    } catch (error) {
      if ((error as Error).message === "AUTH_REQUIRED") {
        navigate(routes.login);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isFavoritePending}
        aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-pressed={isFavorited}
        className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-white/75 transition-colors hover:text-white disabled:opacity-60"
        style={sequelStyle}
      >
        <motion.span
          key={isFavorited ? "fav-on" : "fav-off"}
          whileTap={{ scale: 0.82 }}
          animate={{ scale: isFavorited ? [1, 1.2, 1] : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 16 }}
          className="inline-flex"
        >
          <Heart
            strokeWidth={1.8}
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorited
                ? "fill-[#CAFE5B] text-[#CAFE5B]"
                : "fill-transparent text-white/70 group-hover:text-white",
            )}
          />
        </motion.span>
        {favoriteCount > 0 ? (
          <span className="font-medium tabular-nums text-white/80">{favoriteCount}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSavePending}
        aria-label={isSaved ? "Quitar de guardados" : "Guardar"}
        aria-pressed={isSaved}
        className="group inline-flex items-center justify-center rounded-full p-1.5 text-white/75 transition-colors hover:text-white disabled:opacity-60"
      >
        <motion.span
          key={isSaved ? "save-on" : "save-off"}
          whileTap={{ scale: 0.82 }}
          animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 16 }}
          className="inline-flex"
        >
          <Bookmark
            strokeWidth={1.8}
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved
                ? "fill-[#CAFE5B] text-[#CAFE5B]"
                : "fill-transparent text-white/70 group-hover:text-white",
            )}
          />
        </motion.span>
      </button>
    </>
  );
}

export function ToolDetailsModal({
  selectedTool,
  isOpen,
  onClose,
}: ToolDetailsModalProps) {
  if (!selectedTool) {
    return <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)} />;
  }

  const description = selectedTool.description?.trim();
  const detailSections = buildToolDetailSections(selectedTool);
  const interactions = useToolInteractions([selectedTool.name]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        overlayClassName="bg-black/55 backdrop-blur-md data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
        closeClassName="absolute right-6 top-5 z-[60] flex h-auto w-auto items-center justify-center rounded-full border-0 bg-transparent p-0 text-white/75 opacity-100 shadow-none hover:bg-transparent hover:text-white focus:ring-0 sm:right-8 sm:top-7"
        className="tools-modal-sequel overflow-visible rounded-[2rem] border border-white/10 bg-[#010101] p-0 text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)] duration-500 ease-out data-[state=open]:zoom-in-[98%] data-[state=closed]:zoom-out-[98%] data-[state=open]:slide-in-from-top-[50.5%] data-[state=closed]:slide-out-to-top-[50.5%] sm:max-w-[1320px]"
      >
        <div className="relative flex max-h-[min(92vh,960px)] flex-col overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
          <div className="relative flex h-full flex-col px-6 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-20">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h2
                  className="text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em] text-[#F6F6F6]"
                  style={sequelStyle}
                >
                  {selectedTool.name}
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-2 pr-10 sm:pr-14">
                <ToolHeaderActions toolName={selectedTool.name} interactions={interactions} />
              </div>
            </div>

            <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(340px,0.78fr)_minmax(720px,1.22fr)] lg:gap-14">
              <div className="flex h-full flex-col space-y-8 lg:self-start">
                <div className="space-y-5">
                  <p
                    className="text-[clamp(1.4rem,2.8vw,2.4rem)] font-bold leading-[1] tracking-[-0.04em] text-[#CAFE5B]"
                    style={sequelStyle}
                  >
                    {withSpanishAccents(selectedTool.category)}
                  </p>
                  {description ? (
                    <p className="max-w-[34ch] text-[1.05rem] leading-8 text-white/72" style={sequelStyle}>
                      {description}
                    </p>
                  ) : null}
                </div>

                <div className="flex justify-start pt-0">
                  <a
                    href={getToolHref(selectedTool)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-0 py-0 text-xs font-black uppercase tracking-[0.16em] text-[#F6F6F6] transition hover:opacity-80"
                    style={sequelStyle}
                  >
                    Página oficial
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="mx-auto flex w-full min-w-0 justify-center pt-0 pb-2 lg:max-w-[920px] lg:pb-4">
                <Accordion type="single" collapsible className="w-full space-y-8">
                  {detailSections.map((section) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="rounded-[1.6rem] border border-white/10 bg-[#010101] px-8 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                    >
                      <AccordionPrimitive.Header className="flex">
                        <AccordionPrimitive.Trigger
                          style={sequelStyle}
                          className="flex w-full items-center justify-between gap-5 py-6 text-left [&>div>svg>path:last-child]:origin-center [&>div>svg>path:last-child]:transition-all [&>div>svg>path:last-child]:duration-200 [&[data-state=open]>div>svg>path:last-child]:rotate-90 [&[data-state=open]>div>svg>path:last-child]:opacity-0"
                        >
                          <h3
                            className="text-[clamp(1.45rem,2.4vw,2.2rem)] font-bold leading-[0.98] tracking-[-0.05em] text-[#F6F6F6]"
                            style={sequelStyle}
                          >
                            {section.title}
                          </h3>
                          <div className="flex items-center gap-5">
                            <span
                              className="shrink-0 text-[1.6rem] font-bold tracking-[-0.05em] text-[#CAFE5B]"
                              style={sequelStyle}
                            >
                              {section.number}
                            </span>
                            <Plus
                              size={18}
                              strokeWidth={2}
                              className="shrink-0 text-[#F6F6F6]/80"
                              aria-hidden="true"
                            />
                          </div>
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionContent style={sequelStyle} className="pb-5 pt-0">
                        <p className="max-w-[52ch] text-[0.94rem] leading-[1.65] text-white/72" style={sequelStyle}>
                          {section.description}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
