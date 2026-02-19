import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">Política de Privacidad</h1>
          <p className="font-body text-sm text-muted-foreground">Última actualización: 18 de febrero de 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">1. Información que recopilamos</h2>
          <p className="font-body text-muted-foreground">
            Recopilamos datos básicos de cuenta (como nombre y correo), información de acceso con Google OAuth, prompts
            de generación y metadatos técnicos necesarios para operar Polarist.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">2. Uso de la información</h2>
          <p className="font-body text-muted-foreground">
            Utilizamos tus datos para autenticar tu cuenta, generar imágenes, mejorar la calidad del servicio, prevenir
            abuso y brindarte soporte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">3. Proveedores y terceros</h2>
          <p className="font-body text-muted-foreground">
            Podemos usar proveedores externos para autenticación, almacenamiento y procesamiento. Compartimos solo la
            información estrictamente necesaria para estas funciones.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">4. Conservación y seguridad</h2>
          <p className="font-body text-muted-foreground">
            Conservamos la información mientras tu cuenta esté activa o según lo exija la ley. Aplicamos medidas
            razonables de seguridad para proteger tus datos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">5. Tus derechos</h2>
          <p className="font-body text-muted-foreground">
            Puedes solicitar acceso, corrección o eliminación de tus datos. Para consultas de privacidad contáctanos en{" "}
            <a className="underline underline-offset-4" href="mailto:polarist@gmail.com">
              polarist@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">6. Cambios de esta política</h2>
          <p className="font-body text-muted-foreground">
            Podemos actualizar esta política periódicamente. La versión vigente se publicará en esta misma página.
          </p>
        </section>

        <Button asChild variant="outline">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
};

export default Privacy;
