import { ChangeEvent, useEffect, useState } from "react";
import { ArrowLeft, Download, Folder, FolderPlus, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Campaign {
  id: string;
  name: string;
  created_at: string;
  user_images?: { image_url: string; type: string; viewed: boolean }[];
}

interface UserImage {
  id: string;
  image_url: string;
  type: "upload" | "enhanced";
  created_at: string;
  status: string;
  campaign_id: string;
  viewed?: boolean;
}

const Gallery = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { forceDownload } = {
    forceDownload: (url: string, name: string) => import("@/lib/downloadUtils").then((module) => module.forceDownload(url, name)),
  };

  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    void fetchCampaigns();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(i18n.resolvedLanguage?.startsWith("es") ? "es-ES" : "en-US");

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("campaigns")
        .select("*, user_images(image_url, type, viewed)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (campaignId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_images")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) return;

    try {
      setCreatingCampaign(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(t("gallery.errors.noUser"));

      const { error } = await supabase.from("campaigns").insert({
        user_id: user.id,
        name: newCampaignName.trim(),
      });

      if (error) throw error;

      toast({ title: t("gallery.toasts.campaignCreated") });
      setIsDialogOpen(false);
      setNewCampaignName("");
      void fetchCampaigns();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleEnterCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    void fetchImages(campaign.id);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedCampaign(null);
    setImages([]);
    void fetchCampaigns();
    setView("list");
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !selectedCampaign) return;

      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(t("gallery.errors.noUser"));

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
        campaign_id: selectedCampaign.id,
      });

      if (dbError) throw dbError;

      toast({
        title: t("gallery.toasts.productUploaded"),
        description: t("gallery.toasts.productUploadedDescription"),
      });

      void fetchImages(selectedCampaign.id);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: t("gallery.toasts.uploadErrorTitle"),
        description: error.message || t("gallery.toasts.uploadErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const newImages = images.filter((img) => img.type?.toLowerCase().trim() === "enhanced" && !img.viewed);
  const createdImages = images.filter((img) => img.type?.toLowerCase().trim() === "enhanced" && img.viewed);
  const uploadedImages = images.filter((img) => img.type === "upload" || !img.type);

  if (view === "list") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{t("gallery.list.title")}</h1>
              <p className="mt-1 text-muted-foreground">{t("gallery.list.subtitle")}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {t("gallery.list.createCampaign")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("gallery.dialog.title")}</DialogTitle>
                  <DialogDescription>{t("gallery.dialog.description")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t("gallery.dialog.name")}
                    </Label>
                    <Input
                      id="name"
                      value={newCampaignName}
                      onChange={(event) => setNewCampaignName(event.target.value)}
                      className="col-span-3"
                      placeholder={t("gallery.dialog.placeholder")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateCampaign} disabled={creatingCampaign}>
                    {creatingCampaign && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("gallery.dialog.create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                <Folder className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{t("gallery.list.emptyTitle")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">{t("gallery.list.emptyDescription")}</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                {t("gallery.list.createCampaign")}
              </Button>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const previewImage = campaign.user_images?.[0]?.image_url;
                const hasNewContent = campaign.user_images?.some((img) => img.type?.toLowerCase().trim() === "enhanced" && !img.viewed);

                return (
                  <div
                    key={campaign.id}
                    onClick={() => handleEnterCampaign(campaign)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
                  >
                    <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-secondary/30">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={campaign.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-semibold">{campaign.name}</h3>
                        {hasNewContent && (
                          <span
                            className="flex h-3 w-3 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            title={t("gallery.list.newImagesTitle")}
                          />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{formatDate(campaign.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label={t("common.back")}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedCampaign?.name}</h1>
              <p className="mt-1 text-muted-foreground">{t("gallery.detail.subtitle")}</p>
            </div>
          </div>

          <div>
            <input
              type="file"
              id="upload-image"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label htmlFor="upload-image">
              <Button className="cursor-pointer" asChild disabled={uploading}>
                <span>
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {t("gallery.detail.uploadProduct")}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {newImages.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </div>
              <h2 className="text-xl font-bold">{t("gallery.detail.newImages")}</h2>
              <span className="text-sm text-muted-foreground">({newImages.length})</span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {newImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-green-500/30 bg-card shadow-lg shadow-green-500/5"
                >
                  <img
                    src={img.image_url}
                    alt={t("gallery.detail.enhancedImageAlt")}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-full"
                      onClick={async () => {
                        const dateStr = new Date().toISOString().split("T")[0];
                        const filename = `visual-growth-${dateStr}-${img.id.slice(0, 8)}.png`;
                        forceDownload(img.image_url, filename);

                        const { error } = await supabase.from("user_images").update({ viewed: true }).eq("id", img.id);
                        if (!error) {
                          setImages((prev) => prev.map((item) => (item.id === img.id ? { ...item, viewed: true } : item)));
                          toast({
                            title: t("gallery.toasts.imageDownloaded"),
                            description: t("gallery.toasts.imageMarkedViewed"),
                          });
                        }
                      }}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      {t("common.download")}
                    </Button>
                  </div>
                  <div className="absolute left-2 top-2">
                    <span className="flex items-center gap-1 rounded-full border border-green-600 bg-green-500 px-2 py-1 text-[10px] font-bold text-white">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                      {t("gallery.detail.newBadge")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const ids = newImages.map((img) => img.id);
                  await supabase.from("user_images").update({ viewed: true }).in("id", ids);
                  setImages((prev) => prev.map((img) => (ids.includes(img.id) ? { ...img, viewed: true } : img)));
                  toast({ title: t("gallery.toasts.markedAllSeen") });
                }}
              >
                {t("gallery.detail.markAllSeen")}
              </Button>
            </div>
            <div className="border-t border-border" />
          </section>
        )}

        {createdImages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("gallery.detail.createdImages")}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {createdImages.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border bg-card">
                  <img
                    src={img.image_url}
                    alt={t("gallery.detail.createdImageAlt")}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="text-white">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider">{t("gallery.detail.generatedTag")}</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-full"
                        onClick={() => {
                          const dateStr = new Date().toISOString().split("T")[0];
                          forceDownload(img.image_url, `visual-growth-${dateStr}-${img.id.slice(0, 8)}.png`);
                        }}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        {t("common.download")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border" />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">{t("gallery.detail.uploadedImages")}</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : uploadedImages.length === 0 && createdImages.length === 0 && newImages.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{t("gallery.detail.emptyCampaignTitle")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">{t("gallery.detail.emptyCampaignDescription")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {uploadedImages.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border bg-card">
                  <img
                    src={img.image_url}
                    alt={t("gallery.detail.uploadedImageAlt")}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="text-white">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider">{t("gallery.detail.uploadedTag")}</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-full"
                          onClick={() => {
                            const dateStr = new Date().toISOString().split("T")[0];
                            const filename = `visual-growth-${dateStr}-${img.id.slice(0, 8)}.png`;
                            forceDownload(img.image_url, filename);
                          }}
                        >
                          <Download className="mr-2 h-3 w-3" />
                          {t("common.download")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-2 top-2">
                    <span className="rounded-full border border-border bg-background/80 px-2 py-1 text-[10px] font-bold text-foreground">
                      {t("gallery.detail.uploadedBadge")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Gallery;
