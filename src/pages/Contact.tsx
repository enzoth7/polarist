import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const brandMail = "polarist@gmail.com";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyMail = async () => {
    try {
      await navigator.clipboard.writeText(brandMail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("No se pudo copiar el correo:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/50 p-8 shadow-card">
        <div className="space-y-5">
          <h1 className="font-heading text-3xl tracking-tight">Contacto</h1>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            Si tienes dudas o necesitas soporte, escríbenos. Estamos para ayudarte a llevar tu
            marca al siguiente nivel.
          </p>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-body text-sm sm:text-base">{brandMail}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleCopyMail}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Mail copiado" : "Copiar mail"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
