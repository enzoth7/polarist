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

  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

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
            <Label 
              htmlFor="contact-name" 
              style={sequelStyle}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/70"
            >
              Nombre
            </Label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              style={sequelStyle}
              className="h-11 rounded-xl border-white/15 bg-white/[0.03] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/30 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B]"
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="contact-email" 
              style={sequelStyle}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/70"
            >
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              style={sequelStyle}
              className="h-11 rounded-xl border-white/15 bg-white/[0.03] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/30 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B]"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="contact-message" 
            style={sequelStyle}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/70"
          >
            Mensaje
          </Label>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            style={sequelStyle}
            className="min-h-[148px] rounded-xl border-white/15 bg-white/[0.03] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/30 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B]"
            placeholder="Cuéntanos qué necesitas"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button 
            type="submit" 
            style={sequelStyle}
            className="h-12 rounded-full px-8 text-sm font-bold bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90"
          >
            Enviar
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        <p 
          style={sequelStyle}
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/70"
        >
          Mail de soporte
        </p>
        <a 
          href="mailto:contacto@polarist.app" 
          style={sequelStyle}
          className="mt-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm font-semibold text-[#F6F6F6]/80 transition-colors hover:bg-white/[0.08] hover:text-[#F6F6F6]"
        >
          contacto@polarist.app
        </a>
      </div>
    </LegalPageLayout>
  );
};

export default Contact;
