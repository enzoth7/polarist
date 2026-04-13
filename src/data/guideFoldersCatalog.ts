export type GuideFolderKind = "social" | "web" | "visual" | "decision" | "strategy" | "timeline" | "terms" | "prompts" | "memory";

export type GuideFolderCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  kind: GuideFolderKind;
};

export const guideFoldersCatalog: GuideFolderCard[] = [
  {
    id: "social",
    eyebrow: "Social Media",
    title: "Bases de Redes Sociales",
    description: "Patrones de atención, jerarquía algorítmica y los principios inmutables para el contenido orgánico.",
    kind: "social",
  },
  {
    id: "web",
    eyebrow: "Desarrollo Web",
    title: "Estructuras de Internet",
    description: "Cómo funciona la web, frameworks básicos y la lógica elemental para entender software sin programar.",
    kind: "web",
  },
  {
    id: "visual",
    eyebrow: "Arte & Diseño",
    title: "Conceptos Visuales",
    description: "Composición espacial, teoría de jerarquías y estéticas premium sin necesidad de ser diseñador.",
    kind: "visual",
  },
  {
    id: "decision",
    eyebrow: "Criterio Tecnológico",
    title: "Cuándo Usar IA (y Cuándo No)",
    description: "Un marco de decisión sólido para delegar lo correcto y mantener el trabajo manual donde aporta valor.",
    kind: "decision",
  },
  {
    id: "strategy",
    eyebrow: "Diferenciación",
    title: "Destruye la Homogeneidad",
    description: "La IA estandariza. Descubre los pilares tácticos para que tu marca evada el tono robótico y predomine.",
    kind: "strategy",
  },
  {
    id: "timeline",
    eyebrow: "Historia de la IA",
    title: "Origen de las Máquinas",
    description: "El linaje directo: desde el hardware básico hasta los cerebros sintéticos que levantan mundos.",
    kind: "timeline",
  },
  {
    id: "terms",
    eyebrow: "Glosario Oficial",
    title: "Términos Básicos de IA",
    description: "Inferencia, Tokens, Perceptrones. La guía de léxico definitiva para hablar de tecnología con autoridad.",
    kind: "terms",
  },
  {
    id: "prompts",
    eyebrow: "Ingeniería Prompt",
    title: "Prompts Validados",
    description: "Fórmulas calificadas de alta precisión. Listas para inyectar y explotar algoritmos de cualquier motor.",
    kind: "prompts",
  },
  {
    id: "memory",
    eyebrow: "Context Molding",
    title: "Inyectando Memoria",
    description: "La técnica maestra para nutrir LLMs. Archivos base para guiar la personalidad de GPTs y Gems.",
    kind: "memory",
  },
];

