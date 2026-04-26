export type GuideFolderKind = "social" | "web" | "visual" | "decision" | "strategy" | "timeline" | "terms" | "prompts" | "memory" | "business";

export type GuideFolderCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  kind: GuideFolderKind;
};

export const guideFoldersCatalog: GuideFolderCard[] = [
  {
    id: "timeline",
    eyebrow: "Historia",
    title: "El inicio de la Inteligencia Artificial",
    description: "Desde los primeros algoritmos hasta la revolución actual de los modelos de lenguaje.",
    kind: "timeline",
  },
  {
    id: "terms",
    eyebrow: "Glosario",
    title: "Términos esenciales de Inteligencia Artificial",
    description: "Los conceptos clave que necesitás entender para hablar el mismo idioma que la tecnología.",
    kind: "terms",
  },
  {
    id: "visual",
    eyebrow: "Comunicación",
    title: "Fundamentos de Comunicación y Conceptos Visuales",
    description: "Principios de diseño y narrativa visual para destacar en un mundo saturado de imágenes.",
    kind: "visual",
  },
  {
    id: "social",
    eyebrow: "Estrategia",
    title: "Datos fundamentales para negocios, marcas y emprendedores",
    description: "Información crítica para aplicar la IA en el crecimiento real de tu proyecto o empresa.",
    kind: "social",
  },
  {
    id: "prompts",
    eyebrow: "Ingeniería",
    title: "Prompts estratégicos según cada herramienta",
    description: "Estructuras maestras para obtener los mejores resultados de ChatGPT, Claude, Gemini y más.",
    kind: "prompts",
  },
  {
    id: "decision",
    eyebrow: "Criterio",
    title: "Cuándo usar Inteligencia Artificial y cuándo no",
    description: "Aprendé a distinguir dónde la IA suma valor y dónde el toque humano sigue siendo insustituible.",
    kind: "decision",
  },
  {
    id: "strategy",
    eyebrow: "Diferenciación",
    title: "Cómo diferenciarte en un mercado donde la IA iguala todo",
    description: "Estrategias para mantener tu autenticidad y ventaja competitiva cuando la tecnología se vuelve masiva.",
    kind: "strategy",
  },
];
