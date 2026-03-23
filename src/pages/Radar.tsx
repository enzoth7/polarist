import { useMemo, useState } from "react";
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
  Star,
  Stethoscope,
  Users,
} from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";

const trendItems = [
  {
    title: "La mayor actualización de ChatGPT",
    description:
      "La nueva versión ahora puede leer montañas de información de una sola vez (como libros enteros o decenas de balances) y planificar tareas sola sin que estés encima.",
    accent: "from-amber-300 via-orange-400 to-rose-500",
    glow: "bg-orange-300/35",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Google hace su IA más barata y veloz",
    description:
      "Presentaron a Gemini 3.1 Flash-Lite, una inteligencia muchísimo más rápida pensada para emprendedores que necesitan hacer 10.000 tareas automáticas de golpe sin arruinarse pagando.",
    accent: "from-cyan-300 via-sky-500 to-indigo-600",
    glow: "bg-sky-300/30",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "La próxima generación de cerebros para la IA",
    description:
      "NVIDIA, la empresa que fabrica las 'placas madre' de las inteligencias artificiales, anunció Rubin. Serán el corazón de la IA para que razonen mucho más como humanos.",
    accent: "from-fuchsia-300 via-pink-500 to-violet-600",
    glow: "bg-fuchsia-300/30",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "La IA ya empieza a usar el mouse por vos",
    description:
      "Los creadores de Claude probaron un modelo de IA que literalmente toma control de tu computadora (Mac) para organizar tus archivos y cliquear programas autónomamente.",
    accent: "from-emerald-300 via-teal-500 to-cyan-600",
    glow: "bg-emerald-300/30",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Los bots que trabajan solos ya son reales",
    description:
      "Muchas startups están lanzando software que no te pide chatear, sino que vos le decis 'Buscá los mejores clientes en internet y preparales un email a cada uno', y lo hace.",
    accent: "from-yellow-300 via-lime-400 to-emerald-500",
    glow: "bg-lime-300/30",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
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

const Radar = () => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const { data: officialTools = [], isLoading: toolsCatalogLoading } = useToolsQuery({ isBeta: false });
  const radarTopTools = useMemo(() => officialTools.slice(0, 5), [officialTools]);
  const radarTopToolIds = useMemo(() => radarTopTools.map((tool) => tool.name), [radarTopTools]);
  const { getFavoriteCount, loading: favoritesLoading } = useToolInteractions(radarTopToolIds);

  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12 md:pt-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Última Semana
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Lo más destacado de la semana
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
                        <div className="absolute inset-0 p-4 pb-8 md:p-8">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full rounded-[24px] object-cover shadow-2xl brightness-95 transition-all md:rounded-[30px]"
                          />
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
            {toolsCatalogLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-4">
                  <Skeleton className="h-4 w-5" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : (
              radarTopTools.map((tool, index) => (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => setSelectedTool(tool)}
                  className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:text-primary"
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
                    <span className="flex items-center gap-2 text-base font-medium text-foreground">
                      <span>{tool.name}</span>
                      {!favoritesLoading ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-normal text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>({getFavoriteCount(tool.name)})</span>
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                </button>
              ))
            )}
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

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};

export default Radar;
