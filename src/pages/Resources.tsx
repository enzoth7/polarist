import { useMemo, useState, useRef, useEffect } from "react";
import { ExternalLink, Download, File, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

function getResourceIcon(item: DownloadItem) {
  // 1. Si el item tiene un logo asignado en la base de datos, lo usamos directamente.
  if (item.logo) {
    return (
      <img
        src={item.logo}
        alt={`${item.title} logo`}
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }

  const title = item.title;
  const url = item.url;
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();

  // 2. Prioridad: Logos de marca específicos (fallback dinámico)
  if (lowerTitle.includes("gemini")) {
    return (
      <img
        src="/logos/gemini.webp"
        alt="Gemini logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }
  if (lowerTitle.includes("claude")) {
    return (
      <img
        src="/logos/claude.webp"
        alt="Claude logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }
  if (lowerTitle.includes("chatgpt") || lowerTitle.includes("openai")) {
    return (
      <img
        src="/logos/openai.webp"
        alt="ChatGPT logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }
  if (lowerTitle.includes("gumloop")) {
    return (
      <img
        src="/logos/gumloop.webp"
        alt="Gumloop logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }
  if (lowerTitle.includes("manus")) {
    return (
      <img
        src="/logos/manus.webp"
        alt="Manus logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }
  if (lowerTitle.includes("antigravity")) {
    return (
      <img
        src="/logos/antigravity.webp"
        alt="Antigravity logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }

  // 3. Si no es un logo de marca, clasificamos por tipo de recurso (fallback dinámico)
  // A. NotebookLM (URLs que contienen notebooklm.google.com)
  if (lowerUrl.includes("notebooklm")) {
    return (
      <img
        src="/images/resources/notebooklm.webp"
        alt="NotebookLM logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }

  // B. Videos de YouTube (URLs que contienen youtube o youtu.be)
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return (
      <img
        src="/images/resources/Youtube.png"
        alt="YouTube logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }

  // C. Archivos Markdown (título o url que contiene .md)
  if (lowerTitle.endsWith(".md") || lowerUrl.endsWith(".md") || lowerTitle.includes("markdown")) {
    return (
      <img
        src="/images/resources/Markdown.jpg"
        alt="Markdown logo"
        className="h-7 w-auto shrink-0 rounded-md object-contain"
      />
    );
  }

  return <File className="h-7 w-7 shrink-0 fill-[#F6F6F6] text-transparent" />;
}

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
          {getResourceIcon(item)}
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const LEVELS = ["Básicos", "Intermedios", "Avanzados"];
  const [selectedLevel, setSelectedLevel] = useState<string>("Básicos");

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const openedResource = resources.find((resource) => resource.id === openedResourceId) ?? null;

  const showcaseItems = useMemo<ShowcaseItem[]>(
    () =>
      resources
        .filter((r) => r.nivel === selectedLevel)
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          image: resource.image ?? FALLBACK_RESOURCE_IMAGE,
          onSelect: () => setOpenedResourceId(resource.id),
        })),
    [resources, selectedLevel],
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

      <div className="flex min-h-screen flex-col items-center justify-start bg-[#010101] px-4 pb-32 pt-24 md:pt-32">
        <div className="mb-24 w-full max-w-4xl">
          <h2
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#F6F6F6",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            ¿Por dónde <span className="text-[#CAFE5B]">empezar</span>?
          </h2>
          <p
            className="text-[17px] md:text-[20px] text-white/60 font-light text-center mx-auto max-w-2xl leading-relaxed"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              marginBottom: "clamp(64px, 6vw, 96px)",
            }}
          >
            Mirá este tutorial para saber por donde comenzar</p>

          <div className="mx-auto w-full max-w-4xl px-4">
            <div
              onClick={() => setIsPlaying(true)}
              className="group relative aspect-video w-full overflow-hidden cursor-pointer bg-black"
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <video
                ref={videoRef}
                src="/videos/tutorialrecursos2.webm"
                preload="metadata"
                playsInline
                controls={isPlaying}
                className={`h-full w-full transition-all duration-700 ${isPlaying ? "object-contain blur-0 opacity-100" : "object-cover blur-[10px] opacity-40"
                  }`}
                style={{ borderRadius: "23px" }}
              />

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F6] text-[#010101] shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white"
                  >
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>
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

          <div className="mt-8 flex justify-center w-full px-4">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar max-w-full">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`relative py-2 text-[15px] md:text-[17px] transition-all duration-300 ease-out whitespace-nowrap tracking-wide ${selectedLevel === level
                    ? "text-[#CAFE5B] font-bold"
                    : "text-[#F6F6F6]/40 hover:text-[#F6F6F6]"
                    }`}
                  style={{ fontFamily: SANS }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ResourceShowcase items={showcaseItems} />

        {downloads.length > 0 ? (
          <DownloadFolderExplorer downloads={downloads} />
        ) : null}
      </div>
    </>
  );
};

/* ── Folder Explorer ── */
const FOLDER_ORDER = ["Introducción para construir tu agente de IA", "Otros"] as const;
const SUBFOLDERS_ORDER = [
  "Triggers",
  "Contexto",
  "Modelo de lenguaje",
  "Habilidades",
  "Conectores",
  "Agent Harness",
] as const;

function DownloadFolderExplorer({ downloads }: { downloads: DownloadItem[] }) {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeSubfolder, setActiveSubfolder] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState(false);

  const grouped = useMemo(() => {
    const map: {
      "Introducción para construir tu agente de IA": Record<string, DownloadItem[]>;
      "Otros": DownloadItem[];
    } = {
      "Introducción para construir tu agente de IA": {
        "Triggers": [],
        "Contexto": [],
        "Modelo de lenguaje": [],
        "Habilidades": [],
        "Conectores": [],
        "Memoria": [],
        "Agent Harness": [],
      },
      "Otros": [],
    };

    for (const item of downloads) {
      if (item.folder === "Introducción para construir tu agente de IA") {
        const sub = item.subfolder;
        if (sub && sub in map["Introducción para construir tu agente de IA"]) {
          map["Introducción para construir tu agente de IA"][sub].push(item);
        } else {
          map["Otros"].push(item);
        }
      } else {
        map["Otros"].push(item);
      }
    }
    return map;
  }, [downloads]);

  const hasIntroItems = Object.values(grouped["Introducción para construir tu agente de IA"]).some(
    (arr) => arr.length > 0
  );
  const hasOtrosItems = grouped["Otros"].length > 0;

  const nonEmptyFolders = [];
  if (hasIntroItems) nonEmptyFolders.push("Introducción para construir tu agente de IA");
  if (hasOtrosItems) nonEmptyFolders.push("Otros");

  return (
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

      <div className="space-y-4">
        {nonEmptyFolders.map((folder) => {
          const isOpen = activeFolder === folder;

          return (
            <motion.div
              key={folder}
              layout
              className="overflow-hidden"
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(202, 254, 91, 0.2)",
                background: "#CAFE5B",
              }}
            >
              {/* Folder header */}
              <button
                type="button"
                onClick={() => {
                  setActiveFolder(isOpen ? null : folder);
                  setActiveSubfolder(null);
                }}
                className="relative flex w-full items-center justify-center px-6 py-5 transition-colors duration-300 hover:bg-black/[0.04]"
              >
                <p
                  className="text-[18px] md:text-[20px] font-bold tracking-[-0.01em] text-[#010101] text-center"
                  style={{ fontFamily: SANS }}
                >
                  {folder}
                </p>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute right-6 text-[22px] font-light leading-none text-[#010101]/50"
                  style={{ fontFamily: SANS }}
                >
                  +
                </motion.span>
              </button>

              {/* Folder content */}
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    className="overflow-hidden bg-[#010101]"
                  >
                    <div className="border-t border-white/[0.06] px-6 py-6">
                      {folder === "Otros" ? (
                        <div className="space-y-1">
                          {grouped["Otros"].map((item, index) => (
                            <DownloadRow
                              key={item.id}
                              item={item}
                              isLast={index === grouped["Otros"].length - 1}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Teoría interactiva del Agente */}
                          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#010101] transition-all duration-300 hover:border-white/20">
                            <button
                              type="button"
                              onClick={() => setShowTheory(!showTheory)}
                              className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-transparent"
                            >
                              <div className="flex items-center">
                                <span
                                  className="text-[15px] md:text-[16px] font-bold tracking-[-0.01em] text-[#CAFE5B]"
                                  style={{ fontFamily: SANS }}
                                >
                                  ¿Cómo funciona un Agente de IA?
                                </span>
                              </div>
                              <motion.span
                                animate={{ rotate: showTheory ? 45 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="text-[20px] font-light leading-none text-[#CAFE5B]"
                                style={{ fontFamily: SANS }}
                              >
                                +
                              </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                              {showTheory ? (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                                  className="overflow-hidden bg-transparent"
                                >
                                  <div className="border-t border-[#CAFE5B]/10 px-5 py-5 space-y-6 text-[#F6F6F6]/80 text-[14px] md:text-[15px] leading-relaxed">
                                    <div>
                                      <h4 className="font-bold text-[#F6F6F6] text-[16px] mb-2">¿Qué es un Agente de IA?</h4>
                                      <p className="font-light text-[#F6F6F6]/60">
                                        Un agente es un sistema autónomo diseñado para alcanzar objetivos específicos, capaz de percibir su entorno, tomar decisiones y ejecutar acciones encadenadas sin supervisión constante.
                                      </p>
                                    </div>

                                    <div>
                                      <h4 className="font-bold text-[#F6F6F6] text-[16px] mb-2">¿Qué es un Agent Harness?</h4>
                                      <p className="font-light text-[#F6F6F6]/60">
                                        Un Arnés de Agente o <strong className="text-[#CAFE5B] font-semibold">Agent Harness</strong> es el sistema o entorno que rodea a una IA para que pueda interactuar y realizar tareas útiles en el mundo real.
                                      </p>
                                    </div>

                                    <div className="pt-2">
                                      <h4 className="font-bold text-[#F6F6F6] text-[16px] mb-3">5 Puntos Clave para Construir un Agente:</h4>
                                      <ul className="space-y-4">
                                        <li className="flex gap-3 items-start">
                                          <span className="text-[#CAFE5B] font-bold">1.</span>
                                          <div>
                                            <strong className="text-[#F6F6F6] font-semibold">Triggers (Desencadenante):</strong> El ciclo cognitivo interno (<em className="text-[#CAFE5B]/80">Loop: Observar ➡️ Pensar ➡️ Actuar</em>) y el "latido" (<em className="text-[#CAFE5B]/80">Heartbeat/Trigger</em>) mediante archivos de latidos o funciones externas.
                                          </div>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                          <span className="text-[#CAFE5B] font-bold">2.</span>
                                          <div>
                                            <strong className="text-[#F6F6F6] font-semibold">Contexto:</strong> Definido por el archivo de instrucciones (<code className="text-[#CAFE5B] bg-[#CAFE5B]/10 px-1 rounded">Agents.md</code>) y la información pesada de la empresa (<code className="text-[#CAFE5B] bg-[#CAFE5B]/10 px-1 rounded">Context.md</code>) que utiliza RAG para búsquedas eficientes.
                                          </div>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                          <span className="text-[#CAFE5B] font-bold">3.</span>
                                          <div>
                                            <strong className="text-[#F6F6F6] font-semibold">Modelo de lenguaje (LLM):</strong> El cerebro cognitivo del agente (ej. Gemini, Claude, ChatGPT).
                                          </div>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                          <span className="text-[#CAFE5B] font-bold">4.</span>
                                          <div>
                                            <strong className="text-[#F6F6F6] font-semibold">Skills (Habilidades):</strong> Los SOPs (Procedimientos Operativos Estándar) y la memoria del agente (<code className="text-[#CAFE5B] bg-[#CAFE5B]/10 px-1 rounded">Memory.md</code>) que le permiten aprender y recordar interacciones.
                                          </div>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                          <span className="text-[#CAFE5B] font-bold">5.</span>
                                          <div>
                                            <strong className="text-[#F6F6F6] font-semibold">Herramientas/Conectores:</strong> Los brazos ejecutores del agente para usar aplicaciones del mundo real (Gmail, Notion, Calendar) a través de protocolos abiertos como MCP.
                                          </div>
                                        </li>
                                      </ul>
                                    </div>

                                    {/* Botón de llamado a la acción para ampliar información en NotebookLM */}
                                    <div className="flex justify-center pt-4 pb-2">
                                      <a
                                        href="https://notebooklm.google.com/notebook/2b945d90-1c13-4364-b392-bcb23b34971a"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-xl bg-[#F6F6F6] px-8 py-3.5 text-[16px] font-bold text-[#010101] transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 shadow-md"
                                        style={{ fontFamily: SANS }}
                                      >
                                        <img
                                          src="/images/resources/notebooklm.webp"
                                          alt="NotebookLM logo"
                                          className="h-[22px] w-auto object-contain rounded-sm"
                                        />
                                        Conoce más
                                      </a>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>

                          {SUBFOLDERS_ORDER.map((subfolder) => {
                            const isSubOpen = activeSubfolder === subfolder;
                            const subItems = grouped["Introducción para construir tu agente de IA"][subfolder] || [];

                            return (
                              <div
                                key={subfolder}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-[#010101] transition-all duration-300 hover:border-white/20"
                              >
                                <button
                                  type="button"
                                  onClick={() => setActiveSubfolder(isSubOpen ? null : subfolder)}
                                  className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-transparent"
                                >
                                  <span
                                    className={`text-[15px] md:text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${isSubOpen ? "text-[#CAFE5B]" : "text-[#F6F6F6]/80"
                                      }`}
                                    style={{ fontFamily: SANS }}
                                  >
                                    {subfolder}
                                  </span>
                                  <motion.span
                                    animate={{ rotate: isSubOpen ? 45 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`text-[20px] font-light leading-none transition-colors ${isSubOpen ? "text-[#CAFE5B]" : "text-[#F6F6F6]/40"
                                      }`}
                                    style={{ fontFamily: SANS }}
                                  >
                                    +
                                  </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                  {isSubOpen ? (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ type: "spring", stiffness: 350, damping: 35 }}
                                      className="overflow-hidden bg-transparent"
                                    >
                                      <div className="border-t border-white/[0.03] px-5 py-3">
                                        {subItems.length > 0 ? (
                                          <div className="space-y-1">
                                            {subItems.map((item, index) => (
                                              <DownloadRow
                                                key={item.id}
                                                item={item}
                                                isLast={index === subItems.length - 1}
                                              />
                                            ))}
                                          </div>
                                        ) : (
                                          <p
                                            className="py-4 text-center text-[13px] italic text-[#F6F6F6]/30"
                                            style={{ fontFamily: SANS }}
                                          >
                                            Próximamente se agregarán recursos en esta categoría.
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  ) : null}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Resources;
