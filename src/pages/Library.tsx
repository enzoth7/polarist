import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { ToolInteractionButtons } from "@/components/tools/ToolInteractionButtons";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fullToolsRanking, toolNicheMap } from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { routes } from "@/lib/routes";

const allToolIds = fullToolsRanking.map((tool) => tool.name);

const Library = () => {
  const { status } = useAuth();
  const { toast } = useToast();
  const {
    getFavoriteCount,
    isFavoritePending,
    isFavorited,
    isSavePending,
    isSaved,
    loading,
    savedToolIdSet,
    toggleFavorite,
    toggleSave,
  } = useToolInteractions(allToolIds);

  const savedTools = fullToolsRanking.filter((tool) => savedToolIdSet.has(tool.name));

  const showAuthToast = () =>
    toast({
      title: "Inicia sesion para usar tu biblioteca",
      description: "Guarda herramientas desde el ranking y las vas a ver aca.",
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Biblioteca
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Mi biblioteca
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Tus herramientas guardadas viven aca y se cruzan directo con el ranking local.
            </p>
          </div>

          <Button asChild variant="ghost" className="rounded-full">
            <Link to={routes.appTools}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        {status !== "authenticated" ? (
          <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Inicia sesion para usar tu biblioteca
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Cuando guardes herramientas desde el ranking, las vas a encontrar aca.
            </p>
            <Button asChild className="mt-6 rounded-full px-6">
              <Link to={routes.login}>Ir a login</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">Cargando tu biblioteca...</p>
          </div>
        ) : savedTools.length === 0 ? (
          <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Todavia no guardaste herramientas
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Marca herramientas con el icono de guardado en el ranking para armar tu propia seleccion.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full border-border/40 px-6">
              <Link to={routes.appToolsRanking}>Ir al ranking</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedTools.map((tool) => (
              <article
                key={tool.name}
                className="rounded-3xl border border-border/40 bg-muted/10 px-4 py-4 md:px-5"
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
                      <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
                        {tool.name}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/40 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground"
                        >
                          {tool.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/40 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground"
                        >
                          {tool.kind}
                        </Badge>
                        {tool.niches.slice(0, 2).map((niche) => (
                          <Badge
                            key={`${tool.name}-${niche}`}
                            variant="outline"
                            className="rounded-full border-border/40 bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                          >
                            {toolNicheMap[niche].label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
