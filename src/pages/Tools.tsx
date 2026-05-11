import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Bookmark, ExternalLink, Heart, Plus, X } from "lucide-react";

import Modal from "@/components/ui/modal-drop";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { RadarMetricsBoard } from "@/components/radar/RadarMetricsBoard";
import { FinalCTA } from "@/components/layout/FinalCTA";

import { useAuth } from "@/hooks/useAuth";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { getToolHref, type ToolItem, useToolsQuery } from "@/hooks/useTools";
import { isVideoAsset } from "@/lib/assetPaths";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type ToolInteractions = ReturnType<typeof useToolInteractions>;

const BK = {
  black: "#010101",
  white: "#F6F6F6",
} as const;

const CARD_RADIUS = 32;
const sequelTextStyle = { fontFamily: "Sequel Sans" };

type CategoryDef = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  image: string;
  mediaPosition?: string;
  mediaFit?: "cover" | "contain";
  mediaScale?: number;
};

type ResolvedTool = {
  label: string;
  href: string | null;
  tool: ToolItem;
};

const SUPABASE_CATEGORY_TO_ID: Record<string, string> = {
  "ia conversacional": "conversacional",
  "creacion de contenido": "creacion",
  "automatizacion": "automatizaciones",
  "desarrollo y web": "desarrollo",
  "marketing y ventas": "marketing",
  "productividad": "productividad",
};

const normalizeCategoryKey = (value: string | null | undefined) =>
  (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const matchCategoryId = (toolCategory: string | null | undefined, categoryId: string) =>
  SUPABASE_CATEGORY_TO_ID[normalizeCategoryKey(toolCategory)] === categoryId;

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

const CATEGORIES: CategoryDef[] = [
  {
    id: "conversacional",
    title: "Chatbot",
    description: "Asistentes de lenguaje para consultas, redacción y análisis.",
    coverImage: CATEGORY_IMAGES.conversacional,
    image: "/images/tools/chatbot-pattern-storage.webm",
  },
  {
    id: "creacion",
    title: "Creación de Contenido",
    description: "Imágenes, video, música y presentaciones generadas con IA.",
    coverImage: CATEGORY_IMAGES.creacion,
    image: "/images/tools/creacion-contenido-entryway.webm",
  },
  {
    id: "automatizaciones",
    title: "Automatizaciones",
    description: "Conectá apps y procesos sin código. El stack operativo moderno.",
    coverImage: CATEGORY_IMAGES.automatizaciones,
    image: "/images/tools/automatizaciones-shelf-styling.webm",
    mediaPosition: "center 38%",
  },
  {
    id: "desarrollo",
    title: "Desarrollo y Web",
    description: "Construí más rápido con IA, desde el diseño hasta el deploy.",
    coverImage: CATEGORY_IMAGES.desarrollo,
    image: "/images/tools/desarrollo-web-coastal.webm",
  },
  {
    id: "marketing",
    title: "Marketing y Ventas",
    description: "Captá leads, automatizá comunicaciones y escalá campañas.",
    coverImage: CATEGORY_IMAGES.marketing,
    image: "/images/tools/marketing-ventas-replacement.webm",
  },
  {
    id: "productividad",
    title: "Productividad",
    description: "Organizá, resumí y agilizá el trabajo diario.",
    coverImage: CATEGORY_IMAGES.productividad,
    image: "/images/tools/productividad-cozy-corner.webm",
  },
];

const normalizeText = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();


const buildResolvedTool = (tool: ToolItem): ResolvedTool => ({
  label: tool.name,
  href: getToolHref(tool),
  tool,
});

const buildToolDetailSections = (tool: ResolvedTool): ClaudeDetailSection[] => {
  const sections: ClaudeDetailSection[] = [];
  const baseId = normalizeText(tool.label);

  const realPurpose = tool.tool.whatIsItReallyFor?.trim();
  if (realPurpose) {
    sections.push({
      id: `${baseId}-purpose`,
      number: "",
      title: "Para qué sirve realmente",
      description: realPurpose,
    });
  }

  const audience = tool.tool.whoIsItFor?.trim();
  if (audience) {
    sections.push({
      id: `${baseId}-who`,
      number: "",
      title: "Para quién es",
      description: audience,
    });
  }

  const otherUses = tool.tool.otrosUsos?.trim();
  if (otherUses) {
    sections.push({
      id: `${baseId}-uses`,
      number: "",
      title: "Otros usos",
      description: otherUses,
    });
  }

  return sections.map((section, index) => ({
    ...section,
    number: String(index + 1).padStart(2, "0"),
  }));
};

function ToolHeaderActions({
  toolName,
  interactions,
}: {
  toolName: string;
  interactions: ToolInteractions;
}) {
  const navigate = useNavigate();
  const { status } = useAuth();
  const isFavorited = interactions.isFavorited(toolName);
  const isSaved = interactions.isSaved(toolName);
  const favoriteCount = interactions.getFavoriteCount(toolName);
  const isFavoritePending = interactions.isFavoritePending(toolName);
  const isSavePending = interactions.isSavePending(toolName);

  const requiresLogin = status !== "authenticated";

  const handleFavorite = async () => {
    if (requiresLogin) {
      navigate(routes.login);
      return;
    }
    try {
      await interactions.toggleFavorite(toolName);
    } catch (error) {
      if ((error as Error).message === "AUTH_REQUIRED") {
        navigate(routes.login);
      }
    }
  };

  const handleSave = async () => {
    if (requiresLogin) {
      navigate(routes.login);
      return;
    }
    try {
      await interactions.toggleSave(toolName);
    } catch (error) {
      if ((error as Error).message === "AUTH_REQUIRED") {
        navigate(routes.login);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isFavoritePending}
        aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-pressed={isFavorited}
        className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-white/75 transition-colors hover:text-white disabled:opacity-60"
        style={sequelTextStyle}
      >
        <motion.span
          key={isFavorited ? "fav-on" : "fav-off"}
          whileTap={{ scale: 0.82 }}
          animate={{ scale: isFavorited ? [1, 1.2, 1] : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 16 }}
          className="inline-flex"
        >
          <Heart
            strokeWidth={1.8}
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorited
                ? "fill-[#CAFE5B] text-[#CAFE5B]"
                : "fill-transparent text-white/70 group-hover:text-white",
            )}
          />
        </motion.span>
        {favoriteCount > 0 ? (
          <span className="font-medium tabular-nums text-white/80">{favoriteCount}</span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSavePending}
        aria-label={isSaved ? "Quitar de guardados" : "Guardar"}
        aria-pressed={isSaved}
        className="group inline-flex items-center justify-center rounded-full p-1.5 text-white/75 transition-colors hover:text-white disabled:opacity-60"
      >
        <motion.span
          key={isSaved ? "save-on" : "save-off"}
          whileTap={{ scale: 0.82 }}
          animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 16 }}
          className="inline-flex"
        >
          <Bookmark
            strokeWidth={1.8}
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved
                ? "fill-[#CAFE5B] text-[#CAFE5B]"
                : "fill-transparent text-white/70 group-hover:text-white",
            )}
          />
        </motion.span>
      </button>
    </>
  );
}

function ToolEditorialDetail({ tool }: { tool: ResolvedTool }) {
  const detailSections = buildToolDetailSections(tool);
  const description = tool.tool.description?.trim();
  const kind = tool.tool.kind?.trim();

  return (
    <div className="w-full overflow-x-hidden space-y-10 text-[#F6F6F6]" style={sequelTextStyle}>
      <div className="grid min-w-0 items-start gap-10 lg:grid-cols-[minmax(340px,0.78fr)_minmax(720px,1.22fr)] lg:gap-14">
        <div className="flex min-w-0 h-full flex-col space-y-8 lg:self-start">
          <div className="space-y-5">
            {kind ? (
              <h2
                className="text-[clamp(1.4rem,2.8vw,2.4rem)] font-bold leading-[1] tracking-[-0.04em] text-[#CAFE5B]"
                style={sequelTextStyle}
              >
                {kind}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-[34ch] text-[1.05rem] leading-8 text-white/72" style={sequelTextStyle}>
                {description}
              </p>
            ) : null}
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

        <div className="mx-auto flex w-full min-w-0 max-w-[980px] justify-center overflow-x-hidden pb-10 lg:max-w-[920px] lg:pb-12">
          <Accordion type="single" collapsible className="w-full min-w-0 space-y-8">
            {detailSections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="min-w-0 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#010101] px-8 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    style={sequelTextStyle}
                    className="flex w-full min-w-0 items-center justify-between gap-5 py-6 text-left [&>div>svg>path:last-child]:origin-center [&>div>svg>path:last-child]:transition-all [&>div>svg>path:last-child]:duration-200 [&[data-state=open]>div>svg>path:last-child]:rotate-90 [&[data-state=open]>div>svg>path:last-child]:opacity-0"
                  >
                    <h3
                      className="min-w-0 flex-1 text-[clamp(1.45rem,2.4vw,2.2rem)] font-bold leading-[0.98] tracking-[-0.05em] text-[#F6F6F6]"
                      style={sequelTextStyle}
                    >
                      {section.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-5 pl-3">
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
                  <p
                    className="max-w-[52ch] break-words text-[0.94rem] leading-[1.65] text-white/72"
                    style={sequelTextStyle}
                  >
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
  onClose,
}: {
  category: CategoryDef;
  officialTools: ToolItem[];
  onClose: () => void;
}) {
  const tools = useMemo(
    () =>
      officialTools
        .filter((tool) => matchCategoryId(tool.category, category.id))
        .map((tool) => buildResolvedTool(tool)),
    [category, officialTools],
  );
  const toolNames = useMemo(() => tools.map((tool) => tool.tool.name), [tools]);
  const interactions = useToolInteractions(toolNames);
  const desktopColumns = useMemo(() => {
    if (tools.length <= 1) return tools.length || 1;
    if (tools.length >= 18) return 7;
    if (tools.length >= 15) return 6;
    if (tools.length % 5 === 0) return 5;
    if (tools.length % 4 === 0) return 4;
    if (tools.length % 3 === 0) return 3;
    if (tools.length % 2 === 0) return 2;
    return tools.length;
  }, [tools.length]);
  const hasOddMobileItem = tools.length % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="tools-modal-sequel relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#010101] font-sequel text-[#F6F6F6] shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
      style={sequelTextStyle}
    >
      {/* X fijo — fuera del scroll, siempre visible */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2c2c2c] text-white transition-colors hover:bg-[#3a3a3a]"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      {/* Scroll interno */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-4 overflow-x-hidden px-3 pb-8 pt-4 md:px-4">
          <div className="flex items-center justify-center px-12 py-3">
            <h1 className="text-center text-[clamp(1.2rem,3vw,2.3rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#F6F6F6]">
              {category.title}
            </h1>
          </div>

          <div
            className={cn(
              "grid min-w-0 grid-cols-2 gap-2 overflow-x-hidden",
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
                className={cn(
                  "min-w-0 w-full",
                  hasOddMobileItem && index === tools.length - 1 && "col-span-2 mx-auto max-w-[calc(50%-0.25rem)] lg:col-span-1 lg:max-w-none",
                )}
              >
                <ExpandableCard
                  title={tool.label}
                  src=""
                  description=""
                  className={cn("w-full", "aspect-square")}
                  disableSharedLayout
                  hideExpandedMedia
                  classNameExpanded={
                    "[&_h3]:text-[#F6F6F6] [&_p]:text-[#F6F6F6] !h-auto !max-w-full sm:!max-h-[860px] sm:!max-w-[1320px] !bg-[#010101] !border-white/10"
                  }
                  expandedHeaderActions={
                    <ToolHeaderActions toolName={tool.tool.name} interactions={interactions} />
                  }
                  media={
                    <div className="flex h-full w-full items-center justify-center px-4 py-4 md:px-5 md:py-5">
                      <ToolLogo
                        name={tool.label}
                        logoFilename={tool.tool?.logoFilename}
                        className="h-16 w-16 translate-y-[13%] rounded-[1.5rem] border-0 bg-transparent sm:h-20 sm:w-20 md:h-24 md:w-24"
                        imageClassName="p-0 object-contain"
                      />
                    </div>
                  }
                >
                  <ToolEditorialDetail tool={tool} />
                </ExpandableCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Tools = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: officialTools = [] } = useToolsQuery();

  const selectedCategory = selectedId ? CATEGORIES.find((category) => category.id === selectedId) ?? null : null;

  return (
    <>
      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedId(null)}
        type="blur"
        animationType="scale"
        disablePadding
        showCloseButton={false}
        position={0}
        centerOnMobile
        className="tools-modal-sequel dark !max-w-[1400px] overflow-x-hidden border-0 !bg-transparent font-sequel shadow-none"
      >
        {selectedCategory ? (
          <CategoryDetail
            category={selectedCategory}
            officialTools={officialTools}
            onClose={() => setSelectedId(null)}
          />
        ) : null}
      </Modal>

      <div className="min-h-dvh bg-[#010101] px-5 py-24 md:px-10 md:py-[120px]">
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
                textWrap: "balance",
              }}
            >
              Las herramientas más útiles del Mercado
            </h1>
            <p
              style={{
                fontFamily: "Sequel Sans",
                fontWeight: 400,
                fontSize: "clamp(15px, 4vw, 18px)",
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
                  className="group relative aspect-[16/10] w-full overflow-hidden text-left transition-transform duration-500 md:hover:-translate-y-1"
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
                      className="absolute inset-0 h-full w-full transition-transform duration-700 md:group-hover:scale-105"
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
                      className="absolute inset-0 h-full w-full transition-transform duration-700 md:group-hover:scale-105"
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

        <div className="mt-24">
          <RadarMetricsBoard />
        </div>
      </div>

      <FinalCTA
        title="Mantente en la vanguardia"
        description="Explora las últimas tendencias en el mercado"
        buttonText="Ver tendencias"
        to={routes.appTrends}
      />
    </>
  );
};

export default Tools;
