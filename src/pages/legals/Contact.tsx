import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://epoolgyzovefaofyvocz.supabase.co/functions/v1/contact-form", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          email: form.email.trim(), 
          message: form.message.trim() 
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar");
      }

      setIsSuccess(true);
      setForm({ name: "", email: "", message: "" });
      toast.success("Mensaje enviado con éxito. Te contactaremos pronto.");
    } catch (error) {
      console.error("Error contact form:", error);
      toast.error("Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LegalPageLayout
      eyebrow="Contacto"
      title="Contacto"
      description="¿Tienes dudas o quieres sugerir una herramienta para la comunidad?"
      showSecondaryGlow={false}
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#CAFE5B]/20 text-[#CAFE5B]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 style={sequelStyle} className="mb-2 text-2xl font-bold text-white">¡Mensaje enviado!</h3>
          <p style={sequelStyle} className="mx-auto max-w-sm text-sm text-[#F6F6F6]/60">
            Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos por mail lo antes posible.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            style={sequelStyle}
            className="mt-8 h-12 rounded-full px-8 text-sm font-bold bg-white/[0.05] border border-white/10 text-[#F6F6F6] hover:bg-white/[0.1]"
          >
            Enviar otro mensaje
          </Button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
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
                required
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
                required
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
              required
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              style={sequelStyle}
              className="h-12 rounded-full px-8 text-sm font-bold bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      )}

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
