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
    title: "Polarist | IA aplicada a negocios, recursos y herramientas",
    description:
      "Descubri herramientas, tendencias y recursos de inteligencia artificial para negocios, equipos y personas que quieren aplicar IA con criterio practico.",
    jsonLd: [ORGANIZATION_JSON_LD, WEBSITE_JSON_LD],
  },
  "/about": {
    title: "Sobre Polarist | IA util para negocios reales",
    description:
      "Conoce la mision de Polarist y como acercamos herramientas, recursos y criterio practico sobre inteligencia artificial para negocios reales.",
  },
  "/contact": {
    title: "Contacto Polarist | Consultas sobre IA, recursos y herramientas",
    description:
      "Contactate con Polarist para consultas, soporte o sugerencias sobre herramientas de IA, recursos, tendencias y comunidad.",
  },
  "/privacy": {
    title: "Politica de Privacidad | Polarist",
    description:
      "Lee la politica de privacidad de Polarist y como manejamos datos, navegacion, comunidad, sesiones y comunicaciones dentro de la plataforma.",
  },
  "/terms": {
    title: "Terminos y Condiciones | Polarist",
    description:
      "Consulta los terminos y condiciones de uso de Polarist, incluyendo acceso a la plataforma, comunidad, contenidos, cambios y responsabilidad.",
  },
  "/trends": {
    title: "Tendencias de IA | Polarist",
    description:
      "Explora tendencias de inteligencia artificial curadas por Polarist para entender que cambia, que importa y que conviene aplicar en negocios.",
  },
  "/tools": {
    title: "Herramientas de IA | Polarist",
    description:
      "Descubri herramientas de IA organizadas por casos de uso: chatbots, automatizacion, creacion de contenido, desarrollo, marketing y productividad.",
  },
  "/resources": {
    title: "Recursos de IA | Polarist",
    description:
      "Accede a recursos de IA investigados, filtrados y listos para usar. Polarist reune material util para aprender y trabajar con mas criterio.",
  },
  "/community": {
    title: "Comunidad de IA | Polarist",
    description:
      "Segui la actividad de la comunidad de Polarist y mantenete cerca de eventos, lanzamientos y espacios para aprender sobre IA aplicada.",
  },
  "/login": {
    title: "Iniciar sesion | Polarist",
    description: "Ingresa a tu cuenta de Polarist.",
    robots: "noindex, nofollow",
  },
  "/settings": {
    title: "Configuracion | Polarist",
    description: "Configuracion de cuenta de Polarist.",
    robots: "noindex, nofollow",
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
