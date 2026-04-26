import { useMemo } from "react";

import { conceptosBasicos } from "@/components/education/ConceptosBasicos";
import { FolderDetailView } from "@/components/guides/FolderDetailView";
import { guideFoldersCatalog } from "@/data/guideFoldersCatalog";
import ResourceShowcase, { type ShowcaseItem } from "@/components/ui/resource-showcase";
import { useState } from "react";

// ── Imágenes por carpeta (Unsplash, temáticas) ─────────────────────────────
const FOLDER_IMAGES: Record<string, string> = {
  social:   "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  web:      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  visual:   "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=800&q=80",
  decision: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?auto=format&fit=crop&w=800&q=80",
  strategy: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
  timeline: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80",
  terms:    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
  prompts:  "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&w=800&q=80",
  memory:   "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80",
};

const Guides = () => {
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);

  const showcaseItems = useMemo<ShowcaseItem[]>(() =>
    guideFoldersCatalog.map((card) => ({
      id:          card.id,
      title:       card.title,
      eyebrow:     card.eyebrow,
      description: card.id === "recursos"
        ? card.description.replace("{count}", String(conceptosBasicos.length))
        : card.description,
      image:       FOLDER_IMAGES[card.id] ?? "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      onSelect:    () => {}, // Desactivado por ahora
    })),
    [],
  );

  return (
    <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-start px-4 pb-32 pt-24">
      {/* Sección Introductoria y Tutorial */}
      <div className="max-w-4xl w-full mb-24 space-y-12">
        <div className="space-y-6 text-center">
          <p 
            style={{ 
              fontFamily: "var(--font-sequel, sans-serif)",
              color: "#F6F6F6",
              fontSize: "16px",
              lineHeight: "1.7",
              fontWeight: 400,
              maxWidth: "800px",
              marginInline: "auto"
            }}
          >
            Toda la información de estos capítulos ya fue investigada, filtrada y validada por nosotros. El objetivo es que la leas y la analices para formar tu propio criterio antes de usar cualquier herramienta.
          </p>
          <p 
            style={{ 
              fontFamily: "var(--font-sequel, sans-serif)",
              color: "#F6F6F6",
              fontSize: "16px",
              lineHeight: "1.7",
              fontWeight: 400,
              maxWidth: "800px",
              marginInline: "auto"
            }}
          >
            <span style={{ fontWeight: 700, color: "#CAFE5B" }}>¿La mejor parte?</span> Si la información te sirve, no tenés que perder tiempo explicándosela a tu inteligencia artificial desde cero.
          </p>
          <p 
            style={{ 
              fontFamily: "var(--font-sequel, sans-serif)",
              color: "#F6F6F6",
              fontSize: "16px",
              lineHeight: "1.7",
              fontWeight: 400,
              maxWidth: "800px",
              marginInline: "auto"
            }}
          >
            En el tutorial de acá abajo te mostramos cómo cargar los archivos que dejamos al final de cada capítulo directamente en tu IA favorita. Así, tu modelo arranca pensando con toda esta base al instante, acelerando tus procesos y ahorrándote horas de prueba y error.
          </p>
        </div>

        {/* Contenedor de Vídeo 16:9 */}
        <div className="w-full max-w-4xl mx-auto px-4">
          <div 
            className="relative aspect-video w-full overflow-hidden group"
            style={{ 
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center bg-[#CAFE5B]/10 border border-[#CAFE5B]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#CAFE5B]/20"
              >
                <div 
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                    borderLeft: "16px solid #CAFE5B",
                    marginLeft: "4px"
                  }}
                />
              </div>
            </div>
            {/* Overlay de brillo sutil */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                 style={{ background: "radial-gradient(circle at 50% 50%, rgba(202,254,91,0.05) 0%, transparent 70%)" }} />
          </div>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-[#F6F6F6]/30 font-bold" style={{ fontFamily: "var(--font-sequel)" }}>
            Tutorial: Cómo usar los recursos
          </p>
        </div>
      </div>

      {/* Título Principal */}
      <div className="mb-20 flex flex-col items-center text-center">
        <h1
          style={{ 
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em", 
            lineHeight: 1,
            fontFamily: "var(--font-sequel, sans-serif)",
            color: "#F6F6F6"
          }}
        >
          Recursos
        </h1>
      </div>

      {/* Showcase interactivo */}
      <ResourceShowcase items={showcaseItems} />
    </div>
  );
};

export default Guides;
