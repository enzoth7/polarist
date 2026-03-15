import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Guides = () => {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-zinc-950 p-4 pb-20">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Guías Visuales</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aprende a instalar las mejores herramientas sin jerga técnica.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Guide Card */}
        <div className="bg-card border border-border rounded-xl p-0 overflow-hidden shadow-sm">
          <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center p-6 text-center text-muted-foreground leading-snug">
            {/* Aquí iría la Preview de la guía con Play/Video/Thumbnail */}
            [Thumbnail: WhatsApp + Notifier Integrado]
          </div>
          
          <div className="p-5">
             <div className="flex justify-between items-start mb-2">
                <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-2 inline-block">
                  Sales Automations
                </span>
                <span className="text-xs text-muted-foreground font-medium">Básico</span>
             </div>
             
             <h3 className="font-bold text-xl leading-tight mb-2">
               Cómo crear tu bot de WhatsApp de Venta 24/7 sin programar
             </h3>
             <p className="text-sm text-muted-foreground mb-4">
               Paso a paso usando ManyChat para negocios de servicios y retail.
             </p>

             <div className="space-y-3 mt-4 mb-6">
               <div className="flex gap-3 items-center text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs"><CheckCircle2 className="w-4 h-4"/></div>
                 Conectar WhatsApp Business
               </div>
               <div className="flex gap-3 items-center text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs"><CheckCircle2 className="w-4 h-4"/></div>
                 Crear Flujo Principal
               </div>
               <div className="flex gap-3 items-center text-sm font-medium">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs"><CheckCircle2 className="w-4 h-4"/></div>
                 Publicar
               </div>
             </div>

             <Button className="w-full font-bold">Ver Guía Interactiva</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guides;
