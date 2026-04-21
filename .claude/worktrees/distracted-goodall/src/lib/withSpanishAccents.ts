const accentReplacements: Array<[string, string]> = [
  ["diseno", "diseño"],
  ["presentacion", "presentación"],
  ["automatizacion", "automatización"],
  ["investigacion", "investigación"],
  ["captacion", "captación"],
  ["comunicacion", "comunicación"],
  ["categoria", "categoría"],
  ["categorias", "categorías"],
  ["sesion", "sesión"],
  ["sesiones", "sesiones"],
  ["catalogo", "catálogo"],
  ["configuracion", "configuración"],
  ["pagina", "página"],
  ["pais", "país"],
  ["informacion", "información"],
  ["publicacion", "publicación"],
  ["publicaciones", "publicaciones"],
  ["atencion", "atención"],
  ["campanas", "campañas"],
  ["gastronomia", "gastronomía"],
  ["ultimas", "últimas"],
  ["ultimos", "últimos"],
  ["todavia", "todavía"],
  ["aun", "aún"],
  ["mas", "más"],
  ["rapida", "rápida"],
  ["rapidas", "rápidas"],
  ["dias", "días"],
  ["menu", "menú"],
  ["navegacion", "navegación"],
  ["quienes", "quiénes"],
];

const applyMatchCase = (original: string, replacement: string) => {
  if (original.toUpperCase() === original) {
    return replacement.toUpperCase();
  }

  if (original[0]?.toUpperCase() === original[0]) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }

  return replacement;
};

export const withSpanishAccents = (value: string) => {
  return accentReplacements.reduce((accumulator, [plainWord, accentedWord]) => {
    return accumulator.replace(new RegExp(`\\b${plainWord}\\b`, "gi"), (match) =>
      applyMatchCase(match, accentedWord),
    );
  }, value);
};

