import React from "react";
import { Users, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Community = () => {
  const { requireAuth } = useAuth();

  const handleJoinRoom = requireAuth(() => {
    console.log("Joined Room");
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-zinc-950 p-4 pb-20">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Comunidad</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aprende qué le funciona a tus colegas en este momento.
        </p>
      </header>

      {/* Tu Sector (Configurado por Onboarding MVP) */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-5 shadow-lg relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Users className="w-24 h-24" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest opacity-80 mix-blend-plus-lighter">
          Tu Red Actual
        </span>
        <h2 className="text-2xl font-bold mt-1 mb-1">Sector: E-commerce</h2>
        <p className="opacity-90 max-w-[80%] text-sm">
          Únete al debate de hoy sobre herramientas de recuperación de abandono de carrito con IA.
        </p>
        <button 
           onClick={handleJoinRoom}
           className="mt-4 bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm shadow-sm md:hover:bg-gray-100 transition-colors"
        >
          Entrar a E-commerce Room
        </button>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-4">Otros Sectores</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Otra Industria */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 mb-2 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl">👩‍🍳</span>
            </div>
            <h4 className="font-bold text-sm text-foreground">Gastronomía</h4>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> 1,234 posts
            </div>
        </div>

         <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 mb-2 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl">🛠️</span>
            </div>
            <h4 className="font-bold text-sm text-foreground">Servicios B2B</h4>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> 432 posts
            </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 mb-2 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl">👗</span>
            </div>
            <h4 className="font-bold text-sm text-foreground">Moda & Retail</h4>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> 890 posts
            </div>
        </div>

         <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 mb-2 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl">📸</span>
            </div>
            <h4 className="font-bold text-sm text-foreground">Content Creators</h4>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> 2,130 posts
            </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
