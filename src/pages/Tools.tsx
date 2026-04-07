import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { type ToolItem, useToolsQuery } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { showBubbleToast } from "@/lib/showBubbleToast";
import { cn } from "@/lib/utils";

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const toolCategorySections = [
  {
    id: "marketing",
    title: "Marketing",
    preferredTools: ["Gemini", "Claude", "GPT", "Node.LLM", "NotebookLM", "ChatGPT"],
    keywords: ["marketing", "ads", "campaign", "social", "ventas"],
  },
  {
    id: "automatizaciones",
    title: "Automatizaciones",
    preferredTools: ["Zapier", "Make", "n8n", "IFTTT"],
    keywords: ["automat", "workflow", "integrat", "agent", "orchestr"],
  },
  {
    id: "diseno",
    title: "Diseño",
    preferredTools: ["Canva", "Midjourney", "Runway", "Adobe"],
    keywords: ["design", "diseno", "creative", "image", "visual"],
  },
  {
    id: "modelos",
    title: "Modelos de lenguaje",
    preferredTools: ["ChatGPT", "Claude", "Gemini", "Perplexity"],
    keywords: ["llm", "modelo", "language", "chatbot", "assistant"],
  },
  {
    id: "ventas",
    title: "Ventas",
    preferredTools: ["HubSpot", "Apollo", "Pipedrive", "Clay"],
    keywords: ["ventas", "crm", "lead", "sales", "prospect"],
  },
  {
    id: "contenido",
    title: "Creación de contenido",
    preferredTools: ["Canva", "Sora", "Runway", "Luma"],
    keywords: ["contenido", "video", "copy", "image", "creator"],
  },
] as const;

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const { status } = useAuth();
  const {
    data: officialTools = [],
    error,
    isLoading,
  } = useToolsQuery({ isBeta: false });

  const sectionedTools = useMemo(() => {
    const normalizedTools = officialTools.map((tool) => ({
      tool,
      name: normalizeText(tool.name),
      haystack: normalizeText(`${tool.name} ${tool.category} ${tool.kind} ${tool.description ?? ""}`),
    }));

    return toolCategorySections.map((section) => {
      const pickedTools: ToolItem[] = [];

      const addTool = (candidate?: ToolItem) => {
        if (!candidate) {
          return;
        }

        if (pickedTools.some((pickedTool) => pickedTool.id === candidate.id)) {
          return;
        }

        pickedTools.push(candidate);
      };

      section.preferredTools.forEach((preferredName) => {
        const normalizedPreferred = normalizeText(preferredName);
        const preferredMatch = normalizedTools.find(
          ({ name, haystack }) =>
            name.includes(normalizedPreferred) ||
            normalizedPreferred.includes(name) ||
            haystack.includes(normalizedPreferred),
        );
        addTool(preferredMatch?.tool);
      });

      normalizedTools.forEach(({ tool, haystack }) => {
        if (pickedTools.length >= 3) {
          return;
        }

        const hasSectionKeyword = section.keywords.some((keyword) =>
          haystack.includes(normalizeText(keyword)),
        );

        if (hasSectionKeyword) {
          addTool(tool);
        }
      });

      normalizedTools.forEach(({ tool }) => {
        if (pickedTools.length >= 3) {
          return;
        }
        addTool(tool);
      });

      return {
        ...section,
        tools: pickedTools.slice(0, 3),
      };
    });
  }, [officialTools]);

  const sectionToolIds = useMemo(
    () =>
      Array.from(
        new Set(sectionedTools.flatMap((section) => section.tools.map((tool) => tool.name))),
      ),
    [sectionedTools],
  );

  const {
    isFavorited,
    isFavoritePending,
    isSaved,
    isSavePending,
    toggleFavorite,
    toggleSave,
  } = useToolInteractions(sectionToolIds);
  const isAuthenticated = status === "authenticated";

  const handleQuickSave = async (toolId: string) => {
    const wasSaved = isSaved(toolId);

    if (!isAuthenticated) {
      showBubbleToast({
        title: "Inicia sesión para guardar",
        description: "Guarda herramientas directo en tu perfil.",
        tone: "neutral",
      });
      return;
    }

    try {
      await toggleSave(toolId);
      showBubbleToast({
        title: wasSaved ? "Quitado de tu perfil" : "Listo, guardado en tu perfil",
        description:
          wasSaved ?
            "La herramienta se quitó de tu biblioteca."
          : "La herramienta ya quedó en tu perfil.",
        tone: wasSaved ? "danger" : "success",
      });
    } catch (error) {
      console.error("Error saving tool from quick ranking:", error);
      showBubbleToast({
        title: "No se pudo guardar ahora",
        description: "Prueba nuevamente en unos segundos.",
        tone: "danger",
      });
    }
  };

  const handleQuickFavorite = async (toolId: string) => {
    const wasFavorite = isFavorited(toolId);

    if (!isAuthenticated) {
      showBubbleToast({
        title: "Inicia sesión para destacar",
        description: "Marca herramientas con estrella para potenciar el ranking.",
        tone: "neutral",
      });
      return;
    }

    try {
      await toggleFavorite(toolId);
      showBubbleToast({
        title: wasFavorite ? "Estrella quitada" : "Marcada con estrella",
        description:
          wasFavorite ?
            "La herramienta ya no cuenta como destacada."
          : "La herramienta suma señal para el ranking total.",
        tone: wasFavorite ? "danger" : "success",
        durationMs: 4200,
      });
    } catch (error) {
      console.error("Error starring tool from top tools:", error);
      showBubbleToast({
        title: "No se pudo actualizar la estrella",
        description: "Prueba nuevamente en unos segundos.",
        tone: "danger",
      });
    }
  };

  return (
    <div className="min-h-full bg-background px-4 pb-28 pt-8 md:px-8 md:pb-16 md:pt-10">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_14%_4%,rgba(184,219,77,0.28),transparent_34%),radial-gradient(circle_at_84%_94%,rgba(145,198,171,0.2),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(243,240,234,0.96)_100%)] dark:bg-[radial-gradient(circle_at_14%_4%,rgba(204,255,0,0.16),transparent_34%),radial-gradient(circle_at_84%_94%,rgba(129,255,190,0.11),transparent_38%),linear-gradient(180deg,rgba(8,15,11,0.95)_0%,rgba(6,11,8,1)_100%)]" />

        <header className="flex flex-col items-center gap-5 py-2 text-center md:py-4">
          <h1 className="text-balance text-3xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
            Top herramientas de IA
          </h1>
        </header>

        {isLoading ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[30px] border border-black/12 bg-white/55 p-4 text-foreground shadow-[0_18px_36px_-26px_rgba(0,0,0,0.72)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_28%,rgba(255,255,255,0.08)_56%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.58),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(177,215,66,0.18),transparent_44%)] dark:bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.18),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(204,255,0,0.09),transparent_44%)]" />
                  <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />

                  <div className="relative z-10">
                    <div className="mb-3 space-y-1">
                      <Skeleton className="h-3 w-16 rounded bg-black/10 dark:bg-white/12" />
                      <Skeleton className="h-6 w-36 rounded bg-black/10 dark:bg-white/12" />
                    </div>

                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((__, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex items-center gap-2 rounded-[14px] border border-black/10 bg-white/45 px-2.5 py-2 dark:border-white/12 dark:bg-white/[0.05]"
                        >
                          <Skeleton className="h-4 w-6 rounded bg-black/10 dark:bg-white/12" />
                          <Skeleton className="h-9 w-9 rounded-lg bg-black/10 dark:bg-white/12" />
                          <Skeleton className="h-4 flex-1 rounded bg-black/10 dark:bg-white/12" />
                          <Skeleton className="h-6 w-11 rounded-full bg-black/10 dark:bg-white/12" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : error ? (
          <section className="rounded-[28px] border border-border/40 bg-muted/10 px-5 py-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No pudimos cargar el ranking oficial de herramientas.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              {sectionedTools.map((section) => (
                <article
                  key={section.id}
                  className="relative overflow-hidden rounded-[30px] border border-black/12 bg-white/55 p-4 text-foreground shadow-[0_18px_36px_-26px_rgba(0,0,0,0.72)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_28%,rgba(255,255,255,0.08)_56%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.58),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(177,215,66,0.18),transparent_44%)] dark:bg-[radial-gradient(circle_at_24%_-12%,rgba(255,255,255,0.18),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(204,255,0,0.09),transparent_44%)]" />
                  <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />

                  <div className="relative z-10">
                    <div className="mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#CCFF00]">
                        Top 3
                      </p>
                      <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">{section.title}</h2>
                    </div>

                    <div className="space-y-2">
                      {section.tools.map((tool, index) => (
                        <article
                          key={`${section.id}-${tool.id}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedTool(tool)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedTool(tool);
                            }
                          }}
                          className="flex items-center gap-2 rounded-[14px] border border-black/10 bg-white/45 px-2.5 py-2 text-foreground transition-colors hover:bg-white/70 dark:border-white/12 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
                        >
                          <span
                            className={cn(
                              "inline-flex h-5 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-bold tracking-[0.08em]",
                              "bg-black/7 text-foreground/70 dark:bg-white/10 dark:text-white/75",
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <ToolLogo
                            name={tool.name}
                            domain={tool.domain}
                            className="h-9 w-9 border-none bg-transparent"
                            imageClassName="p-0.5"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{tool.name}</p>
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleQuickFavorite(tool.name);
                            }}
                            disabled={isFavoritePending(tool.name)}
                            aria-pressed={isFavorited(tool.name)}
                            aria-label={isFavorited(tool.name) ? "Quitar estrella" : "Marcar con estrella"}
                            className={cn(
                              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              isFavorited(tool.name) ?
                                "border-amber-400/55 bg-amber-300/30 text-amber-600 dark:border-amber-300/45 dark:bg-amber-300/20 dark:text-amber-200"
                              : "border-black/20 bg-black/10 text-foreground/65 hover:bg-black/15 dark:border-white/20 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15",
                              isFavoritePending(tool.name) && "cursor-not-allowed opacity-60",
                            )}
                          >
                            <Star className={cn("h-3.5 w-3.5", isFavorited(tool.name) && "fill-current")} />
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleQuickSave(tool.name);
                            }}
                            disabled={isSavePending(tool.name)}
                            aria-pressed={isSaved(tool.name)}
                            aria-label={isSaved(tool.name) ? "Quitar de guardados" : "Guardar en tu perfil"}
                            className={cn(
                              "relative inline-flex h-6 w-[44px] shrink-0 items-center rounded-full border p-0 transition-all",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              isSaved(tool.name) ?
                                "border-[#CCFF00]/70 bg-[#CCFF00]/30"
                              : "border-black/20 bg-black/10 dark:border-white/20 dark:bg-white/10",
                              isSavePending(tool.name) && "cursor-not-allowed opacity-60",
                            )}
                          >
                          <span
                            className={cn(
                              "h-[18px] w-[18px] rounded-full bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.65)] transition-transform duration-300",
                              isSaved(tool.name) ? "translate-x-[20px]" : "translate-x-[1px]",
                            )}
                          />
                        </button>
                        </article>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        <div className="flex justify-center pt-2">
          <Button asChild className="rounded-full px-6">
            <Link to={routes.appToolsRanking}>
              Ver ranking total
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};

export default Tools;
