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
      showSecondaryGlow={false}
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 dark:text-white/72">
              Nombre
            </Label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="h-11 rounded-xl border-black/10 bg-white/70 text-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.55)] placeholder:text-foreground/45 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/45"
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 dark:text-white/72">
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="h-11 rounded-xl border-black/10 bg-white/70 text-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.55)] placeholder:text-foreground/45 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/45"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 dark:text-white/72">
            Mensaje
          </Label>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="min-h-[148px] rounded-xl border-black/10 bg-white/70 text-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.55)] placeholder:text-foreground/45 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/45"
            placeholder="Cuéntanos qué necesitas"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" className="h-12 rounded-full px-8 text-sm font-bold">
            Enviar
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 dark:text-white/72">Mail de soporte</p>
        <a href="mailto:soporte@polarist.uy" className="mt-2 inline-flex items-center rounded-full border border-black/10 bg-white/65 px-3.5 py-1.5 text-sm font-semibold text-foreground/82 transition-colors hover:bg-white/85 hover:text-foreground dark:border-white/15 dark:bg-white/[0.08] dark:text-white/82 dark:hover:bg-white/[0.14] dark:hover:text-white">
          soporte@polarist.uy
        </a>
      </div>
    </LegalPageLayout>
  );
};

export default Contact;
