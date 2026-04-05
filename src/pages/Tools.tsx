import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/tools/ToolLogo";
import {
  fullToolsRanking,
  getToolsForNiche,
  toolBusinessNiches,
  type ToolRankingItem,
} from "@/data/aiToolsCatalog";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { routes } from "@/lib/routes";

const topTenTools = fullToolsRanking.slice(0, 10);
const topTenToolIds = topTenTools.map((tool) => tool.name);

type NicheSection = (typeof toolBusinessNiches)[number] & {
  tools: Array<ToolRankingItem & { tag: string }>;
};

const nicheSections: NicheSection[] = toolBusinessNiches
  .map((niche) => ({
    ...niche,
    tools: getToolsForNiche(niche.value)
      .slice(0, 3)
      .map((tool) => ({
        ...tool,
        tag: tool.nicheTags[niche.value] ?? tool.category,
      })),
  }))
  .filter((section) => section.tools.length > 0);

const Tools = () => {
  const { getFavoriteCount, loading } = useToolInteractions(topTenToolIds);

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
              <Button asChild variant="outline" className="rounded-full border-border/40 px-6">
                <Link to={routes.appToolsTips}>Ver tips</Link>
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
                    {!loading ? (
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
        </section>


      </div>
    </div>
  );
};

export default Tools;
