import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChefHat,
  HeartPulse,
  Landmark,
  Megaphone,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

import { ToolLogo } from "@/components/tools/ToolLogo";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fullToolsRanking } from "@/data/aiToolsCatalog";
import { routes } from "@/lib/routes";

const trendItems = [
  {
    title: "Claude 3.5 acelera respuestas para equipos chicos",
    description:
      "Cada vez más negocios lo usan para escribir mejor y resolver tareas diarias sin perder tiempo.",
    accent: "from-amber-300 via-orange-400 to-rose-500",
    glow: "bg-orange-300/35",
    panel: "from-amber-100/95 via-orange-100/80 to-rose-200/70",
  },
  {
    title: "Sora lleva el video corto a otro nivel",
    description:
      "La generación de clips realistas vuelve más fácil probar ideas para redes sin grabar tanto.",
    accent: "from-cyan-300 via-sky-500 to-indigo-600",
    glow: "bg-sky-300/30",
    panel: "from-cyan-100/95 via-sky-100/80 to-indigo-200/70",
  },
  {
    title: "Canva suma más atajos para campañas exprés",
    description:
      "Diseños, copies e ideas rápidas en un mismo lugar para publicar sin frenar la operación.",
    accent: "from-fuchsia-300 via-pink-500 to-violet-600",
    glow: "bg-fuchsia-300/30",
    panel: "from-fuchsia-100/95 via-pink-100/80 to-violet-200/70",
  },
  {
    title: "ChatGPT empuja flujos más simples para pymes",
    description:
      "Se vuelve más útil para ordenar tareas, responder consultas y ahorrar horas de prueba y error.",
    accent: "from-emerald-300 via-teal-500 to-cyan-600",
    glow: "bg-emerald-300/30",
    panel: "from-emerald-100/95 via-teal-100/80 to-cyan-200/70",
  },
  {
    title: "Automatizar mensajes ya no parece cosa de expertos",
    description:
      "Herramientas visuales acercan respuestas automáticas y seguimientos sin tocar código.",
    accent: "from-yellow-300 via-lime-400 to-emerald-500",
    glow: "bg-lime-300/30",
    panel: "from-yellow-100/95 via-lime-100/80 to-emerald-200/70",
  },
] as const;

const communityItems = [
  { name: "Gastronomía", icon: ChefHat },
  { name: "Creadores", icon: Sparkles },
  { name: "Agencias", icon: Megaphone },
  { name: "Inmobiliarias", icon: Building2 },
  { name: "Abogados", icon: Landmark },
  { name: "Retail", icon: ShoppingBag },
  { name: "E-commerce", icon: BriefcaseBusiness },
  { name: "Freelancers", icon: Users },
  { name: "Salud", icon: HeartPulse },
  { name: "Coaches", icon: Stethoscope },
] as const;

const radarTopTools = fullToolsRanking.slice(0, 5);

const Radar = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12 md:pt-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Tendencias
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Lo que se está moviendo en IA
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Noticias rápidas para entender qué vale la pena mirar hoy.
              </p>
            </div>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="mx-auto w-full max-w-[calc(100%-1rem)] md:max-w-[calc(100%-6rem)]"
          >
            <CarouselContent>
              {trendItems.map((item, index) => (
                <CarouselItem key={item.title}>
                  <article
                    className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${item.accent} shadow-[0_28px_90px_-42px_rgba(0,0,0,0.4)]`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,10,18,0.06),rgba(8,10,18,0.28))]" />
                    <div
                      className={`absolute -left-10 top-6 h-40 w-40 rounded-full blur-3xl ${item.glow}`}
                    />
                    <div className="grid min-h-[26rem] md:min-h-[30rem] md:grid-cols-2">
                      <div className="relative z-10 flex flex-col justify-between gap-6 px-7 py-8 md:px-10 md:py-10">
                        <div className="inline-flex w-fit items-center rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur">
                          Tendencia {index + 1}
                        </div>
                        <div className="space-y-4">
                          <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                            {item.title}
                          </h2>
                          <p className="max-w-lg text-sm leading-7 text-white/82 md:text-base">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="relative min-h-[18rem] md:min-h-full">
                        <div className="absolute inset-0 bg-black/10" />
                        <div
                          className={`absolute inset-4 rounded-[30px] bg-gradient-to-br ${item.panel} shadow-inner`}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.95),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.58),transparent_18%),linear-gradient(150deg,rgba(255,255,255,0.24),rgba(255,255,255,0.02))]" />
                          <div className="absolute inset-x-8 top-8 h-10 rounded-full bg-background/70 backdrop-blur" />
                          <div className="absolute left-8 right-20 top-24 h-20 rounded-[28px] bg-background/85 shadow-lg" />
                          <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                            <div className="h-24 rounded-[26px] bg-background/82 shadow-lg" />
                            <div className="h-24 rounded-[26px] bg-background/72 shadow-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 top-1/2 h-11 w-11 border-none bg-background/88 shadow-lg backdrop-blur disabled:opacity-35 md:-left-5" />
            <CarouselNext className="right-3 top-1/2 h-11 w-11 border-none bg-background/88 shadow-lg backdrop-blur disabled:opacity-35 md:-right-5" />
          </Carousel>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Comunidades
            </h2>
            <p className="text-sm text-muted-foreground">
              Elegí un rubro y mirá qué dudas y victorias comparten otros dueños.
            </p>
          </div>

          <Carousel
            opts={{ align: "start" }}
            className="mx-auto w-full max-w-[calc(100%-2.5rem)] md:max-w-[calc(100%-5rem)]"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {communityItems.map(({ name, icon: Icon }) => (
                <CarouselItem
                  key={name}
                  className="basis-[34%] pl-3 sm:basis-[24%] md:basis-[18%] md:pl-4 lg:basis-[14%]"
                >
                  <Link
                    to={routes.appCommunity}
                    className="group flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/16">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {name}
                      </span>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 top-[2.05rem] h-10 w-10 border-none bg-background/92 shadow-md backdrop-blur disabled:opacity-30 md:-left-5" />
            <CarouselNext className="-right-2 top-[2.05rem] h-10 w-10 border-none bg-background/92 shadow-md backdrop-blur disabled:opacity-30 md:-right-5" />
          </Carousel>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Herramientas de IA más usadas
              </h2>
              <Link
                to={routes.appToolsRanking}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Ver ranking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Una lectura rapida del ranking oficial antes de entrar al listado completo.
            </p>
          </div>

          <div className="divide-y divide-border/50">
            {radarTopTools.map((tool, index) => (
              <Link
                key={tool.name}
                to={routes.appToolsRanking}
                className="flex items-center gap-4 py-4 transition-colors hover:text-primary"
              >
                <span className="w-5 text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <ToolLogo
                  name={tool.name}
                  domain={tool.domain}
                  className="h-10 w-10 border-none bg-transparent"
                  imageClassName="p-0.5"
                />
                <div className="min-w-0">
                  <span className="block text-base font-medium text-foreground">
                    {tool.name}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-6 md:py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 rounded-[36px] bg-gradient-to-br from-primary/16 via-secondary/28 to-accent/20 px-6 py-12 text-center md:px-10 md:py-16">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              ¿No sabes por dónde empezar?
            </h2>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              <Link to={routes.appGuides}>Comenzar</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Radar;
