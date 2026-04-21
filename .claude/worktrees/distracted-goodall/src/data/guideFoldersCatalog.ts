export type GuideFolderKind = "stats" | "marketing" | "prompts" | "timeline" | "design" | "automation";

export type GuideFolderCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  kind: GuideFolderKind;
};

export const guideFoldersCatalog: GuideFolderCard[] = [
  {
    id: "recursos",
    eyebrow: "Recursos",
    title: "World class resources at your fingertips",
    description: "Explorá {count}+ conceptos prácticos para dominar IA desde cero.",
    kind: "stats",
  },
  {
    id: "marketing",
    eyebrow: "Marketing",
    title: "Campañas y contenido listos para accionar",
    description: "Ideas, copies y workflows para crecer sin fricción operativa.",
    kind: "marketing",
  },
  {
    id: "prompts",
    eyebrow: "Prompts",
    title: "Prompts claros para mejores resultados",
    description: "Plantillas listas para ventas, soporte y creación de contenido.",
    kind: "prompts",
  },
  {
    id: "historia",
    eyebrow: "Historia de IA",
    title: "La IA no es nueva",
    description: "Un vistazo rápido a los hitos que hicieron posible la IA actual.",
    kind: "timeline",
  },
  {
    id: "diseno",
    eyebrow: "Diseño con IA",
    title: "Diseño visual sin ruido",
    description: "Composición, estilo y consistencia para piezas que se vean premium.",
    kind: "design",
  },
  {
    id: "automatizacion",
    eyebrow: "Automatización",
    title: "Automatizá tareas con lógica simple",
    description: "Conectá herramientas y armá procesos que se ejecuten solos.",
    kind: "automation",
  },
];

