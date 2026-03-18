import { useState } from "react";
import { Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type RankedTool = {
  name: string;
  domain: string;
};

type NicheTool = RankedTool & {
  tag: string;
};

type NicheSection = {
  title: string;
  tools: NicheTool[];
};

const topTenTools: RankedTool[] = [
  { name: "ChatGPT", domain: "openai.com" },
  { name: "Claude", domain: "anthropic.com" },
  { name: "Canva", domain: "canva.com" },
  { name: "n8n", domain: "n8n.io" },
  { name: "Midjourney", domain: "midjourney.com" },
  { name: "Loom", domain: "loom.com" },
  { name: "HeyGen", domain: "heygen.com" },
  { name: "Typeform", domain: "typeform.com" },
  { name: "Kommo", domain: "kommo.com" },
  { name: "ElevenLabs", domain: "elevenlabs.io" },
] as const;

const nicheSections: NicheSection[] = [
  {
    title: "Gastronomia",
    tools: [
      { name: "ChatGPT", domain: "openai.com", tag: "Menu y respuestas" },
      { name: "Canva", domain: "canva.com", tag: "Promos visuales" },
      { name: "Typeform", domain: "typeform.com", tag: "Reservas y pedidos" },
    ],
  },
  {
    title: "Ventas/CRM",
    tools: [
      { name: "Kommo", domain: "kommo.com", tag: "WhatsApp comercial" },
      { name: "Manychat", domain: "manychat.com", tag: "DM en piloto automatico" },
      { name: "Typeform", domain: "typeform.com", tag: "Captura de leads" },
    ],
  },
  {
    title: "Administracion",
    tools: [
      { name: "ChatGPT", domain: "openai.com", tag: "Textos y orden" },
      { name: "Claude", domain: "anthropic.com", tag: "Redaccion fina" },
      { name: "Loom", domain: "loom.com", tag: "Evita reuniones" },
    ],
  },
  {
    title: "Automatizacion",
    tools: [
      { name: "n8n", domain: "n8n.io", tag: "Operaciones conectadas" },
      { name: "Zapier", domain: "zapier.com", tag: "Arranque rapido" },
      { name: "Kommo", domain: "kommo.com", tag: "Seguimiento comercial" },
    ],
  },
] as const;

const ToolLogo = ({ name, domain }: RankedTool) => {
  const [failed, setFailed] = useState(false);
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Wrench className="h-4 w-4" />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-11 w-11 shrink-0 rounded-xl object-cover"
      onError={() => setFailed(true)}
    />
  );
};

const Tools = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-4 md:px-8 md:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Top 10 Mundial</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">Ranking general</h1>
          </div>

          <div className="bg-background">
            {topTenTools.map((tool, index) => (
              <div
                key={tool.name}
                className="flex items-center gap-4 border-b border-border/45 py-4 last:border-b-0"
              >
                <span className="w-8 shrink-0 text-sm font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ToolLogo name={tool.name} domain={tool.domain} />
                <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Top 3 por Nichos</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">Negocios especificos</h2>
          </div>

          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {nicheSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <h3 className="text-xl font-black tracking-tight text-foreground">{section.title}</h3>
                </div>

                <div className="bg-background">
                  {section.tools.map((tool) => (
                    <div
                      key={`${section.title}-${tool.name}`}
                      className="flex items-center gap-4 border-b border-border/45 py-4 last:border-b-0"
                    >
                      <ToolLogo name={tool.name} domain={tool.domain} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold tracking-tight text-foreground">{tool.name}</p>
                      </div>

                      <Badge variant="outline" className="rounded-full border-0 bg-muted px-3 py-1 text-[11px] font-semibold text-foreground">
                        {tool.tag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tools;
