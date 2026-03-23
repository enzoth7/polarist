import {
  BriefcaseBusiness,
  Building2,
  ChefHat,
  HeartPulse,
  Landmark,
  Megaphone,
  MessageCircleHeart,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ToolNicheDefinition = {
  value: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
};

export const toolNicheDefinitions = [
  {
    value: "general",
    label: "General",
    subtitle: "Dudas cruzadas y atajos para cualquier negocio",
    icon: MessageCircleHeart,
  },
  {
    value: "gastronomia",
    label: "Gastronomia",
    subtitle: "Reservas, cocina y servicio en movimiento",
    icon: ChefHat,
  },
  {
    value: "creadores",
    label: "Creadores",
    subtitle: "Contenido, ideas y piezas listas para publicar",
    icon: Sparkles,
  },
  {
    value: "agencias",
    label: "Agencias",
    subtitle: "Entrega mas rapida y menos retrabajo",
    icon: Megaphone,
  },
  {
    value: "inmobiliarias",
    label: "Inmobiliarias",
    subtitle: "Seguimiento, visitas y respuestas repetidas",
    icon: Building2,
  },
  {
    value: "abogados",
    label: "Abogados",
    subtitle: "Consultas frecuentes y orden documental",
    icon: Landmark,
  },
  {
    value: "retail",
    label: "Retail",
    subtitle: "Ventas, catalogo y atencion diaria",
    icon: ShoppingBag,
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    subtitle: "Tienda, campanas y conversiones",
    icon: BriefcaseBusiness,
  },
  {
    value: "freelancers",
    label: "Freelancers",
    subtitle: "Propuestas, entregas y tiempo mejor usado",
    icon: Users,
  },
  {
    value: "salud",
    label: "Salud",
    subtitle: "Turnos, seguimiento y comunicacion clara",
    icon: HeartPulse,
  },
  {
    value: "coaches",
    label: "Coaches",
    subtitle: "Sesiones, seguimiento y materiales simples",
    icon: Stethoscope,
  },
] as const satisfies readonly ToolNicheDefinition[];

export type ToolNicheKey = (typeof toolNicheDefinitions)[number]["value"];

export const toolBusinessNiches = toolNicheDefinitions.filter(
  (niche): niche is Extract<(typeof toolNicheDefinitions)[number], { value: Exclude<ToolNicheKey, "general"> }> =>
    niche.value !== "general",
);

export const toolNicheMap = Object.fromEntries(
  toolNicheDefinitions.map((niche) => [niche.value, niche]),
) as Record<ToolNicheKey, (typeof toolNicheDefinitions)[number]>;
