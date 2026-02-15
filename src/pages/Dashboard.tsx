import { useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { TrendingUp, Lightbulb, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { profile } = useBusinessProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate("/");
    }
  }, [profile.onboardingComplete, navigate]);

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
          <button
            onClick={() => navigate("/preferences")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-border"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-base text-muted-foreground">
          Hoy es un gran día para hacer crecer tu negocio 🚀
        </p>
      </div>

      {/* Stats bar */}
      <div className="mx-5 mt-8 flex gap-4">
        <div className="flex flex-1 items-center gap-3 rounded-3xl bg-card p-5 shadow-card transition-transform hover:scale-[1.02] border border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{profile.completedMissions.length}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Misiones</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-3xl bg-card p-5 shadow-card transition-transform hover:scale-[1.02] border border-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{Math.min(profile.completedMissions.length, 7)}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Racha 🔥</p>
          </div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="mx-5 mt-8">
        <MonthlyCalendar completedDates={profile.completedMissions} />
      </div>

      {/* Tips */}
      <div className="mx-5 mt-10">
        <h3 className="mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Tips Rápidos</h3>
        <div className="space-y-4">
          {[
            { emoji: "📸", text: "Usa luz natural para mejores fotos", color: "bg-pink-500/10 border-pink-500/20 text-pink-300" },
            { emoji: "⏰", text: "Publica entre 10am y 2pm para más alcance", color: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
            { emoji: "💬", text: "Responde comentarios en los primeros 30 min", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" },
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-card transition-transform hover:translate-x-1 border border-white/5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tip.color} shrink-0`}>
                <span className="text-xl">{tip.emoji}</span>
              </div>
              <p className="text-base font-medium text-foreground leading-snug">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
