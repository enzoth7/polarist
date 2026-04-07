import { type CSSProperties, type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  ChefHat,
  Heart,
  HeartPulse,
  ImagePlus,
  Landmark,
  Loader2,
  Megaphone,
  MessageCircleHeart,
  MessageSquare,
  MessagesSquare,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity, type CommunityFeedMode, type Post, type Reply } from "@/hooks/useCommunity";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const communityAreas = [
  {
    value: "general",
    label: "General",
    subtitle: "Dudas cruzadas y atajos para cualquier negocio",
    icon: MessageCircleHeart,
  },
  {
    value: "gastronomia",
    label: "Gastronomía",
    subtitle: "Reservas, cocina y servicio en movimiento",
    icon: ChefHat,
  },
  {
    value: "creadores",
    label: "Creadores",
    subtitle: "Contenido, ideas y piezas listas para publicar",
    icon: Sparkles,
  },
  {
    value: "agencias",
    label: "Agencias",
    subtitle: "Entrega más rápida y menos retrabajo",
    icon: Megaphone,
  },
  {
    value: "inmobiliarias",
    label: "Inmobiliarias",
    subtitle: "Seguimiento, visitas y respuestas repetidas",
    icon: Building2,
  },
  {
    value: "abogados",
    label: "Abogados",
    subtitle: "Consultas frecuentes y orden documental",
    icon: Landmark,
  },
  {
    value: "retail",
    label: "Retail",
    subtitle: "Ventas, catálogo y atención diaria",
    icon: ShoppingBag,
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    subtitle: "Tienda, campañas y conversiones",
    icon: BriefcaseBusiness,
  },
  {
    value: "freelancers",
    label: "Freelancers",
    subtitle: "Propuestas, entregas y tiempo mejor usado",
    icon: Users,
  },
  {
    value: "salud",
    label: "Salud",
    subtitle: "Turnos, seguimiento y comunicación clara",
    icon: HeartPulse,
  },
  {
    value: "coaches",
    label: "Coaches",
    subtitle: "Sesiones, seguimiento y materiales simples",
    icon: Stethoscope,
  },
] as const;

type CommunityAreaValue = (typeof communityAreas)[number]["value"];
type CommunityAreaDefinition = (typeof communityAreas)[number];

const communityFeedAreas = [
  {
    value: "all",
    label: "Todos",
    subtitle: "Todo el feed en una sola vista",
    icon: MessagesSquare,
  },
  ...communityAreas,
] as const;

type CommunityFeedAreaValue = (typeof communityFeedAreas)[number]["value"];
type CommunityFeedAreaDefinition = (typeof communityFeedAreas)[number];
type CommunityTopTab = CommunityFeedMode | "trending";
type CommunityTrendItem = CommunityAreaDefinition & {
  activityCount: number;
  postsCount: number;
  repliesCount: number;
};

const communityAreaMap = Object.fromEntries(
  communityAreas.map((area) => [area.value, area]),
) as Record<CommunityAreaValue, CommunityAreaDefinition>;

const communityFeedAreaMap = Object.fromEntries(
  communityFeedAreas.map((area) => [area.value, area]),
) as Record<CommunityFeedAreaValue, CommunityFeedAreaDefinition>;

const isCommunityAreaValue = (value: string): value is CommunityAreaValue => value in communityAreaMap;

const getInitialPostArea = (activeArea: CommunityFeedAreaValue): CommunityAreaValue =>
  activeArea === "all" ? "general" : activeArea;

const lineClampStyle = (lines: number): CSSProperties => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  overflow: "hidden",
});

const fetchReplyAuthorInitials = (name?: string | null) =>
  name?.trim().slice(0, 2).toUpperCase() || "PU";

const CommunityUserAvatar = ({
  src,
  name,
  className,
  fallbackClassName,
}: {
  src?: string | null;
  name?: string | null;
  className: string;
  fallbackClassName?: string;
}) => {
  const normalizedSrc = src?.trim() || "";
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">(
    normalizedSrc ? "loading" : "error",
  );

  useEffect(() => {
    setImageStatus(normalizedSrc ? "loading" : "error");
  }, [normalizedSrc]);

  return (
    <Avatar className={`${className} bg-muted/40`}>
      {normalizedSrc ? (
        <AvatarImage
          src={normalizedSrc}
          className="object-cover"
          onLoadingStatusChange={(status) => {
            if (status === "loaded") {
              setImageStatus("loaded");
            } else if (status === "error") {
              setImageStatus("error");
            }
          }}
        />
      ) : null}
      {imageStatus === "error" ? (
        <AvatarFallback className={fallbackClassName}>
          {fetchReplyAuthorInitials(name)}
        </AvatarFallback>
      ) : null}
    </Avatar>
  );
};

const getUserProfileHref = (username?: string | null) =>
  username?.trim() ? getAppUserProfileRoute(username.trim()) : routes.appProfile;

const showVisitorAuthToast = (action: string) => {
  toast("Inicia sesión para participar", {
    description: `Necesitas entrar con tu cuenta para ${action}.`,
  });
};

const getTrendSummary = (item: Pick<CommunityTrendItem, "activityCount" | "postsCount" | "repliesCount">) => {
  if (item.postsCount > 0 && item.repliesCount > 0) {
    return `${item.activityCount} movimientos en las últimas 48h`;
  }

  if (item.postsCount > 0) {
    return `${item.postsCount} publicaciones recientes`;
  }

  return `${item.repliesCount} respuestas recientes`;
};

const CommunityTrendsList = ({
  items,
  onSelect,
}: {
  items: CommunityTrendItem[];
  onSelect?: (value: CommunityAreaValue) => void;
}) => (
  <div className="divide-y divide-border/50">
    {items.map((item) => {
      const Icon = item.icon;

      return (
        <button
          key={item.value}
          type="button"
          onClick={() => onSelect?.(item.value)}
          className="flex w-full items-start gap-3 py-3 text-left transition-colors first:pt-0 last:pb-0 hover:text-foreground"
        >
          <span className="rounded-xl border border-border/50 bg-muted/30 p-2 text-foreground">
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">{item.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {getTrendSummary(item)}
            </span>
          </span>
        </button>
      );
    })}
  </div>
);

const NewPostDialog = ({
  open,
  onOpenChange,
  activeArea,
  onCategoryChange,
  createPost,
  refreshPosts,
  onPostCreated,
  hideTrigger = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeArea: CommunityFeedAreaValue;
  onCategoryChange: (value: CommunityFeedAreaValue) => void;
  createPost: (title: string, content: string, category: string, imageFile?: File | null) => Promise<unknown>;
  refreshPosts: () => Promise<void>;
  onPostCreated?: () => void;
  hideTrigger?: boolean;
}) => {
  const { status, loginAsGoogle } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommunityAreaValue>(getInitialPostArea(activeArea));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory(getInitialPostArea(activeArea));
    setImageFile(null);
    setImagePreviewUrl("");
  };

  useEffect(() => {
    if (open) {
      setCategory(getInitialPostArea(activeArea));
    }
  }, [activeArea, open]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setImageFile(nextFile);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async () => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const fallbackTitle =
      cleanContent.split("\n").find((line) => line.trim())?.trim().slice(0, 80) || "Nueva publicación";
    const nextTitle = cleanTitle || fallbackTitle;

    if (!cleanContent) {
      toast.error("Escribe un mensaje antes de publicar.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(nextTitle, cleanContent, category, imageFile);

      const nextFeedArea = activeArea === "all" ? "all" : category;

      onCategoryChange(nextFeedArea);

      if (nextFeedArea === "all" || category === activeArea) {
        await refreshPosts();
      }

      onPostCreated?.();
      toast.success("Tu pregunta ya quedó publicada.");
      handleDialogChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos publicar tu pregunta.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {!hideTrigger ? (
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full px-7 shadow-soft">
            <PlusCircle className="mr-2 h-5 w-5" />
            Hacer una pregunta
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="overflow-hidden rounded-[1.6rem] border-border/60 bg-background/95 p-0 shadow-soft backdrop-blur-xl sm:max-w-[500px]">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <Select value={category} onValueChange={(value) => setCategory(value as CommunityAreaValue)}>
              <SelectTrigger className="h-9 w-fit min-w-[170px] rounded-full border-border/50 bg-muted/25 px-3 text-sm shadow-none">
                <SelectValue placeholder="Elige un nicho" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {communityAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value} className="rounded-xl">
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Titulo (opcional) o punto clave..."
              className="h-auto border-0 bg-transparent px-0 py-0 text-lg font-semibold shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />

            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escribe tu mensaje..."
              className="min-h-[140px] resize-none border-0 bg-transparent px-0 py-0 text-sm leading-7 shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />

            {imagePreviewUrl ? (
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                  <img
                    src={imagePreviewUrl}
                    alt="Previsualizacion de la imagen seleccionada"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
                    aria-label="Quitar imagen"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-3">
            <div className="flex items-center gap-2">
              <input
                id="community-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button asChild type="button" variant="ghost" className="rounded-full px-3 text-muted-foreground">
                <label htmlFor="community-image-upload" className="cursor-pointer">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {imageFile ? "Cambiar foto" : "Subir foto"}
                </label>
              </Button>
            </div>

            {status === "authenticated" ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="rounded-full px-5 shadow-none"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Publicar
              </Button>
            ) : (
              <Button onClick={loginAsGoogle} className="rounded-full px-5 shadow-none">
                Continuar con Google
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommunityAreaButton = ({
  area,
  active,
  layout,
  onClick,
}: {
  area: CommunityFeedAreaDefinition;
  active: boolean;
  layout: "mobile" | "desktop";
  onClick: () => void;
}) => {
  const Icon = area.icon;

  if (layout === "desktop") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
          active ? "bg-muted/60 text-foreground" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        }`}
      >
        <span className={`mt-0.5 rounded-xl p-2 ${active ? "bg-background text-foreground" : "bg-muted/50 text-muted-foreground"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium">{area.label}</span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            {area.subtitle}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{area.label}</span>
    </button>
  );
};

export const PostCard = ({
  post,
  onReplyCreated,
  toggleLike,
}: {
  post: Post;
  onReplyCreated: () => void | Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
}) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyRefreshKey, setReplyRefreshKey] = useState(0);
  const [newReply, setNewReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isReplyComposerOpen, setIsReplyComposerOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const { status } = useAuth();
  const { createReply } = useCommunity({ enabled: false });
  const categoryLabel =
    communityAreaMap[post.category as CommunityAreaValue]?.label ?? post.category;

  useEffect(() => {
    setIsLiked(post.is_liked);
    setLikesCount(post.likes_count);
  }, [post.is_liked, post.likes_count]);

  useEffect(() => {
    let isActive = true;

    const loadReplies = async () => {
      try {
        const { data, error } = await supabase
          .from("community_replies")
          .select(
            `
              *,
              author:user_id (
                full_name,
                username,
                avatar_url
              )
            `,
          )
          .eq("post_id", post.id)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        if (isActive) {
          setReplies(data || []);
        }
      } catch {
        if (isActive) {
          toast.error("No pudimos cargar las respuestas.");
        }
      }
    };

    void loadReplies();

    return () => {
      isActive = false;
    };
  }, [post.id, replyRefreshKey]);

  const handleReply = async () => {
    const cleanReply = newReply.trim();
    if (!cleanReply) return;

    try {
      setIsSubmittingReply(true);
      await createReply(post.id, cleanReply);
      setNewReply("");
      setIsReplyComposerOpen(false);
      setReplyRefreshKey((current) => current + 1);
      await onReplyCreated();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos enviar la respuesta.";
      toast.error(message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = async () => {
    if (status !== "authenticated") {
      showVisitorAuthToast("dar me gusta");
      return;
    }

    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikesCount((prev) => (nextIsLiked ? prev + 1 : prev - 1));

    try {
      await toggleLike(post.id);
    } catch {
      setIsLiked(!nextIsLiked);
      setLikesCount((prev) => (!nextIsLiked ? prev + 1 : prev - 1));
      toast.error("No pudimos guardar tu me gusta.");
    }
  };

  return (
    <article className="border-b border-border/60 px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <Link to={getUserProfileHref(post.author?.username)} className="shrink-0">
          <CommunityUserAvatar
            src={post.author?.avatar_url}
            name={post.author?.full_name}
            className="h-9 w-9 border border-border/50 transition-opacity hover:opacity-90"
            fallbackClassName="bg-muted text-xs font-bold text-foreground"
          />
        </Link>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] sm:text-sm">
            <Link
              to={getUserProfileHref(post.author?.username)}
              className="truncate font-semibold text-foreground transition hover:underline"
            >
              {post.author?.full_name || "Usuario Polarist"}
            </Link>
            <span className="text-muted-foreground">&bull;</span>
            <p className="text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
            </p>
            <Badge
              variant="outline"
              className="h-5 rounded-full border-border/60 px-2 text-[10px] font-medium text-muted-foreground"
            >
              {categoryLabel}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3
              className="text-[15px] font-semibold leading-5 text-foreground sm:text-[16px]"
              style={lineClampStyle(2)}
            >
              {post.title}
            </h3>
            <p
              className="text-[13px] leading-5 text-foreground/85 whitespace-pre-line sm:text-sm sm:leading-6"
              style={lineClampStyle(post.image_url ? 3 : 4)}
            >
              {post.content}
            </p>
          </div>

          {post.image_url ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-zoom-in overflow-hidden rounded-[1.1rem] border border-border/50 bg-muted/20 transition-opacity hover:opacity-90">
                  <div className="aspect-[16/10]">
                    <img
                      src={post.image_url}
                      alt={`Imagen adjunta en ${post.title}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none md:max-w-4xl">
                <DialogTitle className="sr-only">Ver imagen</DialogTitle>
                <img
                  src={post.image_url}
                  alt={`Visor de ${post.title}`}
                  className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
                />
              </DialogContent>
            </Dialog>
          ) : null}

          <div className="flex items-center justify-end gap-1 pt-0.5">
            {status === "authenticated" ? (
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground ${
                  isReplyComposerOpen ? "bg-muted/50 text-foreground" : ""
                }`}
                aria-label={isReplyComposerOpen ? "Cerrar respuesta" : "Responder"}
                title={isReplyComposerOpen ? "Cerrar respuesta" : "Responder"}
                onClick={() => setIsReplyComposerOpen((current) => !current)}
              >
                <MessageSquare className="h-[18px] w-[18px]" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-label="Responder"
                title="Responder"
                onClick={() => showVisitorAuthToast("responder")}
              >
                <MessageSquare className="h-[18px] w-[18px]" />
              </Button>
            )}

            <div className="flex items-center gap-0.5">
              {likesCount > 0 && (
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {likesCount}
                </span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full transition-colors hover:bg-muted/50 ${
                  isLiked ? "bg-muted/50 text-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={isLiked ? "Quitar me gusta" : "Dar me gusta"}
                title={isLiked ? "Quitar me gusta" : "Dar me gusta"}
                aria-pressed={isLiked}
                onClick={handleLike}
              >
                <Heart className={`h-[18px] w-[18px] ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {replies.length > 0 || isReplyComposerOpen ? (
            <div className="space-y-3 border-t border-border/50 pt-3">
              {replies.length > 0 ? (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Link to={getUserProfileHref(reply.author?.username)} className="shrink-0">
                        <CommunityUserAvatar
                          src={reply.author?.avatar_url}
                          name={reply.author?.full_name}
                          className="h-7 w-7 transition-opacity hover:opacity-90"
                          fallbackClassName="text-[10px]"
                        />
                      </Link>
                      <div className="min-w-0 flex-1 border-l border-border/50 pl-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
                          <Link
                            to={getUserProfileHref(reply.author?.username)}
                            className="font-semibold text-foreground transition hover:underline"
                          >
                            {reply.author?.full_name || "Miembro"}
                          </Link>
                          <span className="text-muted-foreground">&bull;</span>
                          <p className="text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </p>
                        </div>
                        <p className="mt-1 text-[13px] leading-5 text-foreground/85 whitespace-pre-line sm:text-sm sm:leading-6">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {isReplyComposerOpen && status === "authenticated" ? (
                <div className="space-y-3">
                  <Textarea
                    value={newReply}
                    onChange={(event) => setNewReply(event.target.value)}
                    placeholder="Escribe una respuesta corta y util..."
                    className="min-h-[84px] rounded-[1.15rem] border-border/60 bg-background px-3.5 py-3 text-[13px] sm:text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleReply}
                      disabled={isSubmittingReply || !newReply.trim()}
                      className="rounded-full"
                    >
                      {isSubmittingReply ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Responder
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const Community = () => {
  const [activeArea, setActiveArea] = useState<CommunityFeedAreaValue>("all");
  const [activeTopTab, setActiveTopTab] = useState<CommunityTopTab>("for-you");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trendingAreas, setTrendingAreas] = useState<CommunityTrendItem[]>([]);
  const [trendsRefreshKey, setTrendsRefreshKey] = useState(0);
  const [isFeedVisible, setIsFeedVisible] = useState(true);
  const { status } = useAuth();
  const feedMode: CommunityFeedMode = activeTopTab === "recent" ? "recent" : "for-you";
  const {
    posts,
    loading,
    isLoadingMore,
    hasMore,
    createPost,
    refreshPosts,
    loadMorePosts,
    toggleLike,
  } = useCommunity({
    category: activeArea === "all" ? undefined : activeArea,
    mode: feedMode,
    pageSize: 15,
    enabled: activeTopTab !== "trending",
  });

  const activeAreaMeta = useMemo(() => communityFeedAreaMap[activeArea], [activeArea]);
  const hasTrendingAreas = trendingAreas.length > 0;
  const topTabs = useMemo(
    () =>
      [
        { value: "for-you", label: "Para ti" },
        { value: "recent", label: "Recientes" },
        ...(hasTrendingAreas ? [{ value: "trending", label: "Tendencias" }] : []),
      ] as Array<{ value: CommunityTopTab; label: string }>,
    [hasTrendingAreas],
  );
  const activeAreaDescription = activeArea === "all"
    ? activeTopTab === "for-you"
      ? "Cargando lo más relevante de toda la comunidad..."
      : "Cargando las publicaciones más recientes de toda la comunidad..."
    : activeTopTab === "for-you"
      ? `Cargando lo más relevante de ${activeAreaMeta.label.toLowerCase()}...`
      : `Cargando las publicaciones más recientes de ${activeAreaMeta.label.toLowerCase()}...`;
  const emptyTitle = activeArea === "all"
    ? activeTopTab === "for-you"
      ? "Aún no hay publicaciones destacadas en el feed"
      : "Aún no hay publicaciones recientes en el feed"
    : activeTopTab === "for-you"
      ? `Aún no hay publicaciones destacadas en ${activeAreaMeta.label}`
      : `Aún no hay publicaciones recientes en ${activeAreaMeta.label}`;
  const EmptyStateIcon = activeAreaMeta.icon;

  const handleTrendSelect = useCallback((value: CommunityAreaValue) => {
    setActiveArea(value);
    setActiveTopTab("for-you");
  }, []);

  const handleComposerOpen = useCallback(() => {
    if (status !== "authenticated") {
      showVisitorAuthToast("publicar en la comunidad");
      return;
    }

    setIsDialogOpen(true);
  }, [status]);

  const handleFeedActivity = useCallback(async () => {
    await refreshPosts();
    setTrendsRefreshKey((current) => current + 1);
  }, [refreshPosts]);

  useEffect(() => {
    if (activeTopTab === "trending" && !hasTrendingAreas) {
      setActiveTopTab("for-you");
    }
  }, [activeTopTab, hasTrendingAreas]);

  useEffect(() => {
    setIsFeedVisible(false);

    const timeout = window.setTimeout(() => {
      setIsFeedVisible(true);
    }, 70);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeArea, activeTopTab]);

  useEffect(() => {
    let isActive = true;

    const loadTrendingAreas = async () => {
      try {
        const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        const [
          { data: recentPosts, error: postsError },
          { data: recentReplies, error: repliesError },
        ] = await Promise.all([
          supabase
            .from("community_posts")
            .select("id, category")
            .gte("created_at", since),
          supabase
            .from("community_replies")
            .select("post_id")
            .gte("created_at", since),
        ]);

        if (postsError) {
          throw postsError;
        }

        if (repliesError) {
          throw repliesError;
        }

        const recentReplyPostIds = Array.from(
          new Set((recentReplies || []).map((reply) => reply.post_id).filter(Boolean)),
        );

        const replyPostCategories = new Map<string, CommunityAreaValue>();

        if (recentReplyPostIds.length > 0) {
          const { data: replyPosts, error: replyPostsError } = await supabase
            .from("community_posts")
            .select("id, category")
            .in("id", recentReplyPostIds);

          if (replyPostsError) {
            throw replyPostsError;
          }

          for (const replyPost of replyPosts || []) {
            if (isCommunityAreaValue(replyPost.category)) {
              replyPostCategories.set(replyPost.id, replyPost.category);
            }
          }
        }

        const trendCounts = new Map<
          CommunityAreaValue,
          { postsCount: number; repliesCount: number }
        >();

        const ensureTrendCount = (value: CommunityAreaValue) => {
          const current = trendCounts.get(value) ?? { postsCount: 0, repliesCount: 0 };
          trendCounts.set(value, current);
          return current;
        };

        for (const post of recentPosts || []) {
          if (!isCommunityAreaValue(post.category)) {
            continue;
          }

          ensureTrendCount(post.category).postsCount += 1;
        }

        for (const reply of recentReplies || []) {
          const nextCategory = replyPostCategories.get(reply.post_id);

          if (!nextCategory) {
            continue;
          }

          ensureTrendCount(nextCategory).repliesCount += 1;
        }

        const nextTrendingAreas = communityAreas
          .map((area) => {
            const counts = trendCounts.get(area.value) ?? { postsCount: 0, repliesCount: 0 };
            return {
              ...area,
              ...counts,
              activityCount: counts.postsCount + counts.repliesCount,
            };
          })
          .filter((area) => area.activityCount > 0)
          .sort((left, right) => {
            if (right.activityCount !== left.activityCount) {
              return right.activityCount - left.activityCount;
            }

            return right.postsCount - left.postsCount;
          })
          .slice(0, 6);

        if (isActive) {
          setTrendingAreas(nextTrendingAreas);
        }
      } catch (error) {
        if (isActive) {
          console.error("No pudimos cargar tendencias de comunidad:", error);
          setTrendingAreas([]);
        }
      }
    };

    void loadTrendingAreas();

    return () => {
      isActive = false;
    };
  }, [trendsRefreshKey]);

  return (
    <div className="min-h-full bg-background pb-24 md:pb-10">
      <NewPostDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        activeArea={activeArea}
        onCategoryChange={setActiveArea}
        createPost={createPost}
        refreshPosts={refreshPosts}
        onPostCreated={() => {
          setActiveTopTab("for-you");
          setTrendsRefreshKey((current) => current + 1);
        }}
        hideTrigger
      />

      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur md:hidden">
        <div className="overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {communityFeedAreas.map((area) => (
              <CommunityAreaButton
                key={area.value}
                area={area}
                active={activeArea === area.value}
                layout="mobile"
                onClick={() => setActiveArea(area.value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] md:grid md:grid-cols-[250px_minmax(0,600px)_300px] md:gap-6 md:px-6 md:pt-6">
        <aside className="hidden md:block">
          <div className="sticky top-6 space-y-4">
            <div className="px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Comunidad
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Timeline
              </p>
            </div>

            <div className="space-y-1">
              {communityFeedAreas.map((area) => (
                <CommunityAreaButton
                  key={area.value}
                  area={area}
                  active={activeArea === area.value}
                  layout="desktop"
                  onClick={() => setActiveArea(area.value)}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <section className="min-h-full bg-background md:border-x md:border-border/60">
            <div className="flex border-b border-border/60">
              {topTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={`flex-1 px-4 py-3 text-sm transition-colors ${
                    activeTopTab === tab.value
                      ? "border-b-2 border-foreground font-semibold text-foreground"
                      : "font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  } ${tab.value === "trending" ? "md:hidden" : ""}`}
                  onClick={() => setActiveTopTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`transition-opacity duration-200 ${isFeedVisible ? "opacity-100" : "opacity-0"}`}>
              {activeTopTab === "trending" ? (
                <div className="px-4 py-4 sm:px-5">
                  <CommunityTrendsList items={trendingAreas} onSelect={handleTrendSelect} />
                </div>
              ) : loading ? (
                <div className="flex min-h-[45vh] flex-col items-center justify-center px-6 py-16 text-center">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {activeAreaDescription}
                  </p>
                </div>
              ) : posts.length > 0 ? (
                <div>
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onReplyCreated={handleFeedActivity}
                      toggleLike={toggleLike}
                    />
                  ))}

                  {hasMore ? (
                    <div className="flex justify-center border-t border-border/60 px-4 py-5 sm:px-5">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-full px-5 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        disabled={isLoadingMore}
                        onClick={() => void loadMorePosts()}
                      >
                        {isLoadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Cargar más
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex min-h-[45vh] flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background text-primary">
                    <EmptyStateIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {emptyTitle}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                    Se el primero en compartir una traba real o un atajo que ya te funciono.
                  </p>
                  <Button className="mt-6 rounded-full md:hidden" onClick={handleComposerOpen}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="hidden md:block">
          <div className="sticky top-6 space-y-4">
            <Button
              size="lg"
              className="w-full rounded-2xl px-4 py-6 text-base font-semibold"
              onClick={handleComposerOpen}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Publicar
            </Button>

            {hasTrendingAreas ? (
              <section className="rounded-[1.75rem] border border-border/60 bg-background p-4">
                <div className="mb-3">
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    Tendencias
                  </p>
                </div>

                <CommunityTrendsList items={trendingAreas} onSelect={handleTrendSelect} />
              </section>
            ) : null}
          </div>
        </aside>
      </div>

      <Button
        size="icon"
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
        onClick={handleComposerOpen}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Community;
