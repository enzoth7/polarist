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
  prompts:  "https://images.unsplash.com/photo-1686191128892-3b37add4c844?auto=format&fit=crop&w=800&q=80",
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
      onSelect:    () => setOpenedFolderId(card.id),
    })),
    [],
  );

  if (openedFolderId) {
    return (
      <FolderDetailView
        folderId={openedFolderId}
        onClose={() => setOpenedFolderId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] flex flex-col items-center justify-start px-4 pb-16 pt-10">
      {/* Título */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h1
          className="text-4xl font-black tracking-tight text-[#F6F6F6] sm:text-5xl lg:text-7xl"
          style={{ letterSpacing: "-0.04em", fontFamily: "var(--font-sequel, sans-serif)" }}
        >
          Recursos
        </h1>
        <p
          className="mt-4 text-sm text-white/40 max-w-xs"
          style={{ fontFamily: "var(--font-sequel, sans-serif)", letterSpacing: "0.04em" }}
        >
          Pasá el cursor sobre cada módulo para explorar
        </p>
      </div>

      {/* Showcase interactivo */}
      <ResourceShowcase items={showcaseItems} />
    </div>
  );
};

export default Guides;
