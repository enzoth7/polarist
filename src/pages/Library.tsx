import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolInteractionButtons } from "@/components/tools/ToolInteractionButtons";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toolNicheMap } from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

const Library = () => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const { status } = useAuth();
  const { toast } = useToast();
  const {
    data: allTools = [],
    error: toolsError,
    isLoading: toolsLoading,
  } = useToolsQuery();

  const allToolIds = useMemo(() => allTools.map((tool) => tool.name), [allTools]);
  const {
    getFavoriteCount,
    isFavoritePending,
    isFavorited,
    isSavePending,
    isSaved,
    loading: interactionsLoading,
    savedToolIdSet,
    toggleFavorite,
    toggleSave,
  } = useToolInteractions(allToolIds);

  const savedTools = useMemo(
    () => allTools.filter((tool) => savedToolIdSet.has(tool.name)),
    [allTools, savedToolIdSet],
  );

  const showAuthToast = () =>
    toast({
      title: "Inicia sesión para usar tu biblioteca",
      description: "Guarda herramientas desde el ranking y las vas a ver acá.",
    });

  const handleFavoriteClick = async (toolId: string) => {
    if (status !== "authenticated") {
      showAuthToast();
      return;
    }

    try {
      await toggleFavorite(toolId);
    } catch (error) {
      console.error("Error toggling tool favorite:", error);
      toast({
        title: "No pudimos actualizar el favorito",
        description: "Intenta de nuevo en unos segundos.",
      });
    }
  };

  const handleSaveClick = async (toolId: string) => {
    if (status !== "authenticated") {
      showAuthToast();
      return;
    }

    try {
      await toggleSave(toolId);
    } catch (error) {
      console.error("Error toggling tool save:", error);
      toast({
        title: "No pudimos actualizar tu biblioteca",
        description: "Intenta de nuevo en unos segundos.",
      });
    }
  };

  return (
    <div className="min-h-full bg-background px-5 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_10%_6%,rgba(184,219,77,0.22),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(145,198,171,0.2),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,244,239,0.95)_100%)] dark:bg-[radial-gradient(circle_at_10%_6%,rgba(204,255,0,0.12),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(129,255,190,0.09),transparent_40%),linear-gradient(180deg,rgba(8,15,11,0.9)_0%,rgba(6,11,8,0.98)_100%)]" />

        <section className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/60 px-5 py-6 text-foreground shadow-[0_22px_45px_-30px_rgba(9,15,12,0.75)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_26%,rgba(255,255,255,0.08)_52%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.54),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(177,215,66,0.2),transparent_46%)] dark:bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.14),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(204,255,0,0.08),transparent_46%)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-black/10 dark:bg-white/30" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                Biblioteca
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground dark:text-white">
                Mi biblioteca
              </h1>
            </div>

            <Button
              asChild
              variant="ghost"
              className="h-auto rounded-full border border-[#CCFF00] bg-[#CCFF00] px-3.5 py-1.5 text-xs font-semibold text-[#0d1204] backdrop-blur-md transition hover:border-[#d8ff4a] hover:bg-[#d8ff4a] hover:text-[#0d1204] focus-visible:ring-[#CCFF00]/70 dark:border-[#CCFF00] dark:bg-[#CCFF00] dark:text-[#0d1204] dark:hover:border-[#d8ff4a] dark:hover:bg-[#d8ff4a] dark:hover:text-[#0d1204]"
            >
              <Link to={routes.appProfile}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] border border-black/10 bg-white/60 p-5 shadow-[0_18px_36px_-26px_rgba(0,0,0,0.62)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.28)_34%,rgba(255,255,255,0.06)_60%,rgba(8,13,10,0.08)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_56%,rgba(8,14,10,0.32)_100%)]" />
          <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />

          <div className="relative">
            {status !== "authenticated" ? (
              <div className="rounded-2xl border border-black/10 bg-white/45 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.05]">
                <h2 className="text-xl font-semibold tracking-tight text-foreground dark:text-white">
                  Inicia sesión para usar tu biblioteca
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  Cuando guardes herramientas desde el ranking, las vas a encontrar acá.
                </p>
                <Button asChild className="mt-6 rounded-full px-6">
                  <Link to={routes.login}>Ir al login</Link>
                </Button>
              </div>
            ) : toolsLoading || interactionsLoading ? (
              <div className="rounded-2xl border border-black/10 bg-white/45 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.05]">
                <p className="text-sm font-medium text-muted-foreground">Cargando tu biblioteca...</p>
              </div>
            ) : toolsError ? (
              <div className="rounded-2xl border border-black/10 bg-white/45 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.05]">
                <p className="text-sm font-medium text-muted-foreground">
                  No pudimos cargar el catálogo de herramientas.
                </p>
              </div>
            ) : savedTools.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white/45 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.05]">
                <h2 className="text-xl font-semibold tracking-tight text-foreground dark:text-white">
                  Todavía no guardaste herramientas
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  Marca herramientas con el ícono de guardado para armar tu propia selección.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-full border-black/10 bg-white/55 px-6 backdrop-blur-md hover:bg-white/75 dark:border-white/20 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
                >
                  <Link to={routes.appTools}>Ir a Herramientas</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedTools.map((tool) => (
                  <article
                    key={tool.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTool(tool)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTool(tool);
                      }
                    }}
                    className="cursor-pointer rounded-2xl border border-black/10 bg-white/45 px-4 py-4 shadow-[0_14px_28px_-24px_rgba(0,0,0,0.72)] backdrop-blur-md transition-colors hover:bg-white/65 dark:border-white/15 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] md:px-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <ToolLogo
                          name={tool.name}
                          domain={tool.domain}
                          className="h-12 w-12 border-none bg-transparent"
                          imageClassName="p-0.5"
                        />

                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold tracking-tight text-foreground dark:text-white">
                            {tool.name}
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[11px] font-medium text-foreground dark:border-white/20 dark:bg-white/10 dark:text-white"
                            >
                              {withSpanishAccents(tool.category)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[11px] font-medium text-foreground dark:border-white/20 dark:bg-white/10 dark:text-white"
                            >
                              {withSpanishAccents(tool.kind)}
                            </Badge>
                            {tool.niches.slice(0, 2).map((niche) => (
                              <Badge
                                key={`${tool.name}-${niche}`}
                                variant="outline"
                                className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[11px] font-medium text-muted-foreground dark:border-white/20 dark:bg-white/10 dark:text-white/75"
                              >
                                {withSpanishAccents(toolNicheMap[niche].label)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div onClick={(event) => event.stopPropagation()}>
                        <ToolInteractionButtons
                          className="justify-end"
                          favoriteActive={isFavorited(tool.name)}
                          favoriteCount={getFavoriteCount(tool.name)}
                          favoritePending={isFavoritePending(tool.name)}
                          saveActive={isSaved(tool.name)}
                          savePending={isSavePending(tool.name)}
                          onFavoriteClick={() => void handleFavoriteClick(tool.name)}
                          onSaveClick={() => void handleSaveClick(tool.name)}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};

export default Library;
