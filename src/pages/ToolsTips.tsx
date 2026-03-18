import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toolTips } from "@/data/aiToolsCatalog";
import { routes } from "@/lib/routes";

const ToolsTips = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Trucos
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
              Consejos para usar mejor la guia
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Ideas simples para encontrar mas rapido la herramienta correcta y no perderte en el camino.
            </p>
          </div>

          <Button asChild variant="ghost" className="rounded-full">
            <Link to={routes.appTools}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <section className="bg-background">
          {toolTips.map((tip, index) => (
            <article
              key={tip.title}
              className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 border-b border-border/40 py-5 last:border-b-0"
            >
              <div className="flex items-start justify-center pt-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Truco {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tip.title}</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{tip.description}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ToolsTips;
