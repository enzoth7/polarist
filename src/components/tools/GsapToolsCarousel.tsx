import React, { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { X, PlayCircle, FolderOpen, Blocks, Bot, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

// Registramos el plugin fundamental para the Morph (Flip)
gsap.registerPlugin(Flip);

// Estructura modular: array de datos.
export type InteractiveTool = {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  clips: { title: string; placeholderBg: string }[];
};

const THE_TOOLS: InteractiveTool[] = [
  {
    id: "tool-gemini",
    category: "LLM / Assistant",
    name: "Gemini",
    description: "Analiza montañas de informacion: carga hojas de calculo, documentos y audios para procesarlos a la velocidad de la luz gracias al contexto expansivo de Google.",
    icon: <Bot className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />,
    clips: [
      { title: "Generación de Reportes", placeholderBg: "bg-zinc-200 dark:bg-zinc-800" },
      { title: "Conexión a Drive", placeholderBg: "bg-zinc-300 dark:bg-zinc-700" },
    ],
  },
  {
    id: "tool-claude",
    category: "LLM / Reasoning",
    name: "Claude 3.5 Sonnet",
    description: "La herramienta líder en razonamiento complejo avanzado. Analiza y entiende contextos ambiguos con un control milimétrico, casi sin alucinaciones.",
    icon: <Blocks className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />,
    clips: [
      { title: "Escritura Adaptativa", placeholderBg: "bg-zinc-200 dark:bg-zinc-800" },
      { title: "Revisíon de Código", placeholderBg: "bg-zinc-300 dark:bg-zinc-700" },
    ],
  },
  {
    id: "tool-midjourney",
    category: "Generative AI",
    name: "Midjourney",
    description: "Produce el arte más impactante del mundo digital. Solo debes definir luces, camara y prompts para obtener un resultado fotorrealista imparable.",
    icon: <FolderOpen className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />,
    clips: [
      { title: "Creación de Assets", placeholderBg: "bg-zinc-200 dark:bg-zinc-800" },
    ],
  },
  {
    id: "tool-zapier",
    category: "Automatization",
    name: "Make",
    description: "Automatización visual que conecta cada parte de tu ecosistema. Si ocurre una venta en tu comercio, el sistema factura, responde y te notifica solo.",
    icon: <BarChart className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />,
    clips: [
      { title: "Workflow Visual", placeholderBg: "bg-zinc-200 dark:bg-zinc-800" },
      { title: "Integración Compleja", placeholderBg: "bg-zinc-300 dark:bg-zinc-700" },
    ],
  },
];

export const GsapToolsCarousel = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flipState, setFlipState] = useState<Flip.FlipState | null>(null);

  const selectedTool = THE_TOOLS.find((t) => t.id === selectedId);

  const toggleSelect = (id: string | null) => {
    // 1. Almacenar el estado (dimensiones, posiciones, radiuses, etc.) de las cosas marcadas
    // Usamos selectores CSS genéricos identificando las clases de morphing
    const state = Flip.getState(".flip-card, .flip-bg, .flip-icon, .flip-content", {
      props: "borderRadius,backgroundColor,boxShadow",
    });

    setFlipState(state);
    setSelectedId(id);
  };

  useLayoutEffect(() => {
    if (!flipState) return;

    // 2. Transicionar de forma fluida y orgánica desde el estado previo al actual con GSAP Flip
    Flip.from(flipState, {
      duration: 0.8,
      ease: "expo.out",
      absolute: true,        // Permite animaciones sin que el layout estalle (pasa a posición absoluta)
      absoluteOnLeave: true,
      nested: true,          // Habilita el morphing para elementos dentro de otros (el BG que se agiganta)
      zIndex: 50,
      scale: true,
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.3 }),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.3 }),
      onComplete: () => {
        setFlipState(null);
      },
    });
  }, [selectedId, flipState]);

  const handleHoverEnter = (e: React.MouseEvent) => {
    if (selectedId) return;
    const icon = e.currentTarget.querySelector(".flip-icon");
    if (icon) {
      // Efecto Pop-Out
      gsap.to(icon, {
        y: -32,
        scale: 1.25,
        duration: 0.5,
        ease: "back.out(1.8)",
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
      });
    }
  };

  const handleHoverLeave = (e: React.MouseEvent) => {
    if (selectedId) return;
    const icon = e.currentTarget.querySelector(".flip-icon");
    if (icon) {
      // Revertir efecto
      gsap.to(icon, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 0px 0px 0px rgba(0,0,0,0)",
      });
    }
  };

  return (
    <div className="relative w-full min-h-[700px] flex items-center justify-center pt-24 pb-20 overflow-visible text-foreground">
      
      {/* ======================= CARRUSEL HORIZONTAL ======================= */}
      <div
        className={cn(
          "flex gap-8 w-full max-w-6xl overflow-x-auto px-8 pb-32 pt-16 scrollbar-hide snap-x transition-opacity duration-300 overflow-visible z-10",
          selectedId ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {THE_TOOLS.map((tool) => (
          // Ocultamos la tarjeta seleccionada en el grid real porque se transiciona al Modal.
          selectedId !== tool.id && (
            <div
              key={tool.id}
              data-flip-id={\`card-\${tool.id}\`}
              className="flip-card relative w-64 h-[340px] shrink-0 snap-center cursor-pointer group"
              onClick={() => toggleSelect(tool.id)}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
              {/* Background Morphing Base */}
              <div
                data-flip-id={\`bg-\${tool.id}\`}
                className="flip-bg absolute inset-0 -z-10 rounded-3xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all group-hover:shadow-[0_12px_44px_-10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_12px_44px_-10px_rgba(255,255,255,0.03)]"
              />

              {/* El Icono "Pop-Out" */}
              <div className="flip-content flex-1 px-5 pt-8 flex flex-col justify-center items-center pointer-events-none">
                <div
                  data-flip-id={\`icon-\${tool.id}\`}
                  className="flip-icon relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-white dark:bg-black shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 dark:border-white/10 z-20"
                >
                  {tool.icon}
                </div>
              </div>

              {/* Textos Informativos Inferiores */}
              <div className="mt-auto px-6 pb-8 text-center pointer-events-none">
                <h3 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                  {tool.name}
                </h3>
                <span className="inline-block mt-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  {tool.category}
                </span>
              </div>
            </div>
          )
        ))}
      </div>

      {/* ======================= ESTADO EXPANSIÓN (THE MORPH) ======================= */}
      {selectedId && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 pointer-events-auto">
          {/* Overlay global para clicar y cerrar fuera del alcance central */}
          <div 
             className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-500" 
             onClick={() => toggleSelect(null)} 
          />

          <div
            data-flip-id={\`card-\${selectedTool.id}\`}
            className="flip-card relative flex flex-col md:flex-row w-full max-w-[1100px] h-full max-h-[750px] shadow-2xl rounded-[32px] overflow-hidden bg-background"
          >
            {/* El Morphing Background se convierte en el contenedor de categorias o del panel left.  */}
            <div
              data-flip-id={\`bg-\${selectedTool.id}\`}
              className="flip-bg absolute inset-y-0 left-0 w-full md:w-[360px] -z-10 bg-zinc-100 dark:bg-zinc-900 border-r border-black/5 dark:border-white/5"
            />

            {/* BOTÓN CERRAR - Con Fade In para que no parezca abrupto en el flip */}
            <button
              onClick={() => toggleSelect(null)}
              className="absolute top-6 right-6 z-50 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 p-2 text-foreground transition-colors animate-in fade-in duration-500 delay-300"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* SIDEBAR EXPANDIDA */}
            <div className="flip-content relative flex flex-col items-center md:items-start p-8 md:p-12 w-full md:w-[360px] shrink-0 border-b md:border-b-0 border-black/5 dark:border-white/5 overflow-y-auto">
              
              <div
                data-flip-id={\`icon-\${selectedTool.id}\`}
                className="flip-icon relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[32px] bg-white dark:bg-black shadow-[0_16px_40px_-10px_rgba(0,0,0,0.12)] border border-black/10 dark:border-white/10 my-6"
              >
                {selectedTool.icon}
              </div>

              <div className="text-center md:text-left animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">
                  {selectedTool.category}
                </span>
                <h2 className="text-3xl lg:text-4xl font-black tracking-[-0.03em] text-foreground mt-2 mb-4">
                  {selectedTool.name}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedTool.description}
                </p>
              </div>

              {/* Categorías Extras / Layout Video */}
              <div className="w-full mt-10 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                <div className="px-5 py-3 rounded-full bg-black/5 dark:bg-white/10 text-sm font-semibold tracking-wide cursor-pointer transition text-foreground">
                  Overview Completo
                </div>
                <div className="px-5 py-3 rounded-full text-sm font-semibold tracking-wide text-zinc-500 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  Comandos Rápidos
                </div>
              </div>
            </div>

            {/* PANEL DERECHO (Ejemplos / Clips) */}
            <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto bg-background animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <h3 className="text-2xl font-bold tracking-tight mb-8">Clips & Acción</h3>
              
              <div className="grid gap-6">
                {selectedTool.clips.map((clip, idx) => (
                  <div 
                    key={idx}
                    className="relative group w-full h-[220px] rounded-[24px] overflow-hidden border border-black/5 dark:border-white/5 cursor-pointer"
                  >
                    <div className={cn("absolute inset-0 transition-opacity", clip.placeholderBg)} />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-white/5 transition-colors duration-300">
                      <PlayCircle className="h-12 w-12 text-zinc-400 group-hover:text-white transition-colors duration-300 mb-3" />
                      <span className="font-bold text-sm text-zinc-600 group-hover:text-white transition-colors duration-300">
                        {clip.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
