import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { FolderOpen, User } from "lucide-react";

import { FolderDetailView } from "@/components/guides/FolderDetailView";
import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { type GuideFolderCard, guideFoldersCatalog } from "@/data/guideFoldersCatalog";
import { toolNicheMap } from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { usePublicUserProfile } from "@/hooks/usePublicUserProfile";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { useUserSavedTools } from "@/hooks/useUserSavedTools";
import { type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

type SavedFilterKey = "all" | "tools" | "resources";

const savedFilterOptions: Array<{ id: SavedFilterKey; label: string }> = [
  { id: "all", label: "Todo" },
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

const displayBlackStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
} as const;

const displayBoldStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
} as const;

const serifStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 400,
} as const;

const serifBoldStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
} as const;

const getInitials = (name?: string | null) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PU";

const parseSavedTime = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const ProfileHeaderSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-end">
    <div className="w-fit">
      <div className="h-[216px] w-[176px] animate-pulse rounded-[24px] border border-white/[0.08] bg-white/[0.05]" />
    </div>

    <div className="space-y-4">
      <div className="h-14 w-72 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="h-6 w-full max-w-[520px] animate-pulse rounded-full bg-white/[0.05]" />
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-8 w-28 animate-pulse rounded-full bg-white/[0.05]" />
        ))}
      </div>
    </div>
  </div>
);

const ToolPosterSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-[332px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.04]"
      />
    ))}
  </div>
);

const ResourceGridSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="h-[236px] animate-pulse rounded-[24px] border border-white/10 bg-white/[0.04]"
      />
    ))}
  </div>
);

const EmptyState = ({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: ReactNode;
}) => (
  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-10 text-center md:px-7">
    <h3 className="text-[1.15rem] leading-tight text-[#F6F6F6]" style={displayBlackStyle}>
      {title}
    </h3>
    {description ? (
      <p className="mx-auto mt-3 max-w-[34rem] text-[1rem] leading-relaxed text-[#F6F6F6]" style={serifStyle}>
        {description}
      </p>
    ) : null}
    {cta ? <div className="mt-6">{cta}</div> : null}
  </div>
);

const SavedToolPoster = ({
  tool,
  onSelect,
}: {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
}) => {
  const primaryNiche = tool.niches[0] ? withSpanishAccents(toolNicheMap[tool.niches[0]].label) : null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(tool)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(tool);
        }
      }}
      className="group relative flex min-h-[332px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(16,16,16,0.98)_36%,rgba(8,8,8,1)_100%)] p-5 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#F6F6F6]" style={displayBoldStyle}>
            {withSpanishAccents(tool.category)}
          </span>
          {tool.isBeta ? (
            <span className="text-[0.62rem] uppercase tracking-[0.24em] text-[#F6F6F6]" style={serifStyle}>
              Beta
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex h-24 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03]">
          <ToolLogo
            name={tool.name}
            domain={tool.domain}
            className="h-[88px] w-[88px] border-none bg-transparent"
            imageClassName="p-1"
          />
        </div>

        <div className="mt-6 flex-1">
          <h3 className="text-[1.34rem] leading-[1.04] text-[#F6F6F6]" style={serifBoldStyle}>
            {tool.name}
          </h3>
          <p className="mt-3 max-h-[5.4rem] overflow-hidden text-[0.98rem] leading-[1.36] text-[#F6F6F6]" style={serifStyle}>
            {tool.description?.trim() ||
              tool.whoIsItFor?.trim() ||
              "Herramienta guardada dentro de esta coleccion."}
          </p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-[0.78rem] leading-relaxed text-[#F6F6F6]" style={serifStyle}>
            {withSpanishAccents(tool.kind)}
            {primaryNiche ? ` / ${primaryNiche}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
};

const SavedResourceCard = ({
  folder,
  onOpen,
}: {
  folder: GuideFolderCard;
  onOpen: (folderId: string) => void;
}) => (
  <article
    role="button"
    tabIndex={0}
    onClick={() => onOpen(folder.id)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(folder.id);
      }
    }}
    className="group relative flex min-h-[236px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#060606] p-5 transition-transform duration-300 hover:-translate-y-1"
  >
    <div className="flex items-start justify-between gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72">
        <FolderOpen className="h-5 w-5" />
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.24em] text-[#F6F6F6]" style={displayBoldStyle}>
        Recurso
      </span>
    </div>

    <div className="mt-8 flex-1">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#F6F6F6]" style={displayBoldStyle}>
        {guideKindLabelMap[folder.kind]}
      </p>
      <h3 className="mt-3 text-[1.3rem] leading-[1.05] text-[#F6F6F6]" style={serifBoldStyle}>
        {folder.title}
      </h3>
      <p className="mt-4 text-[1rem] leading-[1.42] text-[#F6F6F6]" style={serifStyle}>
        {folder.description}
      </p>
    </div>

    <div className="mt-6 border-t border-white/10 pt-4">
      <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[#F6F6F6]" style={displayBoldStyle}>
        Abrir carpeta
      </span>
    </div>
  </article>
);

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = usePublicUserProfile(username);
  const {
    tools,
    savedToolCreatedAtById,
    loading: toolsLoading,
    error: toolsError,
  } = useUserSavedTools(profile?.id);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);
  const [activeSavedFilter, setActiveSavedFilter] = useState<SavedFilterKey>("all");

  const isOwnProfile = Boolean(user && profile && user.id === profile.id);
  const savedGuideOwnerId = isOwnProfile ? user?.id : "__disabled__";
  const { savedFolderIds } = useSavedGuideFolders(savedGuideOwnerId);

  const displayName = profile?.full_name?.trim() || "Usuario Polarist";
  const firstName = displayName.split(/\s+/)[0] || "Usuario";
  const avatarInitials = getInitials(profile?.full_name);
  const profileMeta = [profile?.occupation?.trim(), profile?.country?.trim()].filter(Boolean);

  const orderedSavedTools = useMemo(() => {
    const nextTools = [...tools];

    nextTools.sort((leftTool, rightTool) => {
      const leftSavedAt = parseSavedTime(savedToolCreatedAtById[leftTool.name]);
      const rightSavedAt = parseSavedTime(savedToolCreatedAtById[rightTool.name]);
      return rightSavedAt - leftSavedAt;
    });

    return nextTools;
  }, [savedToolCreatedAtById, tools]);

  const orderedSavedGuideFolders = useMemo(() => {
    if (!isOwnProfile) {
      return [];
    }

    const foldersById = new Map(guideFoldersCatalog.map((folder) => [folder.id, folder]));

    return [...savedFolderIds]
      .reverse()
      .map((folderId) => foldersById.get(folderId))
      .filter((folder): folder is GuideFolderCard => Boolean(folder));
  }, [isOwnProfile, savedFolderIds]);

  const visibleTools = activeSavedFilter === "resources" ? [] : orderedSavedTools;
  const visibleResources = activeSavedFilter === "tools" ? [] : orderedSavedGuideFolders;

  const totalSavedEntries = orderedSavedTools.length + orderedSavedGuideFolders.length;
  const hasAnyVisibleContent = visibleTools.length > 0 || visibleResources.length > 0;

  if (openedFolderId) {
    return <FolderDetailView folderId={openedFolderId} onClose={() => setOpenedFolderId(null)} />;
  }

  if (!username) {
    return (
      <div className="flex min-h-fit items-center justify-center bg-[#010101] px-4 py-20">
        <p className="text-base text-[#F6F6F6]" style={serifStyle}>
          No encontramos ese perfil.
        </p>
      </div>
    );
  }

  if (!profileLoading && (!profile || profileError)) {
    return (
      <div className="min-h-fit bg-[#010101] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <EmptyState
            title="Perfil no disponible"
            description="No encontramos informacion publica para este usuario."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[102vh] bg-[#010101] px-4 pb-48 pt-6 md:px-8 md:pb-64 md:pt-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
        <header className="border-b border-white/10 pb-10">
          {profileLoading ? (
            <ProfileHeaderSkeleton />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-end">
              <div className="w-fit">
                <div className="flex h-[216px] w-[176px] items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.04] text-[#F6F6F6]">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "Perfil"}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : avatarInitials ? (
                    <span className="text-[2rem] tracking-[-0.04em]" style={displayBlackStyle}>
                      {avatarInitials}
                    </span>
                  ) : (
                    <User className="h-10 w-10 text-white/54" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h1
                  className="text-[clamp(2.2rem,6vw,4rem)] leading-[0.92] tracking-[-0.06em] text-[#F6F6F6]"
                  style={displayBlackStyle}
                >
                  Hola, {firstName}
                </h1>



                <div className="mt-7 flex flex-wrap items-center gap-6">
                  {savedFilterOptions.map((filterOption) => {
                    const isActive = filterOption.id === activeSavedFilter;
                    const count =
                      filterOption.id === "all" ?
                        totalSavedEntries
                      : filterOption.id === "tools" ?
                        orderedSavedTools.length
                      : orderedSavedGuideFolders.length;

                    return (
                      <button
                        key={filterOption.id}
                        type="button"
                        onClick={() => setActiveSavedFilter(filterOption.id)}
                        className={cn(
                          "border-b pb-2 text-left text-sm tracking-[0.02em] transition-colors",
                          isActive ?
                            "border-[#F6F6F6] text-[#F6F6F6]"
                          : "border-transparent text-[#F6F6F6] opacity-60 hover:opacity-100",
                        )}
                        style={
                          isActive ? displayBoldStyle : { fontFamily: "var(--font-sequel, sans-serif)", fontWeight: 400 }
                        }
                      >
                        {filterOption.label}
                        <span className="ml-2 text-[#F6F6F6]" style={serifStyle}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </header>

        <section className="flex flex-col gap-8">
          <div>
            <h2 
              style={{ 
                fontFamily: "var(--font-sequel, sans-serif)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: "1",
                letterSpacing: "-0.04em",
                color: "#F6F6F6"
              }}
            >
              Últimas cosas guardadas
            </h2>
          </div>

          {profileLoading ? (
            <>
              {activeSavedFilter !== "resources" ? <ToolPosterSkeleton /> : null}
              {activeSavedFilter !== "tools" ? <ResourceGridSkeleton /> : null}
            </>
          ) : (
            <>
              {activeSavedFilter !== "resources" ? (
                toolsLoading ? (
                  <ToolPosterSkeleton />
                ) : toolsError ? (
                  activeSavedFilter === "tools" || !hasAnyVisibleContent ? (
                    <EmptyState
                      title="No pudimos cargar las herramientas guardadas"
                      description="Intenta de nuevo en unos segundos."
                    />
                  ) : null
                ) : visibleTools.length > 0 ? (
                  <div className="space-y-5">
                    {activeSavedFilter === "all" ? (
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[1.15rem] text-[#F6F6F6]" style={displayBoldStyle}>
                          Herramientas guardadas
                        </h3>
                        <span className="text-sm text-[#F6F6F6]" style={serifStyle}>
                          {visibleTools.length}
                        </span>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {visibleTools.map((tool) => (
                        <SavedToolPoster key={tool.name} tool={tool} onSelect={setSelectedTool} />
                      ))}
                    </div>
                  </div>
                ) : activeSavedFilter === "tools" ? (
                  <EmptyState
                    title={isOwnProfile ? "Todavia no guardaste herramientas" : "Este perfil no tiene herramientas visibles"}
                    description={
                      isOwnProfile ?
                        "Guarda herramientas desde el catalogo para construir tu galeria privada."
                      : ""
                    }
                    cta={
                      isOwnProfile ? (
                        <Link
                          to={routes.appTools}
                          className="inline-flex border-b border-white/16 pb-1 text-sm text-[#F6F6F6] transition-colors hover:border-white/28 hover:text-white"
                          style={displayBoldStyle}
                        >
                          Explorar herramientas
                        </Link>
                      ) : null
                    }
                  />
                ) : null
              ) : null}

              {activeSavedFilter !== "tools" ? (
                visibleResources.length > 0 ? (
                  <div className="space-y-5">
                    {activeSavedFilter === "all" ? (
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[1.15rem] text-[#F6F6F6]" style={displayBoldStyle}>
                          Recursos guardados
                        </h3>
                        <span className="text-sm text-[#F6F6F6]" style={serifStyle}>
                          {visibleResources.length}
                        </span>
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {visibleResources.map((folder) => (
                        <SavedResourceCard key={folder.id} folder={folder} onOpen={setOpenedFolderId} />
                      ))}
                    </div>
                  </div>
                ) : activeSavedFilter === "resources" ? (
                  <EmptyState
                    title={isOwnProfile ? "Todavia no guardaste recursos" : "Este perfil no tiene recursos visibles"}
                    description={
                      isOwnProfile ?
                        "Las carpetas que guardes en Recursos apareceran en esta galeria."
                      : ""
                    }
                    cta={
                      isOwnProfile ? (
                        <Link
                          to={routes.appGuides}
                          className="inline-flex border-b border-white/16 pb-1 text-sm text-[#F6F6F6] transition-colors hover:border-white/28 hover:text-white"
                          style={displayBoldStyle}
                        >
                          Explorar recursos
                        </Link>
                      ) : null
                    }
                  />
                ) : null
              ) : null}

            </>
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

export default UserProfile;
