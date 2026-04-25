import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, X } from "lucide-react";

import { getToolHref, type ToolItem, useToolsQuery } from "@/hooks/useTools";

// ── Paleta Brand Kit B ────────────────────────────────────────────────────
const BK = { black: "#010101", white: "#F6F6F6", green: "#CAFE5B" } as const;
const CARD_RADIUS = 24;

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
    <img
      src={src}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

// ── Tipos ─────────────────────────────────────────────────────────────────
type RequestedTool = { label: string; aliases?: string[]; fallbackHref?: string; };

type CategoryDef = {
  id: string;
  title: string;
  description: string;
  image: string;
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
    title: "IA Conversacional",
    description: "Asistentes de lenguaje para consultas, redacción y análisis.",
    image: "/images/tools/A_hyper_detailed_composite_bio.mp4",
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
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
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
  color: "rgba(1,1,1,0.3)",
  margin: "0 0 10px",
};

const detailTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-sequel, sans-serif)",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: 1.65,
  color: "rgba(1,1,1,0.72)",
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
  color: "rgba(1,1,1,0.35)",
  padding: 0,
};

// ── Vista de detalle de herramienta ──────────────────────────────────────
function ToolDetailView({
  tool,
  categoryTitle,
  onClose,
}: {
  tool: ResolvedTool;
  categoryTitle: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#FFFFFF",
        zIndex: 100,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", padding: "48px 40px 96px" }}>
        <button type="button" onClick={onClose} style={{ ...ghostNavStyle, marginBottom: 64 }}>
          <X style={{ width: 13, height: 13 }} />
          Cerrar
        </button>

        {/* Hero del producto */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <div
            style={{
              width: 112,
              height: 112,
              backgroundColor: "rgba(1,1,1,0.04)",
              border: "1px solid rgba(1,1,1,0.07)",
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {tool.domain ? (
              <FloatingLogo name={tool.label} domain={tool.domain} size={72} />
            ) : (
              <span style={{ fontSize: 28, fontWeight: 800, opacity: 0.15 }}>{tool.label[0]}</span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: BK.black,
                margin: "0 0 20px",
              }}
            >
              {tool.label}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontWeight: 600,
                fontSize: 13,
                color: BK.green,
                backgroundColor: BK.black,
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: 4,
              }}
            >
              {tool.domain || "sin-dominio.com"}
            </p>
          </div>
        </div>

        {/* Contenido en grid */}
        <div
          style={{
            marginTop: 72,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 56,
            borderTop: "1px solid rgba(1,1,1,0.07)",
            paddingTop: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <section>
              <h3 style={detailLabelStyle}>Descripción</h3>
              <p style={detailTextStyle}>
                {tool.tool?.description ||
                  "Una herramienta avanzada diseñada para potenciar la productividad mediante el uso de inteligencia artificial de última generación."}
              </p>
            </section>
            <section>
              <h3 style={detailLabelStyle}>Para qué sirve realmente</h3>
              <p style={detailTextStyle}>
                Permite optimizar flujos de trabajo complejos, reduciendo tiempos de ejecución y elevando la calidad del resultado final en tareas críticas.
              </p>
            </section>
            <section>
              <h3 style={detailLabelStyle}>Quién debería usarla</h3>
              <p style={detailTextStyle}>
                {tool.tool?.whoIsItFor ||
                  "Profesionales, equipos creativos y desarrolladores que buscan escalar su impacto sin aumentar la carga operativa."}
              </p>
            </section>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <section>
              <h3 style={detailLabelStyle}>Cuándo usarla</h3>
              <p style={detailTextStyle}>
                Ideal para momentos donde la velocidad de iteración es clave y se requiere un nivel de precisión superior al estándar.
              </p>
            </section>
            <section>
              <h3 style={detailLabelStyle}>Cuándo no usarla</h3>
              <p style={detailTextStyle}>
                No recomendada para procesos extremadamente simples que no requieren análisis de datos o donde la intervención humana debe ser total.
              </p>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 8 }}>
              <section>
                <h3 style={detailLabelStyle}>Categoría</h3>
                <p style={{ ...detailTextStyle, fontWeight: 700, color: BK.black }}>{categoryTitle}</p>
              </section>
              <section>
                <h3 style={detailLabelStyle}>Tipo</h3>
                <p style={{ ...detailTextStyle, fontWeight: 700, color: BK.black }}>
                  {tool.tool?.kind || "Plataforma"}
                </p>
              </section>
            </div>

            {tool.href && (
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "17px 38px",
                  backgroundColor: BK.green,
                  color: BK.black,
                  fontFamily: "var(--font-sequel, sans-serif)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.3px",
                  textDecoration: "none",
                  borderRadius: 999,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Visitar sitio oficial
                <ExternalLink style={{ width: 15, height: 15 }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Vista de lista ────────────────────────────────────────────────────────
function CategoryDetail({
  category,
  officialTools,
  onBack,
}: {
  category: CategoryDef;
  officialTools: ToolItem[];
  onBack: () => void;
}) {
  const [viewingTool, setViewingTool] = useState<ResolvedTool | null>(null);

  const toolsByName = useMemo(
    () => new Map(officialTools.map((t) => [normalizeText(t.name), t] as const)),
    [officialTools],
  );

  const tools = useMemo(
    () => category.tools.map((req) => resolveTool(req, toolsByName)),
    [category.tools, toolsByName],
  );

  if (viewingTool) {
    return (
      <ToolDetailView
        tool={viewingTool}
        categoryTitle={category.title}
        onClose={() => setViewingTool(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: "100%", backgroundColor: BK.white }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Contenedor blanco */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: CARD_RADIUS,
            border: "1px solid rgba(1,1,1,0.06)",
            padding: "56px 48px",
          }}
        >
          <button type="button" onClick={onBack} style={{ ...ghostNavStyle, marginBottom: 56 }}>
            <ArrowLeft style={{ width: 13, height: 13 }} />
            Herramientas
          </button>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: BK.black,
              marginBottom: 16,
            }}
          >
            {category.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(1,1,1,0.42)",
              marginBottom: 48,
            }}
          >
            {category.description}
          </p>

          <div>
            {tools.map((tool, i) => (
              <div
                key={`${tool.label}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(1,1,1,0.07)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewingTool(tool)}
                  style={{
                    width: 44,
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {tool.domain ? (
                    <FloatingLogo name={tool.label} domain={tool.domain} size={40} />
                  ) : (
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "rgba(1,1,1,0.2)",
                      }}
                    >
                      {tool.label.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                    </span>
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sequel, sans-serif)",
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: "-0.01em",
                      color: BK.black,
                      margin: 0,
                    }}
                  >
                    {tool.label}
                  </p>
                  {tool.tool?.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontWeight: 400,
                        fontSize: 13,
                        color: "rgba(1,1,1,0.42)",
                        marginTop: 3,
                        marginBottom: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {tool.tool.description}
                    </p>
                  )}
                </div>

                {tool.href && (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--font-sequel, sans-serif)",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: BK.black,
                      backgroundColor: BK.green,
                      borderRadius: 999,
                      padding: "7px 14px",
                      textDecoration: "none",
                      flexShrink: 0,
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    Abrir
                    <ExternalLink style={{ width: 11, height: 11 }} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Grid de 6 categorías (vista principal) ────────────────────────────────
const Tools = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: officialTools = [] } = useToolsQuery({ isBeta: false });

  const selectedCategory = selectedId ? CATEGORIES.find((c) => c.id === selectedId) ?? null : null;

  if (selectedCategory) {
    return (
      <CategoryDetail
        category={selectedCategory}
        officialTools={officialTools}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: "100%", backgroundColor: BK.white, padding: "64px 40px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Contenedor blanco */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: CARD_RADIUS,
            border: "1px solid rgba(1,1,1,0.06)",
            padding: "56px 48px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: BK.black,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Catálogo de IA
          </h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedId(cat.id)}
                className="group relative aspect-[16/10] w-full overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1"
                style={{
                  borderRadius: CARD_RADIUS,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
                }}
              >
                {isVideoAsset(cat.image) ? (
                  <video
                    src={cat.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.14)_40%,rgba(0,0,0,0.72)_100%)]" />

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontWeight: 700,
                      fontSize: "clamp(1.3rem, 2vw, 1.85rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    {cat.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-sequel, sans-serif)",
                      fontWeight: 400,
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.62)",
                      margin: "10px 0 0",
                      maxWidth: 420,
                    }}
                  >
                    {cat.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tools;
