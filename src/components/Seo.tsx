import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://polarist.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/Polarist_logo.webp`;

type SeoConfig = {
  title: string;
  description: string;
  robots?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const DEFAULT_DESCRIPTION =
  "Polarist acerca herramientas, tendencias y recursos de IA para aplicar en negocios reales sin friccion tecnica.";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Polarist",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contacto@polarist.app",
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Polarist",
  url: SITE_URL,
  inLanguage: "es",
  description: DEFAULT_DESCRIPTION,
};

const PUBLIC_ROUTES: Record<string, SeoConfig> = {
  "/": {
    title: "Polarist | Tu camino más fácil hacia la IA",
    description:
      "Asesoramos e implementamos Agentes de IA para transformar, acelerar y mejorar tu negocio.",
    jsonLd: [ORGANIZATION_JSON_LD, WEBSITE_JSON_LD],
  },
  "/about": {
    title: "Polarist | ¿Quiénes somos?",
    description:
      "Somos un equipo efocado en eliminar la fricción entre la IA y los negocios tradicionales.",
  },
  "/contact": {
    title: "Polarist | Contacto",
    description:
      "Contáctanos para consultas, soporte o sugerencias sobre herramientas de IA, recursos, tendencias y comunidad.",
  },
  "/privacy": {
    title: "Polarist | Política de Privacidad",
    description:
      "Lee la politica de privacidad de Polarist y como manejamos datos, navegacion, comunidad, sesiones y comunicaciones dentro de la plataforma.",
  },
  "/terms": {
    title: "Polarist | Términos y Condiciones",
    description:
      "Consulta los terminos y condiciones de uso de Polarist, incluyendo acceso a la plataforma, comunidad, contenidos, cambios y responsabilidad.",
  },
  "/tools": {
    title: "Polarist | Herramientas",
    description:
      "Descubrí herramientas de IA organizadas por casos de uso: chatbots, automatizacion, creacion de contenido, desarrollo, marketing y productividad.",
  },
  "/resources": {
    title: "Polarist | Recursos",
    description:
      "Aprendé lo esencial de IA para empezar con criterio, conceptos útiles y una base sólida desde el día uno.",
  },
  "/community": {
    title: "Polarist | Comunidad",
    description:
      "Seguí la actividad de la comunidad de Polarist y mantenete cerca de eventos, lanzamientos y espacios para aprender sobre IA aplicada.",
  },
  "/login": {
    title: "Polarist |Iniciar sesión",
    description: "Ingresa a tu cuenta de Polarist.",
    robots: "noindex, nofollow",
  },
  "/aiagents": {
    title: "Polarist | Agentes de IA",
    description:
      "Descubrí qué es un agente de IA, cómo se diferencia de un chatbot y cómo implementarlo en tu flujo de negocio.",
  },
  "/services": {
    title: "Polarist | Servicios de Inteligencia Artificial para Empresas",
    description:
      "Automatizaciones de procesos, diseño e integración de agentes de IA y consultoría avanzada para optimizar flujos de trabajo corporativos. Descubrí cómo transformamos tu negocio con IA.",
  },
  "/asesorias": {
    title: "Polarist | Asesorías",
    description: "Aprendé a usar agentes de IA en 2 semanas. Un programa de 5 módulos para entender cómo funcionan y aplicarlos en tus tareas de todos los días.",
  },
};

const PRIVATE_ROUTE_PATTERNS = ["/library", "/settings"];

const NOT_FOUND_CONFIG: SeoConfig = {
  title: "Pagina no encontrada | Polarist",
  description: DEFAULT_DESCRIPTION,
  robots: "noindex, nofollow",
};

const ensureMeta = (
  selector: string,
  create: () => HTMLMetaElement,
) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
};

const ensureLink = (
  selector: string,
  create: () => HTMLLinkElement,
) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
};

const ensureStructuredDataTag = () => {
  let element = document.head.querySelector(
    'script[data-polarist-seo="structured-data"]',
  ) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.setAttribute("data-polarist-seo", "structured-data");
    document.head.appendChild(element);
  }

  return element;
};

const resolveSeoConfig = (pathname: string): SeoConfig => {
  if (PUBLIC_ROUTES[pathname]) {
    return PUBLIC_ROUTES[pathname];
  }

  if (
    PRIVATE_ROUTE_PATTERNS.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return {
      title: "Biblioteca | Polarist",
      description: "Biblioteca y contenido personalizado de Polarist.",
      robots: "noindex, nofollow",
    };
  }

  return NOT_FOUND_CONFIG;
};

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const config = resolveSeoConfig(pathname);
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    const description = config.description || DEFAULT_DESCRIPTION;
    const robots = config.robots ?? "index, follow";
    const image = config.image ?? DEFAULT_OG_IMAGE;
    const type = config.type ?? "website";

    document.title = config.title;

    ensureMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "description";
      return meta;
    }).content = description;

    ensureMeta('meta[name="robots"]', () => {
      const meta = document.createElement("meta");
      meta.name = "robots";
      return meta;
    }).content = robots;

    ensureLink('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.rel = "canonical";
      return link;
    }).href = canonicalUrl;

    const propertyMetas = {
      "og:title": config.title,
      "og:description": description,
      "og:type": type,
      "og:url": canonicalUrl,
      "og:image": image,
      "og:site_name": "Polarist",
      "og:locale": "es_UY",
    };

    Object.entries(propertyMetas).forEach(([property, content]) => {
      ensureMeta(`meta[property="${property}"]`, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", property);
        return meta;
      }).content = content;
    });

    const twitterMetas = {
      "twitter:card": "summary_large_image",
      "twitter:title": config.title,
      "twitter:description": description,
      "twitter:image": image,
    };

    Object.entries(twitterMetas).forEach(([name, content]) => {
      ensureMeta(`meta[name="${name}"]`, () => {
        const meta = document.createElement("meta");
        meta.name = name;
        return meta;
      }).content = content;
    });

    const structuredData = config.jsonLd
      ? Array.isArray(config.jsonLd)
        ? config.jsonLd
        : [config.jsonLd]
      : pathname === "/"
        ? [ORGANIZATION_JSON_LD, WEBSITE_JSON_LD]
        : [];

    const structuredDataTag = ensureStructuredDataTag();
    structuredDataTag.textContent =
      structuredData.length > 0 ? JSON.stringify(structuredData) : "";
  }, [location]);

  return null;
}
