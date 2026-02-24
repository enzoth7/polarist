import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Folder, HelpCircle, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";

interface UserImage {
  id: string;
  image_url: string;
  type: "upload" | "enhanced";
  created_at: string;
  status: string;
  campaign_id: string;
  viewed?: boolean;
}

interface Campaign {
  id: string;
  name: string;
  created_at: string;
  user_images?: UserImage[];
}

type GalleryView = "tips" | "upload" | "folders" | "calendar" | "dayDetail";

const Gallery = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { profile, savePushSubscription } = useBusinessProfile();
  const navigate = useNavigate();
  const { forceDownload } = {
    forceDownload: (url: string, name: string) => import("@/lib/downloadUtils").then((module) => module.forceDownload(url, name)),
  };

  const [view, setView] = useState<GalleryView>("tips");
  const [previousView, setPreviousView] = useState<GalleryView | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allImages, setAllImages] = useState<UserImage[]>([]);
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [hasSetInitialView, setHasSetInitialView] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [isRequestingPush, setIsRequestingPush] = useState(false);
  const hasPromptedPushRef = useRef(false);

  const isSpanish = i18n.resolvedLanguage?.startsWith("es") ?? false;
  const hasImages = allImages.length > 0;

  useEffect(() => {
    void initializeGallery();
  }, []);

  useEffect(() => {
    if (initializing || loading || hasSetInitialView) return;
    // Don't override view — always start on tips
    setHasSetInitialView(true);
  }, [allImages.length, hasSetInitialView, initializing, loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    if (!supported) {
      setShowPushBanner(false);
      return;
    }
    if (Notification.permission === "denied") {
      setShowPushBanner(false);
      return;
    }
    if (profile.pushSubscription) {
      setShowPushBanner(false);
      return;
    }
    setShowPushBanner(true);
  }, [profile.pushSubscription]);

  const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    const formatted = new Intl.DateTimeFormat(isSpanish ? "es-ES" : "en-US", {
      month: "long",
      year: "numeric",
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatDayLabel = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const monthName = new Intl.DateTimeFormat(isSpanish ? "es-ES" : "en-US", { month: "long" }).format(date);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    if (isSpanish) {
      return `${day} de ${capitalizedMonth}`;
    }

    return `${capitalizedMonth} ${day}`;
  };

  const isEnhancedImage = (image: UserImage) => (image.type || "").toLowerCase().trim() === "enhanced";

  const getUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  };

  const initializeGallery = async () => {
    setInitializing(true);
    await refreshAllImages();
    setInitializing(false);
  };

  const fetchCampaigns = async (userId?: string, withLoading = true) => {
    try {
      if (withLoading) setLoading(true);
      const resolvedUserId = userId ?? (await getUserId());
      if (!resolvedUserId) {
        setCampaigns([]);
        return [];
      }

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("user_id", resolvedUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
      return data || [];
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    } finally {
      if (withLoading) setLoading(false);
    }
  };

  const fetchAllImages = async (userId?: string, withLoading = true) => {
    try {
      if (withLoading) setLoading(true);
      const resolvedUserId = userId ?? (await getUserId());
      if (!resolvedUserId) {
        setAllImages([]);
        return [];
      }

      const { data, error } = await supabase
        .from("user_images")
        .select("*")
        .eq("user_id", resolvedUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllImages(data || []);
      return data || [];
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    } finally {
      if (withLoading) setLoading(false);
    }
  };

  const refreshAllImages = async () => {
    const resolvedUserId = await getUserId();
    if (!resolvedUserId) {
      setCampaigns([]);
      setAllImages([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      const [, imagesData] = await Promise.all([
        fetchCampaigns(resolvedUserId, false),
        fetchAllImages(resolvedUserId, false),
      ]);
      return imagesData ?? [];
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (monthKey: string) => {
    try {
      setLoading(true);
      const resolvedUserId = await getUserId();
      if (!resolvedUserId) {
        setImages([]);
        return;
      }
      const [year, month] = monthKey.split("-").map(Number);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 1);

      const { data, error } = await supabase
        .from("user_images")
        .select("*")
        .eq("user_id", resolvedUserId)
        .gte("created_at", monthStart.toISOString())
        .lt("created_at", monthEnd.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPushSupported = () =>
    typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let index = 0; index < rawData.length; index += 1) {
      outputArray[index] = rawData.charCodeAt(index);
    }
    return outputArray;
  };

  const requestNotificationPermission = async () => {
    if (isRequestingPush) return;
    if (!isPushSupported()) return;

    setIsRequestingPush(true);
    try {
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("Missing VAPID public key");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        if (permission === "denied") {
          setShowPushBanner(false);
        }
        return;
      }

      const registration =
        (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw-push.js"));
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        }));

      await savePushSubscription(subscription);
      setShowPushBanner(false);
      toast({
        title: t("gallery.toasts.notificationsEnabledTitle"),
        description: t("gallery.toasts.notificationsEnabledDescription"),
      });
    } catch (error) {
      console.error("Push subscription error:", error);
      toast({
        title: t("gallery.toasts.notificationsErrorTitle"),
        description: t("gallery.toasts.notificationsErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsRequestingPush(false);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(t("gallery.errors.noUser"));

      const monthKey = getMonthKey(new Date());
      let campaign = campaigns.find((item) => item.name === monthKey) ?? null;

      if (!campaign) {
        const { data: createdCampaign, error: createError } = await supabase
          .from("campaigns")
          .insert({
            user_id: user.id,
            name: monthKey,
          })
          .select("*")
          .single();

        if (createError) throw createError;
        campaign = createdCampaign;
        setCampaigns((prev) => [createdCampaign, ...prev]);
      }

      if (!campaign) throw new Error(t("gallery.errors.noUser"));

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("user_images").insert({
        user_id: user.id,
        image_url: publicUrl,
        type: "upload",
        status: "ready",
        campaign_id: campaign.id,
      });

      if (dbError) throw dbError;

      toast({
        title: (
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            {t("gallery.toasts.productUploaded")}
          </span>
        ),
        description: t("gallery.toasts.productUploadedDescription"),
      });

      if (!hasPromptedPushRef.current && isPushSupported() && Notification.permission === "default" && !profile.pushSubscription) {
        hasPromptedPushRef.current = true;
        void requestNotificationPermission();
      }

      await fetchCampaigns();
      await fetchAllImages();
      if (selectedMonth === monthKey) {
        void fetchImages(monthKey);
      }
      setView("folders");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: t("gallery.toasts.uploadErrorTitle"),
        description: error.message || t("gallery.toasts.uploadErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleEnhancedDownload = async (image: UserImage) => {
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `visual-growth-${dateStr}-${image.id.slice(0, 8)}.png`;
    forceDownload(image.image_url, filename);

    if (!image.viewed) {
      const resolvedUserId = await getUserId();
      if (!resolvedUserId) return;
      const { error } = await supabase
        .from("user_images")
        .update({ viewed: true })
        .eq("id", image.id)
        .eq("user_id", resolvedUserId);
      if (!error) {
        setImages((prev) => prev.map((item) => (item.id === image.id ? { ...item, viewed: true } : item)));
        setAllImages((prev) => prev.map((item) => (item.id === image.id ? { ...item, viewed: true } : item)));
        toast({
          title: t("gallery.toasts.imageDownloaded"),
          description: t("gallery.toasts.imageMarkedViewed"),
        });
      }
    }
  };

  const getStoragePathFromUrl = (url: string) => {
    const marker = "/product-images/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length).split("?")[0];
  };

  const removeStorageObjects = async (urls: string[]) => {
    const paths = urls
      .map((url) => getStoragePathFromUrl(url))
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) return;
    const { error } = await supabase.storage.from("product-images").remove(paths);
    if (error) {
      console.warn("Storage delete error:", error);
    }
  };

  const handleDeleteImage = async (image: UserImage) => {
    const confirmed = window.confirm(t("gallery.delete.confirmImage"));
    if (!confirmed) return;

    try {
      const resolvedUserId = await getUserId();
      if (!resolvedUserId) throw new Error(t("gallery.errors.noUser"));

      await removeStorageObjects([image.image_url]);

      const { error } = await supabase
        .from("user_images")
        .delete()
        .eq("id", image.id)
        .eq("user_id", resolvedUserId);

      if (error) throw error;

      setImages((prev) => prev.filter((item) => item.id !== image.id));
      setAllImages((prev) => prev.filter((item) => item.id !== image.id));

      toast({
        title: t("gallery.toasts.imageDeletedTitle"),
        description: t("gallery.toasts.imageDeletedDescription"),
      });
    } catch (error: any) {
      console.error("Delete image error:", error);
      toast({
        title: t("gallery.toasts.deleteErrorTitle"),
        description: error.message || t("gallery.toasts.deleteErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async (group: { key: string; images: UserImage[] }) => {
    const confirmed = window.confirm(
      t("gallery.delete.confirmFolder", { month: formatMonthLabel(group.key) }),
    );
    if (!confirmed) return;

    try {
      const resolvedUserId = await getUserId();
      if (!resolvedUserId) throw new Error(t("gallery.errors.noUser"));

      const campaign = campaigns.find((item) => item.name === group.key);

      await removeStorageObjects(group.images.map((image) => image.image_url));

      if (campaign) {
        const { error: imagesError } = await supabase
          .from("user_images")
          .delete()
          .eq("campaign_id", campaign.id)
          .eq("user_id", resolvedUserId);
        if (imagesError) throw imagesError;

        const { error: campaignError } = await supabase
          .from("campaigns")
          .delete()
          .eq("id", campaign.id)
          .eq("user_id", resolvedUserId);
        if (campaignError) throw campaignError;
      } else {
        const [year, month] = group.key.split("-").map(Number);
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 1);
        const { error: imagesError } = await supabase
          .from("user_images")
          .delete()
          .eq("user_id", resolvedUserId)
          .gte("created_at", monthStart.toISOString())
          .lt("created_at", monthEnd.toISOString());
        if (imagesError) throw imagesError;
      }

      setAllImages((prev) => prev.filter((item) => !group.images.some((image) => image.id === item.id)));
      setImages((prev) => prev.filter((item) => !group.images.some((image) => image.id === item.id)));
      if (campaign) {
        setCampaigns((prev) => prev.filter((item) => item.id !== campaign.id));
      }

      if (selectedMonth === group.key) {
        setSelectedMonth(null);
        setSelectedDate(null);
        setView("folders");
      }

      toast({
        title: t("gallery.toasts.folderDeletedTitle"),
        description: t("gallery.toasts.folderDeletedDescription"),
      });
    } catch (error: any) {
      console.error("Delete folder error:", error);
      toast({
        title: t("gallery.toasts.deleteErrorTitle"),
        description: error.message || t("gallery.toasts.deleteErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const monthGroups = useMemo(() => {
    const grouped = new Map<string, UserImage[]>();

    allImages.forEach((image) => {
      const key = getMonthKey(new Date(image.created_at));
      const existing = grouped.get(key) || [];
      grouped.set(key, [...existing, image]);
    });

    return Array.from(grouped.entries())
      .map(([key, groupImages]) => ({
        key,
        images: [...groupImages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [allImages]);

  const daysWithPhotos = useMemo(() => new Set(images.map((image) => new Date(image.created_at).getDate())), [images]);

  const dayImages = useMemo(() => {
    if (!selectedDate) return [];
    return images.filter((image) => getDateKey(new Date(image.created_at)) === selectedDate);
  }, [images, selectedDate]);

  const uploadedDayImages = dayImages.filter((image) => !isEnhancedImage(image));
  const enhancedDayImages = dayImages.filter(isEnhancedImage);

  if (initializing) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (view === "tips") {
    const tips = [
      {
        icon: "💡",
        title: t("gallery.tips.items.light.title"),
        description: t("gallery.tips.items.light.description"),
      },
      {
        icon: "🎯",
        title: t("gallery.tips.items.background.title"),
        description: t("gallery.tips.items.background.description"),
      },
      {
        icon: "📸",
        title: t("gallery.tips.items.center.title"),
        description: t("gallery.tips.items.center.description"),
      },
    ];

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-lg flex-col">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (previousView) {
                      setView(previousView);
                      setPreviousView(null);
                    } else {
                      setView(hasImages ? "folders" : "upload");
                    }
                  }}
                  aria-label={t("common.back")}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-heading font-bold text-foreground">{t("gallery.tips.title")}</h1>
              </div>
              <div className="mt-6 space-y-4">
                {tips.map((tip) => (
                  <div key={tip.title} className="flex items-start gap-4 rounded-2xl border border-border bg-background/60 p-4">
                    <div className="text-2xl">{tip.icon}</div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{tip.title}</p>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-8 w-full"
                onClick={() => {
                  setPreviousView(null);
                  setView("upload");
                }}
              >
                {t("gallery.tips.cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "upload") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="px-6 pt-6">
          <div className="relative flex flex-col items-center justify-center gap-2 text-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (hasImages) {
                  setView("folders");
                } else {
                  navigate("/dashboard");
                }
              }}
              aria-label={t("common.back")}
              className="absolute left-0 top-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-heading font-bold text-foreground">{t("gallery.upload.title")}</h1>
            <p className="text-base text-muted-foreground">{t("gallery.upload.subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 -mt-6 md:-mt-8">
          <input
            type="file"
            id="upload-image"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="upload-image" className={uploading ? "cursor-not-allowed" : "cursor-pointer"}>
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10 md:h-32 md:w-32 ${uploading ? "opacity-60" : ""
                }`}
            >
              {uploading ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary/70" />
              ) : (
                <Plus className="h-14 w-14 text-primary/60 md:h-16 md:w-16" />
              )}
            </div>
          </label>
          <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground">
            {t("gallery.upload.helper")}
          </p>
        </div>
      </div>
    );
  }

  if (view === "folders") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                aria-label={t("common.back")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-heading font-bold">{t("gallery.folders.title")}</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setPreviousView("folders");
                setView("tips");
              }}
              aria-label={t("gallery.tips.title")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
            >
              <HelpCircle className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Archivos organizados por mes. Aquí encontrarás los originales y sus versiones transformadas listas para descargar,
            diseñadas para mantener ordenado tu feed y catálogo.
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {showPushBanner && (
                <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t("gallery.notifications.title")}</p>
                      <p className="text-xs text-muted-foreground">{t("gallery.notifications.description")}</p>
                    </div>
                    <Button size="sm" onClick={requestNotificationPermission} disabled={isRequestingPush}>
                      {isRequestingPush ? t("gallery.notifications.ctaLoading") : t("gallery.notifications.cta")}
                    </Button>
                  </div>
                </div>
              )}
              {monthGroups.map((group) => {
                const previewImage = group.images[0]?.image_url;
                const uploadCount = group.images.filter((image) => !isEnhancedImage(image)).length;
                const hasNewEnhanced = group.images.some((image) => isEnhancedImage(image) && !image.viewed);

                return (
                  <div
                    key={group.key}
                    className="flex w-full items-center gap-2 rounded-2xl border bg-card p-3 text-left transition hover:shadow-md sm:p-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMonth(group.key);
                        setSelectedDate(null);
                        setView("calendar");
                        void fetchImages(group.key);
                      }}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary/50 sm:h-14 sm:w-14">
                          {previewImage ? (
                            <img src={previewImage} alt={group.key} className="h-full w-full object-cover" />
                          ) : (
                            <Folder className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold sm:text-lg">{formatMonthLabel(group.key)}</h3>
                            {hasNewEnhanced && (
                              <span
                                className="flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-500"
                                title={t("gallery.toasts.imageMarkedViewed")}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {t("gallery.folders.photoCount", { count: uploadCount })}
                          </p>
                        </div>
                      </div>
                      <ImageIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFolder(group)}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:text-foreground"
                      aria-label={t("gallery.delete.folderButton")}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setView("upload")}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90"
          aria-label={t("gallery.folders.uploadBtn")}
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    );
  }

  if (view === "calendar" && selectedMonth) {
    const [year, month] = selectedMonth.split("-").map(Number);
    const monthLabel = formatMonthLabel(selectedMonth);
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalCells = 42;
    const weekDays = isSpanish ? ["L", "M", "M", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedDate(null);
                setView("folders");
              }}
              aria-label={t("common.back")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-heading font-bold">{monthLabel}</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Historial de transformaciones: Revisa las fotos generadas por mes.
              </p>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground">
                  {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                  {Array.from({ length: totalCells }).map((_, index) => {
                    const dayNumber = index - startOffset + 1;
                    if (dayNumber < 1 || dayNumber > daysInMonth) {
                      return <div key={`empty-${index}`} className="h-9 w-9" />;
                    }

                    const hasPhotos = daysWithPhotos.has(dayNumber);

                    if (hasPhotos) {
                      const dateKey = `${selectedMonth}-${String(dayNumber).padStart(2, "0")}`;
                      return (
                        <button
                          key={dateKey}
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5729] text-sm font-semibold text-white"
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setView("dayDetail");
                          }}
                        >
                          {dayNumber}
                        </button>
                      );
                    }

                    return (
                      <div key={dayNumber} className="flex h-9 w-9 items-center justify-center text-sm text-foreground/70">
                        {dayNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-[#FF5729]" />
                <span>Días con actividad fotográfica</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "dayDetail" && selectedDate) {
    const dayTitle = formatDayLabel(selectedDate);

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedDate(null);
                setView("calendar");
              }}
              aria-label={t("common.back")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-heading font-bold">{dayTitle}</h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-heading font-semibold">{t("gallery.dayDetail.ownPhoto")}</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {uploadedDayImages.map((image) => (
                  <div key={image.id} className="relative aspect-video overflow-hidden rounded-2xl border bg-card">
                    <img src={image.image_url} alt={t("gallery.dayDetail.ownPhoto")} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border/70"
                      aria-label={t("gallery.delete.imageButton")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="border-t border-border" />

          <section className="space-y-4">
            <h2 className="text-lg font-heading font-semibold">{t("gallery.dayDetail.finalPhoto")}</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : enhancedDayImages.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed p-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("gallery.dayDetail.processing")}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {enhancedDayImages.map((image) => (
                  <div key={image.id} className="space-y-3 rounded-2xl border bg-card p-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <img
                        src={image.image_url}
                        alt={t("gallery.dayDetail.finalPhoto")}
                        className="h-full w-full object-cover"
                      />
                      {!image.viewed && (
                        <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                          {t("gallery.dayDetail.newBadge")}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image)}
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border/70"
                        aria-label={t("gallery.delete.imageButton")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Button variant="secondary" onClick={() => handleEnhancedDownload(image)}>
                      <Download className="mr-2 h-4 w-4" />
                      {t("common.download")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  return null;
};

export default Gallery;
