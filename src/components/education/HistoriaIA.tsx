import { Clock3 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const historiaIATimeline = [
  {
    year: "1950",
    title: "El inicio",
    description: "Alan Turing propone que las máquinas puedan \"pensar\" y resolver lógicas.",
  },
  {
    year: "1956",
    title: "Nace la IA",
    description: "Se crea el término “Inteligencia Artificial”.",
  },
  {
    year: "1980",
    title: "Primeros avances",
    description: "Sistemas empresariales para tomar decisiones simples.",
  },
  {
    year: "2000",
    title: "Internet + datos",
    description: "La nube facilita datos masivos.",
  },
  {
    year: "2010",
    title: "Machine Learning",
    description: "La IA aprende sola con datos (Visión, Voz).",
  },
  {
    year: "2020",
    title: "Explosión de la IA",
    description: "Herramientas potentes en laboratorios.",
  },
  {
    year: "2022-Hoy",
    title: "IA para todos",
    description: "ChatGPT, Gemini, Claude. Uso sin saber programar.",
  },
] as const;

const HistoriaIA = () => {
  return (
    <section className="w-full">
      <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-soft">
        <div className="bg-gradient-to-r from-secondary/20 via-accent/15 to-primary/20">
          <CardHeader className="pb-5">
            <div className="flex items-center gap-3 text-foreground">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/75 text-accent shadow-soft">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Viene evolucionando desde hace más de 70 años</p>
                <CardTitle className="text-3xl font-black tracking-tight">La IA no es nueva</CardTitle>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="space-y-6 p-6">
          <div className="relative pl-5">
            <div className="absolute bottom-0 left-2 top-0 w-[2px] rounded-full bg-gradient-to-b from-primary via-secondary to-accent" />

            <Accordion type="single" collapsible className="space-y-3">
              {historiaIATimeline.map((item, index) => (
                <AccordionItem
                  key={`${item.year}-${item.title}`}
                  value={`historia-${index + 1}`}
                  className="relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-card shadow-soft"
                >
                  <span className="absolute -left-[1.05rem] top-7 h-4 w-4 rounded-full border-4 border-background bg-primary" />

                  <AccordionTrigger className="gap-4 px-5 py-5 text-left hover:no-underline">
                    <div className="flex flex-col gap-2">
                      <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                        {item.year}
                      </span>
                      <span className="text-lg font-bold text-foreground">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-0 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="rounded-[1.75rem] border-border/60 bg-accent/10 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-black tracking-tight">Qué significa esto</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-7 text-foreground/85">
              La IA no apareció ahora de la nada. Evolucionó durante años hasta llegar a herramientas simples que hoy podés usar.
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
};

export default HistoriaIA;
