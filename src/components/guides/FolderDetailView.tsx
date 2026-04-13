import { ArrowLeft, Bookmark, BookmarkPlus, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChapterCard = {
  id: string;
  title: string;
  subtitle: string;
  isUnlocked: boolean;
  isActive?: boolean;
};

// Datos Mockup base solicitados
const mockChapters: ChapterCard[] = [
  { id: "1", title: "Bases de Redes Sociales", subtitle: "Fundamentos clave", isUnlocked: true },
  { id: "2", title: "Estrategia de Contenido", subtitle: "Pilares y planificación", isUnlocked: true },
  { id: "3", title: "Algoritmo y Alcance", subtitle: "Distribución orgánica", isUnlocked: true },
  { id: "4", title: "Métricas Core", subtitle: "Lectura de estadísticas", isUnlocked: true },
  { id: "5", title: "Formatos Verticales", subtitle: "Reels y TikToks", isUnlocked: false },
  { id: "6", title: "Filtro de Audiencia", subtitle: "Segmentación", isUnlocked: false },
  { id: "7", title: "Interacción Directa", subtitle: "Manejo de DMs", isUnlocked: false },
  { id: "8", title: "Errores Comunes", subtitle: "Casos de fracaso", isUnlocked: false },
  { id: "9", title: "Diferenciación", subtitle: "Identidad visual", isUnlocked: false },
  { id: "10", title: "Crecimiento IA", subtitle: "Prompting para RRSS", isUnlocked: true },
];

interface FolderDetailViewProps {
  folderId: string;
  onClose: () => void;
}

const renderBentoContent = (chapterId: string) => {
  return (
    <div className="mt-16 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* 1. HERO WIDE CARD */}
      <div className="flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/50 min-h-[460px]">
        {/* Left Side: Soft Image Fade */}
        <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden bg-[#F8F9FB]">
          <img 
            src="/images/placeholders/rrss_hero_art_1776044207483.png" 
            alt="Hero Conceptual" 
            className="absolute inset-0 w-full h-full object-cover object-center translate-x-[-10%]" 
          />
          {/* Gradient fade to blend with content side on desktop */}
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent hidden md:block" />
          {/* Gradient fade on mobile */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent md:hidden" />
        </div>
        
        {/* Right Side: Text & Actions */}
        <div className="relative z-10 w-full md:w-[55%] p-8 md:p-14 flex flex-col justify-center bg-white">
          <span className="inline-flex self-start items-center justify-center rounded-full bg-zinc-100 px-3 py-1 font-semibold text-[11px] uppercase tracking-wider text-zinc-600 mb-6 border border-zinc-200/50">
            Strategy Core
          </span>
          <h2 className="text-3xl md:text-[2.6rem] leading-[1.05] font-black text-zinc-900 tracking-tight mb-5 text-balance">
            Por qué fallan al crear la identidad digital
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed max-w-md mb-8 text-sm md:text-base text-pretty">
            Muchos equipos gastronómicos se apresuran a postear platos, pero olvidan el diseño base. Este módulo destripa qué hacer exactamente para mantenerte claro, competitivo y frenar la pérdida de retención audivisual.
          </p>
          
          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 mb-8">
            <h4 className="font-bold text-zinc-800 text-sm mb-3">Qué tenés que hacer hoy:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5 text-sm text-zinc-600 font-medium">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Definir 3 pilares visuales estrictos.
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-600 font-medium">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Auditar los colores de tu feed actual vs tu competencia.
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-600 font-medium">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Crear plantilla madre en Figma / Canva que no se varíe.
              </li>
            </ul>
          </div>

          <div className="mt-auto flex justify-between items-center text-xs font-bold text-zinc-800 pt-2">
            <span className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" /> 5 min read
            </span>
            <span className="italic opacity-50 font-serif text-[13px]">by Polarist</span>
          </div>
        </div>
      </div>

      {/* 2. GRID 3 CARDS BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.03)] border border-white flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
          <div className="relative h-48 md:h-56 bg-zinc-50 overflow-hidden">
            <img src="/images/placeholders/rrss_card_growth_1776044221682.png" alt="Growth" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Growth
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col bg-white z-10 -mt-8">
            <h3 className="text-lg font-bold text-zinc-900 leading-tight mb-3">El Costo Real de no Atender el Delivery de Audio</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              Audios de Instagram reels sin retención de gancho estallan las analíticas hacia la baja y paralizan tu crecimiento.
            </p>
            <ul className="mt-auto space-y-1.5">
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Extraer ganchos sonoros
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Transiciones cada 3s
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.03)] border border-white flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
          <div className="relative h-48 md:h-56 bg-zinc-50 overflow-hidden">
            <img src="/images/placeholders/rrss_card_ops_1776044237034.png" alt="Operations" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Operations
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col bg-white z-10 -mt-8">
            <h3 className="text-lg font-bold text-zinc-900 leading-tight mb-3">Conseguir Más Tráfico Sin Contratar Medios</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              Pequeños equipos están usando automatizaciones DM para responder reservaciones 24/7 sin pagar nómina.
            </p>
            <ul className="mt-auto space-y-1.5">
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Crear flujos Manychat
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Vincular N8N con base
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.03)] border border-white flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
          <div className="relative h-48 md:h-56 bg-zinc-50 overflow-hidden">
            <img src="/images/placeholders/rrss_card_workflow_1776044253088.png" alt="Workflow" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Workflow
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col bg-white z-10 -mt-8">
            <h3 className="text-lg font-bold text-zinc-900 leading-tight mb-3">La Calidez en el Trato Directo</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              Una mirada tras bambalinas de cómo los managers conectan con su comunidad de clientes regulares.
            </p>
            <ul className="mt-auto space-y-1.5">
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Mencionar usuarios activos
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <ChevronRight className="h-3 w-3 text-orange-500" /> Retwits a la comunidad
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export const FolderDetailView = ({ folderId, onClose }: FolderDetailViewProps) => {
  const [activeChapter, setActiveChapter] = useState<string>("1");
  const [savedChapters, setSavedChapters] = useState<Set<string>>(new Set(["10"])); // Mock de guardados

  const handleToggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="mx-auto w-full max-w-[1200px]">
        
        {/* Superior Header */}
        <button
          onClick={onClose}
          className="group flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors mb-10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] group-hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-widest uppercase text-xs">Volver a Recursos</span>
        </button>

        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
          Redes Sociales V2
        </h1>
        <p className="text-zinc-500 font-medium mb-16 max-w-xl">
          Selecciona un capítulo de la estructura para desplegar la información o adentrarte en el contenido profundo.
        </p>

        {/* Grid Neumorfico de Píldoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockChapters.map((chapter) => {
            const isSelected = activeChapter === chapter.id;
            const isSaved = savedChapters.has(chapter.id);

            return (
              <div
                key={chapter.id}
                onClick={chapter.isUnlocked ? (() => setActiveChapter(chapter.id)) : undefined}
                className={cn(
                  "relative flex items-center justify-between px-6 py-5 rounded-[2rem]",
                  "transition-all duration-300 w-full text-left bg-[#F0F2F6]",
                  chapter.isUnlocked ? "cursor-pointer" : "opacity-60 grayscale cursor-not-allowed",
                  isSelected 
                    ? "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]"
                    : "shadow-[6px_6px_14px_rgba(0,0,0,0.06),-6px_-6px_14px_rgba(255,255,255,0.9)] hover:scale-[1.02]"
                )}
              >
                <div className="flex flex-col gap-1 pr-4">
                  <span className="font-bold text-zinc-800 text-lg">{chapter.title}</span>
                  <span className="text-xs font-medium text-zinc-400">{chapter.subtitle}</span>
                </div>

                {/* Right Icon Button Neumórfico - GUARDAR */}
                <button 
                  disabled={!chapter.isUnlocked}
                  onClick={(e) => handleToggleSave(e, chapter.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full cursor-pointer transition-all",
                    isSaved 
                      ? "shadow-[0_0_15px_rgba(251,146,60,0.4)] bg-white" 
                      : "bg-[#F0F2F6] shadow-[4px_4px_8px_rgba(0,0,0,0.06),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.03),-4px_-4px_8px_rgba(255,255,255,0.9)]"
                  )}
                >
                  {isSaved ? (
                    <Bookmark className="h-4 w-4 md:h-5 md:w-5 text-orange-500 fill-orange-500 scale-110 transition-transform" />
                  ) : chapter.isUnlocked ? (
                    <BookmarkPlus className="h-4 w-4 md:h-5 md:w-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-zinc-300 shadow-inner" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* CONTENIDO INTERNO PROFUNDO: BENTO */}
        {activeChapter && renderBentoContent(activeChapter)}

      </div>
    </div>
  );
};
