import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toolBusinessNiches } from "@/data/aiToolsCatalog";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";

type NicheSection = (typeof toolBusinessNiches)[number] & {
  tools: Array<ToolItem & { tag: string }>;
};

const Tools = () => {
  const {
    data: officialTools = [],
    error,
    isLoading,
  } = useToolsQuery({ isBeta: false });

  const topTenTools = useMemo(() => officialTools.slice(0, 10), [officialTools]);
  const topTenToolIds = useMemo(() => topTenTools.map((tool) => tool.name), [topTenTools]);
  const nicheSections = useMemo<NicheSection[]>(
    () =>
      toolBusinessNiches
        .map((niche) => ({
          ...niche,
          tools: officialTools
            .filter((tool) => tool.niches.includes(niche.value))
            .slice(0, 3)
            .map((tool) => ({
              ...tool,
              tag: tool.nicheTags[niche.value] ?? tool.category,
            })),
        }))
        .filter((section) => section.tools.length > 0),
    [officialTools],
  );

  const { getFavoriteCount, loading: favoritesLoading } = useToolInteractions(topTenToolIds);

  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Herramientas
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
                Las herramientas que mas se estan usando.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Primero el ranking global. Debajo, una seleccion clara por nicho para encontrar
                rapido lo que mas encaja con tu negocio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6">
                <Link to={routes.appToolsRanking}>
                  Ver ranking total
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full bg-white px-6 font-semibold text-black hover:bg-neutral-200 hover:text-black"
              >
                <Link to={routes.appToolsDiscoveries}>Descubrimientos</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Top 10 mundial
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
              Top 10 ranking mundial
            </h2>
          </div>

          {isLoading ? (
            <div className="divide-y divide-border/40 border-y border-border/40">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No pudimos cargar el ranking principal.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40 border-y border-border/40">
              {topTenTools.map((tool, index) => (
                <div key={tool.name} className="flex items-center gap-4 py-4">
                  <span className="w-8 shrink-0 text-sm font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <ToolLogo
                    name={tool.name}
                    domain={tool.domain}
                    className="h-12 w-12 border-none bg-transparent"
                    imageClassName="p-0.5"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-base font-semibold tracking-tight text-foreground md:text-lg">
                      {tool.name}
                      {!favoritesLoading ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-normal text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>({getFavoriteCount(tool.name)})</span>
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Negocios especificos
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
              Herramientas por nicho
            </h2>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <section
                  key={index}
                  className="rounded-2xl border border-border/40 bg-muted/10 p-5"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {Array.from({ length: 3 }).map((__, toolIndex) => (
                      <div
                        key={toolIndex}
                        className="flex items-center gap-3 rounded-xl bg-background/70 px-3 py-3"
                      >
                        <Skeleton className="h-11 w-11 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No pudimos cargar la seleccion por nicho.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {nicheSections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.value}
                    className="rounded-2xl border border-border/40 bg-muted/10 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background/80 text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">
                          {section.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {section.tools.map((tool) => (
                        <div
                          key={`${section.value}-${tool.name}`}
                          className="flex items-center gap-3 rounded-xl bg-background/70 px-3 py-3"
                        >
                          <ToolLogo name={tool.name} domain={tool.domain} className="h-11 w-11" />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {tool.name}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className="rounded-full border-border/40 bg-muted/30 px-3 py-1 text-[11px] font-medium text-foreground"
                          >
                            {tool.tag}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Tools;
