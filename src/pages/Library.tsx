import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, FolderOpen } from "lucide-react";

import { FolderDetailView } from "@/components/guides/FolderDetailView";
import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import NavHeader from "@/components/ui/nav-header";
import { ToolLogo } from "@/components/tools/ToolLogo";
import Modal from "@/components/ui/modal-drop";
import { AvatarPicker } from "@/components/ui/avatar-picker";
import { type GuideFolderCard, guideFoldersCatalog } from "@/data/guideFoldersCatalog";
import { useAuth } from "@/hooks/useAuth";
import { usePublicUserProfile } from "@/hooks/usePublicUserProfile";
import { useSavedGuideFolders } from "@/hooks/useSavedGuideFolders";
import { useUserEvents, type UserEvent } from "@/hooks/useUserEvents";
import { useUserSavedTools } from "@/hooks/useUserSavedTools";
import { type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

type SavedFilterKey = "all" | "tools" | "resources" | "events";

const savedFilterOptions: Array<{ id: SavedFilterKey; label: string }> = [
  { id: "all", label: "Todo" },
  { id: "tools", label: "Herramientas" },
  { id: "resources", label: "Recursos" },
  { id: "events", label: "Eventos" },
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

const savedFilterHeadingMap: Record<SavedFilterKey, string> = {
  all: "Todo",
  tools: "Herramientas",
  resources: "Recursos",
  events: "Eventos",
};

const displayBlackStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
} as const;

const displayBoldStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
} as const;

const sequelRegularStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 400,
} as const;

const sequelMediumStyle = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 600,
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

const eventDateFormatter = new Intl.DateTimeFormat("es-UY", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const eventTimeFormatter = new Intl.DateTimeFormat("es-UY", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatEventDateLabel = (value?: string | null) => {
  const timestamp = parseSavedTime(value ?? undefined);

  if (!timestamp) {
    return "Fecha por confirmar";
  }

  return eventDateFormatter.format(new Date(timestamp));
};

const formatEventTimeLabel = (value?: string | null) => {
  const timestamp = parseSavedTime(value ?? undefined);

  if (!timestamp) {
    return "Hora por confirmar";
  }

  return `${eventTimeFormatter.format(new Date(timestamp))} Hs`;
};

const buildCancelledEventsStorageKey = (userId?: string, email?: string) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!userId && !normalizedEmail) {
    return null;
  }

  return `polarist-cancelled-events:${userId ?? "anon"}:${normalizedEmail ?? "no-email"}`;
};

const getCancelledEventKeys = (event: UserEvent) =>
  [`registration:${event.registrationId}`];

const ProfileHeaderSkeleton = () => (
  <div className="w-full md:inline-block md:min-w-[980px] md:max-w-fit overflow-hidden rounded-[32px] border border-black/10 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:px-8">
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1.2fr)] lg:items-center">
      <div className="flex justify-center lg:justify-start">
        <div className="h-[190px] w-[190px] animate-pulse rounded-[28px] bg-black/[0.05]" />
      </div>

      <div className="space-y-5">
        <div className="h-20 w-72 animate-pulse rounded-[28px] bg-black/[0.05]" />
        <div className="h-6 w-full max-w-[520px] animate-pulse rounded-full bg-black/[0.05]" />
        <div className="h-5 w-full max-w-[440px] animate-pulse rounded-full bg-black/[0.04]" />
        <div className="flex gap-4 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-8 w-28 animate-pulse rounded-full bg-black/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ToolPosterSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-[332px] animate-pulse rounded-[24px] bg-white/[0.04]"
      />
    ))}
  </div>
);

const ToolCarouselSkeleton = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <div className="h-8 w-52 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="hidden gap-2 sm:flex">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
    </div>

    <div className="scrollbar-hide flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[372px] w-[220px] animate-pulse rounded-[28px] bg-white/[0.04] sm:w-[248px]"
        />
      ))}
    </div>
  </div>
);

const ResourceCarouselSkeleton = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <div className="h-8 w-40 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="hidden gap-2 sm:flex">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
    </div>

    <div className="scrollbar-hide flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[236px] w-[280px] animate-pulse rounded-[24px] bg-white/[0.04]"
        />
      ))}
    </div>
  </div>
);

const EventCarouselSkeleton = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <div className="h-8 w-44 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="hidden gap-2 sm:flex">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
    </div>

    <div className="scrollbar-hide flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[268px] w-[286px] animate-pulse rounded-[24px] bg-white/[0.04] sm:w-[320px]"
        />
      ))}
    </div>
  </div>
);

const ResourceGridSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="h-[236px] animate-pulse rounded-[24px] bg-white/[0.04]"
      />
    ))}
  </div>
);

const EventGridSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="h-[296px] animate-pulse rounded-[24px] bg-white/[0.04]"
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
  <div className="rounded-[24px] bg-white/[0.03] px-5 py-10 text-center md:px-7">
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
}) => (
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
    className="group relative flex min-h-[372px] w-[220px] flex-shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(0,0,0,0.12)] sm:w-[248px]"
  >
    <div className="pointer-events-none absolute inset-x-0 -top-3 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_18%,rgba(0,0,0,0)_34%,rgba(0,0,0,0.01)_58%,rgba(0,0,0,0.04)_100%)]" />

    <div className="relative flex flex-1 flex-col p-3">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[22px] px-5 py-6">
        <ToolLogo
          name={tool.name}
          logoFilename={tool.logoFilename}
          className="h-[112px] w-[112px] rounded-[24px] bg-white transition-transform duration-300 group-hover:scale-[1.03] sm:h-[120px] sm:w-[120px]"
          imageClassName="p-2.5"
        />
      </div>

      <div className="mt-2.5 space-y-2.5 px-4 pb-4">
        <div className="space-y-2">
          <h3 className="text-[1.18rem] leading-[1.02] text-[#010101] sm:text-[1.24rem]" style={displayBoldStyle}>
            {tool.name}
          </h3>
          <p className="line-clamp-3 min-h-[3.75rem] text-[0.88rem] leading-[1.34] text-[#010101]/80 sm:text-[0.9rem]" style={sequelRegularStyle}>
            {tool.description?.trim() ||
              tool.whoIsItFor?.trim() ||
              "Herramienta guardada dentro de esta coleccion."}
          </p>
        </div>

        <div className="border-t border-black/5 pt-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#010101]/60" style={displayBoldStyle}>
            Tipo
          </p>
          <p className="mt-1 text-[0.78rem] leading-relaxed text-[#010101]" style={sequelRegularStyle}>
            {withSpanishAccents(tool.kind)}
          </p>
        </div>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] border-2 border-white/30" />
  </article>
);

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
    className="group relative flex min-h-[236px] w-[280px] flex-shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-[24px] bg-[#060606] p-5 transition-transform duration-300 hover:-translate-y-1 sm:w-[320px]"
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

    <div className="mt-6 pt-4">
      <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[#F6F6F6]" style={displayBoldStyle}>
        Abrir carpeta
      </span>
    </div>
  </article>
);

const SavedEventCard = ({
  event,
  canCancel,
  isCancelling,
  onCancel,
}: {
  event: UserEvent;
  canCancel: boolean;
  isCancelling: boolean;
  onCancel?: (event: UserEvent) => void;
}) => {
  const title = event.title?.trim() || "Evento de comunidad";
  const dateLabel = formatEventDateLabel(event.eventDate);
  const timeLabel = formatEventTimeLabel(event.eventDate);

  return (
    <article className="group relative flex min-h-[268px] w-[286px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] sm:w-[320px]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%]" />
      <div className="relative overflow-hidden rounded-t-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={title}
            className="h-[168px] w-full object-cover"
          />
        ) : (
          <div className="h-[168px] w-full bg-[radial-gradient(circle_at_top,rgba(202,254,91,0.22),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="max-w-[16rem] text-[1.08rem] leading-[1.06] text-white" style={serifBoldStyle}>
            {title}
          </h3>
        </div>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col px-4 pb-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[#010101]">
            <span className="flex shrink-0 items-center justify-center text-black/60">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#010101]/60" style={displayBoldStyle}>
                Fecha real
              </p>
              <p className="mt-1 text-[0.9rem] leading-[1.32] text-[#010101]" style={sequelMediumStyle}>
                {dateLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#010101]">
            <span className="flex shrink-0 items-center justify-center text-black/60">
              <Clock3 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#010101]/60" style={displayBoldStyle}>
                Hora
              </p>
              <p className="mt-1 text-[0.9rem] leading-[1.32] text-[#010101]" style={sequelMediumStyle}>
                {timeLabel}
              </p>
            </div>
          </div>
        </div>

        {canCancel ? (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                onCancel?.(event);
              }}
              onKeyDown={(keyEvent) => keyEvent.stopPropagation()}
              className="inline-flex items-center bg-transparent px-0 py-0 text-[0.72rem] font-bold text-red-500 transition-colors duration-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelando..." : "Cancelar evento"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 rounded-[24px] border-2 border-white/30" />
    </article>
  );
};

const Library = () => {
  const { username: urlUsername } = useParams<{ username: string }>();
  const { user, profile: authProfile } = useAuth();
  
  // Si no hay username en la URL, intentamos usar el del perfil autenticado
  const username = urlUsername || authProfile?.username;
  
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
  const toolsScrollRef = useRef<HTMLDivElement>(null);
  const resourcesScrollRef = useRef<HTMLDivElement>(null);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollToolsLeft, setCanScrollToolsLeft] = useState(false);
  const [canScrollToolsRight, setCanScrollToolsRight] = useState(false);
  const [canScrollResourcesLeft, setCanScrollResourcesLeft] = useState(false);
  const [canScrollResourcesRight, setCanScrollResourcesRight] = useState(false);
  const [canScrollEventsLeft, setCanScrollEventsLeft] = useState(false);
  const [canScrollEventsRight, setCanScrollEventsRight] = useState(false);
  const [cancelledEventKeys, setCancelledEventKeys] = useState<string[]>([]);
  const [eventToCancel, setEventToCancel] = useState<UserEvent | null>(null);
  const [hasLoadedCancelledEvents, setHasLoadedCancelledEvents] = useState(false);

  const isOwnProfile = Boolean(user && profile && user.id === profile.id);
  const profileEmail =
    profile?.email?.trim() || (isOwnProfile ? user?.email?.trim() : undefined);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    cancelEventRegistration,
    isCancellingEvent,
  } = useUserEvents(profileEmail, profile?.id);
  const { savedFolderIds, loading: foldersLoading } = useSavedGuideFolders();

  const displayName = profile?.full_name?.trim() || "Usuario Polarist";
  const firstName = displayName.split(/\s+/)[0] || "Usuario";
  const cancelledEventsStorageKey = useMemo(
    () => buildCancelledEventsStorageKey(profile?.id, profileEmail),
    [profile?.id, profileEmail],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !cancelledEventsStorageKey) {
      setCancelledEventKeys([]);
      setHasLoadedCancelledEvents(false);
      return;
    }

    try {
      const storedValue = window.localStorage.getItem(cancelledEventsStorageKey);
      if (!storedValue) {
        setCancelledEventKeys([]);
        setHasLoadedCancelledEvents(true);
        return;
      }

      const parsed = JSON.parse(storedValue);
      setCancelledEventKeys(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []);
    } catch {
      setCancelledEventKeys([]);
    }

    setHasLoadedCancelledEvents(true);
  }, [cancelledEventsStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !cancelledEventsStorageKey || !hasLoadedCancelledEvents) {
      return;
    }

    window.localStorage.setItem(
      cancelledEventsStorageKey,
      JSON.stringify(cancelledEventKeys),
    );
  }, [cancelledEventKeys, cancelledEventsStorageKey, hasLoadedCancelledEvents]);
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

  const orderedUserEvents = useMemo(() => {
    const nextEvents = [...events];

    nextEvents.sort((leftEvent, rightEvent) => {
      const leftTimestamp = parseSavedTime(leftEvent.eventDate ?? leftEvent.registeredAt);
      const rightTimestamp = parseSavedTime(rightEvent.eventDate ?? rightEvent.registeredAt);
      return leftTimestamp - rightTimestamp;
    });

    return nextEvents;
  }, [events]);

  const visibleRegisteredEvents = useMemo(
    () =>
      orderedUserEvents.filter(
        (event) => !getCancelledEventKeys(event).some((key) => cancelledEventKeys.includes(key)),
      ),
    [cancelledEventKeys, orderedUserEvents],
  );

  const showToolsSection = activeSavedFilter === "all" || activeSavedFilter === "tools";
  const showResourcesSection = activeSavedFilter === "all" || activeSavedFilter === "resources";
  const showEventsSection = activeSavedFilter === "all" || activeSavedFilter === "events";

  const visibleTools = showToolsSection ? orderedSavedTools : [];
  const visibleResources = showResourcesSection ? orderedSavedGuideFolders : [];
  const visibleEvents = showEventsSection ? visibleRegisteredEvents : [];

  const handleCancelEvent = useCallback((event: UserEvent) => {
    setEventToCancel(event);
  }, []);

  const confirmCancelEvent = useCallback(
    async (event: UserEvent) => {
      setEventToCancel(null);
      const eventKeys = getCancelledEventKeys(event);

      setCancelledEventKeys((current) =>
        Array.from(new Set([...current, ...eventKeys])),
      );

      try {
        await cancelEventRegistration(event.registrationId);
      } catch (error) {
        console.error("No pudimos cancelar el evento en Supabase:", error);
      }
    },
    [cancelEventRegistration],
  );

  const totalSavedEntries = orderedSavedTools.length + orderedSavedGuideFolders.length + visibleRegisteredEvents.length;
  const hasAnyVisibleContent =
    visibleTools.length > 0 || visibleResources.length > 0 || visibleEvents.length > 0;

  const isDataLoading = profileLoading || toolsLoading || eventsLoading || foldersLoading;

  const savedFilterCounts: Record<SavedFilterKey, number> = {
    all: totalSavedEntries,
    tools: orderedSavedTools.length,
    resources: orderedSavedGuideFolders.length,
    events: visibleRegisteredEvents.length,
  };
  const savedFilterItems = savedFilterOptions.map((filterOption) => ({
    id: filterOption.id,
    label: filterOption.label,
    meta: !isDataLoading ? savedFilterCounts[filterOption.id] : undefined,
  }));
  const activeSavedFilterHeading = savedFilterHeadingMap[activeSavedFilter];

  const checkToolsScrollability = useCallback(() => {
    const container = toolsScrollRef.current;

    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollToolsLeft(scrollLeft > 4);
    setCanScrollToolsRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const container = toolsScrollRef.current;

    if (!container) {
      return;
    }

    checkToolsScrollability();
    container.addEventListener("scroll", checkToolsScrollability);
    window.addEventListener("resize", checkToolsScrollability);

    return () => {
      container.removeEventListener("scroll", checkToolsScrollability);
      window.removeEventListener("resize", checkToolsScrollability);
    };
  }, [checkToolsScrollability, visibleTools.length]);

  const scrollTools = (direction: "left" | "right") => {
    const container = toolsScrollRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.82;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    window.setTimeout(checkToolsScrollability, 320);
  };

  const checkResourcesScrollability = useCallback(() => {
    const container = resourcesScrollRef.current;

    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollResourcesLeft(scrollLeft > 4);
    setCanScrollResourcesRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const container = resourcesScrollRef.current;

    if (!container) {
      return;
    }

    checkResourcesScrollability();
    container.addEventListener("scroll", checkResourcesScrollability);
    window.addEventListener("resize", checkResourcesScrollability);

    return () => {
      container.removeEventListener("scroll", checkResourcesScrollability);
      window.removeEventListener("resize", checkResourcesScrollability);
    };
  }, [checkResourcesScrollability, visibleResources.length]);

  const scrollResources = (direction: "left" | "right") => {
    const container = resourcesScrollRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.82;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    window.setTimeout(checkResourcesScrollability, 320);
  };

  const checkEventsScrollability = useCallback(() => {
    const container = eventsScrollRef.current;

    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollEventsLeft(scrollLeft > 4);
    setCanScrollEventsRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const container = eventsScrollRef.current;

    if (!container) {
      return;
    }

    checkEventsScrollability();
    container.addEventListener("scroll", checkEventsScrollability);
    window.addEventListener("resize", checkEventsScrollability);

    return () => {
      container.removeEventListener("scroll", checkEventsScrollability);
      window.removeEventListener("resize", checkEventsScrollability);
    };
  }, [checkEventsScrollability, visibleEvents.length]);

  const scrollEvents = (direction: "left" | "right") => {
    const container = eventsScrollRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.82;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    window.setTimeout(checkEventsScrollability, 320);
  };

  if (openedFolderId) {
    return <FolderDetailView folderId={openedFolderId} onClose={() => setOpenedFolderId(null)} />;
  }

  if (!username && !profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#010101] px-4 py-20">
        <div className="text-center">
          <p className="text-base text-[#F6F6F6]" style={serifStyle}>
            Para ver tu biblioteca, necesitas configurar un nombre de usuario.
          </p>
          <Link 
            to={routes.appSettings}
            className="mt-4 inline-block text-[#CAFE5B] underline"
            style={displayBoldStyle}
          >
            Ir a configuración
          </Link>
        </div>
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
        <header className="pb-10">
          {profileLoading ? (
            <ProfileHeaderSkeleton />
          ) : (
            <div className="w-full md:inline-block md:min-w-[980px] md:max-w-fit overflow-hidden rounded-[32px] border border-black/10 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:px-8">
              <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1.2fr)] lg:items-end">
                <div className="flex justify-center lg:justify-start">
                  {profile?.avatar_url ? (
                    <div className="mx-auto lg:mx-0 h-[190px] w-[190px] overflow-hidden rounded-[26px]">
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || "Perfil"}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[340px]">
                      <AvatarPicker
                        title="Sin foto todavía"
                        subtitle="Podés usar este efecto mientras no tengas avatar cargado."
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 text-center lg:text-left lg:-ml-8 lg:self-end">
                  <h1
                    className="text-[clamp(2.5rem,4.8vw,3.8rem)] leading-[0.9] tracking-[-0.07em] text-[#010101]"
                    style={displayBlackStyle}
                  >
                    Biblioteca
                  </h1>

                  <div className={cn("mt-8 flex justify-center lg:justify-start w-full transition-opacity duration-300", isDataLoading ? "opacity-0" : "opacity-100")}>
                    <NavHeader
                      activeId={activeSavedFilter}
                      items={savedFilterItems}
                      onChange={(id) => setActiveSavedFilter(id as SavedFilterKey)}
                      className="border-black/8 bg-[#f1f1f1] p-1.5 mx-auto lg:mx-0"
                      itemClassName="px-2.5 py-1.5 text-[0.75rem] sm:text-[0.8rem] md:px-4 md:py-2 md:text-[0.95rem]"
                      cursorClassName="bg-white"
                    />
                  </div>
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
              {activeSavedFilterHeading}
            </h2>
          </div>

          {profileLoading ? (
            <>
              {showToolsSection ? <ToolCarouselSkeleton /> : null}
              {showResourcesSection ? <ResourceCarouselSkeleton /> : null}
              {showEventsSection ? <EventCarouselSkeleton /> : null}
            </>
          ) : (
            <>
              {activeSavedFilter === "all" && !hasAnyVisibleContent && !toolsLoading && !eventsLoading && !toolsError && !eventsError ? (
                <EmptyState
                  title={isOwnProfile ? "Todavia no guardaste nada" : "Este perfil no tiene elementos visibles"}
                  description=""
                />
              ) : null}

              {showToolsSection ? (
                toolsLoading ? (
                  <ToolCarouselSkeleton />
                ) : toolsError ? (
                  activeSavedFilter === "tools" || !hasAnyVisibleContent ? (
                    <EmptyState
                      title="No pudimos cargar las herramientas guardadas"
                      description="Intenta de nuevo en unos segundos."
                    />
                  ) : null
                ) : visibleTools.length > 0 ? (
                  <div className="space-y-5">
                    <div className={cn("flex items-center gap-4", activeSavedFilter === "all" ? "justify-between" : "justify-end")}>
                      {activeSavedFilter === "all" ? (
                        <div className="min-w-0">
                          <h3 className="text-[1.15rem] text-[#F6F6F6]" style={displayBoldStyle}>
                            Herramientas
                          </h3>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollTools("left")}
                          disabled={!canScrollToolsLeft}
                          aria-label="Ver herramientas anteriores"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollTools("right")}
                          disabled={!canScrollToolsRight}
                          aria-label="Ver siguientes herramientas"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={toolsScrollRef}
                      className="scrollbar-hide -mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-2 pb-2 scroll-smooth sm:gap-5"
                    >
                      {visibleTools.map((tool) => (
                        <SavedToolPoster key={tool.name} tool={tool} onSelect={setSelectedTool} />
                      ))}
                    </div>
                  </div>
                ) : activeSavedFilter === "tools" ? (
                  <EmptyState
                    title={isOwnProfile ? "Todavia no guardaste herramientas" : "Este perfil no tiene herramientas visibles"}
                    description=""
                  />
                ) : null
              ) : null}

              {showResourcesSection ? (
                visibleResources.length > 0 ? (
                  <div className="space-y-5">
                    <div className={cn("flex items-center gap-4", activeSavedFilter === "all" ? "justify-between" : "justify-end")}>
                      {activeSavedFilter === "all" ? (
                        <h3 className="text-[1.15rem] text-[#F6F6F6]" style={displayBoldStyle}>
                          Recursos
                        </h3>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollResources("left")}
                          disabled={!canScrollResourcesLeft}
                          aria-label="Ver recursos anteriores"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollResources("right")}
                          disabled={!canScrollResourcesRight}
                          aria-label="Ver siguientes recursos"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={resourcesScrollRef}
                      className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 scroll-smooth sm:gap-5"
                    >
                      {visibleResources.map((folder) => (
                        <SavedResourceCard key={folder.id} folder={folder} onOpen={setOpenedFolderId} />
                      ))}
                    </div>
                  </div>
                ) : activeSavedFilter === "resources" ? (
                  <EmptyState
                    title={isOwnProfile ? "Todavia no guardaste recursos" : "Este perfil no tiene recursos visibles"}
                    description=""
                  />
                ) : null
              ) : null}

              {showEventsSection ? (
                eventsLoading ? (
                  <EventCarouselSkeleton />
                ) : eventsError ? (
                  activeSavedFilter === "events" || !hasAnyVisibleContent ? (
                    <EmptyState
                      title="No pudimos cargar los eventos"
                      description="Intenta de nuevo en unos segundos."
                    />
                  ) : null
                ) : visibleEvents.length > 0 ? (
                  <div className="space-y-5">
                    <div className={cn("flex items-center gap-4", activeSavedFilter === "all" ? "justify-between" : "justify-end")}>
                      {activeSavedFilter === "all" ? (
                        <h3 className="text-[1.15rem] text-[#F6F6F6]" style={displayBoldStyle}>
                          Eventos
                        </h3>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollEvents("left")}
                          disabled={!canScrollEventsLeft}
                          aria-label="Ver eventos anteriores"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollEvents("right")}
                          disabled={!canScrollEventsRight}
                          aria-label="Ver siguientes eventos"
                          className="rounded-full border border-white/12 bg-white/[0.04] p-2 text-[#F6F6F6] transition-all duration-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={eventsScrollRef}
                      className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 scroll-smooth sm:gap-5"
                    >
                      {visibleEvents.map((event) => (
                        <SavedEventCard
                          key={event.registrationId}
                          event={event}
                          canCancel={isOwnProfile}
                          isCancelling={isCancellingEvent(event.registrationId)}
                          onCancel={handleCancelEvent}
                        />
                      ))}
                    </div>
                  </div>
                ) : activeSavedFilter === "events" ? (
                  <EmptyState
                    title={isOwnProfile ? "Todavia no tenes eventos programados" : "Este perfil no tiene eventos programados"}
                    description=""
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

      <Modal
        isOpen={!!eventToCancel}
        onClose={() => setEventToCancel(null)}
        type="blur"
        animationType="scale"
        disablePadding={true}
        className="bg-transparent border-0 shadow-none"
        showCloseButton={false}
      >
        <div className="flex w-[380px] max-w-full flex-col rounded-[2.2rem] border border-black/10 bg-white p-8 text-[#010101] shadow-2xl">
          <div className="text-center">
            {eventToCancel && (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#010101]/40" style={displayBoldStyle}>
                {formatEventDateLabel(eventToCancel.eventDate)}
              </p>
            )}
            <h2 className="mx-auto mt-4 max-w-[21rem] text-xl font-bold leading-tight" style={displayBoldStyle}>
              ¿Estás seguro que querés eliminar el evento?
            </h2>
            {eventToCancel && (
              <p className="mt-3 text-sm text-[#010101]/60" style={sequelRegularStyle}>
                {eventToCancel.title}
              </p>
            )}
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => eventToCancel && confirmCancelEvent(eventToCancel)}
              className="h-12 w-full rounded-2xl bg-[#ff0000] text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={displayBoldStyle}
            >
              Sí, eliminar
            </button>
            <button
              type="button"
              onClick={() => setEventToCancel(null)}
              className="h-12 w-full rounded-2xl bg-transparent text-sm font-bold text-[#010101]/60 transition-colors hover:bg-black/5"
              style={displayBoldStyle}
            >
              No, volver
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Library;
