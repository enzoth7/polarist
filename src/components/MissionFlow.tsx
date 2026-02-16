import { useState, useRef, useEffect } from "react";
import { X, Copy, Check, Download, ImageIcon, Loader2 } from "lucide-react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { supabase } from "@/lib/supabase";

interface MissionFlowProps {
  onClose: () => void;
  missionTitle: string;
}

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/webhook-image"; // Updated with new flow if needed

const MissionFlow = ({ onClose, missionTitle }: MissionFlowProps) => {
  const { } = useBusinessProfile();
  const { forceDownload } = { forceDownload: (url: string, name: string) => import('@/lib/downloadUtils').then(m => m.forceDownload(url, name)) };

  const [step, setStep] = useState<"upload" | "processing" | "result">("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New Inputs
  const [promoText, setPromoText] = useState("");
  const [intent, setIntent] = useState("promotion"); // default

  // Result state
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState(""); // Still useful
  const [copyCopied, setCopyCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [missionId, setMissionId] = useState<string | null>(null);

  // Campaigns
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('campaigns').select('id, name').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) {
        setCampaigns(data);
        if (data.length > 0) setSelectedCampaignId(data[0].id);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (!missionId) return;

    // Realtime subscription to the specific mission
    const channel = supabase
      .channel(`mission-${missionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'missions', filter: `id=eq.${missionId}` },
        (payload) => {
          console.log('Update received!', payload);
          const newData = payload.new as any;
          if (newData.generated_images && newData.generated_images.length > 0) {
            setGeneratedImages(newData.generated_images);
            setSelectedResult(newData.generated_images[0]); // Default to first
            setStep("result");
            setIsUploading(false);

            // Mock copy for now as n8n might not sending it yet
            setGeneratedCopy(
              `¡Increíble foto para "${missionTitle}"! 🌟\n\nAquí tienes un copy sugerido:\n\n"${promoText || "Descubre la magia"}. ✨ Hecho con pasión para ti."`
            );
            // completeMission(new Date().toISOString().split('T')[0]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [missionId, missionTitle, promoText]);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    setStep("processing");

    try {
      // 1. Upload to Supabase Storage
      const filename = `${Date.now()}_${selectedImage.name.replace(/\s/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('mission-uploads')
        .upload(filename, selectedImage);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mission-uploads')
        .getPublicUrl(filename);

      // 3. Create Mission Record in Supabase (to track status)
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .insert({
          status: 'processing',
          product_image_url: publicUrl,
          mission_title: missionTitle,
          promo_text: promoText,
          intent: intent,
          campaign_id: selectedCampaignId || null
        })
        .select()
        .single();

      if (missionError) throw missionError;

      const newMissionId = missionData.id;
      setMissionId(newMissionId);

      // 4. Send to n8n (including mission_id so n8n connects back)
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: publicUrl,
          mission_title: missionTitle,
          mission_id: newMissionId, // CRITICAL: n8n needs this to update DB
          promo_text: promoText,
          intent: intent,
          campaign_id: selectedCampaignId || null
        })
      });

      // No setTimeout here! We wait for Realtime update in useEffect.
      // Fallback timeout in case n8n fails or realtime issues?
      // Optional: keep a timeout to warn user if it takes too long.

    } catch (error: any) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setStep("upload");
      alert(`Error: ${error.message || JSON.stringify(error)}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopyCopied(true);
    setTimeout(() => setCopyCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-card rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">{missionTitle}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {step === "upload" && "Configura tu anuncio"}
            {step === "processing" && "Diseñando 4 opciones para ti..."}
            {step === "result" && "¡Elige tu diseño favorito!"}
          </p>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {step === "upload" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Image Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors aspect-square relative overflow-hidden"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">Toca para subir producto</p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Right: Form inputs */}
              <div className="flex flex-col gap-4 justify-center">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Intención</label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="promotion">Promoción / Descuento</option>
                    <option value="new_arrival">Nuevo Ingreso</option>
                    <option value="lifestyle">Lifestyle / Branding</option>
                    <option value="informational">Informativo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Texto Promocional</label>
                  <input
                    type="text"
                    value={promoText}
                    onChange={(e) => setPromoText(e.target.value)}
                    placeholder='Ej: "25% OFF Hoy"'
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Campaña Destino</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled>Seleccionar Campaña</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            </div>
        )}

        {step === "processing" && (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">
              La IA está generando variaciones de diseño...
              <br />
              <span className="text-xs opacity-50 block mt-2">(Esto puede tardar unos 20-40 segundos)</span>
            </p>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6">
            {/* Grid of Results */}
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedResult(imgUrl)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedResult === imgUrl ? 'border-primary ring-2 ring-primary/50 scale-[1.02]' : 'border-transparent hover:border-white/20'}`}
                >
                  <img src={imgUrl} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                  {selectedResult === imgUrl && (
                    <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action for selected result */}
            {selectedResult && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm">
                  <p className="font-bold text-foreground">Opción Seleccionada</p>
                  <p className="text-muted-foreground text-xs">Lista para descargar y publicar.</p>
                </div>
                <a
                  href={selectedResult}
                  download={`polarist-${Date.now()}.png`}
                  target="_blank"
                  onClick={(e) => {
                    e.preventDefault();
                    forceDownload(selectedResult, `polarist-${Date.now()}.png`);
                  }}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Descargar Imagen
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-4 border-t border-white/10">
        {step === "upload" && (
          <button
            onClick={handleUploadAndProcess}
            disabled={!selectedImage}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Generar 4 Diseños
          </button>
        )}

        {step === "result" && (
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white/10 text-foreground font-bold text-lg hover:bg-white/20 transition-all"
          >
            Volver al Calendario
          </button>
        )}
      </div>

    </div>
    </div >
    </div >
  );
};

export default MissionFlow;
