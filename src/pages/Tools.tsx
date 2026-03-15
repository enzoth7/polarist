import React from "react";
import { Wrench, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tools = () => {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-zinc-950 p-4 pb-20">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          La élite, no una biblioteca masiva. Solo lo que sirve.
        </p>
      </header>
      
      <div className="flex flex-col gap-6">
        
        {/* Tool 1 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shadow-purple-200">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl leading-tight">Make.com</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-muted text-muted-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                    Productividad
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-foreground/80 mb-1">¿Qué hace?</h4>
              <p className="text-sm text-muted-foreground">Conecta diferentes aplicaciones entre sí bajo la frase "Si pasa X, haz Y" sin usar código.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-sm text-foreground/80 mb-1">Por qué te importa a ti</h4>
              <p className="text-sm text-muted-foreground">Si sientes que pierdes horas copiando datos de correos a Excel, puedes delegarle esto 24/7 de forma automática y concentrarte en decisiones reales.</p>
            </div>
          </div>
          <div className="mt-5 border-t border-border pt-4 text-center">
             <button className="text-primary text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 mx-auto">
               Ver Caso Real Simplificado
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tools;
