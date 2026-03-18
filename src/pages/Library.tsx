import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const Library = () => {
  return (
    <div className="min-h-full bg-background px-5 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Librar
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Tu biblioteca
            </h1>
          </div>

          <Button asChild variant="ghost" className="rounded-full">
            <Link to={routes.appProfile}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Aquí verás tus herramientas y recursos guardados en el futuro.
        </p>
      </div>
    </div>
  );
};

export default Library;
