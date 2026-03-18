import { Compass, Copy, MessageSquare, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const features = [
  {
    icon: Store,
    title: "Feed de Victorias por Rubro",
    description: "Casos concretos filtrados para gastronomia, indumentaria, retail y servicios, sin humo ni teoria eterna.",
  },
  {
    icon: Copy,
    title: "Prompts listos para copiar",
    description: "Atajos accionables para vender, responder clientes, crear contenido y automatizar tareas repetitivas.",
  },
  {
    icon: MessageSquare,
    title: "Chats con dueños de negocios como tu",
    description: "Conversaciones aterrizadas con gente que ya probo la herramienta en un negocio real, no en un laboratorio.",
  },
] as const;

const radarSignals = [
  { label: "Victoria detectada", value: "Menu IA que aumento reservas en 48 horas" },
  { label: "Prompt listo", value: "Responder clientes por WhatsApp en segundos" },
  { label: "Conversacion activa", value: "Dueños compartiendo flujos que ya facturan" },
] as const;

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="landing-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.2),transparent_58%)]"
      />
      <div aria-hidden className="animate-float-gentle absolute -left-16 top-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div
        aria-hidden
        className="animate-float-slower absolute -right-12 bottom-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-12">
        <main className="flex flex-1 flex-col justify-center gap-16 py-12 lg:flex-row lg:items-center lg:py-16">
          <section className="max-w-2xl lg:w-[55%]">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-soft backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-primary" />
              Resultados y atajos listos para copiar
            </div>

            <h1 className="animate-slide-up mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              El radar de Inteligencia Artificial para los que no tienen tiempo de aprender IA.
            </h1>

            <p
              className="animate-slide-up mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
              style={{ animationDelay: "120ms", animationFillMode: "both" }}
            >
              Polarist corta el ruido. En vez de tutoriales largos, te entrega victorias reales, prompts accionables y conversaciones
              utiles para aplicar hoy mismo en tu negocio.
            </p>

            <div
              className="animate-slide-up mt-10 grid gap-3 sm:grid-cols-3"
              style={{ animationDelay: "220ms", animationFillMode: "both" }}
            >
              <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5 shadow-soft backdrop-blur-xl">
                <p className="text-sm font-medium text-muted-foreground">Radar curado</p>
                <p className="mt-2 text-xl font-black tracking-tight">Feed por rubro</p>
              </div>
              <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5 shadow-soft backdrop-blur-xl">
                <p className="text-sm font-medium text-muted-foreground">Implementacion inmediata</p>
                <p className="mt-2 text-xl font-black tracking-tight">Copiar y ejecutar</p>
              </div>
              <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5 shadow-soft backdrop-blur-xl">
                <p className="text-sm font-medium text-muted-foreground">Aprendizaje social</p>
                <p className="mt-2 text-xl font-black tracking-tight">Comunidad util</p>
              </div>
            </div>
          </section>

          <section className="relative flex w-full justify-center lg:w-[45%] lg:justify-end">
            <div className="relative w-full max-w-[380px] rounded-[2.4rem] border border-border/60 bg-background/70 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-border/30 bg-foreground p-4 text-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-background/55">Radar diario</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/10">
                    <Compass className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="mt-5 flex gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-background/10 px-3 py-1.5 text-background/80">Gastronomia</span>
                  <span className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Hoy</span>
                  <span className="rounded-full bg-background/10 px-3 py-1.5 text-background/80">Ventas</span>
                </div>

                <div className="mt-6 space-y-3">
                  {radarSignals.map((signal, index) => (
                    <article
                      key={signal.label}
                      className="rounded-[1.6rem] border border-background/10 bg-background/5 p-4 backdrop-blur-xl"
                      style={{ transform: `translateY(${index * 2}px)` }}
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-background/50">{signal.label}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-background/90">{signal.value}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.7rem] bg-background px-4 py-4 text-foreground shadow-card">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Atajo recomendado</p>
                      <p className="mt-2 text-sm font-bold leading-6">Prompt para vender mas sin sonar robotico</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Copy className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 top-14 hidden rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-card backdrop-blur-xl sm:block">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tiempo ahorrado</p>
                <p className="mt-1 text-lg font-black tracking-tight">Horas, no cursos</p>
              </div>
            </div>
          </section>
        </main>

        <section id="features" className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-fade-in rounded-[2rem] border border-border/60 bg-background/75 p-6 shadow-soft backdrop-blur-xl"
              style={{ animationDelay: `${index * 120 + 180}ms`, animationFillMode: "both" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-[2.25rem] border border-border/60 bg-background/80 p-8 shadow-card backdrop-blur-2xl sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Sin tutorialitis</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Entra, detecta una oportunidad y sal con algo listo para aplicar.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                La entrada ideal es simple: abre la cuenta, mira el radar y copia el primer atajo que encaje con tu negocio.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="h-14 rounded-full bg-foreground px-8 text-base font-bold text-background hover:bg-foreground/90">
                <Link to={routes.login}>Comenzar ahora</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
