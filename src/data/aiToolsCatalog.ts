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

export type ToolRankingItem = {
  name: string;
  domain: string;
  category: string;
  kind: string;
  niches: ToolNicheKey[];
  nicheTags: Partial<Record<ToolNicheKey, string>>;
};

export type ToolTipItem = {
  title: string;
  description: string;
};

export const fullToolsRanking: ToolRankingItem[] = [
  {
    name: "ChatGPT",
    domain: "openai.com",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "gastronomia", "agencias", "retail", "freelancers", "coaches", "salud", "abogados"],
    nicheTags: {
      general: "Textos y orden",
      gastronomia: "Menus y respuestas",
      agencias: "Propuestas mas rapidas",
      retail: "Atencion rapida",
      freelancers: "Briefs y entregables",
      coaches: "Programas y sesiones",
      salud: "Mensajes claros",
      abogados: "Borradores legales",
    },
  },
  {
    name: "Claude",
    domain: "anthropic.com",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "creadores", "abogados", "coaches", "agencias", "freelancers"],
    nicheTags: {
      general: "Redaccion fina",
      creadores: "Guiones y copys",
      abogados: "Analisis largo",
      coaches: "Materiales premium",
      agencias: "Propuestas pulidas",
      freelancers: "Entregables mas claros",
    },
  },
  {
    name: "Gemini",
    domain: "google.com",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "inmobiliarias", "retail", "ecommerce", "creadores"],
    nicheTags: {
      general: "Busqueda asistida",
      inmobiliarias: "Investigacion local",
      retail: "Analisis rapido",
      ecommerce: "Ideas para catalogo",
      creadores: "Apoyo multimodal",
    },
  },
  {
    name: "NotebookLM",
    domain: "google.com",
    category: "Investigacion",
    kind: "Herramienta",
    niches: ["general", "abogados", "coaches", "inmobiliarias", "salud"],
    nicheTags: {
      general: "Sintesis de documentos",
      abogados: "Carpetas y audios",
      coaches: "Notas de sesiones",
      inmobiliarias: "Fichas y comparables",
      salud: "Protocolos resumidos",
    },
  },
  {
    name: "n8n",
    domain: "n8n.io",
    category: "Automatizacion",
    kind: "Plataforma",
    niches: ["agencias", "ecommerce", "retail", "inmobiliarias", "salud"],
    nicheTags: {
      agencias: "Operaciones conectadas",
      ecommerce: "Sincroniza stock",
      retail: "Mensajes automatas",
      inmobiliarias: "Leads conectados",
      salud: "Recordatorios y turnos",
    },
  },
  {
    name: "Canva IA",
    domain: "canva.com",
    category: "Diseno",
    kind: "Herramienta",
    niches: ["gastronomia", "creadores", "retail", "inmobiliarias", "agencias"],
    nicheTags: {
      gastronomia: "Promos visuales",
      creadores: "Piezas rapidas",
      retail: "Ofertas del dia",
      inmobiliarias: "Fichas de propiedad",
      agencias: "Presentaciones express",
    },
  },
  {
    name: "Zapier",
    domain: "zapier.com",
    category: "Automatizacion",
    kind: "Plataforma",
    niches: ["general", "agencias", "freelancers", "ecommerce", "salud"],
    nicheTags: {
      general: "Arranque rapido",
      agencias: "Flujos sin codigo",
      freelancers: "Conecta tus apps",
      ecommerce: "Pedidos conectados",
      salud: "Avisos y formularios",
    },
  },
  {
    name: "Grok",
    domain: "x.ai",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "creadores", "agencias"],
    nicheTags: {
      general: "Exploracion veloz",
      creadores: "Ideas en tiempo real",
      agencias: "Tendencias y contexto",
    },
  },
  {
    name: "Midjourney",
    domain: "midjourney.com",
    category: "Imagen",
    kind: "Motor",
    niches: ["creadores", "agencias", "inmobiliarias", "retail"],
    nicheTags: {
      creadores: "Conceptos visuales",
      agencias: "Campanas rapidas",
      inmobiliarias: "Visuales aspiracionales",
      retail: "Creatividad para promos",
    },
  },
  {
    name: "ElevenLabs",
    domain: "elevenlabs.io",
    category: "Audio",
    kind: "Motor",
    niches: ["creadores", "coaches", "agencias", "salud"],
    nicheTags: {
      creadores: "Locuciones",
      coaches: "Clases narradas",
      agencias: "Piezas de audio",
      salud: "Indicaciones habladas",
    },
  },
  {
    name: "Genspark",
    domain: "genspark.ai",
    category: "Agentes",
    kind: "Plataforma",
    niches: ["general", "agencias", "freelancers", "abogados"],
    nicheTags: {
      general: "Agentes listos",
      agencias: "Investigacion delegada",
      freelancers: "Tareas repetibles",
      abogados: "Busqueda estructurada",
    },
  },
  {
    name: "Sora",
    domain: "openai.com",
    category: "Video",
    kind: "Motor",
    niches: ["creadores", "agencias", "ecommerce", "inmobiliarias"],
    nicheTags: {
      creadores: "Clips narrativos",
      agencias: "Concept testing",
      ecommerce: "Anuncios rapidos",
      inmobiliarias: "Recorridos teaser",
    },
  },
  {
    name: "Runway",
    domain: "runwayml.com",
    category: "Video",
    kind: "Motor",
    niches: ["creadores", "agencias", "retail"],
    nicheTags: {
      creadores: "Edicion creativa",
      agencias: "Versiones de anuncio",
      retail: "Piezas para redes",
    },
  },
  {
    name: "Loom",
    domain: "loom.com",
    category: "Presentacion",
    kind: "Herramienta",
    niches: ["agencias", "freelancers", "coaches", "abogados", "salud"],
    nicheTags: {
      agencias: "Evita reuniones",
      freelancers: "Explica entregables",
      coaches: "Video-feedback",
      abogados: "Contexto asincrono",
      salud: "Instrucciones rapidas",
    },
  },
  {
    name: "Kommo",
    domain: "kommo.com",
    category: "CRM",
    kind: "Plataforma",
    niches: ["inmobiliarias", "agencias", "retail", "salud", "gastronomia"],
    nicheTags: {
      inmobiliarias: "WhatsApp comercial",
      agencias: "Seguimiento de clientes",
      retail: "Atencion por chat",
      salud: "Agendamiento",
      gastronomia: "Reservas organizadas",
    },
  },
  {
    name: "Manychat",
    domain: "manychat.com",
    category: "CRM",
    kind: "Plataforma",
    niches: ["creadores", "retail", "ecommerce", "gastronomia"],
    nicheTags: {
      creadores: "DM en piloto automatico",
      retail: "Promos masivas",
      ecommerce: "Recupera interesados",
      gastronomia: "Reservas por Instagram",
    },
  },
  {
    name: "Typeform",
    domain: "typeform.com",
    category: "Captacion",
    kind: "Herramienta",
    niches: ["gastronomia", "inmobiliarias", "retail", "agencias", "salud"],
    nicheTags: {
      gastronomia: "Reservas y pedidos",
      inmobiliarias: "Califica leads",
      retail: "Encuestas y pedidos",
      agencias: "Briefing automatico",
      salud: "Preconsulta",
    },
  },
  {
    name: "Apollo",
    domain: "apollo.io",
    category: "Captacion",
    kind: "Plataforma",
    niches: ["agencias", "freelancers", "ecommerce"],
    nicheTags: {
      agencias: "Prospeccion B2B",
      freelancers: "Lista de leads",
      ecommerce: "Mayoristas y partners",
    },
  },
  {
    name: "DeepSeek",
    domain: "deepseek.com",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "abogados", "freelancers"],
    nicheTags: {
      general: "Analisis tecnico",
      abogados: "Revision de textos",
      freelancers: "Resolucion precisa",
    },
  },
  {
    name: "Qwen",
    domain: "qwen.ai",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "ecommerce", "retail", "agencias"],
    nicheTags: {
      general: "Pruebas de razonamiento",
      ecommerce: "Catalogo y FAQs",
      retail: "Respuestas de venta",
      agencias: "Soporte de operacion",
    },
  },
  {
    name: "Kimi",
    domain: "kimi.ai",
    category: "Razonamiento",
    kind: "Motor",
    niches: ["general", "abogados", "coaches"],
    nicheTags: {
      general: "Lectura larga",
      abogados: "Contexto extenso",
      coaches: "Investigacion de programas",
    },
  },
  {
    name: "Freepik",
    domain: "freepik.com",
    category: "Imagen",
    kind: "Herramienta",
    niches: ["creadores", "agencias", "retail", "gastronomia"],
    nicheTags: {
      creadores: "Recursos visuales",
      agencias: "Mockups y assets",
      retail: "Promos rapidas",
      gastronomia: "Menus visuales",
    },
  },
  {
    name: "Higgsfield",
    domain: "higgsfield.ai",
    category: "Video",
    kind: "Motor",
    niches: ["creadores", "agencias"],
    nicheTags: {
      creadores: "Piezas cinematicas",
      agencias: "Conceptos visuales",
    },
  },
  {
    name: "Kling AI",
    domain: "klingai.com",
    category: "Video",
    kind: "Motor",
    niches: ["creadores", "agencias", "ecommerce"],
    nicheTags: {
      creadores: "Clips experimentales",
      agencias: "Versiones de campaña",
      ecommerce: "Videos de producto",
    },
  },
  {
    name: "HeyGen",
    domain: "heygen.com",
    category: "Video",
    kind: "Herramienta",
    niches: ["agencias", "coaches", "salud", "inmobiliarias"],
    nicheTags: {
      agencias: "Avatares para anuncios",
      coaches: "Lecciones grabadas",
      salud: "Explicaciones de atencion",
      inmobiliarias: "Presentaciones guiadas",
    },
  },
  {
    name: "Suno",
    domain: "suno.com",
    category: "Audio",
    kind: "Motor",
    niches: ["creadores", "agencias", "coaches"],
    nicheTags: {
      creadores: "Musica original",
      agencias: "Jingles rapidos",
      coaches: "Piezas para cursos",
    },
  },
  {
    name: "Wispr",
    domain: "wisprflow.ai",
    category: "Audio",
    kind: "Herramienta",
    niches: ["general", "freelancers", "abogados", "coaches"],
    nicheTags: {
      general: "Dictado rapido",
      freelancers: "Escribe hablando",
      abogados: "Notas en voz",
      coaches: "Ideas al vuelo",
    },
  },
  {
    name: "Ideogram",
    domain: "ideogram.ai",
    category: "Imagen",
    kind: "Motor",
    niches: ["agencias", "retail", "gastronomia", "creadores"],
    nicheTags: {
      agencias: "Titulares visuales",
      retail: "Piezas con texto",
      gastronomia: "Flyers de menu",
      creadores: "Portadas",
    },
  },
  {
    name: "Photoroom",
    domain: "photoroom.com",
    category: "Imagen",
    kind: "Herramienta",
    niches: ["ecommerce", "retail", "gastronomia", "inmobiliarias"],
    nicheTags: {
      ecommerce: "Fotos de catalogo",
      retail: "Promos de producto",
      gastronomia: "Platos para redes",
      inmobiliarias: "Edicion de fotos",
    },
  },
  {
    name: "Opus Clip",
    domain: "opus.pro",
    category: "Video",
    kind: "Herramienta",
    niches: ["creadores", "agencias", "coaches"],
    nicheTags: {
      creadores: "Shorts automaticos",
      agencias: "Recortes para pauta",
      coaches: "Highlights de clases",
    },
  },
  {
    name: "Vizard.ai",
    domain: "vizard.ai",
    category: "Video",
    kind: "Herramienta",
    niches: ["creadores", "agencias", "coaches"],
    nicheTags: {
      creadores: "Clips para redes",
      agencias: "Versiones cortas",
      coaches: "Reutiliza sesiones",
    },
  },
  {
    name: "Nano Banana",
    domain: "google.com",
    category: "Imagen",
    kind: "Motor",
    niches: ["creadores", "gastronomia", "retail"],
    nicheTags: {
      creadores: "Visuales rapidos",
      gastronomia: "Ideas de emplatado",
      retail: "Conceptos de producto",
    },
  },
  {
    name: "Apify",
    domain: "apify.com",
    category: "Captacion",
    kind: "Plataforma",
    niches: ["agencias", "ecommerce", "inmobiliarias", "retail"],
    nicheTags: {
      agencias: "Extraccion de leads",
      ecommerce: "Monitoreo de catalogos",
      inmobiliarias: "Captura de listados",
      retail: "Inteligencia competitiva",
    },
  },
  {
    name: "WaLead.ai",
    domain: "walead.ai",
    category: "Captacion",
    kind: "Herramienta",
    niches: ["inmobiliarias", "agencias", "retail"],
    nicheTags: {
      inmobiliarias: "Prospeccion por WhatsApp",
      agencias: "Seguimiento comercial",
      retail: "Leads por chat",
    },
  },
  {
    name: "Pirsonal",
    domain: "pirsonal.com",
    category: "Presentacion",
    kind: "Herramienta",
    niches: ["agencias", "inmobiliarias", "freelancers"],
    nicheTags: {
      agencias: "Presentaciones personalizadas",
      inmobiliarias: "Videos para leads",
      freelancers: "Propuestas con contexto",
    },
  },
  {
    name: "Pomelli",
    domain: "pomelli.ai",
    category: "Marca",
    kind: "Herramienta",
    niches: ["creadores", "retail", "gastronomia"],
    nicheTags: {
      creadores: "Naming y marca",
      retail: "Conceptos de identidad",
      gastronomia: "Naming de productos",
    },
  },
  {
    name: "HumanizeAI",
    domain: "humanizeai.pro",
    category: "Refinamiento",
    kind: "Herramienta",
    niches: ["general", "freelancers", "abogados", "coaches"],
    nicheTags: {
      general: "Texto mas natural",
      freelancers: "Entregables mas humanos",
      abogados: "Tono menos rigido",
      coaches: "Mensajes cercanos",
    },
  },
  {
    name: "Lovable",
    domain: "lovable.dev",
    category: "Desarrollo",
    kind: "Plataforma",
    niches: ["agencias", "freelancers", "ecommerce"],
    nicheTags: {
      agencias: "MVPs rapidos",
      freelancers: "Prototipos vendibles",
      ecommerce: "Interfaces internas",
    },
  },
  {
    name: "Bolt.new",
    domain: "bolt.new",
    category: "Desarrollo",
    kind: "Plataforma",
    niches: ["agencias", "freelancers", "ecommerce"],
    nicheTags: {
      agencias: "Demos de producto",
      freelancers: "Apps de soporte",
      ecommerce: "Landing con logica",
    },
  },
  {
    name: "Antigravity",
    domain: "antigravity.google",
    category: "Desarrollo",
    kind: "IDE IA",
    niches: ["agencias", "ecommerce", "freelancers"],
    nicheTags: {
      agencias: "Exploracion tecnica",
      ecommerce: "Pruebas de producto",
      freelancers: "Desarrollo asistido",
    },
  },
  {
    name: "Stitch AI",
    domain: "stitch.withgoogle.com",
    category: "UI",
    kind: "Herramienta",
    niches: ["agencias", "retail", "ecommerce"],
    nicheTags: {
      agencias: "Pantallas rapidas",
      retail: "Experimentos de UX",
      ecommerce: "Wireframes de tienda",
    },
  },
  {
    name: "Manus",
    domain: "manus.im",
    category: "Agentes",
    kind: "Plataforma",
    niches: ["general", "agencias", "ecommerce", "inmobiliarias"],
    nicheTags: {
      general: "Tareas multi-paso",
      agencias: "Operaciones delegadas",
      ecommerce: "Investigacion automatica",
      inmobiliarias: "Seguimiento estructurado",
    },
  },
];

export const getToolsForNiche = (niche: ToolNicheKey) =>
  fullToolsRanking.filter((tool) => tool.niches.includes(niche));

export const toolTips: ToolTipItem[] = [
  {
    title: "Empieza por un solo cuello de botella",
    description: "No abras diez herramientas juntas. Elige primero el punto donde hoy pierdes mas tiempo.",
  },
  {
    title: "Primero resuelve, despues automatiza",
    description: "Si todavia no sabes el paso exacto que quieres repetir, la automatizacion te va a confundir mas de lo que ayuda.",
  },
  {
    title: "Separa motores de herramientas",
    description: "Claude o ChatGPT te ayudan a pensar. n8n o Zapier te ayudan a ejecutar. No cumplen el mismo rol.",
  },
  {
    title: "Usa la guia como mapa, no como lista infinita",
    description: "Entra buscando una victoria puntual: vender, responder, ordenar o captar. Eso te da foco.",
  },
  {
    title: "Guarda tu stack minimo",
    description: "Con tres o cuatro herramientas bien elegidas ya puedes avanzar muchisimo mas que probando veinte.",
  },
  {
    title: "Mide horas ahorradas, no nombres de moda",
    description: "Si una herramienta te devuelve tiempo real en una tarea repetida, vale mas que una herramienta de moda.",
  },
  {
    title: "Cuando una no encaja, cambia de categoria",
    description: "Si una app no te funciona, tal vez no necesitas otra parecida. Tal vez necesitas otro tipo de solucion.",
  },
  {
    title: "Vuelve al ranking cuando cambie tu etapa",
    description: "No necesitas las mismas herramientas para captar, presentar, vender o automatizar. Revisa segun el momento.",
  },
];
