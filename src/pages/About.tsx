import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-border bg-card/50 p-8 shadow-card md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="font-heading text-3xl tracking-tight">Quiénes Somos</h1>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            En Polarist impulsamos marcas con inteligencia artificial para crear contenido visual con estrategia,
            calidad y consistencia. Nuestra misión es simplificar la comunicación de negocios y emprendedores con
            herramientas que convierten ideas en imágenes listas para publicar.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            Creemos que una buena presencia digital no debería depender de equipos complejos ni procesos lentos.
            Polarist combina automatización, diseño y claridad para que cada marca crezca con identidad propia.
          </p>
          <Button asChild variant="outline">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center">
          {imageError ? (
            <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-background/70 p-6">
              <Sparkles className="h-16 w-16 text-primary" strokeWidth={1.5} />
              <p className="font-body text-sm text-muted-foreground">Logo no disponible. Mostrando placeholder.</p>
            </div>
          ) : (
            <img
              src="/Polarist_logo.jpeg"
              alt="Logo de Polarist"
              className="h-72 w-full rounded-xl border border-border object-contain p-6"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default About;
