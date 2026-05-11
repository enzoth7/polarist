import { useMemo, useState } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useResourcesQuery, type ResourceItem } from "@/hooks/useResources";
import ResourceShowcase, { type ShowcaseItem } from "@/components/ui/resource-showcase";
import Modal from "@/components/ui/modal-drop";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80";

const SANS = "var(--font-sequel, sans-serif)";

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3
      className="mt-10 text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#F6F6F6] first:mt-0 md:text-[1.5rem]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4
      className="mt-8 text-[1.05rem] font-bold leading-[1.25] tracking-[-0.015em] text-[#F6F6F6] md:text-[1.15rem]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p
      className="mt-3 text-[14.5px] leading-[1.75] text-[#F6F6F6]/72 md:text-[15px]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-3 flex flex-col gap-2.5 pl-1">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li
      className="relative pl-5 text-[14.5px] leading-[1.6] text-[#F6F6F6]/72 before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-[#CAFE5B] md:text-[15px]"
      style={{ fontFamily: SANS }}
    >
      {children}
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-[#F6F6F6]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="not-italic text-[#F6F6F6]/55" style={{ fontFamily: SANS }}>
      {children}
    </em>
  ),
};

const ResourceDetail = ({ resource, onClose }: { resource: ResourceItem; onClose: () => void }) => (
  <div className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#010101] text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
    <button
      type="button"
      aria-label="Cerrar"
      onClick={onClose}
      className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      <X className="h-5 w-5" strokeWidth={2} />
    </button>

    <div className="flex-1 overflow-y-auto overscroll-contain">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img src={resource.image ?? FALLBACK_IMAGE} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/40 to-transparent" />
      </div>

      <div className="px-7 pb-12 pt-6 md:px-10 md:pb-14 md:pt-8">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#CAFE5B]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {resource.eyebrow}
        </p>
        <h2
          className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: SANS }}
        >
          {resource.title}
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.7] text-[#F6F6F6]/70"
          style={{ fontFamily: SANS }}
        >
          {resource.description}
        </p>

        {resource.content ? (
          <div className="mt-10 border-t border-white/8 pt-8">
            <ReactMarkdown components={markdownComponents}>{resource.content}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

const Resources = () => {
  const { data: resources = [] } = useResourcesQuery();
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);

  const openedResource = resources.find((r) => r.id === openedFolderId) ?? null;

  const showcaseItems = useMemo<ShowcaseItem[]>(() =>
    resources.map((resource) => ({
      id:          resource.id,
      title:       resource.title,
      eyebrow:     resource.eyebrow,
      description: resource.description,
      image:       resource.image ?? FALLBACK_IMAGE,
      onSelect:    () => setOpenedFolderId(resource.id),
    })),
    [resources],
  );

  return (
    <>
      <Modal
        isOpen={!!openedResource}
        onClose={() => setOpenedFolderId(null)}
        type="blur"
        animationType="scale"
        disablePadding
        showCloseButton={false}
        position={0}
        centerOnMobile
        className="!max-w-[720px] border-0 !bg-transparent shadow-none"
      >
        {openedResource ? (
          <ResourceDetail resource={openedResource} onClose={() => setOpenedFolderId(null)} />
        ) : null}
      </Modal>

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
    </>
  );
};

export default Resources;
