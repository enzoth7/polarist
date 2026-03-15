import React from "react";
import { Copy, ArrowRight, Play, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const Radar = () => {
  return (
    <div className="flex flex-col min-h-full bg-background p-4 pb-20">
      <header className="mb-4 pt-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Tu Radar</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Inteligencia táctica lista para usar hoy.
        </p>
      </header>
      
      <div className="flex flex-col gap-6">
        {/* Card 1: Main Highlight (Neon Green) */}
        <div className="bg-primary text-primary-foreground rounded-[32px] p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
             <span className="bg-primary-foreground/10 text-primary-foreground text-[10px] uppercase font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                Caso Real
             </span>
             <span className="text-xs font-bold opacity-70">Gastronomía</span>
          </div>
          <div className="z-10 mt-2">
            <h3 className="font-extrabold text-3xl leading-none tracking-tight mb-3">
              Maiketing<br/>Services
            </h3>
            <p className="text-sm font-medium opacity-80 leading-snug w-2/3">
              Una pizzería duplicó sus reservas por WhatsApp automatizando consultas en 10 min.
            </p>
          </div>
          <div className="mt-4 z-10 flex gap-2">
            <Button className="bg-primary-foreground text-primary rounded-full font-bold px-6 border-none hover:opacity-90 transition-opacity">
              Conocer el caso
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-primary-foreground/10 border-none text-primary-foreground hover:bg-primary-foreground/20">
              <Play className="w-4 h-4" />
            </Button>
          </div>
          {/* Decoración Simulando el Avatar de la imagen - Abstract Shape */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 blur-2xl rounded-full z-0 pointer-events-none"></div>
        </div>

        {/* Shortcuts Section Title */}
        <div className="mt-2 flex items-center justify-between">
           <h2 className="text-xl font-bold text-foreground">Shortcuts</h2>
           <span className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">Ver Todos</span>
        </div>

        {/* Card 2: Prompt Listo (Dark) */}
        <div className="bg-foreground text-background rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
           <div className="flex gap-2 mb-2">
              <span className="bg-background/20 text-background text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                Guion
              </span>
              <span className="bg-background/20 text-background text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                Viral
              </span>
           </div>
           
           <h3 className="font-bold text-2xl leading-none">
             Estructura Reels
           </h3>
           <p className="text-sm font-medium opacity-70 leading-snug">
             Prompt táctico para obtener un guion corto que convierte vistas en seguidores.
           </p>

           <div className="mt-4">
              <Button className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:opacity-90 rounded-full border-none transition-colors">
                <Copy className="w-4 h-4 mr-2" /> Copiar y Usar
              </Button>
           </div>
        </div>

        {/* Two Columns Grid for smaller cards */}
        <div className="grid grid-cols-2 gap-4">
            {/* Small Card 1 */}
            <div className="bg-muted text-muted-foreground rounded-[32px] p-5 flex flex-col items-center justify-center text-center gap-3">
               <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                 <span className="text-xl font-bold text-foreground">M</span>
               </div>
               <div>
                 <h4 className="font-bold text-foreground leading-none">Make.com</h4>
                 <p className="text-[10px] mt-1 font-medium">Automatizaciones sin código</p>
               </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-foreground text-background rounded-[32px] p-5 flex flex-col gap-3 relative overflow-hidden">
               <div className="flex justify-between items-center z-10">
                 <span className="text-xs font-bold opacity-70">Community</span>
                 <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-xs">💬</span>
               </div>
               <div className="z-10 mt-auto pt-8">
                 <h4 className="font-bold text-sm leading-tight mb-1">Debate de E-commerce</h4>
                 <p className="text-[10px] opacity-70 leading-snug">Herramientas para recuperar carritos hoy.</p>
               </div>
               <Button className="absolute bottom-4 right-4 bg-primary text-primary-foreground font-bold rounded-full text-[10px] px-3 py-1 h-auto z-10 border-none">
                 Entrar
               </Button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Radar;
