import { useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Question Interface
interface Question {
  id: number;
  category: string;
  text: string;
  description: string;
  options: {
    label: string;
    value: string;
    description: string;
    icon?: string;
  }[];
}

// 10-Question Survey Data
const QUESTIONS: Question[] = [
  {
    id: 11, // Using 11 to avoiding renumbering conflict logic, will act as step 0 effectively
    category: "Industria",
    text: "¿Cuál es la categoría de tu negocio?",
    description: "Para adaptar las recomendaciones a tu nicho.",
    options: [
      { label: "Restaurante / Cafetería", value: "gastronomia", description: "Comida, bebida y servicio." },
      { label: "Moda / Retail", value: "moda", description: "Ropa, accesorios y productos físicos." },
      { label: "Servicios Profesionales", value: "servicios", description: "Consultoría, salud, legal, etc." },
      { label: "Otro", value: "otro", description: "Cualquier otro tipo de negocio." },
    ],
  },
  {
    id: 1,
    category: "Meta Principal",
    text: "¿Cuál es tu meta principal para los próximos meses?",
    description: "Para crecer, necesitas un objetivo claro y medible.",
    options: [
      { label: "A) Reconocimiento", value: "reconocimiento", description: "Que más gente conozca mi marca." },
      { label: "B) Ventas Directas", value: "ventas", description: "Aumentar los pedidos a domicilio o reservas." },
      { label: "C) Fidelización", value: "fidelizacion", description: "Que mis clientes actuales vuelvan más seguido." },
    ],
  },
  {
    id: 2,
    category: "Personalidad",
    text: "Si tu restaurante fuera una persona, ¿cómo sería su personalidad?",
    description: "Esto define tu arquetipo de marca.",
    options: [
      { label: "A) Divertida y Sociable", value: "bufon", description: "Arquetipo 'Bufón'." },
      { label: "B) Tradicional y Cálida", value: "cuidador", description: "Arquetipo 'Cuidador'." },
      { label: "C) Elegante y Exclusiva", value: "gobernante", description: "Arquetipo 'Gobernante'." },
    ],
  },
  {
    id: 3,
    category: "Cliente Objetivo",
    text: "¿A qué tipo de cliente quieres atraer principalmente?",
    description: "Entender a quién le hablas permite elegir el lenguaje visual correcto.",
    options: [
      { label: "A) Jóvenes", value: "jovenes", description: "Buscan algo nuevo y 'fotogénico'." },
      { label: "B) Trabajadores", value: "trabajadores", description: "Necesitan algo rico y rápido." },
      { label: "C) Familias o Parejas", value: "familias", description: "Buscan una experiencia con calma." },
    ],
  },
  {
    id: 4,
    category: "Colores",
    text: "¿Qué colores representan mejor el 'sabor' de tu comida?",
    description: "El color comunica sensaciones físicas.",
    options: [
      { label: "A) Naranjas y Amarillos", value: "calidos", description: "Amistoso, energía y hambre." },
      { label: "B) Verdes y Tonos Tierra", value: "naturales", description: "Natural, fresco y orgánico." },
      { label: "C) Rojos Intensos y Negros", value: "intensos", description: "Poder, pasión y rapidez." },
    ],
  },
  {
    id: 5,
    category: "Estilo Visual",
    text: "¿Qué estilo visual prefieres para tus diseños y redes?",
    description: "La estética debe ser coherente.",
    options: [
      { label: "A) Minimalista", value: "minimalista", description: "Muy limpio, con mucho blanco y pocos adornos." },
      { label: "B) Rústico", value: "rustico", description: "Texturas de madera, tonos oscuros y acogedores." },
      { label: "C) Moderno/Pop", value: "pop", description: "Colores vibrantes y composiciones llamativas." },
    ],
  },
  {
    id: 6,
    category: "Iluminación",
    text: "¿Cómo quieres que se vea la iluminación en las fotos de tus platos?",
    description: "La luz cambia la 'historia' de la comida.",
    options: [
      { label: "A) Luz Suave", value: "suave", description: "Limpia, elimina sombras fuertes y se ve profesional." },
      { label: "B) Luz Lateral", value: "lateral", description: "Resalta texturas, hace que la comida se vea real." },
      { label: "C) Luz Dramática", value: "dramatica", description: "Estilo 'Dark Food', elegante y sofisticado." },
    ],
  },
  {
    id: 7,
    category: "Enfoque de Imágenes",
    text: "¿Qué tipo de imágenes quieres que dominen tu perfil?",
    description: "Es clave decidir si mostrarás el producto de cerca o el ambiente.",
    options: [
      { label: "A) Planos de Detalle", value: "macro", description: "Que se vea el queso derretido o la textura." },
      { label: "B) Estilo de Vida", value: "lifestyle", description: "Gente disfrutando y el ambiente del local." },
      { label: "C) Detrás de Escena", value: "bts", description: "El chef cocinando y el equipo trabajando." },
    ],
  },
  {
    id: 8,
    category: "Tono de Voz",
    text: "¿Qué tono de voz y letras (tipografía) van mejor contigo?",
    description: "Las letras modernas transmiten urgencia; las clásicas, estabilidad.",
    options: [
      { label: "A) Moderno y Directo", value: "moderno", description: "Sans Serif, mensajes cortos." },
      { label: "B) Elegante y Serio", value: "elegante", description: "Serif, lenguaje profesional." },
      { label: "C) Cercano y Artesanal", value: "cercano", description: "Handwritten, lenguaje de amigo." },
    ],
  },
  {
    id: 9,
    category: "Contenido",
    text: "¿Qué tipo de contenido publicarás más seguido?",
    description: "Debes equilibrar lo que informas con lo que vendes.",
    options: [
      { label: "A) Informativo", value: "informativo", description: "Menú, horarios y procesos." },
      { label: "B) Entretenimiento", value: "entretenimiento", description: "Retos, videos graciosos o tendencias." },
      { label: "C) Inspiración", value: "inspiracion", description: "Historias del local o ingredientes." },
    ],
  },
  {
    id: 10,
    category: "Factor Wow",
    text: "¿Cuál es tu 'Factor Wow' (tu mayor diferencia)?",
    description: "Identificar tu valor único evita competir solo por precio.",
    options: [
      { label: "A) Receta Secreta/Sabor", value: "sabor", description: "Un sabor que no existe en otro lado." },
      { label: "B) Rapidez/Servicio", value: "servicio", description: "La rapidez o facilidad de compra." },
      { label: "C) Experiencia/Decoración", value: "experiencia", description: "La decoración única y el ambiente." },
    ],
  },
];

const Onboarding = () => {
  const { updateProfile } = useBusinessProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Map answers to database columns
    // IDs correspond to the QUESTIONS array order. 
    // Note: Question with ID 11 is 'business_category'
    const profileData = {
      business_category: answers[11] || "",
      goal: answers[1] || "",
      personality: answers[2] || "",
      target_audience: answers[3] || "",
      colors: answers[4] || "",
      visual_style: answers[5] || "",
      lighting: answers[6] || "",
      image_focus: answers[7] || "",
      tone_of_voice: answers[8] || "",
      content_type: answers[9] || "",
      wow_factor: answers[10] || "",
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user found. Redirecting to login.");
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      updateProfile({
        ...profileData,
        onboardingComplete: true
      });

      toast({
        title: "¡Perfil Creado!",
        description: "Tu estrategia de marca ha sido guardada.",
      });

      navigate("/dashboard");

    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 justify-center">
        {/* Header */}
        <div className="mb-8 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-primary font-medium mb-4">
            <span className="bg-primary/10 px-3 py-1 rounded-full text-sm">
              Pregunta {step + 1} de {QUESTIONS.length}
            </span>
            <span className="text-muted-foreground text-sm">
              {currentQuestion.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {currentQuestion.text}
          </h1>
          <p className="text-xl text-muted-foreground">
            {currentQuestion.description}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 group
                ${answers[currentQuestion.id] === option.value
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold text-lg mb-1 group-hover:text-primary transition-colors
                    ${answers[currentQuestion.id] === option.value ? "text-primary" : ""}`}>
                    {option.label}
                  </h3>
                  <p className="text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                {answers[currentQuestion.id] === option.value && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1 animate-in zoom-in">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || isSubmitting}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : step === QUESTIONS.length - 1 ? (
              <>
                Finalizar
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
