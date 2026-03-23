import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const toolData = [
  {
    name: "ChatGPT",
    description: "El modelo fundacional más versátil de OpenAI. Permite razonamiento complejo, análisis de datos, navegación web y generación de código o texto con un nivel de contexto y memoria avanzados.",
    who_is_it_for: "Para cualquier negocio que necesite un 'copiloto' todoterreno: redacción, análisis rápido, estructuración de ideas y automatización conversacional."
  },
  {
    name: "Claude",
    description: "Modelo conversacional especializado en lectura profunda, escritura natural no robótica y seguimiento estricto de instrucciones largas. Posee la ventana de contexto más amplia para analizar documentos enteros.",
    who_is_it_for: "Especialmente valioso para abogados, investigadores, agencias y creadores que necesitan redactar textos largos con alta calidad humana y analizar PDFs complejos."
  },
  {
    name: "Gemini",
    description: "Ecosistema de Google integrado con Docs, Drive y Búsqueda web en tiempo real. Se destaca por procesar texto, imágenes, audio y video nativamente desde el mismo prompt.",
    who_is_it_for: "Equipos anclados en el ecosistema de Google Workspace, agencias que requieren validación de información web instantánea y creadores que usan análisis multimodal."
  },
  {
    name: "NotebookLM",
    description: "Asistente de investigación anclado estrictamente a tus propios documentos. A diferencia de ChatGPT, no alucina información externa, sino que sintetiza, cita fuentes y arma 'podcasts' de tu propio material.",
    who_is_it_for: "Estudiantes, abogados, investigadores y coaches que necesitan cruzar información de decenas de PDFs propios sin perder la referencia exacta del texto original."
  },
  {
    name: "n8n",
    description: "Herramienta de automatización de flujos de trabajo orientada a desarrolladores y operaciones técnicas. Permite conectar cientos de APIs con lógica compleja, ramas condicionales e IA embebida.",
    who_is_it_for: "Agencias de automatización, equipos de operaciones y e-commerce que necesitan sincronizaciones robustas entre su CRM, facturación, correos y bases de datos a menor costo de ejecución."
  },
  {
    name: "Canva IA",
    description: "Suite de diseño accesible potenciada con generación mágica de imágenes, expansión de fondos, edición generativa y redacción de textos integrada en el canvas.",
    who_is_it_for: "Negocios locales, restaurantes, creadores y equipos de marketing que necesitan activos visuales diarios, rápidos y profesionales sin aprender software complejo."
  },
  {
    name: "Zapier",
    description: "El pionero en conectar aplicaciones sin código (No-Code). Simplifica la creación de triggers (disparadores) que activan cadenas de acciones automáticas entre más de 5000 apps.",
    who_is_it_for: "Freelancers, marketers y empresas tradicionales que buscan eliminar la carga manual de datos (ej: Pasar leads de Facebook a Google Sheets) con una curva de aprendizaje muy baja."
  },
  {
    name: "Grok",
    description: "Modelo de inteligencia artificial de X (antes Twitter), diseñado para ser directo, con menos filtros y conectado al feed en tiempo real de X para conocer las noticias al instante.",
    who_is_it_for: "Creadores de contenido, periodistas y growth hackers que necesitan sondear tendencias en redes y obtener respuestas que no pasen por el estricto filtro de seguridad corporativo."
  },
  {
    name: "Midjourney",
    description: "El motor de generación de imágenes más avanzado en cuanto a estética, calidad fotográfica e iluminación cinemática. Opera principalmente a través de Discord o su web en beta.",
    who_is_it_for: "Directores de arte, agencias de publicidad, estudios de arquitectura e inmobiliarias que necesitan visualizaciones impresionantes o concepts de alta resolución."
  },
  {
    name: "ElevenLabs",
    description: "El líder absoluto en síntesis de voz (Text-to-Speech) y clonación vocal. Produce locuciones con emociones humanas precisas (pausas, respiraciones, entonación).",
    who_is_it_for: "Creadores de YouTube, productoras de podcasts, agencias haciendo Video Sales Letters (VSL) y coaches que quieren narrar sus cursos sin grabar el audio manualmente."
  },
  {
    name: "Genspark",
    description: "Plataforma enfocada en agentes autónomos especializados en responder consultas técnicas y hacer research investigativo cruzando múltiples bases de datos de forma autónoma.",
    who_is_it_for: "Equipos de investigación, agencias B2B y consultores que deben navegar mares de información específica para entregar reportes curados a clientes."
  },
  {
    name: "Sora",
    description: "Motor generativo de video de OpenAI capaz de crear videos largos (hasta 1 minuto) hiperrealistas basados en descripciones de texto, manteniendo una coherencia física asombrosa.",
    who_is_it_for: "Productoras, agencias de publicidad e e-commerce que desean filmar comerciales, b-roll o anuncios conceptuales sin los masivos costos de filmación real."
  },
  {
    name: "Runway",
    description: "Suite de edición de video basada en IA. Su motor Gen-3 permite crear y alterar video cuadro por cuadro de forma profesional, expandiendo los límites creativos.",
    who_is_it_for: "Editores de video profesionales, creadores de contenido visual y marcas de retail que buscan efectos impactantes para sus campañas en TikTok o Reels."
  },
  {
    name: "Loom",
    description: "Herramienta de comunicación asíncrona que graba tu pantalla, cámara y voz simultáneamente. Su IA ahora resume, arma transcripciones y sugiere títulos automáticamente.",
    who_is_it_for: "Equipos remotos, agencias enviando actualizaciones de diseño, freelancers presentando propuestas y soporte técnico dando respuestas visuales a clientes."
  },
  {
    name: "Kommo",
    description: "CRM pionero especializado en ventas conversacionales (WhatsApp, Instagram, Messenger). Automatiza embudos directamente desde los canales de chat integrando bots básicos y avanzados.",
    who_is_it_for: "Inmobiliarias, clínicas, concesionarios y e-commerce donde la primera línea de venta siempre inicia por un mensaje de WhatsApp y necesita cerrarse sin perder el hilo."
  },
  {
    name: "Manychat",
    description: "Líder en automatización de mensajería para Instagram y Facebook. Capaz de enviar links automáticos cuando alguien comenta 'QUIERO' en un reel o post.",
    who_is_it_for: "Influencers, tiendas online y marcas FMCG que utilizan Instagram Reels/Stories para generar leads masivos y necesitan responder comentarios 24/7."
  },
  {
    name: "Typeform",
    description: "Plataforma de formularios interactivos y limpios. Utiliza IA para generar encuestas, ramificaciones lógicas y ahora analizar las respuestas escritas por los usuarios.",
    who_is_it_for: "Clínicas para onboarding de pacientes, empresas de servicios haciendo calificación de prospectos (Lead scoring) e investigadores de mercado UX."
  },
  {
    name: "Apollo",
    description: "Base de datos masiva B2B y plataforma de Sales Engagement. La IA te ayuda a segmentar y redactar correos en frío altamente personalizados a miles de prospectos.",
    who_is_it_for: "SDRs, agencias B2B y firmas de software que buscan escalar sus procesos de outbound email e identificar tomadores de decisión exactos."
  },
  {
    name: "DeepSeek",
    description: "Modelo de origen chino destacable en razonamiento puro, código y matemáticas (DeepSeek-Coder). Frecuentemente iguala capacidades de modelos caros a una fracción del costo.",
    who_is_it_for: "Desarrolladores independientes, empresas que buscan correr modelos open-source y analistas de datos que requieren capacidades matemáticas y lógicas robustas."
  },
  {
    name: "Qwen",
    description: "Familia de modelos open-source de Alibaba, muy potentes en contexto multimodal y multilingüe. Su variante Qwen-VL es líder en comprensión de imágenes complejas.",
    who_is_it_for: "Empresas que buscan integraciones API baratas pero efectivas para e-commerce (lectura de etiquetas, facturas chinas) y agencias que procesan alto volumen de texto en varios idiomas."
  },
  {
    name: "Kimi",
    description: "Modelo conversacional especializado en hiper-contexto: capaz de tragar cientos de PDFs y mantener la coherencia en la extracción sin olvidarse factores en el medio.",
    who_is_it_for: "Abogados revisando jurisprudencia masiva, auditores contables y coaches analizando grabaciones larguísimas de clientes."
  },
  {
    name: "Freepik",
    description: "Biblioteca gigante de vectores que implementó un motor de IA que permite retocar elementos de los vectores o crear imágenes de stock limpias al instante.",
    who_is_it_for: "Diseñadores gráficos, community managers y agencias chicas que necesitan armar posteos rápido sin saltar de sitio web en sitio web."
  },
  {
    name: "Higgsfield",
    description: "Motor generativo enfocado a creadores en redes sociales. Busca facilitar la creación y edición de videos virales con IA usando tu propio rostro u objetos de tu marca.",
    who_is_it_for: "Agencias de marketing de influencers, creadores de TikTok y marcas retail buscando un acercamiento simple pero efectivo para pautas publicitarias de video."
  },
  {
    name: "Kling AI",
    description: "Motor generativo de video chino capaz de simular físicas extremadamente complejas y movimientos realistas imposibles hasta la fecha con herramientas occidentales convencionales.",
    who_is_it_for: "Productoras experimentales, agencias creativas y curiosos del e-commerce que quieren estar a la vanguardia de la generación videográfica de productos."
  },
  {
    name: "HeyGen",
    description: "Te permite subir un video de 1 minuto tuyo y crear un clon o avatar digital hiperrealista que lee cualquier guión en decenas de idiomas conservando tu voz original.",
    who_is_it_for: "Coaches digitales armando sus cursos sin tener que grabar cada clase, e-commerce para páginas de ventas internacionales e inmobiliarias para presentar propiedades de forma estandarizada."
  },
  {
    name: "Suno",
    description: "Generador de canciones, melodías y música de estudio a partir de texto. Simplemente ingresá un género y letra (o deje que la escriba) y tendrás un audio original masterizado.",
    who_is_it_for: "Agencias creativas creando jingles o cortinas musicales orgánicas, creadores y equipos trabajando en entretenimiento que necesitan soundtracks sin usar librerías de stock genéricas."
  },
  {
    name: "Wispr",
    description: "Reimaginación del dictado por voz para el teclado moderno. Transcribe tu voz y al vuelo utiliza IA contextual para reformatear tu murmullo en lenguaje escrito empresarial impecable.",
    who_is_it_for: "Consultores y ejecutivos respondiendo docenas de correos diarios caminando por la calle, abogados y editores de texto que piensan más rápido de lo que teclean."
  },
  {
    name: "Ideogram",
    description: "Motor de imagen especialmente robusto manejando tipografía real dentro de la imagen, superando ampliamente a Midjourney o DALL-E en coherencia de textos (letreros, afiches, logos).",
    who_is_it_for: "Agencias creativas creando cartelería o posters promocionales, dueños de PyMEs generando sus propios logos rudimentarios o gráficas para Instagram que requieren texto legibile."
  },
  {
    name: "Photoroom",
    description: "Herramienta que recorta fondos de manera impecable y genera estudios o entornos fotográficos virtuales con IA alrededor de un simple producto fotografiado con tu celular.",
    who_is_it_for: "E-commerce manejando catálogos gigantes, vendedores de MercadoLibre/Amazon, y retail, permitiendo tener fotos profesionales sin pagar un estudio de iluminación real."
  },
  {
    name: "Opus Clip",
    description: "Sube un video largo de YouTube o un podcast y la IA encuentra los momentos álgidos, los recorta en formato vertical, agrega zoom dinámico y subtítulos estilo Hormiguero/TikTok.",
    who_is_it_for: "Podcasters, creadores de contenido, agencias de repurposing y coaches digitales que buscan multiplicar su alcance en Shorts y Reels sin sacrificar mil horas editando Premiere."
  },
  {
    name: "Vizard.ai",
    description: "Plataforma integral de repurposing de video a video vertical, similar a Opus, pero enfocada fuertemente a webinars, reuniones de zoom y ponencias con interfaces para equipos.",
    who_is_it_for: "Firmas B2B que graban conferencias, coaches con seminarios en vivo, y gerentes de marketing sacando valor publicitario de sus capacitaciones internas de YouTube."
  },
  {
    name: "Nano Banana",
    description: "Herramienta visual que genera conceptos, variantes fotográficas o arte digital a alta velocidad iterativa.",
    who_is_it_for: "Ideación visual y prototipado rápido en agencias, restaurantes diseñando platos, y creadores conceptualizando."
  },
  {
    name: "Apify",
    description: "La capa de ingeniería y scraping (extracción masiva de datos) web. Proveen cientos de actores pre-creados. Raspan desde leads de Google Maps hasta catálogos enteros de Amazon.",
    who_is_it_for: "SDRs, growth hackers en agencias, equipos de ventas de inmobiliarias scrapeando el MLS y e-commerces que monitorean el pricing de la competencia automáticamente."
  },
  {
    name: "WaLead.ai",
    description: "Sistemas avanzados de conexión entre prospectación, captura de leads telefónicos y engagement automático, enfocado al lead nurturing.",
    who_is_it_for: "Inmobiliarias y concesionarias intentando estandarizar el 'follow-up' que los vendedores humanos olvidan hacer recurrentemente."
  },
  {
    name: "Pirsonal",
    description: "Generación de videos automatizados a gran escala, metiendo datos del cliente nativamente en el video (ej: 'Hola Enzo, mirá tu resumen de tarjeta' en el video visible renderizado).",
    who_is_it_for: "Agencias de marketing manejando financieras o aseguradoras y empresas de suscripciones intentando recuperar retiros cruzando CRM y marketing visual."
  },
  {
    name: "Pomelli",
    description: "Asistente para la construcción de la identidad abstracta y Naming impulsado mediante generación iterativa para marcas comerciales.",
    who_is_it_for: "Consultores de branding, estudios de diseño pequeños, y emprendedores fundando Startups y batallando la aridez del brainstorming."
  },
  {
    name: "HumanizeAI",
    description: "Reformateador extremo. Tomas texto generado por GPT altamente robótico, burocrático, con enumeraciones y lo transforma en un tono de humano indistinguible para saltar los chequeos de 'AI Text Detectors'.",
    who_is_it_for: "Estudiantes entregando reportes (arriesgado), redactor publicitario freelance acortando plazos, y agencias intentando evitar la sequedad plástica del IA."
  },
  {
    name: "Lovable",
    description: "Plataforma super cargada que de un prompt crea Aplicaciones Web (React) enteras visuales editables. No sólo escribe el código, sino que da un entorno UI vivo con base de datos e integraciones.",
    who_is_it_for: "Equipos de producto haciendo MVPs interactivos de un día y no mockups tontos en Figma, agencias validando software con clientes."
  },
  {
    name: "Bolt.new",
    description: "El playground (StackBlitz) asistido con IA que lee contextos en segundos, armando plantillas y frameworks del ecosistema JS en tiempo récord sin setup local.",
    who_is_it_for: "Tech-leads probando librerías nuevas, freelancers y desarrolladores de integraciones armando demostraciones o herramientas de middleware sin gastar una tarde configurando Webpack o Vite."
  },
  {
    name: "Antigravity",
    description: "Motor IA o asistente profundo integrado a metodologías ágiles y entornos IDE; experto en operaciones con terminal para automatizar construcciones enteras de bases del proyecto.",
    who_is_it_for: "Desarrolladores buscando delegar las partes dolorosas del CI/CD, bases de datos o migración inter-tecnológica permitiéndose centrar sólo en la lógica arquitectónica."
  },
  {
    name: "Stitch AI",
    description: "Capa experimental enfocada en la creación rápida de maquetado e iteraciones de interfaz, empalmando fragmentos de código bajo demanda intuitiva.",
    who_is_it_for: "Diseñadores UI/UX que no codifican profundamente, consultores tecnológicos o agencias ensamblando landing pages ad-hoc descartables para tests A/B en frío."
  },
  {
    name: "Manus",
    description: "Una plataforma o macro-agente capacitado para el entorno comercial; orquesta acciones complejas a bajo nivel simulando clics reales donde no existen APIs.",
    who_is_it_for: "Directores de ecommerce, managers inmobiliarios y agencias resolviendo el 'trabajo basura' de actualizar reportes y sincronizar paneles cerrados semanalmente."
  }
];

async function updateDescriptions() {
  console.log('Updating tool descriptions in Supabase...');

  for (const tool of toolData) {
    const { error } = await supabase
      .from('tools')
      .update({
        description: tool.description,
        who_is_it_for: tool.who_is_it_for
      })
      .eq('name', tool.name);

    if (error) {
      console.error(`Error updating ${tool.name}:`, error.message);
    } else {
      console.log(`Updated ${tool.name} successfully.`);
    }
  }

  console.log('Finished updating all tools!');
}

updateDescriptions().catch(console.error);
