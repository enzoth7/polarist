import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown, Star } from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import {
  toolNicheDefinitions,
  type ToolNicheKey,
} from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery } from "@/hooks/useTools";
import { cn } from "@/lib/utils";
import { withSpanishAccents } from "@/lib/withSpanishAccents";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

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

const labelWithAccents = (value: string) => withSpanishAccents(value);

const dropdownContentClassName =
  "w-56 overflow-hidden rounded-[18px] border border-black/18 bg-white/82 p-1.5 shadow-[0_24px_48px_-26px_rgba(0,0,0,0.78)] backdrop-blur-xl dark:border-white/24 dark:bg-[#0b120e]/88";

const dropdownLabelClassName =
  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/70 dark:text-white/72";

const dropdownItemClassName =
  "rounded-[12px] border border-transparent px-2.5 py-2 pl-2.5 pr-2.5 text-[13px] font-semibold text-foreground/86 transition-colors data-[state=checked]:border-black/15 data-[state=checked]:bg-white/86 hover:border-black/12 hover:bg-white/88 focus:bg-white/88 dark:text-white/84 dark:data-[state=checked]:border-white/20 dark:data-[state=checked]:bg-white/[0.15] dark:hover:border-white/18 dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.12] [&>span]:hidden";

const dropdownSeparatorClassName = "my-1 bg-black/10 dark:bg-white/14";

const filterChipClassName =
  "inline-flex items-center gap-2 rounded-full border border-black/26 bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.62)_52%,rgba(236,246,239,0.58)_100%)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground shadow-[0_14px_30px_-18px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl dark:border-white/34 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_52%,rgba(133,170,120,0.16)_100%)] dark:text-white dark:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)]";

const filterChipButtonClassName =
  `${filterChipClassName} transition-colors hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.74)_52%,rgba(230,245,234,0.7)_100%)] dark:hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.14)_52%,rgba(156,196,141,0.2)_100%)]`;

const ToolsRanking = () => {
  const { status } = useAuth();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<ToolNicheKey[]>([]);
  const {
    data: officialTools = [],
    error,
    isLoading,
  } = useToolsQuery({ isBeta: false });
  const rankingWithPosition = useMemo(
    () => officialTools.map((tool, index) => ({ ...tool, position: index + 1 })),
    [officialTools],
  );
  const [selectedTool, setSelectedTool] = useState<(typeof rankingWithPosition)[number] | null>(null);
  const allToolIds = useMemo(() => rankingWithPosition.map((tool) => tool.name), [rankingWithPosition]);
  const {
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
      title: "Inicia sesión para usar favoritos y guardados",
      description: "Necesitas entrar con tu cuenta para marcar herramientas y ver tu biblioteca.",
    });

  const handleFavoriteClick = async (toolId: string) => {
    if (status !== "authenticated") {
      showAuthToast();
      return;
    }

    try {
      await toggleFavorite(toolId);
    } catch (nextError) {
      console.error("Error toggling tool favorite:", nextError);
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
    } catch (nextError) {
      console.error("Error toggling tool save:", nextError);
      toast({
        title: "No pudimos actualizar tu biblioteca",
        description: "Intenta de nuevo en unos segundos.",
      });
    }
  };

  return (
    <div className="min-h-full bg-background px-4 pb-32 pt-9 md:px-8 md:pb-20 md:pt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col items-center gap-5 py-4 text-center md:py-6">
          <h1 className="text-balance text-3xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
            Todas las herramientas de IA
          </h1>
        </header>

        <section className="space-y-4">
            <div className="mx-auto flex w-full max-w-[980px] flex-wrap items-center justify-between gap-3">
              <p className={filterChipClassName}>
                {isLoading ? "CARGANDO HERRAMIENTAS..." : `TOTAL: ${rankingWithPosition.length} HERRAMIENTAS`}
              </p>

              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={filterChipButtonClassName}
                    >
                      Categoría
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className={dropdownContentClassName}>
                    <DropdownMenuLabel className={dropdownLabelClassName}>Categorías</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      className={dropdownItemClassName}
                      checked={selectedCategories.length === 0}
                      onCheckedChange={() => setSelectedCategories([])}
                    >
                      Todas
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator className={dropdownSeparatorClassName} />
                    {categoryOptions.map((category) => (
                      <DropdownMenuCheckboxItem
                        className={dropdownItemClassName}
                        key={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() =>
                          toggleFilterValue(selectedCategories, category, setSelectedCategories)
                        }
                      >
                        {labelWithAccents(category)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={filterChipButtonClassName}
                    >
                      Nicho
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className={dropdownContentClassName}>
                    <DropdownMenuLabel className={dropdownLabelClassName}>Negocios</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      className={dropdownItemClassName}
                      checked={selectedNiches.length === 0}
                      onCheckedChange={() => setSelectedNiches([])}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator className={dropdownSeparatorClassName} />
                    {toolNicheDefinitions.map((niche) => (
                      <DropdownMenuCheckboxItem
                        className={dropdownItemClassName}
                        key={niche.value}
                        checked={selectedNiches.includes(niche.value)}
                        onCheckedChange={() =>
                          toggleFilterValue(selectedNiches, niche.value, setSelectedNiches)
                        }
                      >
                        {labelWithAccents(niche.label)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={filterChipButtonClassName}
                    >
                      Tipo
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={dropdownContentClassName}>
                    <DropdownMenuLabel className={dropdownLabelClassName}>Tipos</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      className={dropdownItemClassName}
                      checked={selectedKinds.length === 0}
                      onCheckedChange={() => setSelectedKinds([])}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator className={dropdownSeparatorClassName} />
                    {kindOptions.map((kind) => (
                      <DropdownMenuCheckboxItem
                        className={dropdownItemClassName}
                        key={kind}
                        checked={selectedKinds.includes(kind)}
                        onCheckedChange={() => toggleFilterValue(selectedKinds, kind, setSelectedKinds)}
                      >
                        {labelWithAccents(kind)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="mx-auto w-full max-w-[980px] space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-[20px] border border-black/12 bg-white/55 px-3 py-2.5 shadow-[0_16px_34px_-26px_rgba(0,0,0,0.7)] backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.2)_34%,rgba(255,255,255,0.05)_100%)] dark:bg-[linear-gradient(150deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.02)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.58),transparent_42%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_40%)]" />
                    <div className="relative z-10 flex items-center gap-2">
                    <Skeleton className="h-8 w-10 rounded-full bg-black/10 dark:bg-white/12" />
                    <Skeleton className="h-11 w-11 rounded-full bg-black/10 dark:bg-white/12" />
                    <Skeleton className="h-5 flex-1 rounded bg-black/10 dark:bg-white/12" />
                    <Skeleton className="h-8 w-8 rounded-full bg-black/10 dark:bg-white/12" />
                    <Skeleton className="h-6 w-[44px] rounded-full bg-black/10 dark:bg-white/12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-black/10 bg-white/45 px-5 py-10 text-center backdrop-blur-md dark:border-white/15 dark:bg-white/[0.05]">
                <p className="text-sm font-medium text-muted-foreground">
                  No pudimos cargar el ranking oficial.
                </p>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-[980px] space-y-2">
                {filteredTools.map((tool) => (
                  <article
                    key={`${tool.position}-${tool.name}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTool(tool)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTool(tool);
                      }
                    }}
                    className="group relative overflow-hidden rounded-[20px] border border-black/12 bg-white/55 px-3 py-2.5 text-foreground shadow-[0_16px_34px_-26px_rgba(0,0,0,0.7)] backdrop-blur-md transition-colors hover:bg-white/70 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.2)_34%,rgba(255,255,255,0.05)_100%)] dark:bg-[linear-gradient(150deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.02)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.58),transparent_42%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_40%)]" />

                    <div className="relative z-10 flex items-center gap-2">
                      <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-full bg-black/10 px-2 text-xs font-bold tracking-[0.08em] text-foreground/70 dark:bg-white/10 dark:text-white/75">
                        {String(tool.position).padStart(2, "0")}
                      </span>

                      <ToolLogo
                        name={tool.name}
                        domain={tool.domain}
                        className="h-11 w-11 border-none bg-transparent"
                        imageClassName="p-0.5"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold">{tool.name}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleFavoriteClick(tool.name);
                        }}
                        disabled={isFavoritePending(tool.name)}
                        aria-pressed={isFavorited(tool.name)}
                        aria-label={isFavorited(tool.name) ? "Quitar estrella" : "Marcar con estrella"}
                        className={cn(
                          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
                          void handleSaveClick(tool.name);
                        }}
                        disabled={isSavePending(tool.name)}
                        aria-pressed={isSaved(tool.name)}
                        aria-label={isSaved(tool.name) ? "Quitar de guardados" : "Guardar en tu perfil"}
                        className={cn(
                          "relative inline-flex h-6 w-[44px] shrink-0 items-center rounded-full border p-0 transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isSaved(tool.name) ?
                            "border-primary/70 bg-primary/30"
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
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!isLoading && !error && filteredTools.length === 0 ? (
              <div className="rounded-[24px] border border-black/10 bg-white/45 px-5 py-10 text-center backdrop-blur-md dark:border-white/15 dark:bg-white/[0.05]">
                <p className="text-sm font-medium text-muted-foreground">
                  No hay herramientas para esa combinación de filtros.
                </p>
              </div>
            ) : null}
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

export default ToolsRanking;
