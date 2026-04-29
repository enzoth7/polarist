import { BookOpenText } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const conceptosBasicos = [
  {
    title: "Inteligencia Artificial (IA)",
    description: "Tecnología que puede resolver tareas como una persona (Ej: escribir, crear imágenes, responder preguntas)",
  },
  {
    title: "Prompt (Instrucción)",
    description: "Lo que le pedís a la IA. Cuanto más claro, mejor resultado.",
  },
  {
    title: "Modelo de IA",
    description: "El “cerebro” que responde (Ej: ChatGPT).",
  },
  {
    title: "Chatbot",
    description: "IA con la que podés conversar. Responde preguntas en tiempo real.",
  },
  {
    title: "Agente de IA",
    description: "IA que no solo responde, también actúa e interactúa. Puede trabajar de forma automática.",
  },
  {
    title: "Automatización",
    description: "Usar IA para hacer tareas sin intervención constante (Ej: responder mensajes solo).",
  },
  {
    title: "Flujo de trabajo (Workflow)",
    description: "Pasos que sigue la IA para completar una tarea (Ej: recibir → analizar → responder).",
  },
  {
    title: "Generación de contenido",
    description: "Crear textos, imágenes o videos con IA. Uso clave para redes y negocios.",
  },
  {
    title: "Datos (Información)",
    description: "Lo que la IA usa para responder. Mejor información = mejores resultados.",
  },
  {
    title: "Contexto",
    description: "Información extra que le das a la IA. Hace que las respuestas sean más precisas.",
  },
  {
    title: "Iteración (Mejora)",
    description: "Ajustar lo que pedís hasta que quede bien. Nunca es perfecto a la primera.",
  },
  {
    title: "Errores (Alucinaciones)",
    description: "A veces la IA puede inventar información. Siempre verificar.",
  },
] as const;

const ConceptosBasicos = () => {
  return (
    <section className="w-full">
      <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-soft">
        <div className="bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20">
          <CardHeader className="pb-5">
            <div className="flex items-center gap-3 text-foreground">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/75 text-primary shadow-soft">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Entendé las palabras más usadas</p>
                <CardTitle className="text-3xl font-black tracking-tight">Conceptos básicos de IA</CardTitle>
              </div>
            </div>
            <CardDescription className="max-w-3xl pt-3 text-sm leading-7 text-foreground/80">
              Para usar inteligencia artificial, primero necesitás conocer algunos conceptos simples. Así vas a entender qué significa cada cosa y para qué sirve.
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {conceptosBasicos.map((concepto, index) => (
              <AccordionItem
                key={concepto.title}
                value={`concepto-${index + 1}`}
                className="border-border/50 px-6 transition-colors hover:bg-muted/20"
              >
                <AccordionTrigger className="gap-4 py-5 text-left text-base font-bold text-foreground hover:no-underline">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-primary">
                      {index + 1}
                    </span>
                    <span>{concepto.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12 pr-4 text-sm leading-7 text-muted-foreground">
                  {concepto.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};

export default ConceptosBasicos;
