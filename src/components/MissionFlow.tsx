import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Check, Download, ImageIcon, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

interface MissionFlowProps {
  onClose: () => void;
  missionTitle: string;
}

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/webhook-image";

const MissionFlow = ({ onClose, missionTitle }: MissionFlowProps) => {
  const { t } = useTranslation();
  const { forceDownload } = {
    forceDownload: (url: string, name: string) => import("@/lib/downloadUtils").then((module) => module.forceDownload(url, name)),
  };

  const [step, setStep] = useState<"upload" | "processing" | "result">("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [promoText, setPromoText] = useState("");
  const [intent, setIntent] = useState("promotion");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("campaigns").select("id, name").eq("user_id", user.id).order("created_at", { ascending: false });
      if (!data) return;

      setCampaigns(data);
      if (data.length > 0) setSelectedCampaignId(data[0].id);
    };

    void fetchCampaigns();
  }, []);

  useEffect(() => {
    if (!missionId) return;

    const channel = supabase
      .channel(`mission-${missionId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "missions", filter: `id=eq.${missionId}` }, (payload) => {
        const newData = payload.new as any;
        if (newData.generated_images && newData.generated_images.length > 0) {
          setGeneratedImages(newData.generated_images);
          setSelectedResult(newData.generated_images[0]);
          setStep("result");
          setIsUploading(false);
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [missionId]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAndProcess = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    setStep("processing");

    try {
      const filename = `${Date.now()}_${selectedImage.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("mission-uploads").upload(filename, selectedImage);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("mission-uploads").getPublicUrl(filename);

      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .insert({
          status: "processing",
          product_image_url: publicUrl,
          mission_title: missionTitle,
          promo_text: promoText,
          intent,
          campaign_id: selectedCampaignId || null,
        })
        .select()
        .single();

      if (missionError) throw missionError;

      const newMissionId = missionData.id;
      setMissionId(newMissionId);

      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: publicUrl,
          mission_title: missionTitle,
          mission_id: newMissionId,
          promo_text: promoText,
          intent,
          campaign_id: selectedCampaignId || null,
        }),
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setStep("upload");
      window.alert(t("missionFlow.uploadFailed", { message: error.message || JSON.stringify(error) }));
    }
  };

  const stepDescriptionKey =
    step === "upload"
      ? "missionFlow.steps.upload"
      : step === "processing"
        ? "missionFlow.steps.processing"
        : "missionFlow.steps.result";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("common.close")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-foreground">{missionTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(stepDescriptionKey)}</p>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          {step === "upload" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-white/20 p-4 transition-colors hover:bg-white/5"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt={t("missionFlow.imagePreview")} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">{t("missionFlow.tapToUpload")}</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">{t("missionFlow.intentLabel")}</label>
                  <select
                    value={intent}
                    onChange={(event) => setIntent(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="promotion">{t("missionFlow.intents.promotion")}</option>
                    <option value="new_arrival">{t("missionFlow.intents.newArrival")}</option>
                    <option value="lifestyle">{t("missionFlow.intents.lifestyle")}</option>
                    <option value="informational">{t("missionFlow.intents.informational")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">{t("missionFlow.promoTextLabel")}</label>
                  <input
                    type="text"
                    value={promoText}
                    onChange={(event) => setPromoText(event.target.value)}
                    placeholder={t("missionFlow.promoTextPlaceholder")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">{t("missionFlow.campaignLabel")}</label>
                <select
                  value={selectedCampaignId}
                  onChange={(event) => setSelectedCampaignId(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled>
                    {t("missionFlow.selectCampaign")}
                  </option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="animate-pulse text-center text-sm text-muted-foreground">
                {t("missionFlow.processingLine1")}
                <br />
                <span className="mt-2 block text-xs opacity-50">{t("missionFlow.processingLine2")}</span>
              </p>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imgUrl, index) => (
                  <button
                    key={imgUrl}
                    onClick={() => setSelectedResult(imgUrl)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      selectedResult === imgUrl
                        ? "scale-[1.02] border-primary ring-2 ring-primary/50"
                        : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img src={imgUrl} alt={t("missionFlow.optionAlt", { index: index + 1 })} className="h-full w-full object-cover" />
                    {selectedResult === imgUrl && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-black">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedResult && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row">
                  <div className="text-sm">
                    <p className="font-bold text-foreground">{t("missionFlow.selectedOptionTitle")}</p>
                    <p className="text-xs text-muted-foreground">{t("missionFlow.selectedOptionDescription")}</p>
                  </div>
                  <a
                    href={selectedResult}
                    download={`polarist-${Date.now()}.png`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      event.preventDefault();
                      forceDownload(selectedResult, `polarist-${Date.now()}.png`);
                    }}
                    className="cursor-pointer rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {t("missionFlow.downloadImage")}
                    </span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          {step === "upload" && (
            <button
              onClick={handleUploadAndProcess}
              disabled={!selectedImage || isUploading}
              className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("missionFlow.generateDesigns")}
            </button>
          )}

          {step === "result" && (
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-white/10 py-4 text-lg font-bold text-foreground transition-all hover:bg-white/20"
            >
              {t("missionFlow.backToCalendar")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionFlow;
