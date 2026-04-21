import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const Shortcuts = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-6 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-5 rounded-[2rem] bg-muted/20 px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Atajos
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Esta sección se está reordenando
        </h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          Mientras tanto, puedes ir a Guías o al ranking de herramientas para encontrar atajos útiles.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link to={routes.appGuides}>Ir a Guías</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to={routes.appTools}>Ver herramientas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;
