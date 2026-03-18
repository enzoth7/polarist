import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { ToolInteractionButtons } from "@/components/tools/ToolInteractionButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/tools/ToolLogo";
import {
  fullToolsRanking,
  toolNicheDefinitions,
  toolNicheMap,
  type ToolNicheKey,
} from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { routes } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const toggleFilterValue = <T extends string>(
  currentValues: T[],
  nextValue: T,
  setter: Dispatch<SetStateAction<T[]>>,
) => {
  setter(
    currentValues.includes(nextValue)
      ? currentValues.filter((value) => value !== nextValue)
      : [...currentValues, nextValue],
  );
};

const ToolsRanking = () => {
  const { status } = useAuth();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<ToolNicheKey[]>([]);

  const rankingWithPosition = useMemo(
    () => fullToolsRanking.map((tool, index) => ({ ...tool, position: index + 1 })),
    [],
  );
  const allToolIds = useMemo(() => rankingWithPosition.map((tool) => tool.name), [rankingWithPosition]);
  const {
    getFavoriteCount,
    isFavoritePending,
    isFavorited,
    isSavePending,
    isSaved,
    toggleFavorite,
    toggleSave,
  } = useToolInteractions(allToolIds);

  const categoryOptions = useMemo(
    () => Array.from(new Set(rankingWithPosition.map((tool) => tool.category))),
    [rankingWithPosition],
  );

  const kindOptions = useMemo(
    () => Array.from(new Set(rankingWithPosition.map((tool) => tool.kind))),
    [rankingWithPosition],
  );

  const filteredTools = useMemo(() => {
    return rankingWithPosition.filter((tool) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(tool.category);
      const kindMatch = selectedKinds.length === 0 || selectedKinds.includes(tool.kind);
      const nicheMatch =
        selectedNiches.length === 0 || selectedNiches.some((niche) => tool.niches.includes(niche));

      return categoryMatch && kindMatch && nicheMatch;
    });
  }, [rankingWithPosition, selectedCategories, selectedKinds, selectedNiches]);

  const showAuthToast = () =>
    toast({
      title: "Inicia sesion para usar favoritos y guardados",
      description: "Necesitas entrar con tu cuenta para marcar herramientas y ver tu biblioteca.",
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
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Ranking total
            </p>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
              Todas las herramientas
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Mismo catalogo, mismos logos y mismos nichos que ves en la vitrina principal.
            </p>
          </div>

          <Button asChild variant="ghost" className="w-fit rounded-full">
            <Link to={routes.appTools}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {filteredTools.length} herramientas visibles
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-border/40 bg-background">
            <div className="overflow-x-auto">
              <Table className="min-w-[1100px]">
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="w-[92px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Posicion
                    </TableHead>
                    <TableHead className="min-w-[280px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Nombre
                    </TableHead>
                    <TableHead className="w-[180px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Categoria
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuLabel>Categorias</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={selectedCategories.length === 0}
                            onCheckedChange={() => setSelectedCategories([])}
                          >
                            Todas
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {categoryOptions.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() =>
                                toggleFilterValue(selectedCategories, category, setSelectedCategories)
                              }
                            >
                              {category}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="w-[220px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Nicho
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuLabel>Negocios</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={selectedNiches.length === 0}
                            onCheckedChange={() => setSelectedNiches([])}
                          >
                            Todos
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {toolNicheDefinitions.map((niche) => (
                            <DropdownMenuCheckboxItem
                              key={niche.value}
                              checked={selectedNiches.includes(niche.value)}
                              onCheckedChange={() =>
                                toggleFilterValue(selectedNiches, niche.value, setSelectedNiches)
                              }
                            >
                              {niche.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="w-[160px] px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="ml-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Tipo
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Tipos</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={selectedKinds.length === 0}
                            onCheckedChange={() => setSelectedKinds([])}
                          >
                            Todos
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {kindOptions.map((kind) => (
                            <DropdownMenuCheckboxItem
                              key={kind}
                              checked={selectedKinds.includes(kind)}
                              onCheckedChange={() => toggleFilterValue(selectedKinds, kind, setSelectedKinds)}
                            >
                              {kind}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="w-[180px] px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Interacciones
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTools.map((tool) => {
                    const matchedNiche = selectedNiches.find((niche) => tool.niches.includes(niche));
                    const displayNiches = matchedNiche ? [matchedNiche] : tool.niches.slice(0, 2);
                    const matchedTag = matchedNiche ? tool.nicheTags[matchedNiche] : undefined;

                    return (
                      <TableRow
                        key={`${tool.position}-${tool.name}`}
                        className="border-border/40 hover:bg-muted/10"
                      >
                        <TableCell className="px-5 py-4 align-middle">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {String(tool.position).padStart(2, "0")}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-4">
                            <ToolLogo
                              name={tool.name}
                              domain={tool.domain}
                              className="h-12 w-12 border-none bg-transparent"
                              imageClassName="p-0.5"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold tracking-tight text-foreground">
                                {tool.name}
                              </p>
                              {matchedTag ? (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {matchedTag}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 align-middle">
                          <Badge
                            variant="outline"
                            className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                          >
                            {tool.category}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-5 py-4 align-middle">
                          <div className="flex flex-wrap gap-2">
                            {displayNiches.map((niche) => (
                              <Badge
                                key={`${tool.name}-${niche}`}
                                variant="outline"
                                className="rounded-full border-border/40 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                              >
                                {toolNicheMap[niche].label}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-right align-middle">
                          <Badge
                            variant="outline"
                            className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                          >
                            {tool.kind}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-right align-middle">
                          <ToolInteractionButtons
                            favoriteActive={isFavorited(tool.name)}
                            favoriteCount={getFavoriteCount(tool.name)}
                            favoritePending={isFavoritePending(tool.name)}
                            saveActive={isSaved(tool.name)}
                            savePending={isSavePending(tool.name)}
                            onFavoriteClick={() => void handleFavoriteClick(tool.name)}
                            onSaveClick={() => void handleSaveClick(tool.name)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="border border-border/40 px-5 py-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No hay herramientas para esa combinacion de filtros.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ToolsRanking;
