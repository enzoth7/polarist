import { useMemo, useState } from "react";
import { ExternalLink, Download } from "lucide-react";

import { FALLBACK_RESOURCE_IMAGE, ResourceDetail } from "@/components/resources/ResourceDetail";
import Modal from "@/components/ui/modal-drop";
import ResourceShowcase, { type ShowcaseItem } from "@/components/ui/resource-showcase";
import { useResourceDownloadsQuery, type DownloadItem } from "@/hooks/useResourceDownloads";
import { useResourcesQuery } from "@/hooks/useResources";

const SANS = "var(--font-sequel, sans-serif)";

async function forceDownload(url: string) {
  const filename = url.split("/").pop() ?? "archivo";
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

const LINK_THUMB = "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=80&q=70";
const SKILL_THUMB = "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=80&q=70";

function DownloadRow({ item, isLast }: { item: DownloadItem; isLast: boolean }) {
  const isDownload = item.type === "download";
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await forceDownload(item.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded-xl py-4 transition-colors duration-300 hover:bg-white/[0.05]">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <img
              src={item.imageUrl ?? (isDownload ? SKILL_THUMB : LINK_THUMB)}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "grayscale(0.3) brightness(0.75)" }}
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#F6F6F6]"
              style={{ fontFamily: SANS }}
            >
              {item.title}
            </p>
            {item.description ? (
              <p
                className="mt-1 text-[13px] leading-[1.55] text-[#F6F6F6]/50"
                style={{ fontFamily: SANS }}
              >
                {item.description}
              </p>
            ) : null}
          </div>
        </div>
        {isDownload ? (
          <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#F6F6F6]/60 transition-colors hover:border-[#CAFE5B]/40 hover:text-[#CAFE5B] disabled:opacity-40"
            aria-label="Descargar"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#F6F6F6]/60 transition-colors hover:border-[#a78bfa]/40 hover:text-[#a78bfa]"
            aria-label="Abrir enlace"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2} />
          </a>
        )}
      </div>
      {!isLast ? <div className="mx-14 h-px bg-white/10" /> : null}
    </div>
  );
}

const Resources = () => {
  const { data: resources = [] } = useResourcesQuery();
  const { data: downloads = [] } = useResourceDownloadsQuery();
  const [openedResourceId, setOpenedResourceId] = useState<string | null>(null);

  const openedResource = resources.find((resource) => resource.id === openedResourceId) ?? null;

  const showcaseItems = useMemo<ShowcaseItem[]>(
    () =>
      resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        eyebrow: resource.eyebrow,
        description: resource.description,
        image: resource.image ?? FALLBACK_RESOURCE_IMAGE,
        onSelect: () => setOpenedResourceId(resource.id),
      })),
    [resources],
  );

  return (
    <>
      <Modal
        isOpen={Boolean(openedResource)}
        onClose={() => setOpenedResourceId(null)}
        type="blur"
        animationType="scale"
        disablePadding
        showCloseButton={false}
        position={0}
        centerOnMobile
        className="!max-w-[720px] border-0 !bg-transparent shadow-none"
      >
        {openedResource ? (
          <ResourceDetail resource={openedResource} onClose={() => setOpenedResourceId(null)} />
        ) : null}
      </Modal>

      <div className="flex min-h-screen flex-col items-center justify-start bg-[#010101] px-4 pb-32 pt-24">
        <div className="mb-24 w-full max-w-4xl space-y-12">
          <div className="space-y-6 text-center">
            <p
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                color: "#F6F6F6",
                fontSize: "16px",
                lineHeight: "1.7",
                fontWeight: 400,
                maxWidth: "800px",
                marginInline: "auto",
              }}
            >
              Toda la información de estos capítulos ya fue investigada, filtrada y validada por
              nosotros. El objetivo es que la leas y la analices para formar tu propio criterio
              antes de usar cualquier herramienta.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                color: "#F6F6F6",
                fontSize: "16px",
                lineHeight: "1.7",
                fontWeight: 400,
                maxWidth: "800px",
                marginInline: "auto",
              }}
            >
              <span style={{ fontWeight: 700, color: "#CAFE5B" }}>¿La mejor parte?</span> Si la
              información te sirve, no tenés que perder tiempo explicándosela a tu inteligencia
              artificial desde cero.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                color: "#F6F6F6",
                fontSize: "16px",
                lineHeight: "1.7",
                fontWeight: 400,
                maxWidth: "800px",
                marginInline: "auto",
              }}
            >
              En el tutorial de acá abajo te mostramos cómo cargar los archivos que dejamos al
              final de cada capítulo directamente en tu IA favorita. Así, tu modelo arranca
              pensando con toda esta base al instante, acelerando tus procesos y ahorrándote horas
              de prueba y error.
            </p>
          </div>

          <div className="mx-auto w-full max-w-4xl px-4">
            <div
              className="group relative aspect-video w-full overflow-hidden"
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#CAFE5B]/20 bg-[#CAFE5B]/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#CAFE5B]/20">
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderLeft: "16px solid #CAFE5B",
                      marginLeft: "4px",
                    }}
                  />
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(202,254,91,0.05) 0%, transparent 70%)",
                }}
              />
            </div>
            <p
              className="mt-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#F6F6F6]/30"
              style={{ fontFamily: "var(--font-sequel)" }}
            >
              Tutorial: Cómo usar los recursos
            </p>
          </div>
        </div>

        <div className="mb-20 flex flex-col items-center text-center">
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontFamily: "var(--font-sequel, sans-serif)",
              color: "#F6F6F6",
            }}
          >
            Recursos
          </h1>
        </div>

        <ResourceShowcase items={showcaseItems} />

        {downloads.length > 0 ? (
          <div className="mt-32 w-full max-w-4xl">
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#F6F6F6",
                textAlign: "center",
                marginBottom: "2.5rem",
              }}
            >
              Links externos y descargables
            </h2>
            <div>
              {downloads.map((item, index) => (
                <DownloadRow key={item.id} item={item} isLast={index === downloads.length - 1} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Resources;
