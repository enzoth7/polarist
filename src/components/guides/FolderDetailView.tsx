import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { guideFoldersCatalog } from "@/data/guideFoldersCatalog";

// ── Brand Kit B ───────────────────────────────────────────────────────────
const BG    = "#F6F6F6";
const WHITE = "#FFFFFF";
const BLACK = "#010101";
const GREEN = "#CAFE5B";
const SERIF = "var(--font-serif)";
const SANS  = "var(--font-sequel, sans-serif)";

type ChapterCard = {
  id: string;
  title: string;
  subtitle: string;
  isUnlocked: boolean;
};

// ── Catálogo de capítulos ─────────────────────────────────────────────────
const guideContentCatalog: Record<string, ChapterCard[]> = {
  social: [
    { id: "1", title: "Patrones de Atención",      subtitle: "Hooks y retención visual",       isUnlocked: true  },
    { id: "2", title: "Jerarquía Algorítmica",     subtitle: "Cómo priorizan las plataformas", isUnlocked: true  },
    { id: "3", title: "Contenido Orgánico",        subtitle: "Principios inmutables",          isUnlocked: true  },
    { id: "4", title: "Formatos Verticales",       subtitle: "Reels, Shorts, TikTok",          isUnlocked: true  },
    { id: "5", title: "Métricas Core",             subtitle: "Lectura de estadísticas",        isUnlocked: true  },
    { id: "6", title: "Segmentación de Audiencia", subtitle: "Filtrar para crecer",            isUnlocked: false },
    { id: "7", title: "Automatización de DMs",     subtitle: "Flujos de respuesta",            isUnlocked: false },
    { id: "8", title: "Crecimiento con IA",        subtitle: "Prompting para RRSS",            isUnlocked: false },
  ],
  web: [
    { id: "1", title: "Cómo Funciona Internet", subtitle: "Protocolos y rutas",            isUnlocked: true  },
    { id: "2", title: "Frontend Básico",        subtitle: "Lo que el usuario ve",          isUnlocked: true  },
    { id: "3", title: "Backend y Servidores",   subtitle: "Lógica invisible",              isUnlocked: true  },
    { id: "4", title: "Bases de Datos",         subtitle: "Dónde vive la información",     isUnlocked: true  },
    { id: "5", title: "APIs y HTTP",            subtitle: "Cómo hablan los servicios",     isUnlocked: true  },
    { id: "6", title: "DNS y Hosting",          subtitle: "Tu dirección en la web",        isUnlocked: false },
    { id: "7", title: "Frameworks Modernos",    subtitle: "React, Next.js, Vue",           isUnlocked: false },
    { id: "8", title: "Deploy y Producción",    subtitle: "Llevar código al mundo",        isUnlocked: false },
  ],
  visual: [
    { id: "1", title: "Composición Espacial", subtitle: "Peso y balance visual",        isUnlocked: true  },
    { id: "2", title: "Teoría del Color",     subtitle: "Psicología y sistemas",        isUnlocked: true  },
    { id: "3", title: "Tipografía Funcional", subtitle: "Legibilidad y jerarquía",      isUnlocked: true  },
    { id: "4", title: "Jerarquía Visual",     subtitle: "Guiar la mirada",              isUnlocked: true  },
    { id: "5", title: "Espaciado y Ritmo",    subtitle: "El poder del vacío",           isUnlocked: true  },
    { id: "6", title: "Contraste y Tensión",  subtitle: "Alto impacto sin ruido",       isUnlocked: false },
    { id: "7", title: "Estilos Premium",      subtitle: "Minimalismo y elegancia",      isUnlocked: false },
    { id: "8", title: "Identidad Visual",     subtitle: "Coherencia de marca",          isUnlocked: false },
  ],
  decision: [
    { id: "1", title: "Marco de Decisión",       subtitle: "El filtro base",                  isUnlocked: true  },
    { id: "2", title: "Cuándo Automatizar",      subtitle: "Señales de alerta positivas",     isUnlocked: true  },
    { id: "3", title: "Cuándo No Usar IA",       subtitle: "Límites críticos",                isUnlocked: true  },
    { id: "4", title: "Evaluación de ROI",       subtitle: "Costo real de implementar",       isUnlocked: true  },
    { id: "5", title: "Sesgos del Modelo",       subtitle: "Lo que la IA no ve",              isUnlocked: true  },
    { id: "6", title: "Trabajo Manual Valioso",  subtitle: "Dónde el humano gana",            isUnlocked: false },
    { id: "7", title: "Criterio vs Automatismo", subtitle: "El balance correcto",             isUnlocked: false },
    { id: "8", title: "Delegación Estratégica",  subtitle: "Qué ceder y qué retener",         isUnlocked: false },
  ],
  strategy: [
    { id: "1", title: "La Estandarización IA", subtitle: "El riesgo de la uniformidad", isUnlocked: true  },
    { id: "2", title: "Tono de Voz Propio",    subtitle: "Anti-robótico y directo",     isUnlocked: true  },
    { id: "3", title: "Pilares de Marca",      subtitle: "Las tres anclas",             isUnlocked: true  },
    { id: "4", title: "Narrativa Original",    subtitle: "Historias que no se copian",  isUnlocked: true  },
    { id: "5", title: "Identidad Constante",   subtitle: "Coherencia a escala",         isUnlocked: true  },
    { id: "6", title: "Anti-IA Writing",       subtitle: "Técnicas de humanización",    isUnlocked: false },
    { id: "7", title: "Originalidad Táctica",  subtitle: "Métodos verificables",        isUnlocked: false },
    { id: "8", title: "Predominio de Marca",   subtitle: "Diferenciación sostenida",    isUnlocked: false },
  ],
  timeline: [
    { id: "1", title: "Los Primeros Algoritmos",    subtitle: "Turing y los fundamentos",   isUnlocked: true  },
    { id: "2", title: "Redes Neuronales",            subtitle: "El modelo biológico",        isUnlocked: true  },
    { id: "3", title: "Machine Learning",            subtitle: "Aprender de datos",          isUnlocked: true  },
    { id: "4", title: "Deep Learning",               subtitle: "Capas y representaciones",   isUnlocked: true  },
    { id: "5", title: "La Revolución Transformer",  subtitle: "Atención y contexto",         isUnlocked: true  },
    { id: "6", title: "GPT y los LLMs",             subtitle: "El lenguaje como interfaz",   isUnlocked: false },
    { id: "7", title: "IA Generativa",              subtitle: "Imágenes, audio, video",      isUnlocked: false },
    { id: "8", title: "El Presente",                subtitle: "Agentes y razonamiento",      isUnlocked: false },
  ],
  terms: [
    { id: "1", title: "Inferencia",     subtitle: "Cómo un modelo predice",        isUnlocked: true  },
    { id: "2", title: "Tokens",         subtitle: "La unidad mínima del lenguaje", isUnlocked: true  },
    { id: "3", title: "Perceptrones",   subtitle: "La neurona artificial",         isUnlocked: true  },
    { id: "4", title: "Embeddings",     subtitle: "El espacio semántico",          isUnlocked: true  },
    { id: "5", title: "Fine-tuning",    subtitle: "Especializar un modelo",        isUnlocked: true  },
    { id: "6", title: "RAG",            subtitle: "Recuperación aumentada",        isUnlocked: false },
    { id: "7", title: "Context Window", subtitle: "Límite de memoria activa",      isUnlocked: false },
    { id: "8", title: "Temperatura",    subtitle: "Creatividad controlada",        isUnlocked: false },
  ],
  prompts: [
    { id: "1", title: "Anatomía del Prompt",   subtitle: "Estructura base probada",   isUnlocked: true  },
    { id: "2", title: "Chain of Thought",      subtitle: "Razonamiento paso a paso",  isUnlocked: true  },
    { id: "3", title: "Few-Shot Prompting",    subtitle: "Ejemplos como guía",        isUnlocked: true  },
    { id: "4", title: "System Prompt",         subtitle: "Instruir desde el inicio",  isUnlocked: true  },
    { id: "5", title: "Rol y Persona",         subtitle: "Darle identidad al modelo", isUnlocked: true  },
    { id: "6", title: "Restricciones Claras",  subtitle: "Lo que no debe hacer",      isUnlocked: false },
    { id: "7", title: "Output Format",         subtitle: "Controlar la respuesta",    isUnlocked: false },
    { id: "8", title: "Iteración Estratégica", subtitle: "Refinar hasta precisión",   isUnlocked: false },
  ],
  memory: [
    { id: "1", title: "Qué es Context Molding", subtitle: "La técnica maestra",             isUnlocked: true  },
    { id: "2", title: "Archivos Base",           subtitle: "El sistema de instrucción",      isUnlocked: true  },
    { id: "3", title: "Memoria Persistente",     subtitle: "Nutrir LLMs de forma continua",  isUnlocked: true  },
    { id: "4", title: "System Instructions",     subtitle: "Capas de personalidad",          isUnlocked: true  },
    { id: "5", title: "GPT Custom",              subtitle: "Configurar tu asistente",        isUnlocked: true  },
    { id: "6", title: "Google Gems",             subtitle: "El equivalente de Google",       isUnlocked: false },
    { id: "7", title: "Agentes con Memoria",     subtitle: "Flujos que recuerdan",           isUnlocked: false },
    { id: "8", title: "Límites de Contexto",     subtitle: "Estrategias de compresión",      isUnlocked: false },
  ],
};

// ── Helpers de layout ─────────────────────────────────────────────────────
const inner = { maxWidth: 1200, margin: "0 auto", padding: "0 32px" };

interface FolderDetailViewProps {
  folderId: string;
  onClose: () => void;
}

export const FolderDetailView = ({ folderId, onClose }: FolderDetailViewProps) => {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const folder   = guideFoldersCatalog.find((f) => f.id === folderId);
  const chapters = guideContentCatalog[folderId] ?? [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG }}>

      {/* ── Cabecera ── */}
      <div style={{ ...inner, paddingTop: 40, paddingBottom: 56 }}>

        {/* Botón volver — link de texto minimalista */}
        <button
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: "0.04em",
            color: "rgba(1,1,1,0.38)",
            padding: 0,
            marginBottom: 48,
            transition: "color 0.15s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = BLACK; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(1,1,1,0.38)"; }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Volver a Recursos
        </button>

        <h1
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: BLACK,
            marginBottom: 14,
          }}
        >
          {folder?.title ?? folderId}
        </h1>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(1,1,1,0.45)",
            maxWidth: 520,
            marginBottom: 48,
          }}
        >
          {folder?.description ?? "Seleccioná un capítulo para explorar el contenido."}
        </p>

        {/* Grid de capítulos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {chapters.map((chapter) => {
            const isSelected = activeChapter === chapter.id;
            return (
              <div
                key={chapter.id}
                onClick={chapter.isUnlocked ? () => setActiveChapter(chapter.id) : undefined}
                style={{
                  backgroundColor: isSelected ? BLACK : WHITE,
                  borderRadius: 24,
                  border: `1px solid ${isSelected ? BLACK : "rgba(1,1,1,0.07)"}`,
                  padding: "20px 24px",
                  cursor: chapter.isUnlocked ? "pointer" : "not-allowed",
                  opacity: chapter.isUnlocked ? 1 : 0.35,
                  filter: chapter.isUnlocked ? "none" : "grayscale(1)",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <p
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.2,
                    color: isSelected ? WHITE : BLACK,
                    margin: 0,
                  }}
                >
                  {chapter.title}
                </p>
                <p
                  style={{
                    fontFamily: SANS,
                    fontWeight: 400,
                    fontSize: 12,
                    color: isSelected ? "rgba(255,255,255,0.5)" : "rgba(1,1,1,0.38)",
                    margin: 0,
                  }}
                >
                  {chapter.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Contenido del capítulo — bands de ancho completo ── */}
      {activeChapter && (
        <>
          {/* Band 1 — blanca: texto principal */}
          <div style={{ backgroundColor: WHITE, padding: "72px 0" }}>
            <div style={inner}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: BLACK,
                  marginBottom: 20,
                  maxWidth: 720,
                }}
              >
                Por qué fallan al crear la identidad digital
              </h2>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(1,1,1,0.55)",
                  maxWidth: 640,
                }}
              >
                Muchos equipos se apresuran a publicar, pero olvidan el diseño base. Este módulo explica qué hacer para mantenerse claro, competitivo y frenar la pérdida de retención.
              </p>
            </div>
          </div>

          {/* Band 2 — gris: puntos de acción */}
          <div style={{ backgroundColor: BG, padding: "72px 0" }}>
            <div style={inner}>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  letterSpacing: "-0.02em",
                  color: BLACK,
                  marginBottom: 32,
                }}
              >
                Qué tenés que hacer hoy
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Definir 3 pilares visuales estrictos.",
                  "Auditar los colores de tu feed actual vs tu competencia.",
                  "Crear plantilla madre en Figma / Canva que no varíe.",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div
                      style={{
                        marginTop: 7,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: BLACK,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "rgba(1,1,1,0.65)",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Band 3 — blanca: cards puras */}
          <div style={{ backgroundColor: WHITE, padding: "72px 0 96px" }}>
            <div style={inner}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {[
                  {
                    title: "El Costo Real de no Atender el Delivery de Audio",
                    body: "Audios sin retención de gancho paralizan el crecimiento orgánico y degradan el alcance de forma silenciosa.",
                    items: ["Extraer ganchos sonoros", "Transiciones cada 3 segundos"],
                  },
                  {
                    title: "Conseguir Más Tráfico Sin Contratar Medios",
                    body: "Automatizaciones de DMs permiten responder reservaciones 24/7 sin aumentar la nómina del equipo.",
                    items: ["Crear flujos en Manychat", "Vincular N8N con base de datos"],
                  },
                  {
                    title: "La Calidez en el Trato Directo",
                    body: "Cómo los equipos que más crecen conectan de forma genuina con su comunidad de clientes regulares.",
                    items: ["Mencionar usuarios activos", "Repostear contenido de la comunidad"],
                  },
                ].map(({ title, body, items }) => (
                  <div
                    key={title}
                    style={{
                      borderRadius: 24,
                      border: "1px solid rgba(1,1,1,0.07)",
                      padding: "28px 28px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: 15,
                        lineHeight: 1.3,
                        color: BLACK,
                        margin: 0,
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 400,
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: "rgba(1,1,1,0.48)",
                        margin: 0,
                      }}
                    >
                      {body}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0", display: "flex", flexDirection: "column", gap: 7 }}>
                      {items.map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <ChevronRight style={{ width: 11, height: 11, color: GREEN, flexShrink: 0 }} />
                          <span
                            style={{
                              fontFamily: SANS,
                              fontWeight: 500,
                              fontSize: 12,
                              color: "rgba(1,1,1,0.58)",
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
