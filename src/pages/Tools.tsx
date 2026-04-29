import { useMemo, useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Plus } from "lucide-react";

import Modal from "@/components/ui/modal-drop";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { BubbleText } from "@/components/ui/bubble-text";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { ToolLogo } from "@/components/tools/ToolLogo";

import { getToolHref, type ToolItem, useToolsQuery } from "@/hooks/useTools";
import { cn } from "@/lib/utils";

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
  href: string | null;
  tool: ToolItem | null;
  preview: string;
  whyItMatters: string;
  useCases: string[];
  cautions: string[];
};

type ClaudeDetailSection = {
  id: string;
  number: string;
  title: string;
  description: string;
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
      { label: "Midjourney", aliases: ["MidJourney"], fallbackHref: "https://www.midjourney.com" },
      { label: "Adobe Firefly", aliases: ["Firefly"], fallbackHref: "https://www.adobe.com/products/firefly.html" },
      { label: "Higgsfield", fallbackHref: "https://higgsfield.ai" },
      { label: "Genspark", fallbackHref: "https://genspark.ai" },
      { label: "Runway", fallbackHref: "https://runwayml.com" },
      { label: "ElevenLabs", fallbackHref: "https://elevenlabs.io" },
      { label: "Retell", aliases: ["Retell AI"], fallbackHref: "https://www.retellai.com" },
      { label: "Ideogram", fallbackHref: "https://ideogram.ai" },
      { label: "HeyGen", fallbackHref: "https://www.heygen.com" },
      { label: "Jasper", fallbackHref: "https://www.jasper.ai" },
      { label: "Descript", fallbackHref: "https://www.descript.com" },
      { label: "Freepik", fallbackHref: "https://www.freepik.com" },
      { label: "Opus Clip", fallbackHref: "https://www.opus.pro" },
      { label: "Canva", aliases: ["Canva IA"], fallbackHref: "https://www.canva.com" },
      { label: "Odysser", fallbackHref: "https://odysser.com" },
      { label: "Submagic", fallbackHref: "https://www.submagic.co" },
      { label: "Magnific", aliases: ["Magnific AI"], fallbackHref: "https://magnific.ai" },
      { label: "Beeble", fallbackHref: "https://beeble.ai" },
      { label: "Suno", fallbackHref: "https://suno.com" },
      { label: "Moises", fallbackHref: "https://moises.ai" },
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
      { label: "n8n", fallbackHref: "https://n8n.io" },
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
      { label: "Supabase", fallbackHref: "https://supabase.com" },
      { label: "Vercel", fallbackHref: "https://vercel.com" },
      { label: "Framer AI", aliases: ["Framer"], fallbackHref: "https://www.framer.com/ai" },
      { label: "VS Code", fallbackHref: "https://code.visualstudio.com" },
      { label: "Cursor", fallbackHref: "https://cursor.com" },
      { label: "Bolt.new", fallbackHref: "https://bolt.new" },
      { label: "Stitch", aliases: ["Stitch AI"], fallbackHref: "https://stitch.withgoogle.com" },
      { label: "Figma", fallbackHref: "https://www.figma.com" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing y Ventas",
    description: "Captá leads, automatizá comunicaciones y escalá campañas.",
    coverImage: CATEGORY_IMAGES.marketing,
    image: "/images/tools/marketing-ventas-replacement.mp4",
    tools: [
      { label: "AdCreative", aliases: ["AdCreative.ai"], fallbackHref: "https://www.adcreative.ai" },
      { label: "Pomelli", fallbackHref: "https://labs.google.com/u/0/pomelli" },
      { label: "Surfer SEO", fallbackHref: "https://surferseo.com" },
      { label: "Typeform", fallbackHref: "https://www.typeform.com" },
      { label: "Kommo", fallbackHref: "https://kommo.com" },
      { label: "Manychat", aliases: ["ManyChat"], fallbackHref: "https://manychat.com" },
    ],
  },
  {
    id: "productividad",
    title: "Productividad",
    description: "Organizá, resumí y agilizá el trabajo diario.",
    coverImage: CATEGORY_IMAGES.productividad,
    image: "/images/tools/productividad-cozy-corner.mp4",
    tools: [
      { label: "Notion AI", aliases: ["Notion"], fallbackHref: "https://www.notion.so/product/ai" },
      { label: "NotebookLM", fallbackHref: "https://notebooklm.google.com" },
      { label: "Loom", fallbackHref: "https://www.loom.com" },
      { label: "Antigravity", fallbackHref: "https://antigravity.google" },
      { label: "Wispr", fallbackHref: "https://wisprflow.ai" },
      { label: "Gamma", fallbackHref: "https://gamma.app" },
      { label: "Slack", fallbackHref: "https://slack.com" },
      { label: "Fireflies", aliases: ["Fireflies.ai"], fallbackHref: "https://fireflies.ai" },
    ],
  },
];

const normalizeText = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();


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
    href: match ? getToolHref(match) : (req.fallbackHref ?? null),
    tool: match,
    preview: playbook.preview,
    whyItMatters: playbook.whyItMatters,
    useCases: playbook.useCases,
    cautions: playbook.cautions,
  };
};

const buildToolDetailSections = (tool: ResolvedTool, category: CategoryDef): ClaudeDetailSection[] => [
  {
    id: `${normalizeText(tool.label)}-what`,
    number: "01",
    title: "Qué es",
    description:
      `${tool.label} es una herramienta de ${category.title.toLowerCase()} pensada para ${tool.preview.toLowerCase()}.`,
  },
  {
    id: `${normalizeText(tool.label)}-practice`,
    number: "02",
    title: "Qué resuelve en la práctica",
    description:
      tool.tool?.whatIsItReallyFor?.trim() ||
      tool.tool?.description?.trim() ||
      `${tool.label} te ayuda a ejecutar mejor tareas clave dentro de ${category.title.toLowerCase()}.`,
  },
  {
    id: `${normalizeText(tool.label)}-who`,
    number: "03",
    title: "Para quién es",
    description:
      tool.tool?.whoIsItFor?.trim() ||
      "Ideal para equipos, freelancers y negocios que quieren ganar velocidad sin perder criterio.",
  },
  {
    id: `${normalizeText(tool.label)}-uses`,
    number: "04",
    title: "Otros usos",
    description:
      tool.tool?.otrosUsos?.trim() ||
      tool.useCases.join(" • "),
  },
];

function ToolEditorialDetail({ tool, category }: { tool: ResolvedTool; category: CategoryDef }) {
  const detailSections = buildToolDetailSections(tool, category);

  return (
    <div className="space-y-10 text-[#F6F6F6]" style={sequelTextStyle}>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(340px,0.78fr)_minmax(720px,1.22fr)] lg:gap-14">
        <div className="flex h-full flex-col space-y-8 lg:self-start">
          <div className="space-y-7">
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
                <ToolLogo
                  name={tool.label}
                  logoFilename={tool.tool?.logoFilename}
                  className="h-16 w-16 rounded-[1.4rem] border-0 bg-transparent"
                  imageClassName="p-0 object-contain"
                />
                <div className="space-y-1">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#010101]/50">
                    Herramienta
                  </p>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-[#010101]">
                    {tool.label}
                  </p>
                </div>
              </div>
            </div>
            <h2
              className="max-w-[12ch] text-[clamp(2rem,4.8vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.055em] text-[#F6F6F6]"
              style={sequelTextStyle}
            >
              <span className="text-[#CAFE5B]">{category.title}</span>
            </h2>
            <p className="max-w-[34ch] text-[1.05rem] leading-8 text-white/72" style={sequelTextStyle}>
              {tool.whyItMatters} Dentro de {category.title}, {tool.label} funciona como una puerta de entrada muy fuerte para pensar, ejecutar y resolver mejor.
            </p>
          </div>

          <div className="flex justify-start pt-0">
            {tool.href ? (
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#010101] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#F6F6F6] transition hover:scale-[1.03] hover:bg-[#1b1b1b]"
              >
                Página oficial
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="ml-auto w-full max-w-[880px]">
          <Accordion type="single" collapsible className="w-full space-y-8">
            {detailSections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-[1.6rem] border border-white/10 bg-[#010101] px-7 py-1 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    style={sequelTextStyle}
                    className="flex w-full items-start justify-between gap-5 py-4 text-left [&>div>svg>path:last-child]:origin-center [&>div>svg>path:last-child]:transition-all [&>div>svg>path:last-child]:duration-200 [&[data-state=open]>div>svg>path:last-child]:rotate-90 [&[data-state=open]>div>svg>path:last-child]:opacity-0"
                  >
                    <h3
                      className="text-[clamp(1.45rem,2.4vw,2.2rem)] font-bold leading-[0.98] tracking-[-0.05em] text-[#F6F6F6]"
                      style={sequelTextStyle}
                    >
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-5">
                      <span
                        className="shrink-0 text-[1.6rem] font-bold tracking-[-0.05em] text-[#CAFE5B]"
                        style={sequelTextStyle}
                      >
                        {section.number}
                      </span>
                      <Plus
                        size={18}
                        strokeWidth={2}
                        className="shrink-0 text-[#F6F6F6]/80"
                        aria-hidden="true"
                      />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent style={sequelTextStyle} className="pb-5 pt-0">
                  <p className="max-w-[52ch] text-[0.94rem] leading-[1.65] text-white/72" style={sequelTextStyle}>
                    {section.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

    </div>
  );
}

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
  const desktopColumns = useMemo(() => {
    if (tools.length <= 1) return tools.length || 1;
    if (tools.length % 4 === 0) return 4;
    if (tools.length % 3 === 0) return 3;
    if (tools.length % 2 === 0) return 2;
    return tools.length;
  }, [tools.length]);
  const usesSingleDesktopRow = tools.length > 1 && tools.length % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="tools-modal-sequel relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#010101] p-5 font-sequel text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)] md:p-7"
      style={sequelTextStyle}
    >
      <div className="relative space-y-6">
        <div className="flex items-center justify-center px-4 py-5 md:px-6 md:py-7">
          <div className="space-y-4 text-center">
            <h1 className="text-[clamp(1.7rem,3.8vw,2.85rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#F6F6F6]">
              {category.title}
            </h1>
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            "lg:grid-cols-none lg:[grid-template-columns:repeat(var(--desktop-cols),minmax(0,1fr))]",
          )}
          style={{ ["--desktop-cols" as string]: desktopColumns }}
        >
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
                description=""
                className={cn("w-full", "aspect-square")}
                disableSharedLayout
                classNameExpanded={
                  "[&_h3]:text-[#F6F6F6] [&_p]:text-[#F6F6F6] !h-auto !max-h-[860px] !max-w-[1320px] !bg-[#010101] !border-white/10"
                }
                media={
                  <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-[#ffffff] px-8 py-8">
                    <ToolLogo
                      name={tool.label}
                      logoFilename={tool.tool?.logoFilename}
                      className="h-32 w-32 rounded-[2rem] border-0 bg-transparent sm:h-36 sm:w-36"
                      imageClassName="p-0 object-contain"
                    />
                  </div>
                }
              >
                <ToolEditorialDetail tool={tool} category={category} />
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
