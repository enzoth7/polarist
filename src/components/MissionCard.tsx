import { ArrowRight, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MissionCardProps {
  title: string;
  description: string;
  category: string;
  onStart: () => void;
}

const categoryColors: Record<string, string> = {
  foto: "border border-pink-500/20 bg-pastel-pink text-pink-300",
  idea: "border border-yellow-500/20 bg-pastel-yellow text-yellow-300",
  promo: "border border-blue-500/20 bg-pastel-blue text-blue-300",
  historia: "border border-green-500/20 bg-pastel-green text-green-300",
};

const MissionCard = ({ title, description, category, onStart }: MissionCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="animate-slide-up rounded-3xl bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[category] || "bg-pastel-purple text-primary"}`}>
          {t("missionCard.badge")}
        </span>
      </div>
      <h2 className="text-2xl font-bold leading-tight text-foreground">{title}</h2>
      <p className="mt-2 text-base text-muted-foreground">{description}</p>
      <button
        onClick={onStart}
        className="mt-6 flex w-full transform items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
      >
        <Rocket className="h-6 w-6 animate-pulse" />
        {t("missionCard.start")}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MissionCard;
