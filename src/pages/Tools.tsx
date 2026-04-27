import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BubbleText } from "@/components/ui/bubble-text";
import { getToolHref, type ToolItem, useToolsQuery } from "@/hooks/useTools";
import Modal from "@/components/ui/modal-drop";

// ── Paleta Brand Kit B (Dark Theme) ──────────────────────────────────────
const BK = { 
  black: "#010101", 
  white: "#F6F6F6", 
  green: "#CAFE5B",
  cardBg: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.08)"
} as const;

const CARD_RADIUS = 32;

// ── Floating logo ─────────────────────────────────────────────────────────
const SPECIAL_SRCS: Record<string, string> = {
  ChatGPT: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
  Claude: "/logos/claude.svg",
  Gemini: "/logos/gemini.svg",
  "Stitch AI": "https://logo.clearbit.com/stitch.withgoogle.com?size=96",
  NotebookLM: "/logos/notebooklm.svg",
  Grok: "/logos/grok.svg",
  Freepik: "/logos/freepik1.svg",
  Genspark: "/logos/genspark.svg",
  Higgsfield: "/logos/higgsfield.svg",
  Loom: "/logos/loom.svg",
  Wispr: "/logos/wispr.png",
};

function FloatingLogo({ name, domain, size = 40 }: { name: string; domain: string; size?: number }) {
  const sources = useMemo(() => {
    const srcs: string[] = [];
    if (SPECIAL_SRCS[name]) srcs.push(SPECIAL_SRCS[name]);
    srcs.push(`https://logo.clearbit.com/${domain}?size=128`);
    srcs.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    return srcs.filter((s, i, a) => a.indexOf(s) === i);
  }, [name, domain]);

  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [sources]);

  const src = sources[idx];
  if (!src)
    return (
      <span
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sequel, sans-serif)",
          fontWeight: 700,
          fontSize: size * 0.3,
          color: "rgba(246,246,246,0.25)",
          flexShrink: 0,
        }}
      >
        {name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
      </span>
    );

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFFFFF",
        borderRadius: size * 0.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: size * 0.15,
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={() => setIdx((i) => i + 1)}
      />
    </div>
  );
}

// ── Tipos ─────────────────────────────────────────────────────────────────
type RequestedTool = { label: string; aliases?: string[]; fallbackHref?: string; };

type CategoryDef = {
  id: string;
  title: string;
  description: string;
  image: string;
  mediaPosition?: string;
  mediaFit?: "cover" | "contain";
  mediaScale?: number;
  tools: RequestedTool[];
};

type ResolvedTool = {
  label: string;
  domain: string | null;
  href: string | null;
  tool: ToolItem | null;
};

const isVideoAsset = (assetPath: string) => assetPath.toLowerCase().endsWith(".mp4");

// ── 6 Categorías ─────────────────────────────────────────────────────────
const CATEGORIES: CategoryDef[] = [
  {
    id: "conversacional",
    title: "Chatbot",
    description: "Asistentes de lenguaje para consultas, redacción y análisis.",
    image: "/images/tools/chatbot-pattern-storage.mp4",
    tools: [
      { label: "Claude", fallbackHref: "https://claude.ai" },
      { label: "ChatGPT", fallbackHref: "https://chatgpt.com" },
      { label: "Gemini", fallbackHref: "https://gemini.google.com" },
      { label: "Perplexity", fallbackHref: "https://www.perplexity.ai" },
      { label: "Grok", fallbackHref: "https://grok.com" },
    ],
  },
  {
    id: "creacion",
    title: "Creación de Contenido",
    description: "Imágenes, video, música y presentaciones generadas con IA.",
    image: "/images/tools/creacion-contenido-entryway.mp4",
    tools: [
      { label: "MidJourney", aliases: ["Midjourney"], fallbackHref: "https://www.midjourney.com" },
      { label: "Canva", aliases: ["Canva IA"], fallbackHref: "https://www.canva.com" },
      { label: "Higgsfield", fallbackHref: "https://higgsfield.ai" },
      { label: "Genspark", fallbackHref: "https://genspark.ai" },
      { label: "Freepik", fallbackHref: "https://www.freepik.com" },
      { label: "Submagic", fallbackHref: "https://www.submagic.co" },
      { label: "Suno", fallbackHref: "https://suno.com" },
      { label: "Gamma", fallbackHref: "https://gamma.app" },
    ],
  },
  {
    id: "automatizaciones",
    title: "Automatizaciones",
    description: "Conectá apps y procesos sin código. El stack operativo moderno.",
    image: "/images/tools/automatizaciones-shelf-styling.mp4",
    mediaPosition: "center 38%",
    tools: [
      { label: "n8n", aliases: ["n8n"], fallbackHref: "https://n8n.io" },
      { label: "Make", fallbackHref: "https://www.make.com" },
      { label: "Zapier", fallbackHref: "https://zapier.com" },
      { label: "Apify", fallbackHref: "https://apify.com" },
      { label: "Gumloop", fallbackHref: "https://www.gumloop.com" },
    ],
  },
  {
    id: "desarrollo",
    title: "Desarrollo y Web",
    description: "Construí más rápido con IA, desde el diseño hasta el deploy.",
    image: "/images/tools/desarrollo-web-coastal.mp4",
    tools: [
      { label: "Lovable", fallbackHref: "https://lovable.dev" },
      { label: "Bolt.new", aliases: ["Bolt.new"], fallbackHref: "https://bolt.new" },
      { label: "Cursor", fallbackHref: "https://cursor.com" },
      { label: "Figma", fallbackHref: "https://www.figma.com" },
      { label: "Vercel", fallbackHref: "https://vercel.com" },
      { label: "Supabase", fallbackHref: "https://supabase.com" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing y Ventas",
    description: "Captá leads, automatizá comunicaciones y escalá campañas.",
    image: "/images/tools/marketing-ventas-craft-project.mp4",
    tools: [
      { label: "Typeform", fallbackHref: "https://www.typeform.com" },
      { label: "Kommo", fallbackHref: "https://kommo.com" },
      { label: "Manychat", fallbackHref: "https://manychat.com" },
      { label: "ElevenLabs", fallbackHref: "https://elevenlabs.io" },
    ],
  },
  {
    id: "productividad",
    title: "Productividad",
    description: "Organizá, resumí y agilizá el trabajo diario.",
    image: "/images/tools/productividad-cozy-corner.mp4",
    tools: [
      { label: "Notion AI", aliases: ["Notion AI"], fallbackHref: "https://www.notion.so/product/ai" },
      { label: "NotebookLM", fallbackHref: "https://notebooklm.google.com" },
      { label: "Wispr", fallbackHref: "https://wisprflow.ai" },
      { label: "Fireflies", fallbackHref: "https://fireflies.ai" },
      { label: "Loom", fallbackHref: "https://www.loom.com" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const normalizeText = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const getDomainFromHref = (href: string | null | undefined) => {
  if (!href) return null;
  try { return new URL(href).hostname.replace(/^www\./i, ""); } catch { return null; }
};

const resolveTool = (
  req: RequestedTool,
  toolsByName: Map<string, ToolItem>,
): ResolvedTool => {
  const match =
    [req.label, ...(req.aliases ?? [])]
      .map((c) => toolsByName.get(normalizeText(c)))
      .find((t): t is ToolItem => Boolean(t)) ?? null;
  return {
    label: req.label,
    domain: match ? match.domain : getDomainFromHref(req.fallbackHref),
    href: match ? getToolHref(match) : (req.fallbackHref ?? null),
    tool: match,
  };
};

// ── Estilos compartidos ───────────────────────────────────────────────────
const detailLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(246,246,246,0.35)",
  margin: "0 0 10px",
};

const detailTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: 1.65,
  color: BK.white,
  margin: 0,
};

const ghostNavStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(246,246,246,0.45)",
  padding: 0,
};

// ── Vista de lista ────────────────────────────────────────────────────────
function CategoryDetail({
  category,
  officialTools,
  onBack,
  onViewTool,
}: {
  category: CategoryDef;
  officialTools: ToolItem[];
  onBack: () => void;
  onViewTool: (tool: ResolvedTool) => void;
}) {
  const toolsByName = useMemo(
    () => new Map(officialTools.map((t) => [normalizeText(t.name), t] as const)),
    [officialTools],
  );

  const tools = useMemo(
    () => category.tools.map((req) => resolveTool(req, toolsByName)),
    [category.tools, toolsByName],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#010101]/65 p-6 text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-9"
      style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(246,246,246,0.08),transparent_35%,rgba(202,254,91,0.06))]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#CAFE5B]/12 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-5">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-full border-white/15 bg-white/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F6F6F6]/60 backdrop-blur"
              >
                Herramientas
              </Badge>
              <div>
                <h1 className="text-[clamp(2rem,5vw,3.35rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#F6F6F6]">
                  {category.title}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#F6F6F6]/62">
                  {category.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F6F6F6]/55 transition hover:border-[#CAFE5B]/30 hover:text-[#CAFE5B] sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver
            </button>
          </div>

          <div className="grid gap-3">
            {tools.map((tool, i) => (
              <motion.div
                key={`${tool.label}-${i}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 * i }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur transition-all hover:border-[#CAFE5B]/28 hover:bg-white/[0.075] hover:shadow-[0_18px_48px_rgba(0,0,0,0.25)]"
              >
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(202,254,91,0.09),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onViewTool(tool)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/80 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition group-hover:border-[#CAFE5B]/40"
                  >
                    {tool.domain ? (
                      <FloatingLogo name={tool.label} domain={tool.domain} size={36} />
                    ) : (
                      <span className="text-xs font-bold text-[#010101]/55">
                        {tool.label.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                      </span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-base font-bold tracking-[-0.01em] text-[#F6F6F6]">
                      {tool.label}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#F6F6F6]/42">
                      {tool.domain ?? "Recurso recomendado"}
                    </p>
                  </div>

                  <button
                    onClick={() => onViewTool(tool)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#CAFE5B] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#010101] transition hover:scale-[1.03] hover:bg-[#d8ff77]"
                  >
                    Detalles
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px]">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-[#CAFE5B]/18 via-transparent to-transparent blur-3xl" />
          <div className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10 bg-[#010101]">
              {category.mediaFit === "contain" ? (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,254,91,0.08),rgba(1,1,1,0.96)_72%)]" />
              ) : null}
              {isVideoAsset(category.image) ? (
                <video
                  src={category.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full"
                  style={{
                    objectFit: category.mediaFit ?? "cover",
                    objectPosition: category.mediaPosition ?? "center",
                    transform: category.mediaScale ? `scale(${category.mediaScale})` : undefined,
                  }}
                />
              ) : (
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full"
                  style={{
                    objectFit: category.mediaFit ?? "cover",
                    objectPosition: category.mediaPosition ?? "center",
                    transform: category.mediaScale ? `scale(${category.mediaScale})` : undefined,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(1,1,1,0.42))]" />
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#010101]/45 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F6F6F6]/35">
                  Selección
                </p>
                <p className="mt-2 text-sm leading-6 text-[#F6F6F6]/68">
                  {tools.length} herramientas curadas para explorar esta categoría.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#010101]/45 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F6F6F6]/35">
                  Siguiente paso
                </p>
                <p className="mt-2 text-sm leading-6 text-[#F6F6F6]/68">
                  Tocá “Detalles” para ver una ficha breve de cada herramienta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ToolDetailContent({ 
  viewingTool, 
  onClose 
}: { 
  viewingTool: ResolvedTool; 
  onClose: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#F6F6F6]/40" style={{ fontFamily: 'var(--font-sequel)' }}>
            Para qué sirve
          </h3>
          <p className="text-sm leading-relaxed text-[#F6F6F6]" style={{ fontFamily: 'var(--font-sequel)' }}>
            {viewingTool.tool?.description || "Optimiza flujos de trabajo complejos mediante IA avanzada."}
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#F6F6F6]/40" style={{ fontFamily: 'var(--font-sequel)' }}>
            Para quién
          </h3>
          <p className="text-sm leading-relaxed text-[#F6F6F6]" style={{ fontFamily: 'var(--font-sequel)' }}>
            {viewingTool.tool?.whoIsItFor || "Profesionales y equipos que buscan escalar su impacto digital."}
          </p>
        </section>
      </div>

      <section className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#F6F6F6]/40" style={{ fontFamily: 'var(--font-sequel)' }}>
          Para qué no
        </h3>
        <p className="text-sm leading-relaxed text-[#F6F6F6]" style={{ fontFamily: 'var(--font-sequel)' }}>
          No recomendada para procesos manuales simples que no requieren análisis de datos o automatización inteligente.
        </p>
      </section>

      <div className="pt-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full text-sm font-bold text-[#F6F6F6] hover:bg-white/5 transition-colors"
          style={{ fontFamily: 'var(--font-sequel)' }}
        >
          Cerrar
        </button>
        {viewingTool.href && (
          <a
            href={viewingTool.href}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3 rounded-full text-sm font-bold bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90 transition-colors inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-sequel)' }}
          >
            Visitar sitio
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}


// ── Grid de 6 categorías (vista principal) ────────────────────────────────
const Tools = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingTool, setViewingTool] = useState<ResolvedTool | null>(null);
  const { data: officialTools = [] } = useToolsQuery({ isBeta: false });

  const selectedCategory = selectedId ? CATEGORIES.find((c) => c.id === selectedId) ?? null : null;

  return (
    <>
      {/* Modal de Categoría (Lista de herramientas) */}
      <Modal
        isOpen={!!selectedCategory && !viewingTool}
        onClose={() => setSelectedId(null)}
        type="blur"
        animationType="scale"
        disablePadding
        showCloseButton={true}
        className="dark !max-w-5xl border-0 !bg-transparent shadow-none"
      >
        {selectedCategory && (
          <CategoryDetail
            category={selectedCategory}
            officialTools={officialTools}
            onBack={() => setSelectedId(null)}
            onViewTool={(tool) => setViewingTool(tool)}
          />
        )}
      </Modal>

      {/* Modal de Detalle de Herramienta */}
      <Modal
        isOpen={!!viewingTool}
        onClose={() => setViewingTool(null)}
        title={viewingTool?.label}
        subtitle={viewingTool?.domain || ""}
        type="blur"
        animationType="scale"
        className="dark border-white/10"
      >
        {viewingTool && (
          <ToolDetailContent 
            viewingTool={viewingTool} 
            onClose={() => setViewingTool(null)} 
          />
        )}
      </Modal>
    <div style={{ minHeight: "100vh", backgroundColor: BK.black, padding: "120px 40px 120px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Contenedor oscuro */}
        <div
          style={{
            backgroundColor: "transparent",
            borderRadius: CARD_RADIUS,
            padding: "0",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: BK.white,
              marginBottom: 20,
              textAlign: "center",
              whiteSpace: "nowrap"
            }}
          >
            <BubbleText text="Las herramientas más útiles del Mercado" />
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: 1.6,
              color: BK.white,
              marginBottom: 120,
              textAlign: "center",
              maxWidth: "800px",
              marginInline: "auto"
            }}
          >
            Explorá las tecnologías que dominan cada área del mundo digital, organizadas para vos.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedId(cat.id)}
                className="group relative aspect-[16/10] w-full overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1"
                style={{
                  borderRadius: CARD_RADIUS,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat.mediaFit === "contain" ? (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,254,91,0.08),rgba(1,1,1,0.96)_72%)]" />
                ) : null}
                {isVideoAsset(cat.image) ? (
                  <video
                    src={cat.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                    style={{
                      objectFit: cat.mediaFit ?? "cover",
                      objectPosition: cat.mediaPosition ?? "center",
                      transform: cat.mediaScale ? `scale(${cat.mediaScale})` : undefined,
                      borderRadius: cat.mediaFit === "contain" ? 22 : undefined,
                    }}
                  />
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                    style={{
                      objectFit: cat.mediaFit ?? "cover",
                      objectPosition: cat.mediaPosition ?? "center",
                      transform: cat.mediaScale ? `scale(${cat.mediaScale})` : undefined,
                      borderRadius: cat.mediaFit === "contain" ? 22 : undefined,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.85)_100%)]" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <h2
                    style={{
                      fontFamily: "var(--font-sequel, sans-serif)",
                      fontWeight: 700,
                      fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: BK.white,
                      margin: 0,
                    }}
                  >
                    {cat.title}
                  </h2>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default Tools;
