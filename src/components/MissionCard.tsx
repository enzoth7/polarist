import { Rocket, ArrowRight } from "lucide-react";

interface MissionCardProps {
  title: string;
  description: string;
  category: string;
  onStart: () => void;
}

const categoryColors: Record<string, string> = {
  foto: "bg-pastel-pink text-pink-300 border border-pink-500/20",
  idea: "bg-pastel-yellow text-yellow-300 border border-yellow-500/20",
  promo: "bg-pastel-blue text-blue-300 border border-blue-500/20",
  historia: "bg-pastel-green text-green-300 border border-green-500/20",
};

const MissionCard = ({ title, description, category, onStart }: MissionCardProps) => {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[category] || "bg-pastel-purple text-primary"}`}>
          🎯 Misión del Día
        </span>
      </div>
      <h2 className="text-2xl font-bold text-foreground leading-tight">{title}</h2>
      <p className="mt-2 text-base text-muted-foreground">{description}</p>
      <button
        onClick={onStart}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
      >
        <Rocket className="h-6 w-6 animate-pulse" />
        ¡Empezar Misión!
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MissionCard;
