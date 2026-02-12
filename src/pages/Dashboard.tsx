import { useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import MissionCard from "@/components/MissionCard";
import MissionFlow from "@/components/MissionFlow";
import { TrendingUp, Lightbulb, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { format } from "date-fns";

const MISSIONS = [
  { title: "Sube una foto de tu producto estrella", description: "Muestra lo mejor que tienes. Una buena foto vale más que mil palabras.", category: "foto" },
  { title: "Cuenta tu historia", description: "¿Por qué empezaste tu negocio? A la gente le encanta conocer la historia detrás.", category: "historia" },
  { title: "Crea una oferta especial", description: "Un descuento o promoción para esta semana. ¡Haz que la gente se emocione!", category: "promo" },
  { title: "Comparte un tip de tu industria", description: "Comparte algo que tus clientes no sepan. ¡Conviértete en experto!", category: "idea" },
  { title: "Muestra tu espacio de trabajo", description: "Lleva a tus seguidores detrás de escenas. ¡La autenticidad conecta!", category: "foto" },
];

const Dashboard = () => {
  const { profile } = useBusinessProfile();
  const navigate = useNavigate();
  const [showMission, setShowMission] = useState(false);

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate("/");
    }
  }, [profile.onboardingComplete, navigate]);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayCompleted = profile.completedMissions.includes(today);
  const dayIndex = new Date().getDay();
  const mission = MISSIONS[dayIndex % MISSIONS.length];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()} 👋</p>
            <h1 className="text-2xl font-bold text-foreground">{profile.brandName}</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-border">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-base text-muted-foreground">
          Hoy es un gran día para hacer crecer tu negocio 🚀
        </p>
      </div>

      {/* Stats bar */}
      <div className="mx-5 mt-5 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pastel-green">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{profile.completedMissions.length}</p>
            <p className="text-xs text-muted-foreground">Misiones</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pastel-yellow">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{Math.min(profile.completedMissions.length, 7)}</p>
            <p className="text-xs text-muted-foreground">Racha 🔥</p>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mx-5 mt-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tu Semana</h3>
        <WeeklyCalendar completedDates={profile.completedMissions} />
      </div>

      {/* Mission Card */}
      <div className="mx-5 mt-6">
        {todayCompleted ? (
          <div className="rounded-3xl bg-success/5 border-2 border-success/20 p-6 text-center animate-fade-in">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">¡Misión Completada!</h2>
            <p className="mt-2 text-muted-foreground">Excelente trabajo. Vuelve mañana para tu próxima misión.</p>
          </div>
        ) : (
          <MissionCard
            title={mission.title}
            description={mission.description}
            category={mission.category}
            onStart={() => setShowMission(true)}
          />
        )}
      </div>

      {/* Tips */}
      <div className="mx-5 mt-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tips Rápidos</h3>
        <div className="space-y-3">
          {[
            { emoji: "📸", text: "Usa luz natural para mejores fotos", color: "bg-pastel-pink" },
            { emoji: "⏰", text: "Publica entre 10am y 2pm para más alcance", color: "bg-pastel-blue" },
            { emoji: "💬", text: "Responde comentarios en los primeros 30 min", color: "bg-pastel-yellow" },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tip.color}`}>
                <span className="text-lg">{tip.emoji}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Flow Modal */}
      {showMission && (
        <MissionFlow
          onClose={() => setShowMission(false)}
          missionTitle={mission.title}
        />
      )}
    </div>
  );
};

export default Dashboard;
