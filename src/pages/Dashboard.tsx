import { useNavigate } from "react-router-dom";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Settings, Image as ImageIcon, Sparkles, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { profile } = useBusinessProfile();
  const navigate = useNavigate();
  const { isInstallable, installApp } = useInstallPrompt();

  const brandName = profile.businessName || "Mi Negocio";
  // Fallback to "N/A" if empty
  const archetype = profile.personality || "—";
  const goal = profile.goal || "—";

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="min-h-screen bg-background pb-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()} 👋</p>
          <h1 className="text-2xl font-bold text-foreground">{brandName}</h1>
        </div>
        <div className="flex items-center gap-1">
          {isInstallable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={installApp}
              title="Instalar app"
            >
              <Download className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/preferences")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Identity Summary Card */}
      <div className="bg-card rounded-xl p-6 border shadow-sm mb-8 animate-fade-in text-card-foreground">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Tu Identidad de Marca
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Arquetipo</span>
            <span className="font-medium capitalize">{archetype.replace('_', ' ')}</span>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Meta Principal</span>
            <span className="font-medium capitalize">{goal.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Main Action: Gallery */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center mb-8">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">Galería de Contenido</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Sube tus productos y descarga contenido mejorado para tus redes.
        </p>
        <Button
          size="lg"
          className="w-full sm:w-auto px-8"
          onClick={() => navigate("/gallery")}
        >
          Ir a la Galería
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Tips */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Tips para hoy
        </h3>
        <div className="space-y-3">
          {[
            { emoji: "📸", text: "Fotos claras y con buena luz generan mejores resultados." },
            { emoji: "🎨", text: "Mantén coherencia con tu paleta de colores." },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
              <span className="text-xl">{tip.emoji}</span>
              <p className="text-sm font-medium">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
