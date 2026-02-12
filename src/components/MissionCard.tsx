import { Rocket, ArrowRight } from "lucide-react";

interface MissionCardProps {
  title: string;
  description: string;
  category: string;
  onStart: () => void;
}

const categoryColors: Record<string, string> = {
  foto: "bg-pastel-pink text-primary",
  idea: "bg-pastel-yellow text-primary",
  promo: "bg-pastel-blue text-primary",
  historia: "bg-pastel-green text-primary",
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
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Rocket className="h-5 w-5" />
        ¡Empezar Misión!
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MissionCard;
