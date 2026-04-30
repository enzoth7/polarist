import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark, FolderOpen, Search, Star, User } from "lucide-react";

import { FolderDetailView } from "@/components/guides/FolderDetailView";
import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { type GuideFolderCard, guideFoldersCatalog } from "@/data/guideFoldersCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

type LibrarySection = "tools" | "resources";

const librarySections: Array<{ id: LibrarySection; label: string }> = [
  { id: "tools", label: "Herramientas" },
  { id: "resources", label: "Recursos" },
];

const guideKindLabelMap: Record<GuideFolderCard["kind"], string> = {
  social: "Social Systems",
  web: "Web Structures",
  visual: "Visual Culture",
  decision: "Decision Framework",
  strategy: "Brand Strategy",
  timeline: "AI Timeline",
  terms: "Glossary",
  prompts: "Prompt Archive",
  memory: "Memory Systems",
};

const compactNumberFormatter = new Intl.NumberFormat("es", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getInitials = (name?: string | null) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "";

const matchesToolSearch = (tool: ToolItem, searchTerm: string) => {
  const normalizedSearch = normalizeForMatch(searchTerm.trim());

  if (!normalizedSearch) {
    return true;
  }

  return normalizeForMatch(
    [
      tool.name,
      tool.category,
      tool.kind,
      tool.description ?? "",
      tool.whoIsItFor ?? "",
    ].join(" "),
  ).includes(normalizedSearch);
};

const matchesGuideSearch = (folder: GuideFolderCard, searchTerm: string) => {
  const normalizedSearch = normalizeForMatch(searchTerm.trim());

  if (!normalizedSearch) {
    return true;
  }

  return normalizeForMatch([folder.eyebrow, folder.title, folder.description].join(" ")).includes(
    normalizedSearch,
  );
};

const displayBlackStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 900,
} as const;

const displayBoldStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
} as const;

const serifStyle = {
  fontFamily: "var(--font-serif)",
  fontWeight: 400,
} as const;

const LibraryEmptyState = ({
  icon,
  title,
  description,
  cta,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  cta?: ReactNode;
}) => (
  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-10 text-center md:px-7">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
      {icon}
    </div>
    <h3 className="mt-5 text-[1.15rem] leading-tight text-[#F6F6F6]" style={displayBlackStyle}>
      {title}
    </h3>
    <p className="mx-auto mt-3 max-w-[34rem] text-[1rem] leading-relaxed text-white/56" style={serifStyle}>
      {description}
    </p>
    {cta ? <div className="mt-6">{cta}</div> : null}
  </div>
);

const ToolPosterSkeleton = () => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-[330px] w-[220px] min-w-[220px] animate-pulse rounded-[24px] border border-white/8 bg-white/[0.04]"
      />
    ))}
  </div>
);

const Library = () => {
  const [activeSection, setActiveSection] = useState<LibrarySection>("tools");
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { status, profile, user } = useAuth();
  const { toast } = useToast();
  const { data: allTools = [], error: toolsError, isLoading: toolsLoading } = useToolsQuery();

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
  const { savedFolderIds, toggleSavedFolder } = useSavedGuideFolders();

  const savedTools = useMemo(
    () => allTools.filter((tool) => savedToolIdSet.has(tool.name)),
    [allTools, savedToolIdSet],
  );
  const savedGuideFolders = useMemo(() => {
    const foldersById = new Map(guideFoldersCatalog.map((folder) => [folder.id, folder]));

    return [...savedFolderIds]
      .reverse()
      .map((folderId) => foldersById.get(folderId))
      .filter((folder): folder is GuideFolderCard => Boolean(folder));
  }, [savedFolderIds]);
  const filteredSavedTools = useMemo(
    () => savedTools.filter((tool) => matchesToolSearch(tool, searchTerm)),
    [savedTools, searchTerm],
  );
  const filteredSavedGuideFolders = useMemo(
    () => savedGuideFolders.filter((folder) => matchesGuideSearch(folder, searchTerm)),
    [savedGuideFolders, searchTerm],
  );

  useEffect(() => {
    if (activeSection === "tools" && !toolsLoading && savedTools.length === 0 && savedGuideFolders.length > 0) {
      setActiveSection("resources");
    }

    if (activeSection === "resources" && savedGuideFolders.length === 0 && savedTools.length > 0) {
      setActiveSection("tools");
    }
  }, [activeSection, savedGuideFolders.length, savedTools.length, toolsLoading]);

  const totalSavedEntries = savedTools.length + savedGuideFolders.length;
  const currentCount =
    activeSection === "tools" ? filteredSavedTools.length : filteredSavedGuideFolders.length;
  const avatarInitials = getInitials(profile?.fullName);
  const hasSearch = Boolean(searchTerm.trim());

  const showAuthToast = () =>
    toast({
      title: "Inicia sesion para usar tu biblioteca",
      description: "Guarda herramientas desde el catalogo y apareceran aqui.",
    });

  const handleFavoriteClick = async (toolId: string) => {
    if (status !== "authenticated") {
      showAuthToast();
      return;
    }

    try {
      await toggleFavorite(toolId);
    } catch {
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
    } catch {
      toast({
        title: "No pudimos actualizar tu biblioteca",
        description: "Intenta de nuevo en unos segundos.",
      });
    }
  };

  if (openedFolderId) {
    return <FolderDetailView folderId={openedFolderId} onClose={() => setOpenedFolderId(null)} />;
  }

  return (
    <div className="min-h-fit bg-[#010101] px-4 pb-10 pt-6 md:px-8 md:pb-12 md:pt-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
        <header className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/36" style={displayBlackStyle}>
                Mi coleccion
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm text-[#F6F6F6]">
                  {avatarInitials ? (
                    <span style={displayBoldStyle}>{avatarInitials}</span>
                  ) : (
                    <User className="h-[18px] w-[18px] text-white/68" />
                  )}
                </span>

                <div className="min-w-0">
                  <h1
                    className="text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.94] tracking-[-0.06em] text-[#F6F6F6]"
                    style={displayBlackStyle}
                  >
                    Biblioteca
                  </h1>
                  <p className="mt-2 max-w-[40rem] text-[1.02rem] leading-relaxed text-white/58 md:text-[1.1rem]" style={serifStyle}>
                    Tu archivo privado de herramientas y recursos guardados dentro de Polarist.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 text-right md:block">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34" style={displayBoldStyle}>
                Entradas guardadas
              </p>
              <p className="mt-3 text-[2.4rem] leading-none tracking-[-0.06em] text-[#F6F6F6]" style={displayBlackStyle}>
                {String(totalSavedEntries).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {librarySections.map((section) => {
                const isActive = section.id === activeSection;
                const count = section.id === "tools" ? savedTools.length : savedGuideFolders.length;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "shrink-0 border-b pb-2 text-left text-sm tracking-[0.02em] transition-colors",
                      isActive ? "border-[#F6F6F6] text-[#F6F6F6]" : "border-transparent text-white/46 hover:text-white/74",
                    )}
                    style={isActive ? displayBoldStyle : { fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    {section.label}
                    <span className="ml-2 text-white/42" style={serifStyle}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="flex w-full max-w-[420px] items-center gap-3 border-b border-white/12 pb-3 text-white/60 transition-colors focus-within:border-white/24">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={activeSection === "tools" ? "Buscar herramienta guardada" : "Buscar recurso guardado"}
                className="h-7 w-full bg-transparent text-sm text-[#F6F6F6] outline-none placeholder:text-white/34"
                style={serifStyle}
                aria-label="Buscar en biblioteca"
              />
            </label>
          </div>
        </header>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34" style={displayBoldStyle}>
                {activeSection === "tools" ? "Mi coleccion" : "Archivo editorial"}
              </p>
              <h2 className="mt-2 text-[1.8rem] leading-none tracking-[-0.04em] text-[#F6F6F6] md:text-[2.35rem]" style={displayBlackStyle}>
                {activeSection === "tools" ? "Herramientas guardadas" : "Recursos guardados"}
              </h2>
            </div>

            <div className="flex items-center gap-5 text-sm text-white/54">
              <span style={serifStyle}>
                {currentCount} resultado{currentCount === 1 ? "" : "s"}
              </span>
              <Link
                to={activeSection === "tools" ? routes.appTools : routes.appGuides}
                className="border-b border-white/12 pb-1 text-[#F6F6F6] transition-colors hover:border-white/28 hover:text-white"
                style={displayBoldStyle}
              >
                {activeSection === "tools" ? "Explorar catalogo" : "Explorar recursos"}
              </Link>
            </div>
          </div>

          {activeSection === "tools" ? (
            toolsLoading || interactionsLoading ? (
              <ToolPosterSkeleton />
            ) : toolsError ? (
              <LibraryEmptyState
                icon={<Bookmark className="h-5 w-5" />}
                title="No pudimos cargar la coleccion"
                description="Revisa tu conexion y vuelve a intentar."
              />
            ) : filteredSavedTools.length > 0 ? (
              <div className="-mx-4 overflow-x-auto pb-2 pl-4 [scrollbar-width:none] md:-mx-8 md:pl-8 [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-4 pr-4 md:gap-5 md:pr-8">
                  {filteredSavedTools.map((tool) => (
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
                        className="group relative flex min-h-[332px] w-[220px] min-w-[220px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(18,18,18,0.96)_38%,rgba(8,8,8,1)_100%)] p-5 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_40%)] opacity-70" />

                        <div className="relative flex flex-1 flex-col">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[0.62rem] uppercase tracking-[0.24em] text-white/38" style={displayBoldStyle}>
                              {withSpanishAccents(tool.category)}
                            </span>
                          </div>

                          <div className="mt-6 flex h-24 items-center justify-center">
                            <ToolLogo
                              name={tool.name}
                              logoFilename={tool.logoFilename}
                              className="h-[84px] w-[84px] border-none bg-transparent"
                              imageClassName="p-1"
                            />
                          </div>

                          <div className="mt-6">
                            <h3 className="min-h-[3.4rem] text-[1.12rem] leading-[1.08] text-[#F6F6F6]" style={displayBoldStyle}>
                              {tool.name}
                            </h3>
                            <p className="mt-3 max-h-[5.4rem] overflow-hidden text-[0.96rem] leading-[1.35] text-white/56" style={serifStyle}>
                              {tool.description?.trim() ||
                                tool.whoIsItFor?.trim() ||
                                "Herramienta guardada dentro de tu archivo privado."}
                            </p>
                          </div>

                          <div className="mt-auto pt-6">
                            <p className="text-[0.78rem] leading-relaxed text-white/38" style={serifStyle}>
                              {withSpanishAccents(tool.kind)}
                            </p>
                          </div>
                        </div>

                        <div className="relative mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleFavoriteClick(tool.name);
                            }}
                            disabled={isFavoritePending(tool.name)}
                            className={cn(
                              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[0.68rem] uppercase tracking-[0.18em] transition-colors",
                              isFavorited(tool.name) ?
                                "border-white/18 text-[#F6F6F6]"
                              : "border-white/10 text-white/48 hover:border-white/18 hover:text-white/70",
                            )}
                            style={displayBoldStyle}
                            aria-label={`Favorito ${tool.name}`}
                          >
                            <Star className={cn("h-3.5 w-3.5", isFavorited(tool.name) && "fill-current")} />
                            <span className="min-w-[2ch] tabular-nums">{compactNumberFormatter.format(getFavoriteCount(tool.name))}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleSaveClick(tool.name);
                            }}
                            disabled={isSavePending(tool.name)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                              isSaved(tool.name) ?
                                "border-white/18 text-[#F6F6F6]"
                              : "border-white/10 text-white/50 hover:border-white/18 hover:text-white/72",
                            )}
                            aria-label={`Guardar ${tool.name}`}
                          >
                            <Bookmark className={cn("h-4 w-4", isSaved(tool.name) && "fill-current")} />
                          </button>
                        </div>
                      </article>
                  ))}
                </div>
              </div>
            ) : (
              <LibraryEmptyState
                icon={<Bookmark className="h-5 w-5" />}
                title={status === "authenticated" ? "Todavia no guardaste herramientas" : "Inicia sesion para activar tu archivo"}
                description={
                  hasSearch ?
                    "No encontramos herramientas guardadas para esa busqueda."
                  : status === "authenticated" ?
                    "Guarda herramientas desde el catalogo y apareceran en esta coleccion."
                  : "Las herramientas guardadas viven en tu cuenta. Inicia sesion y construye tu seleccion privada."
                }
                cta={
                  <Link
                    to={status === "authenticated" ? routes.appTools : routes.login}
                    className="inline-flex border-b border-white/16 pb-1 text-sm text-[#F6F6F6] transition-colors hover:border-white/28 hover:text-white"
                    style={displayBoldStyle}
                  >
                    {status === "authenticated" ? "Ir a herramientas" : "Ir al login"}
                  </Link>
                }
              />
            )
          ) : filteredSavedGuideFolders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSavedGuideFolders.map((folder, index) => (
                <article
                  key={folder.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenedFolderId(folder.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpenedFolderId(folder.id);
                    }
                  }}
                  className="group relative flex min-h-[248px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_26%,rgba(8,8,8,1)_100%)] p-5 transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${18 + index * 8}% 0%, rgba(255,255,255,0.08), transparent 36%), linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 26%, rgba(8,8,8,1) 100%)`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72">
                      <FolderOpen className="h-5 w-5" />
                    </span>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (status !== "authenticated") {
                          showAuthToast();
                          return;
                        }
                        void toggleSavedFolder(folder.id).catch(() => {
                          toast({
                            title: "No pudimos actualizar tu biblioteca",
                            description: "Intenta de nuevo en unos segundos.",
                          });
                        });
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/56 transition-colors hover:border-white/18 hover:text-white/76"
                      aria-label={`Quitar ${folder.title} de la biblioteca`}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>
                  </div>

                  <div className="mt-8 flex-1">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/34" style={displayBoldStyle}>
                      {guideKindLabelMap[folder.kind]}
                    </p>
                    <h3 className="mt-3 text-[1.32rem] leading-[1.05] text-[#F6F6F6]" style={displayBoldStyle}>
                      {folder.title}
                    </h3>
                    <p className="mt-4 max-w-[32rem] text-[1rem] leading-[1.4] text-white/56" style={serifStyle}>
                      {folder.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/8 pt-4">
                    <span className="text-[0.76rem] uppercase tracking-[0.2em] text-white/42" style={displayBoldStyle}>
                      Abrir carpeta
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : hasSearch ? (
            <LibraryEmptyState
              icon={<FolderOpen className="h-5 w-5" />}
              title="No encontramos recursos para esa busqueda"
              description="Prueba con otro termino o vuelve a explorar la biblioteca editorial."
            />
          ) : (
            <LibraryEmptyState
              icon={<FolderOpen className="h-5 w-5" />}
              title="Todavia no guardaste recursos"
              description="Cuando empieces a guardar carpetas de aprendizaje, apareceran aqui."
              cta={
                <Link
                  to={routes.appGuides}
                  className="inline-flex border-b border-white/16 pb-1 text-sm text-[#F6F6F6] transition-colors hover:border-white/28 hover:text-white"
                  style={displayBoldStyle}
                >
                  Ir a recursos
                </Link>
              }
            />
          )}
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
