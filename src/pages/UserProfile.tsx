import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpDown,
  FolderOpen,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { guideFoldersCatalog, type GuideFolderCard } from "@/data/guideFoldersCatalog";
import { useAuth } from "@/hooks/useAuth";
import { usePublicUserProfile } from "@/hooks/usePublicUserProfile";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { useUserSavedTools } from "@/hooks/useUserSavedTools";
import { type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

const getInitials = (name?: string | null) => name?.trim().slice(0, 2).toUpperCase() || "PU";

type SavedFilterKey =
  | "all"
  | "tools"
  | "resources";

const savedFilterOptions: Array<{ id: SavedFilterKey; label: string }> = [
  { id: "all", label: "Todo" },
  { id: "tools", label: "Herramientas" },
  { id: "resources", label: "Recursos" },
];

type SavedFilterOption = (typeof savedFilterOptions)[number];
type SavedFilterId = SavedFilterOption["id"];
type SavedOrder = "recent" | "oldest";

const sortOrderLabelMap: Record<SavedOrder, string> = {
  recent: "Más reciente",
  oldest: "Primero guardado",
};

const getToolClassifierText = (tool: ToolItem) =>
  [
    tool.name,
    tool.category,
    tool.kind,
    tool.description ?? "",
    tool.whoIsItFor ?? "",
    tool.niches.join(" "),
  ]
    .join(" ")
    .toLowerCase();

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getToolSectionText = (tool: ToolItem) => normalizeForMatch(`${tool.category} ${tool.kind}`);

const isResourceTool = (tool: ToolItem) =>
  /(recurso|resource|guia|guide|tutorial|curso|manual|playbook|framework|aprendizaje|learning|documentacion|historia|biblioteca)/.test(
    getToolSectionText(tool),
  );

const toolMatchesFilter = (tool: ToolItem, filterId: SavedFilterId) => {
  if (filterId === "all") {
    return true;
  }

  if (filterId === "tools") {
    return !isResourceTool(tool);
  }

  if (filterId === "resources") {
    return isResourceTool(tool);
  }

  return false;
};

const toolMatchesSearch = (tool: ToolItem, term: string) => {
  const normalizedSearch = term.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const searchableText = [
    tool.name,
    tool.category,
    tool.kind,
    tool.description ?? "",
    tool.whoIsItFor ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
};

const parseSavedTime = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { profile, loading: profileLoading } = usePublicUserProfile(username);
  const {
    tools,
    savedToolCreatedAtById,
    loading: toolsLoading,
  } = useUserSavedTools(profile?.id);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [savedSearchTerm, setSavedSearchTerm] = useState("");
  const [activeSavedFilter, setActiveSavedFilter] = useState<SavedFilterKey>("all");
  const [toolsSortOrder, setToolsSortOrder] = useState<SavedOrder>("recent");
  const [resourcesSortOrder, setResourcesSortOrder] = useState<SavedOrder>("recent");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const goToSettings = () => {
    navigate(routes.appSettings);
  };

  const isOwnProfile = Boolean(user && profile && user.id === profile.id);
  const savedGuideOwnerId = isOwnProfile ? user?.id : "__disabled__";
  const { savedFolderIds } = useSavedGuideFolders(savedGuideOwnerId);
  const displayName = profile?.full_name?.trim() || "Usuario Polarist";
  const firstName = displayName.split(/\s+/)[0] || "Usuario";
  const savedGuideFolders = useMemo(
    () => {
      if (!isOwnProfile) {
        return [];
      }

      const foldersById = new Map(guideFoldersCatalog.map((folder) => [folder.id, folder]));

      return savedFolderIds
        .map((folderId) => foldersById.get(folderId))
        .filter((folder): folder is GuideFolderCard => Boolean(folder))
        .map((folder) => ({
          ...folder,
          description:
            folder.id === "recursos" ?
              "Explorá conceptos prácticos para dominar IA desde cero."
            : folder.description,
        }));
    },
    [isOwnProfile, savedFolderIds],
  );

  const filteredSavedTools = useMemo(
    () =>
      tools
        .filter((tool) => toolMatchesFilter(tool, activeSavedFilter))
        .filter((tool) => toolMatchesSearch(tool, savedSearchTerm)),
    [activeSavedFilter, savedSearchTerm, tools],
  );
  const filteredSavedGuideFolders = useMemo(() => {
    if (activeSavedFilter === "tools") {
      return [];
    }

    const normalizedSearch = savedSearchTerm.trim().toLowerCase();

    return savedGuideFolders.filter((folder) => {
      if (!normalizedSearch) {
        return true;
      }

      return `${folder.eyebrow} ${folder.title} ${folder.description}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [activeSavedFilter, savedGuideFolders, savedSearchTerm]);
  const orderedSavedTools = useMemo(() => {
    const nextTools = [...filteredSavedTools];

    nextTools.sort((leftTool, rightTool) => {
      const leftSavedAt = parseSavedTime(savedToolCreatedAtById[leftTool.name]);
      const rightSavedAt = parseSavedTime(savedToolCreatedAtById[rightTool.name]);

      return toolsSortOrder === "recent" ? rightSavedAt - leftSavedAt : leftSavedAt - rightSavedAt;
    });

    return nextTools;
  }, [filteredSavedTools, savedToolCreatedAtById, toolsSortOrder]);
  const orderedSavedGuideFolders = useMemo(() => {
    const nextFolders = [...filteredSavedGuideFolders];

    if (resourcesSortOrder === "recent") {
      nextFolders.reverse();
    }

    return nextFolders;
  }, [filteredSavedGuideFolders, resourcesSortOrder]);
  const hasSavedContent = filteredSavedTools.length > 0 || filteredSavedGuideFolders.length > 0;
  const totalSavedEntries = tools.length + savedGuideFolders.length;
  const showSavedToolsColumn = activeSavedFilter !== "resources";
  const showSavedResourcesColumn = activeSavedFilter !== "tools";

  const activeSavedFilterLabel =
    savedFilterOptions.find((filterOption) => filterOption.id === activeSavedFilter)?.label ||
    "Todo";

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      navigate(routes.landing, { replace: true });
    } catch (error) {
      console.error("Error signing out from profile:", error);
      toast.error("No se pudo cerrar sesión");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!username) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">No encontramos ese perfil.</p>
      </div>
    );
  }



  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-6 md:pb-12">
      <div className="relative mx-auto flex w-full max-w-[980px] flex-col gap-6">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_10%_6%,rgba(184,219,77,0.22),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(145,198,171,0.2),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,244,239,0.95)_100%)] dark:bg-[radial-gradient(circle_at_10%_6%,rgba(204,255,0,0.12),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(129,255,190,0.09),transparent_40%),linear-gradient(180deg,rgba(8,15,11,0.9)_0%,rgba(6,11,8,0.98)_100%)]" />

        <section className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/60 px-5 py-6 text-foreground shadow-[0_22px_45px_-30px_rgba(9,15,12,0.75)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_26%,rgba(255,255,255,0.08)_52%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.54),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(177,215,66,0.2),transparent_46%)] dark:bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.14),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(204,255,0,0.08),transparent_46%)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-black/10 dark:bg-white/30" />
          <div className="relative flex flex-col gap-5">
            {profileLoading ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-[74px] w-[74px] rounded-full bg-black/10 dark:bg-white/15" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full bg-black/10 dark:bg-white/15" />
                    <Skeleton className="h-10 w-10 rounded-full bg-black/10 dark:bg-white/15" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-12 w-52 bg-black/10 dark:bg-white/15" />
                  <Skeleton className="h-8 w-full rounded-full bg-black/10 dark:bg-white/15" />
                </div>
              </>
            ) : profile ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(true)}
                    className="group relative inline-flex items-center justify-center rounded-full text-left transition hover:opacity-95 active:scale-95"
                  >
                    <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full text-xl font-semibold text-white">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || "Perfil"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(profile.full_name)}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                      <Sparkles className="h-5 w-5 text-white/70" />
                    </div>
                  </button>

                </div>

                <div className="space-y-3">
                  <h1 className="text-[42px] font-semibold tracking-tight text-foreground dark:text-white md:text-[44px]">
                    Hola, {firstName}
                  </h1>
                  <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex w-max items-center gap-2 px-1">
                      {savedFilterOptions.map((filterOption) => {
                        const isActive = filterOption.id === activeSavedFilter;

                        return (
                          <button
                            key={filterOption.id}
                            type="button"
                            onClick={() => setActiveSavedFilter(filterOption.id)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition ${
                              isActive ?
                                "border-[#CCFF00] bg-[#CCFF00] text-[#0d1204]"
                              : "border-black/10 bg-white/45 text-foreground/85 hover:bg-white/65 dark:border-white/20 dark:bg-white/[0.08] dark:text-white/85 dark:hover:bg-white/[0.14]"
                            }`}
                          >
                            {filterOption.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <div className="py-6 text-center">
                <h1 className="text-xl font-semibold text-foreground dark:text-white">
                  Perfil no disponible
                </h1>
                <p className="mt-2 text-sm text-foreground/70 dark:text-white/70">
                  No encontramos información pública para este usuario.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] border border-black/10 bg-white/60 p-5 shadow-[0_18px_36px_-26px_rgba(0,0,0,0.62)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.28)_34%,rgba(255,255,255,0.06)_60%,rgba(8,13,10,0.08)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_56%,rgba(8,14,10,0.32)_100%)]" />
          <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Últimas cosas guardadas
            </h2>
            <div
              className="relative flex h-11 w-[min(68vw,620px)] min-w-[180px] shrink-0 items-center overflow-hidden rounded-full border border-black/10 bg-white/40 text-foreground backdrop-blur-md transition hover:bg-white/65 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center">
                <Search className="h-4 w-4" />
              </span>
              <input
                value={savedSearchTerm}
                onChange={(event) => setSavedSearchTerm(event.target.value)}
                placeholder="Buscar..."
                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm text-foreground outline-none placeholder:text-foreground/55 dark:text-white dark:placeholder:text-white/55"
                aria-label="Buscar en tus guardados"
              />
            </div>
          </div>

          {toolsLoading ? (
            <div className="relative z-10 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-black/10 bg-white/45 p-4 dark:border-white/15 dark:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSavedContent ? (
            <>
              <div className={`grid gap-3 ${showSavedToolsColumn && showSavedResourcesColumn ? "md:grid-cols-2" : ""}`}>
                {showSavedToolsColumn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/72 dark:text-white/70">
                        Herramientas
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 items-center gap-1.5 px-1 text-[11px] font-semibold text-foreground/72 transition-colors hover:text-foreground dark:text-white/70 dark:hover:text-white"
                          >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            {sortOrderLabelMap[toolsSortOrder]}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[170px] overflow-hidden rounded-[16px] border border-black/18 bg-[linear-gradient(165deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.68)_42%,rgba(235,244,239,0.58)_100%)] p-1.5 shadow-[0_22px_46px_-28px_rgba(0,0,0,0.76)] backdrop-blur-xl dark:border-white/24 dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.07)_42%,rgba(133,170,120,0.12)_100%)]"
                        >
                          <DropdownMenuRadioGroup
                            value={toolsSortOrder}
                            onValueChange={(value) => setToolsSortOrder(value as SavedOrder)}
                          >
                            <DropdownMenuRadioItem
                              value="recent"
                              className="rounded-[10px] border border-transparent px-2.5 py-2 text-[12px] font-semibold text-foreground/85 outline-none transition-colors data-[state=checked]:border-black/16 data-[state=checked]:bg-white/92 hover:bg-white/86 focus:bg-white/86 dark:text-white/85 dark:data-[state=checked]:border-white/24 dark:data-[state=checked]:bg-white/[0.16] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.12] [&>span]:hidden"
                            >
                              Más reciente
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              value="oldest"
                              className="rounded-[10px] border border-transparent px-2.5 py-2 text-[12px] font-semibold text-foreground/85 outline-none transition-colors data-[state=checked]:border-black/16 data-[state=checked]:bg-white/92 hover:bg-white/86 focus:bg-white/86 dark:text-white/85 dark:data-[state=checked]:border-white/24 dark:data-[state=checked]:bg-white/[0.16] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.12] [&>span]:hidden"
                            >
                              Primero guardado
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {orderedSavedTools.length > 0 ? (
                      orderedSavedTools.map((tool) => (
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
                          className="group relative cursor-pointer overflow-hidden rounded-[22px] border border-black/12 bg-white/55 p-3 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] backdrop-blur-[14px] transition-colors hover:bg-white/70 dark:border-white/18 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(177,215,66,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(204,255,0,0.09),transparent_42%)]" />
                          <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />

                          <div className="relative z-10 flex items-start gap-3">
                            <ToolLogo
                              name={tool.name}
                              domain={tool.domain}
                              className="h-12 w-12 border-none bg-transparent"
                              imageClassName="p-0.5"
                            />
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold text-foreground">
                                  {tool.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-black/10 bg-white/75 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:border-white/20 dark:bg-white/10"
                                >
                                  {withSpanishAccents(tool.kind)}
                                </Badge>
                              </div>
                              <p className="text-sm leading-5 text-muted-foreground">
                                {tool.description?.trim() ||
                                  tool.whoIsItFor?.trim() ||
                                  "Herramienta guardada en tu biblioteca."}
                              </p>
                              <Badge
                                variant="outline"
                                className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[10px] font-semibold text-foreground dark:border-white/20 dark:bg-white/10 dark:text-white"
                              >
                                {withSpanishAccents(tool.category)}
                              </Badge>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="relative overflow-hidden rounded-[22px] border border-black/12 bg-white/55 px-4 py-4 text-sm text-muted-foreground shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] backdrop-blur-[14px] dark:border-white/18 dark:bg-white/[0.08]">
                        Todavía no guardaste herramientas.
                      </div>
                    )}
                  </div>
                ) : null}

                {showSavedResourcesColumn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/72 dark:text-white/70">
                        Recursos
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 items-center gap-1.5 px-1 text-[11px] font-semibold text-foreground/72 transition-colors hover:text-foreground dark:text-white/70 dark:hover:text-white"
                          >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            {sortOrderLabelMap[resourcesSortOrder]}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[170px] overflow-hidden rounded-[16px] border border-black/18 bg-[linear-gradient(165deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.68)_42%,rgba(235,244,239,0.58)_100%)] p-1.5 shadow-[0_22px_46px_-28px_rgba(0,0,0,0.76)] backdrop-blur-xl dark:border-white/24 dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.07)_42%,rgba(133,170,120,0.12)_100%)]"
                        >
                          <DropdownMenuRadioGroup
                            value={resourcesSortOrder}
                            onValueChange={(value) => setResourcesSortOrder(value as SavedOrder)}
                          >
                            <DropdownMenuRadioItem
                              value="recent"
                              className="rounded-[10px] border border-transparent px-2.5 py-2 text-[12px] font-semibold text-foreground/85 outline-none transition-colors data-[state=checked]:border-black/16 data-[state=checked]:bg-white/92 hover:bg-white/86 focus:bg-white/86 dark:text-white/85 dark:data-[state=checked]:border-white/24 dark:data-[state=checked]:bg-white/[0.16] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.12] [&>span]:hidden"
                            >
                              Más reciente
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              value="oldest"
                              className="rounded-[10px] border border-transparent px-2.5 py-2 text-[12px] font-semibold text-foreground/85 outline-none transition-colors data-[state=checked]:border-black/16 data-[state=checked]:bg-white/92 hover:bg-white/86 focus:bg-white/86 dark:text-white/85 dark:data-[state=checked]:border-white/24 dark:data-[state=checked]:bg-white/[0.16] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.12] [&>span]:hidden"
                            >
                              Primero guardado
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {orderedSavedGuideFolders.length > 0 ? (
                      orderedSavedGuideFolders.map((folder) => (
                        <article
                          key={folder.id}
                          className="relative overflow-hidden rounded-[22px] border border-black/12 bg-white/55 px-4 py-3 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] backdrop-blur-[14px] dark:border-white/18 dark:bg-white/[0.08]"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(177,215,66,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(204,255,0,0.09),transparent_42%)]" />
                          <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />

                          <div className="relative z-10 flex items-start gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white/75 text-foreground/85 dark:border-white/20 dark:bg-white/12 dark:text-white/90">
                              <FolderOpen className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/90">
                                {folder.eyebrow}
                              </p>
                              <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground dark:text-white">
                                {folder.title}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                {folder.description}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="relative overflow-hidden rounded-[22px] border border-black/12 bg-white/55 px-4 py-4 text-sm text-muted-foreground shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] backdrop-blur-[14px] dark:border-white/18 dark:bg-white/[0.08]">
                        Todavía no guardaste recursos.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          ) : totalSavedEntries === 0 ? (
            <div className="relative z-10 rounded-2xl border border-black/10 bg-white/45 px-5 py-8 text-center dark:border-white/15 dark:bg-white/[0.05]">
              <p className="text-sm font-medium text-foreground">Aún no guardaste herramientas ni recursos.</p>
            </div>
          ) : savedSearchTerm.trim() ? (
            <div className="relative z-10 rounded-2xl border border-black/10 bg-white/45 px-5 py-8 text-center dark:border-white/15 dark:bg-white/[0.05]">
              <p className="text-sm font-medium text-foreground">
                No encontramos resultados para esa búsqueda.
              </p>
            </div>
          ) : activeSavedFilter !== "all" ? (
            <div className="relative z-10 rounded-2xl border border-black/10 bg-white/45 px-5 py-8 text-center dark:border-white/15 dark:bg-white/[0.05]">
              <p className="text-sm font-medium text-foreground">
                Todavía no hay herramientas guardadas en {activeSavedFilterLabel}.
              </p>
            </div>
          ) : (
            <div className="relative z-10 rounded-2xl border border-black/10 bg-white/45 px-5 py-8 text-center dark:border-white/15 dark:bg-white/[0.05]">
              <p className="text-sm font-medium text-foreground">
                No encontramos resultados para esa búsqueda.
              </p>
            </div>
          )}
        </section>

      </div>

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />

      {/* Modal de Imagen Grande */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowImagePreview(false);
              }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={profile?.avatar_url || "/avatar.jpg"}
                alt="Avatar grande"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
