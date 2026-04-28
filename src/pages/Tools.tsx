import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import Modal from "@/components/ui/modal-drop";
import { BubbleText } from "@/components/ui/bubble-text";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { getToolHref, type ToolItem, useToolsQuery } from "@/hooks/useTools";

const BK = {
  black: "#010101",
  white: "#F6F6F6",
} as const;

const CARD_RADIUS = 32;
const sequelTextStyle = { fontFamily: "Sequel Sans" };

type RequestedTool = {
  label: string;
  aliases?: string[];
  fallbackHref?: string;
};

type CategoryDef = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
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
  preview: string;
  whyItMatters: string;
  useCases: string[];
  cautions: string[];
};

const CATEGORY_IMAGES: Record<string, string> = {
  conversacional:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  creacion:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  automatizaciones:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  desarrollo:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  marketing:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  productividad:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
};

const CATEGORY_PLAYBOOK: Record<
  string,
  { preview: string; whyItMatters: string; useCases: string[]; cautions: string[] }
> = {
  conversacional: {
    preview: "Asistencia conversacional",
    whyItMatters:
      "Ideal para responder, redactar, investigar y ordenar ideas con mucha menos fricción.",
    useCases: [
      "Resolver consultas complejas en minutos.",
      "Escribir textos, propuestas o respuestas mejor estructuradas.",
      "Analizar información y bajar ideas a acciones concretas.",
    ],
    cautions: [
      "Conviene validar datos sensibles o cifras antes de publicar.",
      "Rinde mucho más cuando se le da contexto claro del negocio.",
    ],
  },
  creacion: {
    preview: "Producción creativa",
    whyItMatters:
      "Sirve para producir piezas visuales, video, presentaciones y assets creativos a velocidad de campaña.",
    useCases: [
      "Generar imágenes y conceptos visuales para anuncios o branding.",
      "Armar presentaciones, reels o piezas multimedia con menos tiempo de edición.",
      "Explorar ideas de estilo antes de producir una versión final.",
    ],
    cautions: [
      "Hay que cuidar consistencia de marca y derechos de uso de assets.",
      "La mejor calidad aparece cuando se trabaja con referencias claras.",
    ],
  },
  automatizaciones: {
    preview: "Operación conectada",
    whyItMatters:
      "Permite conectar herramientas, mover datos entre sistemas y evitar tareas manuales repetitivas.",
    useCases: [
      "Automatizar leads, formularios, CRM y seguimiento comercial.",
      "Sincronizar operaciones entre apps sin depender de procesos manuales.",
      "Construir flujos de trabajo que corran solos todos los días.",
    ],
    cautions: [
      "Hay que revisar permisos, errores y escenarios de fallback.",
      "No conviene automatizar un proceso roto sin definirlo primero.",
    ],
  },
  desarrollo: {
    preview: "Construcción digital",
    whyItMatters:
      "Acelera diseño, código, prototipado y despliegue para pasar de idea a producto mucho más rápido.",
    useCases: [
      "Prototipar interfaces y flujos antes de desarrollar.",
      "Escribir, revisar o corregir código con apoyo de IA.",
      "Publicar proyectos más rápido con tooling moderno.",
    ],
    cautions: [
      "Siempre hace falta criterio técnico para revisar lo generado.",
      "La velocidad no reemplaza una buena arquitectura base.",
    ],
  },
  marketing: {
    preview: "Crecimiento y ventas",
    whyItMatters:
      "Ayuda a captar demanda, ordenar conversaciones comerciales y escalar comunicación sin perder timing.",
    useCases: [
      "Capturar leads y enriquecer datos automáticamente.",
      "Acompañar prospectos con mensajes, formularios o secuencias.",
      "Diseñar campañas más eficientes con foco en conversión.",
    ],
    cautions: [
      "Conviene alinear el tono comercial con la marca antes de escalar.",
      "Hay que medir resultados reales, no solo volumen de actividad.",
    ],
  },
  productividad: {
    preview: "Trabajo diario optimizado",
    whyItMatters:
      "Reduce tiempo operativo, resume información y ordena conocimiento para equipos que hacen muchas cosas a la vez.",
    useCases: [
      "Resumir reuniones, documentos y conversaciones largas.",
      "Documentar procesos y centralizar conocimiento.",
      "Agilizar tareas repetidas del día a día.",
    ],
    cautions: [
      "Es importante revisar prioridades para no automatizar ruido.",
      "La adopción mejora cuando el equipo entiende el beneficio práctico.",
    ],
  },
};

const isVideoAsset = (assetPath: string) => assetPath.toLowerCase().endsWith(".mp4");

const CATEGORIES: CategoryDef[] = [
  {
    id: "conversacional",
    title: "Chatbot",
    description: "Asistentes de lenguaje para consultas, redacción y análisis.",
    coverImage: CATEGORY_IMAGES.conversacional,
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
    coverImage: CATEGORY_IMAGES.creacion,
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
    coverImage: CATEGORY_IMAGES.automatizaciones,
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
    coverImage: CATEGORY_IMAGES.desarrollo,
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
    coverImage: CATEGORY_IMAGES.marketing,
    image: "/images/tools/marketing-ventas-replacement.mp4",
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
    coverImage: CATEGORY_IMAGES.productividad,
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

const normalizeText = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const getDomainFromHref = (href: string | null | undefined) => {
  if (!href) return null;

  try {
    return new URL(href).hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
};

const resolveTool = (
  req: RequestedTool,
  category: CategoryDef,
  toolsByName: Map<string, ToolItem>,
): ResolvedTool => {
  const match =
    [req.label, ...(req.aliases ?? [])]
      .map((candidate) => toolsByName.get(normalizeText(candidate)))
      .find((tool): tool is ToolItem => Boolean(tool)) ?? null;

  const playbook = CATEGORY_PLAYBOOK[category.id];

  return {
    label: req.label,
    domain: match ? match.domain : getDomainFromHref(req.fallbackHref),
    href: match ? getToolHref(match) : (req.fallbackHref ?? null),
    tool: match,
    preview: playbook.preview,
    whyItMatters: playbook.whyItMatters,
    useCases: playbook.useCases,
    cautions: playbook.cautions,
  };
};

function CategoryDetail({
  category,
  officialTools,
}: {
  category: CategoryDef;
  officialTools: ToolItem[];
}) {
  const toolsByName = useMemo(
    () => new Map(officialTools.map((tool) => [normalizeText(tool.name), tool] as const)),
    [officialTools],
  );

  const tools = useMemo(
    () => category.tools.map((req) => resolveTool(req, category, toolsByName)),
    [category, toolsByName],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="tools-modal-sequel relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#010101] p-5 font-sequel text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)] md:p-7"
      style={sequelTextStyle}
    >
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-5">
          <div className="space-y-4">
            <h1 className="text-[clamp(2rem,5vw,3.35rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#F6F6F6]">
              {category.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div
              key={`${tool.label}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.04 * index }}
              className="w-full"
            >
              <ExpandableCard
                title={tool.label}
                src=""
                description={tool.domain ?? ""}
                className="aspect-square w-full"
                classNameExpanded="[&_h4]:text-white [&_h4]:font-semibold"
                media={
                  <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-[#ffffff] px-8 py-8">
                    {tool.domain ? (
                      <ToolLogo
                        name={tool.label}
                        domain={tool.domain}
                        logoFilename={tool.tool?.logoFilename}
                        className="h-32 w-32 rounded-[2rem] border-0 bg-transparent sm:h-36 sm:w-36"
                        imageClassName="p-0 object-contain"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white text-center text-sm font-semibold text-black sm:h-36 sm:w-36">
                        {tool.label}
                      </div>
                    )}
                  </div>
                }
              >
                <div className="grid gap-6" style={sequelTextStyle}>
                  <section className="space-y-2">
                    <h4 className="text-base uppercase tracking-[0.18em] text-[#CAFE5B]" style={sequelTextStyle}>
                      Para qué sirve
                    </h4>
                    <p style={sequelTextStyle}>
                      {tool.tool?.description?.trim() ||
                        `${tool.label} te ayuda a ejecutar mejor tareas clave dentro de ${category.title.toLowerCase()}.`}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base uppercase tracking-[0.18em] text-[#CAFE5B]" style={sequelTextStyle}>
                      Para quién
                    </h4>
                    <p style={sequelTextStyle}>
                      {tool.tool?.whoIsItFor?.trim() ||
                        "Equipos, freelancers y negocios que quieren ganar velocidad sin perder criterio."}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base uppercase tracking-[0.18em] text-[#CAFE5B]" style={sequelTextStyle}>
                      Por qué importa
                    </h4>
                    <p style={sequelTextStyle}>{tool.whyItMatters}</p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base uppercase tracking-[0.18em] text-[#CAFE5B]" style={sequelTextStyle}>
                      Casos de uso
                    </h4>
                    <ul className="space-y-2 text-white/72" style={sequelTextStyle}>
                      {tool.useCases.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#CAFE5B]" />
                          <span style={sequelTextStyle}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base uppercase tracking-[0.18em] text-[#CAFE5B]" style={sequelTextStyle}>
                      Qué mirar antes de usarla
                    </h4>
                    <ul className="space-y-2 text-white/72" style={sequelTextStyle}>
                      {tool.cautions.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/35" />
                          <span style={sequelTextStyle}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {tool.domain ? (
                      <span
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/60"
                        style={sequelTextStyle}
                      >
                        {tool.domain}
                      </span>
                    ) : null}

                    {tool.href ? (
                      <a
                        href={tool.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#CAFE5B] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#010101] transition hover:scale-[1.03] hover:bg-[#d8ff77]"
                        style={sequelTextStyle}
                      >
                        Visitar sitio
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </ExpandableCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const Tools = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: officialTools = [] } = useToolsQuery({ isBeta: false });

  const selectedCategory = selectedId ? CATEGORIES.find((category) => category.id === selectedId) ?? null : null;

  return (
    <>
      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedId(null)}
        type="blur"
        animationType="scale"
        disablePadding
        showCloseButton={true}
        className="tools-modal-sequel dark !max-w-[1400px] border-0 !bg-transparent font-sequel shadow-none"
      >
        {selectedCategory ? (
          <CategoryDetail
            category={selectedCategory}
            officialTools={officialTools}
          />
        ) : null}
      </Modal>

      <div style={{ minHeight: "100vh", backgroundColor: BK.black, padding: "120px 40px 120px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "transparent",
              borderRadius: CARD_RADIUS,
              padding: "0",
            }}
          >
            <h1
              style={{
                fontFamily: "Sequel Sans",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: BK.white,
                marginBottom: 20,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              <BubbleText text="Las herramientas más útiles del Mercado" />
            </h1>
            <p
              style={{
                fontFamily: "Sequel Sans",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: 1.6,
                color: BK.white,
                marginBottom: 120,
                textAlign: "center",
                maxWidth: "800px",
                marginInline: "auto",
              }}
            >
              Explorá las tecnologías que dominan cada área del mundo digital, organizadas para vos.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedId(category.id)}
                  className="group relative aspect-[16/10] w-full overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1"
                  style={{
                    borderRadius: CARD_RADIUS,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
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
                      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectFit: category.mediaFit ?? "cover",
                        objectPosition: category.mediaPosition ?? "center",
                        transform: category.mediaScale ? `scale(${category.mediaScale})` : undefined,
                        borderRadius: category.mediaFit === "contain" ? 22 : undefined,
                      }}
                    />
                  ) : (
                    <img
                      src={category.image}
                      alt={category.title}
                      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectFit: category.mediaFit ?? "cover",
                        objectPosition: category.mediaPosition ?? "center",
                        transform: category.mediaScale ? `scale(${category.mediaScale})` : undefined,
                        borderRadius: category.mediaFit === "contain" ? 22 : undefined,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.85)_100%)]" />

                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <h2
                      style={{
                        fontFamily: "Sequel Sans",
                        fontWeight: 700,
                        fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                        color: BK.white,
                        margin: 0,
                      }}
                    >
                      {category.title}
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
