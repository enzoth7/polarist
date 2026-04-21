import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const newTools = [
  {
    name: "WeixinClawBot",
    domain: "producthunt.com/products/weixinclawbot",
    url: "https://www.producthunt.com/products/weixinclawbot",
    category: "Agentes",
    kind: "Motor",
    niches: ["general", "ecommerce"],
    niche_tags: { general: "Automatizacion WeChat", ecommerce: "Soporte Asiatico" },
    description: "Agente autonomo disenado para operar nativamente en WeChat. Permite automatizar atencion al cliente, captacion de leads y envios masivos dentro del ecosistema mas cerrado de mensajeria.",
    who_is_it_for: "Marcas y agencias que operan o venden en mercados asiaticos y necesitan un frontend automatizado en WeChat sin depender de APIs restrictivas.",
    is_beta: true
  },
  {
    name: "Cursor",
    domain: "cursor.com",
    url: "https://cursor.com",
    category: "Programacion",
    kind: "Herramienta",
    niches: ["freelancers", "agencias", "general"],
    niche_tags: { freelancers: "Pair programming", agencias: "Desarrollo rapido" },
    description: "El editor de codigo (fork de VS Code) construido desde cero para programar con inteligencia artificial. Integra modelos como Claude 3.5 Sonnet para escribir, refactorizar y debugear repositorios enteros.",
    who_is_it_for: "Desarrolladores, agencias de software y creadores técnicos que buscan multiplicar su velocidad productiva (hasta 10x) delegando el tipeo de código rutinario a la IA.",
    is_beta: true
  },
  {
    name: "Perplexity",
    domain: "perplexity.ai",
    url: "https://www.perplexity.ai",
    category: "Investigacion",
    kind: "Herramienta",
    niches: ["general", "agencias"],
    niche_tags: { general: "Buscador IA", agencias: "Research de mercado" },
    description: "Motor de busqueda conversacional que navega la web en tiempo real, lee multiples fuentes y redacta una respuesta final siempre incluyendo referencias y citas exactas (links a los articulos).",
    who_is_it_for: "Investigadores, periodistas, estrategas de agencias y cualquier profesional que necesite buscar datos duros en Google pero sin tener que abrir 15 pestanas distintas.",
    is_beta: true
  },
  {
    name: "Gumloop",
    domain: "gumloop.com",
    url: "https://www.gumloop.com",
    category: "Agentes",
    kind: "Plataforma",
    niches: ["agencias", "freelancers"],
    niche_tags: { agencias: "Flujos de IA", freelancers: "Automatizacion visual" },
    description: "Plataforma No-Code similar a Zapier o Make, pero construida especificamente para encadenar modelos de Inteligencia Artificial (LLMs, scrapers, generadores) en flujos de trabajo visuales.",
    who_is_it_for: "Operadores de agencias y growth hackers que necesitan crear 'agentes' que extraigan datos, los resuman con IA y los guarden en un CRM, todo arrastrando nodos visuales.",
    is_beta: true
  },
  {
    name: "Descript",
    domain: "descript.com",
    url: "https://www.descript.com",
    category: "Video",
    kind: "Herramienta",
    niches: ["agencias", "freelancers", "general"],
    niche_tags: { agencias: "Edicion agil", freelancers: "Podcasting" },
    description: "Editor de video y audio revolucionario que transcribe tu archivo y te permite editar el video simplemente borrando el texto de la transcripcion. Incluye clonacion de voz para corregir errores.",
    who_is_it_for: "Podcasters, creadores de contenido, marketers y educadores digitales que quieren editar entrevistas y video-tutoriales rapido, como si estuvieran editando un documento de Word.",
    is_beta: true
  },
  {
    name: "Framer AI",
    domain: "framer.com/ai",
    url: "https://www.framer.com/ai/",
    category: "Diseño Web",
    kind: "Plataforma",
    niches: ["agencias", "freelancers", "retail"],
    niche_tags: { agencias: "Landing pages", freelancers: "Portfolios web" },
    description: "El constructor de sitios web visual mas potente del mercado integro un motor generativo: introduces un prompt y genera el framework, los colores, copy y las animaciones de un sitio web entero en segundos.",
    who_is_it_for: "Disenadores web, agencias de marketing y startups que necesitan iterar landing pages altamente pulidas y animadas de forma ridículamente rapida.",
    is_beta: true
  },
  {
    name: "AdCreative.ai",
    domain: "adcreative.ai",
    url: "https://www.adcreative.ai",
    category: "Diseño Gráfico",
    kind: "Herramienta",
    niches: ["agencias", "ecommerce"],
    niche_tags: { agencias: "Banners masivos", ecommerce: "Anuncios Meta/Google" },
    description: "Generador de creatividades para publicidad. Analiza tu marca, tus colores y tus imagenes, y escupe cientos de variaciones de banners orientados a conversion para Facebook Ads y Google Ads.",
    who_is_it_for: "Equipos de performance marketing, media buyers y e-commerces que necesitan testear decenas de anuncios (A/B testing) todas las semanas sin un equipo gigante de disenadores.",
    is_beta: true
  },
  {
    name: "Surfer SEO",
    domain: "surferseo.com",
    url: "https://surferseo.com",
    category: "Marketing",
    kind: "Herramienta",
    niches: ["agencias", "freelancers"],
    niche_tags: { agencias: "Posicionamiento", freelancers: "Redaccion SEO" },
    description: "Suite de optimizacion SEO que utiliza inteligencia artificial (Surfer AI) para generar articulos completos que no solo leen bien, sino que incluyen matematicamente las palabras clave necesarias para rankear en Google.",
    who_is_it_for: "Agencias SEO, redactores de contenido y dueños de blogs nicho que quieren automatizar su marketing de contenidos asegurando resultados comprobables en los motores de busqueda.",
    is_beta: true
  },
  {
    name: "Scaloom AI",
    domain: "scaloom.com",
    url: "https://scaloom.com",
    category: "Captacion",
    kind: "Motor",
    niches: ["agencias", "ecommerce", "retail"],
    niche_tags: { agencias: "Guerilla Marketing", ecommerce: "Trafico Reddit" },
    description: "Agente autonomo especializado en marketing de Reddit. Escanea subreddits relevantes para tu producto y genera respuestas sutiles y de alto valor aportando soluciones e integrando tu marca naturalmente.",
    who_is_it_for: "Startups B2B y B2C, agencias de Growth Marketing y fundadores que quieren capturar trafico ultra-cualificado desde comunidades de Reddit sin parecer spammers.",
    is_beta: true
  },
  {
    name: "Jasper",
    domain: "jasper.ai",
    url: "https://www.jasper.ai",
    category: "Texto",
    kind: "Plataforma",
    niches: ["agencias", "general"],
    niche_tags: { agencias: "Copys masivos", general: "Voz de marca" },
    description: "Copiloto de IA puramente orientado a marketing corporativo. A diferencia de ChatGPT, Jasper memoriza la guia de estilo de tu marca y genera campañas multicanal manteniendo exactamente tu tono comercial.",
    who_is_it_for: "Equipos de marketing en empresas grandes, agencias con decenas de clientes y content managers corporativos que no pueden permitirse textos genericos o con 'tono de robot'.",
    is_beta: true
  },
  {
    name: "Notion AI",
    domain: "notion.so",
    url: "https://www.notion.so/product/ai",
    category: "Productividad",
    kind: "Herramienta",
    niches: ["general", "agencias", "freelancers"],
    niche_tags: { general: "Workspace", agencias: "Gestion docs" },
    description: "La IA integrada directamente en tu espacio de trabajo. Puede resumir notas de reuniones al instante, traducir manuales corporativos, escribir documentacion basandose en otras paginas, y hacer Q&A de toda tu wiki.",
    who_is_it_for: "Agencias, startups y equipos remotos que ya usan Notion para centralizar su documentacion y necesitan extraer o procesar conocimiento de forma instantanea sin salir del editor.",
    is_beta: true
  },
  {
    name: "Make",
    domain: "make.com",
    url: "https://www.make.com",
    category: "Automatización",
    kind: "Plataforma",
    niches: ["agencias", "freelancers", "ecommerce"],
    niche_tags: { agencias: "Integracion APIs", ecommerce: "Sincronizacion datos" },
    description: "Plataforma visual de integracion (antes Integromat). Compite con Zapier y n8n, permitiendo armar flujos logicos mas complejos de forma muy visual y conectando facilmente modulos de IA abiertos.",
    who_is_it_for: "Consultores de automatizacion, agencias operativas y dueños de e-commerce que requieren rutas condicionales complejas para sus flujos de datos sin pagar licencias abusivas.",
    is_beta: true
  },
  {
    name: "Synthesia",
    domain: "synthesia.io",
    url: "https://www.synthesia.io",
    category: "Video",
    kind: "Plataforma",
    niches: ["general", "agencias", "retail"],
    niche_tags: { general: "Avatares IA", retail: "Videos onboarding" },
    description: "Plataforma lider en creacion de videos con Avatares Hyper-realistas. Ingresas un guion de texto corporativo y en minutos obtienes un video de un presentador humano hablando en mas de 120 idiomas.",
    who_is_it_for: "Departamentos de Recursos Humanos (onboarding), e-learning corporativo, startups explicando su producto y agencias localizando anuncios a varias regiones del mundo economicamente.",
    is_beta: true
  },
  {
    name: "Adaptify SEO",
    domain: "adaptify.ai",
    url: "https://adaptify.ai",
    category: "Marketing",
    kind: "Plataforma",
    niches: ["agencias", "freelancers"],
    niche_tags: { agencias: "SEO B2B", freelancers: "Rankings automaticos" },
    description: "Automatizacion profunda de la gestion SEO. No solo escribe el contenido (como Surfer), sino que hace outreach automatizado para construir back-links (enlaces entrantes) utilizando agentes IA B2B.",
    who_is_it_for: "Agencias especializadas en SEO y profesionales del posicionamiento organico buscando escalar la creacion de dominios con autoridad (DA) para docenas de clientes en paralelo.",
    is_beta: true
  },
  {
    name: "Improvado AI",
    domain: "improvado.io",
    url: "https://improvado.io/ai-agent",
    category: "Análisis",
    kind: "Herramienta",
    niches: ["agencias", "ecommerce"],
    niche_tags: { agencias: "Reportes ROAS", ecommerce: "Data Analytics" },
    description: "Un agente analista de datos exclusivo para Marketing. Se conecta a Meta Ads, Google Ads, TikTok Ads, y te permite preguntarle en ingles comun: '¿Que campaña de Facebook me trajo el ROAS mas alto ayer?'.",
    who_is_it_for: "Performance managers, agencias administrando altísimos presupuestos publicitarios anuales y directores de e-commerce que odian compilar excels manualmente.",
    is_beta: true
  },
  {
    name: "Unblocked",
    domain: "getunblocked.com",
    url: "https://getunblocked.com",
    category: "Programacion",
    kind: "Herramienta",
    niches: ["agencias", "freelancers"],
    niche_tags: { agencias: "Onboarding devs", freelancers: "Contexto codigo" },
    description: "Agente IA focalizado absolutamente en 'Contexto'. Se conecta a tus repositorios en GitHub, a tus Slack y a tus Docs, para responder cualquier pregunta tecnica sobre el codigo base historico de tu proyecto.",
    who_is_it_for: "Equipos de ingenieria, agencias liderando multiples bases de codigo heredadas, y CTOs que desean que los nuevos programadores tengan las repuestas a mano desde el dia uno.",
    is_beta: true
  },
  {
    name: "Atlas.new",
    domain: "atlas.new",
    url: "https://atlas.new",
    category: "Agentes",
    kind: "Motor",
    niches: ["general", "freelancers"],
    niche_tags: { general: "Datos espaciales", freelancers: "Analisis mapas" },
    description: "Agente inteligente centrado unicamente en cartografia y mapas. Puede mapear competidores geographicamente, analizar rutas ideales basandonos logicamente en parametros, extrayendo datos geo-espaciales.",
    who_is_it_for: "Inmobiliarias buscando lotes prospectivos, empresas de logistica (delivery), urbanistas, y consultoras midiendo ubicaciones optimas para locales cruzando variables espaciales.",
    is_beta: true
  },
  {
    name: "Livedocs",
    domain: "livedocs.com",
    url: "https://livedocs.com",
    category: "Investigacion",
    kind: "Herramienta",
    niches: ["agencias", "general"],
    niche_tags: { agencias: "Datos vivos", general: "Extraccion IA" },
    description: "Documentos que funcionan como mini-agentes. Ingresas una tabla, le asignas tareas en lenguaje natural ('Ve a linkedin de cada persona y traeme su cargo actual') y la hoja de calculo se rellena sola iterativamente.",
    who_is_it_for: "Reclutadores, equipos de ventas (BDRs) enriqueciendo leads y agencias extrayendo miles de puntos de datos desde listados monotonos web.",
    is_beta: true
  },
  {
    name: "Writesonic",
    domain: "writesonic.com",
    url: "https://writesonic.com",
    category: "Texto",
    kind: "Plataforma",
    niches: ["freelancers", "ecommerce", "agencias"],
    niche_tags: { freelancers: "Blogs SEO", ecommerce: "Fichas de producto" },
    description: "Generador de textos muy agresivo en SEO (Chatsonic). Competencia directa de Jasper, pero a un precio mas abarcativo; incluye generacion de fichas de producto amazon y creacion automatica de landing pages textuales.",
    who_is_it_for: "Copywriters independientes, dueños de e-commerce gestionando tiendas Shopify con 500 productos y marketers digitales generando blogs informativos a volumen brutal.",
    is_beta: true
  },
  {
    name: "Flux (iMessage)",
    domain: "useflux.ai",
    url: "https://www.producthunt.com/products/flux-imessage",
    category: "Productividad",
    kind: "Motor",
    niches: ["general", "freelancers"],
    niche_tags: { general: "Asistente SMS", freelancers: "On-the-go" },
    description: "Constructor de Agentes Personales en Apple iMessage. Permite tener a tu IA en el bolsillo mediante mensajeria de texto tradicional, sin depender de un navegador u otra aplicacion, conectada a tu calendario y notas.",
    who_is_it_for: "Emprendedores, freelancers, directores creativos o cualquier individuo con horarios freneticos que quiere charlar con su Inteligencia Artificial a la vieja usanza: por mensaje de texto.",
    is_beta: true
  }
];

async function seedNewTools() {
  console.log('Seeding 20 new discovery tools...');
  for (const tool of newTools) {
    const { error } = await supabase.from('tools').upsert(tool, { onConflict: 'name' });
    if (error) console.error(`Error with ${tool.name}:`, error.message);
    else console.log(`Success: ${tool.name}`);
  }
}

seedNewTools().catch(console.error);
