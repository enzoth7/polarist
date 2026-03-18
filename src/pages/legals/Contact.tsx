import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import LegalPageLayout from "./LegalPageLayout";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  return (
    <LegalPageLayout
      eyebrow="Contacto"
      title="Contacto"
      description="¿Tienes dudas o quieres sugerir una herramienta para la comunidad?"
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Nombre</Label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="h-12 rounded-2xl border-border/70 bg-background/80"
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="h-12 rounded-2xl border-border/70 bg-background/80"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">Mensaje</Label>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="min-h-[160px] rounded-2xl border-border/70 bg-background/80"
            placeholder="Cuéntanos qué necesitas"
          />
        </div>

        <Button type="submit" className="h-12 rounded-full px-8 text-sm font-bold">
          Enviar
        </Button>
      </form>

      <div className="mt-8 rounded-[1.5rem] border border-border/60 bg-primary/10 p-5 shadow-soft">
        <p className="text-sm font-semibold text-foreground">Mail de soporte</p>
        <a href="mailto:soporte@polarist.uy" className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground">
          soporte@polarist.uy
        </a>
      </div>
    </LegalPageLayout>
  );
};

export default Contact;
