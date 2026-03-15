import React, { useState } from "react";
import { Search, Copy, BookmarkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Shortcuts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { requireAuth } = useAuth();

  const handleCopy = requireAuth(() => {
    console.log("Copied to clipboard");
  });

  const handleBookmark = requireAuth(() => {
    console.log("Bookmarked prompt");
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-zinc-950 p-4 pb-20">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Shortcuts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Prompts diseñados por expertos, listos para copiar.
        </p>
      </header>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-9 h-10 w-full bg-background rounded-full shadow-sm" 
          placeholder="Buscar atajos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5">
        
        {/* Shortcut 1 */}
        <div className="bg-card border border-border rounded-xl px-5 py-6 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl leading-tight text-foreground pr-8">
              Convertir seguidores en Leads Calientes
            </h3>
            <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">Ventas</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Úsalo cuando un usuario pregunta por tu precio en Instagram para generar urgencia sin sonar agresivo.
          </p>
          
          <div className="bg-muted rounded-md p-4 font-mono text-sm shadow-inner relative mt-2 border-l-4 border-l-blue-500">
            <p className="text-foreground italic mb-2">"Actúa como un cerrador de ventas experto. Crea 3 respuestas para [Producto/Servicio] enfocadas en..."</p>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ver Ejemplo</span>
            </div>
          </div>
          
          <div className="mt-2 flex gap-2">
            <Button onClick={handleCopy} className="w-full gap-2 font-bold py-6 text-sm" variant="default">
              <Copy className="w-5 h-5" /> Copiar y Usar
            </Button>
            <Button onClick={handleBookmark} variant="outline" size="icon" className="h-auto w-14 shrink-0 rounded-lg">
              <BookmarkIcon className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Shortcut 2 */}
        <div className="bg-card border border-border rounded-xl px-5 py-6 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl leading-tight text-foreground pr-8">
              Guion de Video Ads (Estructura Hook, Body, Call to Action)
            </h3>
            <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">Contenido</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Diseñado para anuncios cortos en TikTok o Reels donde el objetivo es conseguir que visiten tu perfil.
          </p>
          
          <div className="bg-muted rounded-md p-4 font-mono text-sm shadow-inner relative mt-2 border-l-4 border-l-purple-500">
            <p className="text-foreground italic mb-2">"Necesito un guion de 30 segundos para vender [Producto] a una audiencia de [Edad]..."</p>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ver Ejemplo</span>
            </div>
          </div>
          
          <div className="mt-2 flex gap-2">
            <Button onClick={handleCopy} className="w-full gap-2 font-bold py-6 text-sm" variant="default">
              <Copy className="w-5 h-5" /> Copiar y Usar
            </Button>
            <Button onClick={handleBookmark} variant="outline" size="icon" className="h-auto w-14 shrink-0 rounded-lg">
              <BookmarkIcon className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shortcuts;
