import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 22 },
  },
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const sequelStyle = { fontFamily: "var(--font-sequel, sans-serif)" };
  const serifStyle = { fontFamily: "var(--font-serif, serif)" };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("¡Email copiado al portapapeles!");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
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
      toast.success("Mensaje enviado con éxito. Te responderemos pronto.");
    } catch (error) {
      console.error("Error contact form:", error);
      toast.error("Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 md:pt-40 pb-32"
      style={{ backgroundColor: "#010101" }}
    >
      {/* Background Grids & Ambient Effects */}
      <div className="absolute inset-0 z-0 bg-grid-white/[0.015] pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{ backgroundColor: "rgba(202,254,91,0.03)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full blur-[160px] opacity-30 pointer-events-none"
        style={{ backgroundColor: "rgba(202,254,91,0.02)" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-5xl flex flex-col items-center"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 max-w-3xl w-full">
          <h1
            className="mb-5 text-[#F6F6F6] font-normal leading-[0.95] tracking-tight"
            style={{
              ...serifStyle,
              fontSize: "clamp(42px, 8vw, 68px)",
            }}
          >
            Hablemos de tu <br />
            próximo <strong className="text-[#CAFE5B] font-normal italic">paso</strong>
          </h1>
          <p
            className="mx-auto max-w-2xl text-[16px] md:text-[18px] font-light leading-relaxed"
            style={{
              ...sequelStyle,
              color: "rgba(246,246,246,0.6)",
            }}
          >
            ¿Tenés alguna duda o querés sugerir una herramienta para la comunidad? Escribinos y potenciemos tus flujos de trabajo con inteligencia artificial.
          </p>
        </motion.div>

        {/* Main Grid: Form (Left) + Contact Details (Right) */}
        <motion.div
          variants={itemVariants}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl"
        >
          {/* Left Column: Form */}
          <div className="lg:col-span-7 flex flex-col w-full relative z-10">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center rounded-[24px] border border-white/[0.06] bg-zinc-950/40 p-8 backdrop-blur-md"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#CAFE5B]/10 text-[#CAFE5B]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 style={sequelStyle} className="mb-2 text-2xl font-bold text-white">¡Mensaje enviado!</h3>
                <p style={sequelStyle} className="mx-auto max-w-xs text-sm text-[#F6F6F6]/60">
                  Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos por mail lo antes posible.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  style={sequelStyle}
                  className="mt-8 h-12 rounded-full px-8 text-xs font-bold bg-white/[0.05] border border-white/10 text-[#F6F6F6] hover:bg-white/[0.1] cursor-pointer"
                >
                  Enviar otro mensaje
                </Button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label 
                    htmlFor="contact-name" 
                    style={sequelStyle}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/60 ml-1"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    style={sequelStyle}
                    className="h-12 rounded-xl border-white/10 bg-white/[0.02] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/25 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B] focus-visible:bg-white/[0.04] transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="contact-email" 
                    style={sequelStyle}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/60 ml-1"
                  >
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    style={sequelStyle}
                    className="h-12 rounded-xl border-white/10 bg-white/[0.02] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/25 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B] focus-visible:bg-white/[0.04] transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="contact-message" 
                    style={sequelStyle}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F6F6]/60 ml-1"
                  >
                    Mensaje
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                    style={sequelStyle}
                    className="min-h-[160px] rounded-xl border-white/10 bg-white/[0.02] text-[#F6F6F6] shadow-none placeholder:text-[#F6F6F6]/25 focus-visible:ring-1 focus-visible:ring-[#CAFE5B] focus-visible:border-[#CAFE5B] focus-visible:bg-white/[0.04] transition-all resize-none"
                    placeholder="Cuéntanos en qué te podemos ayudar..."
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={sequelStyle}
                    className="h-13 rounded-full px-10 text-xs font-bold bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-lg shadow-[#CAFE5B]/5"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Contact Info (Redesigned boxless) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full mt-2 relative z-10">
            <div>
              <h2
                className="text-xl md:text-2xl font-bold mb-3 text-[#F6F6F6]"
                style={sequelStyle}
              >
                Canales directos
              </h2>
              <p
                className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-sm"
                style={sequelStyle}
              >
                ¿Preferís escribirnos directamente? Copiá nuestra dirección oficial. Respondemos en menos de 24 horas.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <span 
                className="text-[17px] font-semibold text-[#F6F6F6]/90 select-all"
                style={sequelStyle}
              >
                contacto@polarist.app
              </span>
              <button
                type="button"
                onClick={() => handleCopy("contacto@polarist.app")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Copiar email"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[#CAFE5B]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
