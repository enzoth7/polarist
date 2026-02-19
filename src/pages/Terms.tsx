import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">Términos y Condiciones</h1>
          <p className="font-body text-sm text-muted-foreground">Última actualización: 18 de febrero de 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">1. Aceptación de uso</h2>
          <p className="font-body text-muted-foreground">
            Al usar Polarist aceptas estos términos. Si no estás de acuerdo, no utilices la plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">2. Cuenta y acceso</h2>
          <p className="font-body text-muted-foreground">
            Eres responsable de la actividad de tu cuenta y de mantener la seguridad de tus credenciales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">3. Uso permitido</h2>
          <p className="font-body text-muted-foreground">
            No puedes usar Polarist para generar contenido ilegal, engañoso, difamatorio o que infrinja derechos de
            terceros. Nos reservamos el derecho de limitar o suspender cuentas por abuso.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">4. Contenido generado</h2>
          <p className="font-body text-muted-foreground">
            El usuario conserva la responsabilidad sobre el uso final del contenido generado. Polarist puede mantener
            registros técnicos para mejorar el servicio y cumplir obligaciones legales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">5. Disponibilidad del servicio</h2>
          <p className="font-body text-muted-foreground">
            El servicio puede cambiar, interrumpirse o actualizarse sin previo aviso. No garantizamos disponibilidad
            continua ni ausencia total de errores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">6. Limitación de responsabilidad</h2>
          <p className="font-body text-muted-foreground">
            Polarist no será responsable por daños indirectos, pérdida de beneficios o interrupciones derivadas del uso
            de la plataforma, en la medida permitida por la ley.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">7. Contacto</h2>
          <p className="font-body text-muted-foreground">
            Para dudas legales o de uso, escríbenos a{" "}
            <a className="underline underline-offset-4" href="mailto:polarist@gmail.com">
              polarist@gmail.com
            </a>
            .
          </p>
        </section>

        <Button asChild variant="outline">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
};

export default Terms;
