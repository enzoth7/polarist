import { useState } from "react";
import { Camera, Loader2, Check, Copy, Download, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { format } from "date-fns";

interface MissionFlowProps {
  onClose: () => void;
  missionTitle: string;
}

const SAMPLE_COPY = `✨ ¡Descubre nuestro producto estrella! ✨

Lo que hace especial a nuestro negocio es la dedicación y el amor que ponemos en cada detalle.

¿Ya lo probaste? ¡Cuéntanos en los comentarios! 👇

#emprendimiento #negociolocal #calidad`;

const MissionFlow = ({ onClose, missionTitle }: MissionFlowProps) => {
  const { completeMission } = useBusinessProfile();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleUpload = () => {
    // Simulate upload
    setStep(1);
    // Simulate AI processing
    setTimeout(() => setStep(2), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_COPY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    completeMission(format(new Date(), "yyyy-MM-dd"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-lg font-semibold text-foreground">Tu Misión</h3>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-border"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-5 pb-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-5 pb-8">
        {step === 0 && (
          <div className="animate-fade-in flex flex-col items-center pt-8">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-pastel-pink">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground text-center">{missionTitle}</h2>
            <p className="mt-3 text-center text-muted-foreground max-w-xs">
              Busca un lugar con buena luz natural. ¡No necesitas ser fotógrafo profesional!
            </p>
            <div className="mt-8 flex w-full flex-col gap-3">
              <button
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                <Camera className="h-5 w-5" />
                Tomar Foto
              </button>
              <button
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-4 text-lg font-semibold text-foreground transition-all hover:border-primary/30"
              >
                <ImageIcon className="h-5 w-5" />
                Subir desde Galería
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in flex flex-col items-center justify-center pt-16">
            <div className="relative mb-8">
              <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary animate-pulse-soft" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground text-center">Mejorando con IA...</h2>
            <p className="mt-3 text-center text-muted-foreground">Ajustando colores y redactando el copy perfecto</p>
            <div className="mt-8 w-full max-w-xs space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Optimizando imagen...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" style={{ animationDelay: "0.5s" }} />
                <span className="text-sm text-muted-foreground">Redactando copy...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" style={{ animationDelay: "1s" }} />
                <span className="text-sm text-muted-foreground">Añadiendo hashtags...</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                <Check className="h-4 w-4" />
                ¡Listo para publicar!
              </div>
            </div>

            {/* Image placeholder */}
            <div className="mb-5 aspect-square w-full rounded-3xl bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-primary/40" />
                <p className="mt-2 text-sm text-primary/40">Vista previa de imagen</p>
              </div>
            </div>

            {/* Copy text */}
            <div className="rounded-2xl border-2 border-border bg-card p-4">
              <p className="whitespace-pre-line text-sm text-foreground leading-relaxed">{SAMPLE_COPY}</p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-3.5 text-base font-semibold text-foreground transition-all hover:border-primary/30"
              >
                {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                {copied ? "¡Copiado!" : "Copiar Texto"}
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-3.5 text-base font-semibold text-foreground transition-all hover:border-primary/30">
                <Download className="h-5 w-5" />
                Descargar
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-4 text-lg font-semibold text-success-foreground transition-all hover:opacity-90"
            >
              <Check className="h-5 w-5" />
              ¡Misión Completada!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionFlow;
