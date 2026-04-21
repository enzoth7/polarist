import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const discoveries = [
  {
    name: "Paperclip",
    domain: "paperclip.ai",
    url: "https://paperclip.ai",
    category: "Investigacion",
    kind: "Herramienta",
    niches: ["general", "agencias", "abogados"],
    niche_tags: {
      general: "Research automatizado",
      agencias: "Pistas y briefs",
      abogados: "Analisis documental"
    },
    description: "Asistente inteligente que optimiza la investigacion y el manejo de informacion. Disenado para transformar datos no estructurados en reportes utiles y accionables de forma rapida.",
    who_is_it_for: "Equipos de estrategia, investigadores y consultores que necesitan sintetizar gran cantidad de informacion dispersa en documentos cohesivos.",
    is_beta: true
  },
  {
    name: "OpenClaw",
    domain: "openclaw.ai",
    url: "https://openclaw.ai",
    category: "Agentes",
    kind: "Motor",
    niches: ["agencias", "freelancers", "ecommerce"],
    niche_tags: {
      agencias: "Automatizacion en PC",
      freelancers: "Delegacion de tareas",
      ecommerce: "Scraping y gestion"
    },
    description: "Asistente personal con control total del sistema. Corre en tu maquina, puede usar el navegador autonomamente, integrarse a cualquier app de chat y ejecutar comandos complejos.",
    who_is_it_for: "Usuarios tecnicos, freelancers operativos y desarrolladores que necesitan delegar tareas aburridas directamente a nivel de sistema operativo y navegador web.",
    is_beta: true
  },
  {
    name: "Twin",
    domain: "twin.so",
    url: "https://twin.so",
    category: "Agentes",
    kind: "Plataforma",
    niches: ["general", "ecommerce", "agencias"],
    niche_tags: {
      general: "Creacion de agentes",
      ecommerce: "Operadores soporte",
      agencias: "Scrapers a medida"
    },
    description: "'The AI Company Builder'. Permite programar agentes escribiendo en lenguaje natural. Los bots se conectan a APIs o usan el navegador y quedan ejecutandose 24/7.",
    who_is_it_for: "Fundadores, agencias y freelancers operativos que quieren montar bots de scrapping, monitoreo y respuesta sin tirar una sola linea de codigo.",
    is_beta: true
  },
  {
    name: "Relevance AI",
    domain: "relevanceai.com",
    url: "https://relevanceai.com",
    category: "Captacion",
    kind: "Plataforma",
    niches: ["agencias", "ecommerce", "retail"],
    niche_tags: {
      agencias: "Agentes SDR",
      ecommerce: "Atencion a clientes",
      retail: "Calificacion B2B"
    },
    description: "Plataforma B2B para orquestar fuerzas de trabajo guiadas por IA. Especializada en Go-To-Market (BDRs automaticos, cualificadores de Inbound y soporte 24/7).",
    who_is_it_for: "Equipos de ventas, directores de revenue y agencias de growth que buscan escalar exponencialmente su alcance comercial y calificacion sin sumar personal humano extra.",
    is_beta: true
  }
];

async function updateDiscoveries() {
  console.log('Upserting discovery tools...');
  for (const tool of discoveries) {
    const { error } = await supabase.from('tools').upsert(tool, { onConflict: 'name' });
    if (error) console.error(`Error with ${tool.name}:`, error.message);
    else console.log(`Success: ${tool.name}`);
  }
}

updateDiscoveries().catch(console.error);
