import { useMemo, useState, useLayoutEffect } from "react";
import { Star, X, PlayCircle, ExternalLink, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import confetti from "canvas-confetti";

import { ToolLogo } from "@/components/tools/ToolLogo";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { type ToolItem, useToolsQuery } from "@/hooks/useTools";
import { showBubbleToast } from "@/lib/showBubbleToast";
import { cn } from "@/lib/utils";
import { RadarMetricsBoard } from "@/components/radar/RadarMetricsBoard";

gsap.registerPlugin(Flip);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const TOOL_INSIGHTS: Record<string, { whenToUse: string; whenNotToUse: string }> = {
  "claude": {
    whenToUse: "Excelente para programación compleja, análisis de texto profundo, redacción con tono humano y seguir instrucciones sumamente específicas sin inventar datos.",
    whenNotToUse: "Búsquedas web en tiempo real superficiales o tareas que obliguen a conectividad o interacción con gráficas 3D en vivo."
  },
  "chatgpt": {
    whenToUse: "El gran generalista. Vital para análisis de datos con Excel/CSV (Data Analyst), crear integraciones de voz inmediatas o generar imágenes de concepto rápido.",
    whenNotToUse: "Redacción literaria creativa extensa (su tono suele ser predecible) o desarrollo de código algorítmico super denso donde Claude 3.5 lo supera."
  },
  "gemini": {
    whenToUse: "Procesar montañas enormes de información: PDFs gigantes, libros enteros, o bases de código completas a la vez gracias a su contexto masivo de más de 2M de tokens.",
    whenNotToUse: "Generación de respuestas corporativas neutrales extremas (suele rechazar prompts inofensivos por barreras de seguridad sobre-restringidas)."
  },
  "perplexity": {
    whenToUse: "Motor definitivo de investigación de mercado fáctica. Buscar papers, citas académicas, o cruzar noticias en tiempo real con sus urls de origen claras.",
    whenNotToUse: "Reescribir textos creativos, programar, o tener sesiones de brainstorming abstractas a base de conocimiento no escrito."
  },
  "grok": {
    whenToUse: "Análisis instantáneo de tendencias sociales leyendo el feed global. Respuestas que requieran esquivar los filtros de censura típicos de occidente.",
    whenNotToUse: "Tareas corporativas ultra-críticas, desarrollo web robusto o procesamiento de reportes técnicos PDF gigantes."
  },
  "genspark": {
    whenToUse: "Para automatizar decenas de ramificaciones de búsqueda y condensar estudios de mercado o productos exhaustivos en 'Sparkpages' de inmediato.",
    whenNotToUse: "Programación, matemáticas puras u operaciones que no basen su respuesta estrictamente en internet compilada."
  },
  "kimi": {
    whenToUse: "Alternativa asiática con un músculo demencial para procesar documentaciones larguísimas y multidiomáticas, y resumir o generar extractos lógicos largos.",
    whenNotToUse: "Tareas que dependan fuertemente del ecosistema de software americano nativo, o multimodalidades complejas."
  },
  "lovable": {
    whenToUse: "Desarrollo instantáneo de webs, MVPs y dashboards funcionales desde cero usando una IA autónoma que escribe y despliega el código.",
    whenNotToUse: "Sistemas backend muy complejos escalables horizontalmente que requieran infraestructura de legacy o bases de datos mega corporativas."
  },
  "elevenlabs": {
    whenToUse: "Clonación y síntesis de voz humana hiperrealista, doblaje automático con sincronización labial y retención de perfil emocional.",
    whenNotToUse: "Sistemas de IVR telefónicos masivos que solo requieran que una voz robótica dicte algo simple (como marcación rápida antigua)."
  },
  "moises": {
    whenToUse: "Separación magistral de pistas STEM (voz, batería, bajo) desde un máster final. Excelente para músicos y productores controlando pitch y BPM.",
    whenNotToUse: "Si tu objetivo es generar música 100% instrumental o con coros artificiales escritos explícitamente desde texto bruto."
  },
  "higgsfield": {
    whenToUse: "Generación de video y control de movimiento hiper-realista en cinematografía AI con consistencia temporal avanzada en personajes.",
    whenNotToUse: "Si simplemente buscas editar un clip simple cortando pistas en un timeline rápido a lo Premiere Pro, o animar gráficos 2D corporativos estáticos."
  }
};

const getInsight = (toolName: string) => {
  const norm = toolName.toLowerCase();
  for (const [key, value] of Object.entries(TOOL_INSIGHTS)) {
    if (norm.includes(key)) return value;
  }
  return null;
};

const toolCategorySections = [
  {
    id: "modelos",
    title: "Modelos de Lenguaje",
    preferredTools: ["Claude", "ChatGPT", "Gemini", "Perplexity", "Grok", "Kimi"],
    keywords: ["llm", "modelo", "language", "chatbot", "assistant"],
  },
  {
    id: "automatizaciones",
    title: "Automatizaciones",
    preferredTools: ["Make", "Zapier", "n8n"],
    keywords: ["automat", "workflow", "integrat", "agent", "orchestr"],
  },
  {
    id: "diseno",
    title: "Diseño",
    preferredTools: ["Canva", "Pomelli", "Imagen", "Google Vids"],
    keywords: ["design", "diseno", "creative", "image", "visual"],
  },
  {
    id: "grabacion_audio_video",
    title: "Grabación de Audio / Video",
    preferredTools: ["ElevenLabs", "Moises", "Higgsfield"],
    keywords: ["video", "audio", "voice", "grabacion", "speech", "generator"],
  },
  {
    id: "paginas_web",
    title: "Páginas Web",
    preferredTools: ["Lovable"],
    keywords: ["web", "conocimiento", "knowledge", "wiki", "site", "landing", "builder"],
  },
] as const;

const Tools = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flipState, setFlipState] = useState<Flip.FlipState | null>(null);

  const { status } = useAuth();
  const { data: officialTools = [], error, isLoading } = useToolsQuery({ isBeta: false });

  const sectionedTools = useMemo(() => {
    const normalizedTools = officialTools.map((tool) => ({
      tool,
      name: normalizeText(tool.name),
      haystack: normalizeText(`\${tool.name} \${tool.category} \${tool.kind} \${tool.description ?? ""}`),
    }));

    return toolCategorySections.map((section) => {
      const pickedTools: ToolItem[] = [];

      const addTool = (candidate?: ToolItem) => {
        if (!candidate) return;
        if (pickedTools.some((pickedTool) => pickedTool.id === candidate.id)) return;
        pickedTools.push(candidate);
      };

      section.preferredTools.forEach((preferredName) => {
        const normalizedPreferred = normalizeText(preferredName);
        const preferredMatch = normalizedTools.find(
          ({ name, haystack }) =>
            name === normalizedPreferred ||
            name.includes(normalizedPreferred) ||
            normalizedPreferred.includes(name) ||
            haystack.includes(normalizedPreferred)
        );
        addTool(preferredMatch?.tool);
      });

      return {
        ...section,
        tools: pickedTools,
      };
    });
  }, [officialTools]);

  const sectionToolIds = useMemo(
    () => Array.from(new Set(sectionedTools.flatMap((section) => section.tools.map((tool) => tool.id)))),
    [sectionedTools]
  );

  const { isFavorited, isFavoritePending, isSaved, isSavePending, toggleFavorite, toggleSave } = useToolInteractions(sectionToolIds);
  const isAuthenticated = status === "authenticated";

  const selectedTool = officialTools.find((t) => t.id === selectedId);

  // Funciones de Lógica Rápida
  const handleQuickSave = async (toolId: string) => {
    const wasSaved = isSaved(toolId);
    if (!isAuthenticated) return showBubbleToast({ title: "Inicia sesión para guardar", description: "Guarda herramientas directo en tu perfil.", tone: "neutral" });
    try {
      await toggleSave(toolId);
      if (!wasSaved) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#10b981", "#34d399", "#a7f3d0", "#ffffff"],
          zIndex: 10000,
        });
      }
    } catch (error) {
      showBubbleToast({ title: "Error", description: "Prueba nuevamente.", tone: "danger" });
    }
  };

  const handleQuickFavorite = async (toolId: string) => {
    const wasFavorite = isFavorited(toolId);
    if (!isAuthenticated) return showBubbleToast({ title: "Inicia sesión", description: "Marca herramientas para potenciar el ranking.", tone: "neutral" });
    try {
      await toggleFavorite(toolId);
      if (!wasFavorite) {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.8 },
          colors: ["#fbbf24", "#f59e0b", "#fcd34d", "#ffffff"],
          zIndex: 10000,
        });
      }
    } catch (error) {
      showBubbleToast({ title: "Error", description: "Prueba nuevamente.", tone: "danger" });
    }
  };

  // Scroll function for Next/Prev
  const handleScroll = (direction: "left" | "right", sectionId: string) => {
    const container = document.getElementById(`scroll-${sectionId}`);
    if (container) {
      const scrollAmount = container.clientWidth * 0.7;
      container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  // =============== GSAP FLIP LOGIC ===============
  const toggleSelect = (id: string | null) => {
    // Resetear las transformaciones de íconos trancados antes del Flip para evitar "saltos" y bugs de proporciones en DOM.
    const allIcons = document.querySelectorAll(".flip-icon");
    gsap.killTweensOf(allIcons);
    gsap.set(allIcons, { y: 0, scale: 1, clearProps: "y,scale,boxShadow" });

    const state = Flip.getState(".flip-card, .flip-bg, .flip-icon, .flip-content", {
      props: "borderRadius,backgroundColor,boxShadow",
    });
    setFlipState(state);
    setSelectedId(id);
  };

  useLayoutEffect(() => {
    if (!flipState) return;

    Flip.from(flipState, {
      duration: 0.8,
      ease: "expo.out",
      absolute: true,
      absoluteOnLeave: true,
      nested: true,
      zIndex: 100,
      scale: true,
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.3 }),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.3 }),
      onComplete: () => setFlipState(null),
    });
  }, [selectedId, flipState]);

  const handleHoverEnter = (e: React.MouseEvent) => {
    if (selectedId) return;
    const icon = e.currentTarget.querySelector(".flip-icon");
    if (icon) {
      gsap.to(icon, {
        y: -32,
        scale: 1.25,
        duration: 0.5,
        ease: "back.out(1.8)",
        boxShadow: "0 22px 36px -12px rgba(0,0,0,0.18)",
      });
    }
  };

  const handleHoverLeave = (e: React.MouseEvent) => {
    if (selectedId) return;
    const icon = e.currentTarget.querySelector(".flip-icon");
    if (icon) {
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
    <div className="min-h-full bg-[#F0F2F6] px-4 pb-24 pt-6 md:px-12 md:pb-16 md:pt-10 overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl flex flex-col gap-4">

        <header className="flex flex-col items-start gap-2 mb-4 text-left w-full">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Catálogo</span>
          <h1 className="text-[clamp(2rem,4.5vw,3.8rem)] font-black tracking-tight leading-none text-zinc-900">
            Las mejores herramientas de IA
          </h1>
          <p className="text-zinc-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Explorá las potencias que dominan cada área del mundo digital, organizadas para vos.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-16 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="h-8 w-56 mb-8 rounded-lg bg-black/5 dark:bg-white/5" />
                <div className="flex gap-8 overflow-hidden">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-[340px] w-64 shrink-0 rounded-3xl bg-black/5 dark:bg-white/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <section className="rounded-[28px] border border-border/40 bg-black/5 dark:bg-white/5 px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No pudimos cargar el ranking. Vuelve a intentar.</p>
          </section>
        ) : (
          <div className={cn("transition-all duration-700 ease-out", selectedId ? "opacity-0 blur-md pointer-events-none scale-95" : "opacity-100")}>
            
            {sectionedTools.map((section) => (
              <section key={section.id} className="relative w-full mb-6">
                
              {/* Encabezado de sección */}
              <div className="mb-4 flex items-center justify-between w-full">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Categoría {sectionedTools.indexOf(section) + 1}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight mt-0.5">
                    {section.title}
                  </h2>
                </div>

                {/* Flechas glassmorphism */}
                <div className="flex items-center gap-2 shrink-0 pl-4">
                  <button
                    onClick={() => handleScroll("left", section.id)}
                    aria-label="Anterior"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:scale-110 active:scale-95"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleScroll("right", section.id)}
                    aria-label="Siguiente"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:scale-110 active:scale-95"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

                {/* ======================= CARRUSEL GRID CON CONTROLES ======================= */}
                <div className="relative group/carousel w-full flex flex-col">

                  {/* Pista del Carrusel (Scroller) */}
                  <div id={`scroll-${section.id}`} className="flex gap-4 overflow-x-auto pb-3 pt-4 px-1 snap-x items-center scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {section.tools.map((tool, index) => (
                      // GSAP Flip Items base
                      selectedId !== tool.id && (
                        <div
                          key={tool.id}
                          data-flip-id={`card-${tool.id}`}
                          onClick={() => toggleSelect(tool.id)}
                          onMouseEnter={handleHoverEnter}
                          onMouseLeave={handleHoverLeave}
                          className="flip-card relative w-[220px] h-[300px] shrink-0 snap-center cursor-pointer group"
                        >
                          {/* Número ranking */}
                          <div className="absolute top-5 left-5 font-mono text-[11px] font-black tracking-widest text-zinc-400 pointer-events-none z-30">
                            Nº{index + 1}
                          </div>

                          {/* Background */}
                          <div
                            data-flip-id={`bg-${tool.id}`}
                            className="flip-bg absolute inset-0 -z-10 rounded-[28px] bg-white border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] group-hover:-translate-y-1"
                          />

                          {/* Ícono pop-out */}
                          <div className="flip-content flex-1 px-5 pt-10 flex flex-col justify-center items-center pointer-events-none">
                            <div
                              data-flip-id={`icon-${tool.id}`}
                              className="flip-icon relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-zinc-100 z-20 overflow-hidden"
                            >
                              <ToolLogo name={tool.name} domain={tool.domain} className="w-11 h-11 border-none bg-transparent" />
                            </div>
                          </div>

                          {/* Textos inferiores */}
                          <div className="mt-auto px-5 pb-6 text-center pointer-events-none">
                            <h3 className="font-black text-lg tracking-tight text-zinc-900 line-clamp-1">
                              {tool.name}
                            </h3>
                            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>


                </div>
              </section>
            ))}

            <RadarMetricsBoard />
          </div>
        )}

        {/* ======================= THE MORPH (EXPANDIDO) ======================= */}
        {selectedId && selectedTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-auto">
            {/* Overlay Genérico */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-500" 
              onClick={() => toggleSelect(null)} 
            />

            <div
              data-flip-id={`card-${selectedTool.id}`}
              className="flip-card relative flex flex-col md:flex-row w-full max-w-[1280px] h-full max-h-[85vh] shadow-2xl rounded-[32px] overflow-hidden bg-background border border-black/10 dark:border-white/10"
            >
              {/* Contexto UI transformado o The "Sidebar" del Morph */}
              <div
                data-flip-id={`bg-${selectedTool.id}`}
                className="flip-bg absolute inset-y-0 left-0 w-full md:w-[420px] -z-10 bg-black/5 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/5"
              />

              {/* Botón de control de Flip Closure */}
              <button
                onClick={() => toggleSelect(null)}
                className="absolute top-6 right-6 z-50 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-black/5 dark:hover:bg-white/10 p-2.5 text-foreground transition-all animate-in fade-in duration-500 delay-300"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* ----- COLUMNA LATERAL (Details y Acciones) ----- */}
              <div className="flip-content relative flex flex-col p-8 md:p-12 w-full md:w-[420px] shrink-0 overflow-y-auto">
                <div
                  data-flip-id={`icon-${selectedTool.id}`}
                  className="flip-icon relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[32px] bg-white dark:bg-black shadow-[0_16px_40px_-10px_rgba(0,0,0,0.12)] border border-black/10 dark:border-white/10 mb-8 overflow-hidden"
                >
                  <ToolLogo name={selectedTool.name} domain={selectedTool.domain} className="w-16 h-16 border-none bg-transparent" />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                  <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">
                    {selectedTool.category}
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-black tracking-[-0.03em] text-foreground mt-2 mb-4">
                    {selectedTool.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground font-medium mb-8">
                    {selectedTool.description}
                  </p>

                  {/* ===== SECCIÓN DE INSIGHTS PROFESIONALES (Cuándo usar / Cuándo no) ===== */}
                  {(() => {
                    const insight = getInsight(selectedTool.name);
                    if (!insight) return null;
                    return (
                      <div className="flex flex-col gap-6 mb-8 px-2">
                        <div>
                          <h4 className="flex items-center gap-3 text-[11px] font-black tracking-[0.1em] uppercase text-emerald-800 dark:text-emerald-400 mb-1">
                            <span className="h-[6px] w-[6px] rounded-full bg-emerald-600 dark:bg-emerald-500 shadow-[0_0_8px_rgba(5,150,105,0.8)]" />
                            Cuándo Usarlo
                          </h4>
                          <p className="text-sm text-emerald-950/90 dark:text-emerald-200/80 font-medium leading-relaxed pl-4">{insight.whenToUse}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center gap-3 text-[11px] font-black tracking-[0.1em] uppercase text-red-700 dark:text-red-400 mb-1">
                            <span className="h-[6px] w-[6px] rounded-full bg-red-600 dark:bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                            Cuándo NO usarlo
                          </h4>
                          <p className="text-sm text-red-900/90 dark:text-red-200/80 font-medium leading-relaxed pl-4">{insight.whenNotToUse}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Acciones Reales (Guardar / Estrella) */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleQuickSave(selectedTool.id)}
                      disabled={isSavePending(selectedTool.id)}
                      className={cn(
                        "relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border px-5 py-4 text-sm font-semibold shadow-[0_12px_24px_-12px_rgba(0,0,0,0.62)] backdrop-blur-[18px] transition-all duration-300",
                        isSaved(selectedTool.id) 
                          ? "border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/20"
                          : "border-black/10 bg-white/55 text-foreground hover:bg-white/70 dark:border-white/20 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
                      )}
                    >
                      {!isSaved(selectedTool.id) && (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_42%)]" />
                          <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />
                        </>
                      )}
                      <span className="relative z-10">{isSaved(selectedTool.id) ? "Guardada en Biblioteca" : "Agregar a Biblioteca"}</span>
                      <Bookmark className={cn("relative z-10 h-4 w-4", isSaved(selectedTool.id) && "fill-current")} />
                    </button>

                    <button
                      onClick={() => handleQuickFavorite(selectedTool.id)}
                      disabled={isFavoritePending(selectedTool.id)}
                      className={cn(
                        "relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border px-5 py-4 text-sm font-semibold shadow-[0_12px_24px_-12px_rgba(0,0,0,0.62)] backdrop-blur-[18px] transition-all duration-300",
                        isFavorited(selectedTool.id)
                          ? "border-amber-400 bg-amber-400/10 text-amber-600 dark:border-amber-400 dark:bg-amber-400/20 dark:text-amber-300"
                          : "border-black/10 bg-white/55 text-foreground hover:bg-white/70 dark:border-white/20 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
                      )}
                    >
                      {!isFavorited(selectedTool.id) && (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_42%)]" />
                          <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />
                        </>
                      )}
                      <span className="relative z-10">{isFavorited(selectedTool.id) ? "Rankeado Premium" : "Impulsar el Ranking"}</span>
                      <Star className={cn("relative z-10 h-4 w-4", isFavorited(selectedTool.id) && "fill-current")} />
                    </button>

                    <a 
                      href={`https://${selectedTool.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border border-black/10 bg-white/55 px-5 py-4 mb-6 text-sm font-semibold shadow-[0_12px_24px_-12px_rgba(0,0,0,0.62)] backdrop-blur-[18px] transition-all duration-300 hover:bg-white/70 dark:border-white/20 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-foreground"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_42%)]" />
                      <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-black/12 dark:bg-white/30" />
                      
                      <span className="relative z-10 transition-transform group-hover:translate-x-1">Acceso al Sitio Web</span>
                      <ExternalLink className="relative z-10 h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* ----- ÁREA CENTRAL (Visuals, Use Cases, Clips) ----- */}
              <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto bg-background animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-px bg-zinc-400 dark:bg-zinc-600 block"></span>
                  <h3 className="text-xl font-bold tracking-widest uppercase text-foreground">Playbook Visual</h3>
                </div>
                
                <div className="w-full">
                  <div 
                    className="group relative w-full h-[380px] md:h-[450px] rounded-[36px] overflow-hidden border border-black/10 bg-white/60 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.62)] backdrop-blur-[18px] cursor-pointer dark:border-white/20 dark:bg-white/[0.06]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.08)_60%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.06)_30%,rgba(255,255,255,0.02)_58%,rgba(8,14,10,0.36)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.56),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(0,0,0,0.05),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_84%_100%,rgba(255,255,255,0.03),transparent_42%)]" />
                    <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-black/12 dark:bg-white/30" />

                    <div className="absolute inset-0 transition-opacity bg-background/50 backdrop-blur-md group-hover:bg-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-zinc-900/60 transition-colors duration-500">
                      <PlayCircle className="h-20 w-20 md:h-24 md:w-24 text-zinc-400 group-hover:text-white transition-all duration-500 mb-6 scale-95 group-hover:scale-110 drop-shadow-2xl" />
                      <span className="font-extrabold text-lg md:text-xl text-zinc-500 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                        Ver Máster Class
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tools;
