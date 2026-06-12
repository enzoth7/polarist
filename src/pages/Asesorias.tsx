import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Asesorias() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    level: "",
    goal: "",
    commitment: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("asesorias_waitlist").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          level: formData.level,
          goal: formData.goal,
          commitment: formData.commitment,
        },
      ]);

      if (error) throw error;

      // Invocar la Edge Function para mandar el mail con el PDF
      const { error: fnError } = await supabase.functions.invoke("asesorias-waitlist-email", {
        body: { name: formData.fullName, email: formData.email }
      });

      if (fnError) {
        console.error("Error enviando email:", fnError);
        // Opcional: Podrías tirar un toast acá, pero el registro a la lista igual fue exitoso.
      }

      toast.success("¡Agendado exitosamente!", {
        description: "Pronto recibirás un correo con la guía exclusiva.",
      });

      setFormData({ fullName: "", email: "", whatsapp: "", level: "", goal: "", commitment: "" });
      setStep(1); // Reset to start
    } catch (error: any) {
      console.error(error);
      toast.error("Hubo un error al registrarte.", {
        description: error.message || "Por favor, intentá de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white flex flex-col items-center justify-start pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 font-sans text-white">
          Aprendé a usar agentes de IA en <span className="text-[#CAFE5B]">2 semanas.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-sans font-light leading-relaxed">
          Un programa de 5 módulos para entender cómo funcionan y aplicarlos en tus tareas de todos los días.
        </p>
      </div>

      <div className="w-full max-w-2xl mt-4">
        <div className="mb-10 text-center">
          <p className="text-2xl md:text-3xl font-serif text-[#F6F6F6] italic tracking-wide">
            Nivelación
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step >= i ? "w-10 bg-[#8B5BF5]" : "w-4 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full" style={{ minHeight: "450px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-left">
                      <Label htmlFor="fullName" className="text-white/80 font-medium text-base">Nombre</Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Tu nombre"
                        className="bg-transparent border-white/20 text-white rounded-lg focus-visible:ring-[#8B5BF5] focus-visible:border-[#8B5BF5] h-14 px-5 text-base transition-colors"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3 text-left">
                      <Label htmlFor="email" className="text-white/80 font-medium text-base">Correo</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="tu@empresa.com"
                        className="bg-transparent border-white/20 text-white rounded-lg focus-visible:ring-[#8B5BF5] focus-visible:border-[#8B5BF5] h-14 px-5 text-base transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 text-left pt-2">
                    <Label htmlFor="whatsapp" className="text-white/80 font-medium text-base">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      required
                      placeholder="+598 99 123 456"
                      className="bg-transparent border-white/20 text-white rounded-lg focus-visible:ring-[#8B5BF5] focus-visible:border-[#8B5BF5] h-14 px-5 text-base transition-colors"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.fullName || !formData.email || !formData.whatsapp}
                    className="bg-[#8B5BF5] text-white hover:bg-[#8B5BF5]/90 rounded-[9999px] h-14 px-10 text-base font-bold font-sans border-none transition-transform hover:scale-[1.02] ml-auto"
                  >
                    Siguiente paso
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <div className="space-y-5 text-left">
                  <Label className="text-white/90 text-xl font-medium tracking-tight block mb-2">¿Cómo usás la Inteligencia Artificial hoy?</Label>
                  <div className="flex flex-col gap-4">
                    {[
                      { id: "initial-1", label: "Casi nada. Entré a ChatGPT un par de veces para ver qué era.", value: "initial_1" },
                      { id: "initial-2", label: "Básico. La uso a veces para redactar correos o resumir textos.", value: "initial_2" },
                      { id: "intermediate-1", label: "Frecuente. Lo uso diariamente y lo integro en mi trabajo diario.", value: "intermediate_1" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${formData.level === opt.value ? 'bg-[#8B5BF5]/10 border-[#8B5BF5] shadow-[0_0_20px_rgba(139,91,245,0.1)]' : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/[0.02]'}`}>
                        <input
                          type="radio"
                          name="level"
                          value={opt.value}
                          required
                          className="w-5 h-5 text-[#8B5BF5] bg-transparent border-white/30 focus:ring-[#8B5BF5] focus:ring-2 accent-[#8B5BF5]"
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          checked={formData.level === opt.value}
                        />
                        <span className="text-base text-white/80 leading-snug">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="text-white/60 hover:text-white hover:bg-white/5 rounded-[9999px] h-14 px-8 text-base font-medium transition-colors"
                  >
                    Volver
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.level}
                    className="bg-[#8B5BF5] text-white hover:bg-[#8B5BF5]/90 rounded-[9999px] h-14 px-10 text-base font-bold font-sans border-none transition-transform hover:scale-[1.02]"
                  >
                    Siguiente
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <div className="space-y-5 text-left">
                  <Label className="text-white/90 text-xl font-medium tracking-tight block mb-2">¿Cuál es tu objetivo principal para estas 2 semanas?</Label>
                  <div className="flex flex-col gap-4">
                    {[
                      { id: "goal-1", label: "Ahorrar tiempo en las tareas de mi propio negocio/emprendimiento.", value: "ahorrar_tiempo" },
                      { id: "goal-2", label: "Mejorar mis habilidades para mi trabajo actual.", value: "mejorar_habilidades" },
                      { id: "goal-3", label: "Crear una nueva fuente de ingresos o servicios.", value: "nueva_fuente_ingresos" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${formData.goal === opt.value ? 'bg-[#8B5BF5]/10 border-[#8B5BF5] shadow-[0_0_20px_rgba(139,91,245,0.1)]' : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/[0.02]'}`}>
                        <input
                          type="radio"
                          name="goal"
                          value={opt.value}
                          required
                          className="w-5 h-5 text-[#8B5BF5] bg-transparent border-white/30 focus:ring-[#8B5BF5] accent-[#8B5BF5]"
                          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                          checked={formData.goal === opt.value}
                        />
                        <span className="text-base text-white/80 leading-snug">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="text-white/60 hover:text-white hover:bg-white/5 rounded-[9999px] h-14 px-8 text-base font-medium transition-colors"
                  >
                    Volver
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.goal}
                    className="bg-[#8B5BF5] text-white hover:bg-[#8B5BF5]/90 rounded-[9999px] h-14 px-10 text-base font-bold font-sans border-none transition-transform hover:scale-[1.02]"
                  >
                    Siguiente
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full space-y-6"
              >
                <div className="space-y-5 text-left">
                  <Label className="text-white/90 text-xl font-medium tracking-tight block mb-2">¿Disponés de 4 horas semanales para aplicar los módulos?</Label>
                  <div className="flex flex-col gap-4">
                    {[
                      { id: "commit-1", label: "Sí, tengo el tiempo.", value: "si" },
                      { id: "commit-2", label: "No estoy seguro, busco algo para ver a mi propio ritmo.", value: "no_seguro" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${formData.commitment === opt.value ? 'bg-[#8B5BF5]/10 border-[#8B5BF5] shadow-[0_0_20px_rgba(139,91,245,0.1)]' : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/[0.02]'}`}>
                        <input
                          type="radio"
                          name="commitment"
                          value={opt.value}
                          required
                          className="w-5 h-5 text-[#8B5BF5] bg-transparent border-white/30 focus:ring-[#8B5BF5] accent-[#8B5BF5]"
                          onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                          checked={formData.commitment === opt.value}
                        />
                        <span className="text-base text-white/80 leading-snug">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-10 flex flex-col gap-5">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-white/60 hover:text-white hover:bg-white/5 rounded-[9999px] h-14 px-6 text-base font-medium transition-colors"
                    >
                      Volver
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !formData.commitment}
                      className="bg-[#F6F6F6] text-[#010101] hover:bg-white/90 rounded-[9999px] h-14 px-8 md:px-12 text-base font-bold font-sans border-none transition-transform hover:scale-[1.02]"
                    >
                      {loading ? "Procesando..." : "Agendarme al Prelanzamiento"}
                    </Button>
                  </div>

                  <p className="text-xs md:text-sm text-white/40 text-center max-w-lg mx-auto leading-relaxed">
                    Te enviaremos un mail de confirmación y una guía rápida con los detalles de los módulos y el costo.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
