import { useEffect, useMemo, useRef, useState } from "react";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type QuestionType = "single" | "text";

interface QuestionCondition {
  questionId: number;
  values: string[];
}

interface QuestionOption {
  label: string;
  value: string;
  description?: string;
  icon: string;
}

interface Question {
  id: number;
  category: string;
  type: QuestionType;
  text: string;
  description?: string;
  options?: QuestionOption[];
  placeholder?: string;
  optional?: boolean;
  showIf?: QuestionCondition;
}

const QUESTION_IDS = {
  BRAND_CATEGORY: 1,
  BRAND_HISTORY: 2,
  BRAND_HISTORY_EXTRA: 3,
  DIFFERENTIAL: 4,
  CLIENT_IDEAL: 5,
  CLIENT_IDEAL_EXTRA: 6,
  PROMOTIONS: 7,
  PROMOTIONS_EXTRA: 8,
  PRODUCTS: 9,
  OPERATION: 10,
  SHIPPING: 11,
  CONTENT_TYPE: 12,
  RESOURCES: 13,
  CAMERA: 14,
  SALES_CHANNELS: 15,
  PRIORITY_CHANNEL: 16,
  TYPOGRAPHY: 17,
  SOCIAL_PRIORITY: 18,
  HUMANIZATION: 19,
  PRODUCT_LOOK: 20,
  FREQUENCY: 21,
  BRAND_FEELING: 22,
  COLOR_PALETTE_DEFINED: 23,
  BRAND_COLORS: 24,
  BRAND_PERCEPTION: 25,
  FINAL_CONTEXT: 26,
} as const;

const QUESTIONS: Question[] = [
  {
    id: QUESTION_IDS.BRAND_CATEGORY,
    category: "🍔 Categoría",
    type: "single",
    text: "¿Cuál de estas categorías define más a tu marca?",
    options: [
      {
        label: "A) Comida rápida (Fast Food)",
        value: "comida_rapida",
        description: "Enfocada en vender mucho, rápido y de forma accesible.",
        icon: "🍟",
      },
      {
        label: "B) Marca artesanal",
        value: "marca_artesanal",
        description: "Enfatiza lo casero, natural y hecho a mano.",
        icon: "🧵",
      },
      {
        label: "C) Marca premium o gourmet",
        value: "marca_premium_gourmet",
        description: "Busca posicionarse como exclusiva y de alta calidad.",
        icon: "🍽️",
      },
      {
        label: "D) Marca de bienestar o saludable",
        value: "marca_bienestar_saludable",
        description: "Enfocada en hacer sentir bien al cliente física y mentalmente. No solo venden comida, venden un estilo de vida.",
        icon: "🥗",
      },
      {
        label: "E) Marca moderna o disruptiva",
        value: "marca_moderna_disruptiva",
        description: "Enfocada en destacar y verse nueva o innovadora.",
        icon: "⚡",
      },
    ],
  },
  {
    id: QUESTION_IDS.BRAND_HISTORY,
    category: "📖 Historia",
    type: "single",
    text: "¿Cuál es la historia de su marca?",
    options: [
      {
        label: "A) Nació como un proyecto personal o familiar.",
        value: "historia_personal_familiar",
        icon: "👨‍👩‍👧",
      },
      {
        label: "B) Surgió al ver una oportunidad en el mercado.",
        value: "historia_oportunidad_mercado",
        icon: "📈",
      },
      {
        label: "C) Es el resultado de una pasión o sueño que decidimos hacer realidad.",
        value: "historia_pasion_sueno",
        icon: "💭",
      },
    ],
  },
  {
    id: QUESTION_IDS.DIFFERENTIAL,
    category: "✨ Diferencial",
    type: "single",
    text: "¿Cuál es su mayor diferencial y qué los hace únicos?",
    options: [
      {
        label: "A) La calidad y el cuidado en los detalles.",
        value: "diferencial_calidad_detalles",
        icon: "💎",
      },
      {
        label: "B) La experiencia y el vínculo con el cliente.",
        value: "diferencial_experiencia_vinculo",
        icon: "🤝",
      },
      {
        label: "C) El concepto, estilo o idea diferente.",
        value: "diferencial_concepto_estilo",
        icon: "🎨",
      },
    ],
  },
  {
    id: QUESTION_IDS.CLIENT_IDEAL,
    category: "🎯 Cliente Ideal",
    type: "single",
    text: "¿Quién es su cliente ideal?",
    options: [
      {
        label: "A) Personas jóvenes que buscan algo nuevo.",
        value: "cliente_ideal_jovenes",
        icon: "🧑‍🎓",
      },
      {
        label: "B) Adultos que valoran calidad y estética.",
        value: "cliente_ideal_adultos",
        icon: "🧑‍💼",
      },
      {
        label: "C) Público variado que busca algo rico y confiable.",
        value: "cliente_ideal_publico_variado",
        icon: "👥",
      },
    ],
  },
  {
    id: QUESTION_IDS.CLIENT_IDEAL_EXTRA,
    category: "📝 Cliente Ideal",
    type: "text",
    optional: true,
    text: "Si tu cliente ideal no se encuentra en las opciones anteriores, puedes describirlo acá.",
    placeholder: "Contanos cómo es tu cliente ideal...",
  },
  {
    id: QUESTION_IDS.PROMOTIONS,
    category: "🎉 Promociones",
    type: "single",
    text: "¿Tienen promociones, combos o fechas especiales que quieran comunicar?",
    options: [
      {
        label: "A) Sí, trabajamos con fechas especiales tradicionales (Día de la Madre, Navidad, San Valentín, etc.)",
        value: "promociones_fechas_tradicionales",
        icon: "📅",
      },
      {
        label: "B) Sí, tenemos nuestras propias promociones o fechas importantes.",
        value: "promociones_propias",
        icon: "🎁",
      },
      {
        label: "C) No, actualmente no trabajamos con promociones ni fechas especiales.",
        value: "sin_promociones",
        icon: "🚫",
      },
    ],
  },
  {
    id: QUESTION_IDS.PROMOTIONS_EXTRA,
    category: "📝 Promociones",
    type: "text",
    optional: true,
    showIf: {
      questionId: QUESTION_IDS.PROMOTIONS,
      values: ["promociones_propias"],
    },
    text: "Detallá tus promociones o fechas importantes.",
    placeholder: "Ejemplo: 2x1 los miércoles, semana aniversario, combo del mes...",
  },
  {
    id: QUESTION_IDS.PRODUCTS,
    category: "📸 Producto",
    type: "text",
    text: "Contanos sobre tus productos.",
    description:
      "Contanos cuáles son los productos que más te gustaría destacar en redes sociales.",
    placeholder: "Escribí los productos que querés destacar...",
  },
  {
    id: QUESTION_IDS.OPERATION,
    category: "🏪 Operación",
    type: "single",
    text: "¿Cuentan con local físico o trabajan por pedido?",
    options: [
      {
        label: "A) Tenemos un local físico (uno o más).",
        value: "operacion_local_fisico",
        icon: "🏬",
      },
      {
        label: "B) Trabajamos con delivery y/o envíos.",
        value: "operacion_delivery_envios",
        icon: "🛵",
      },
      {
        label: "C) Trabajamos únicamente por pedido.",
        value: "operacion_solo_pedido",
        icon: "📦",
      },
    ],
  },
  {
    id: QUESTION_IDS.SHIPPING,
    category: "🚚 Envíos",
    type: "single",
    text: "¿Realizan envíos?",
    options: [
      {
        label: "A) Sí, a todo el país.",
        value: "envios_todo_el_pais",
        icon: "🗺️",
      },
      {
        label: "B) Solo en nuestra ciudad.",
        value: "envios_ciudad",
        icon: "🏙️",
      },
      {
        label: "C) No realizamos envíos.",
        value: "sin_envios",
        icon: "🙅",
      },
    ],
  },
  {
    id: QUESTION_IDS.CONTENT_TYPE,
    category: "🎬 Contenido",
    type: "single",
    text: "¿Qué tipo de contenido buscan crear?",
    options: [
      {
        label: "A) Carruseles y diseños informativos (promociones, productos, precios, novedades)",
        value: "contenido_informativo",
        icon: "🧠",
      },
      {
        label: "B) Contenido de entretenimiento (Reels, tendencias, videos cortos, contenido dinámico)",
        value: "contenido_entretenimiento",
        icon: "🎉",
      },
      {
        label: "C) Contenido visual del producto (fotos atractivas, diseños promocionales y publicaciones de venta)",
        value: "contenido_visual_producto",
        icon: "📷",
      },
    ],
  },
  {
    id: QUESTION_IDS.RESOURCES,
    category: "🧰 Recursos",
    type: "single",
    text: "¿Qué recursos tienen disponibles para crear contenido?",
    options: [
      {
        label: "A) Contamos con un espacio atractivo y buena iluminación para grabar o sacar fotos",
        value: "recursos_completos",
        icon: "💡",
      },
      {
        label: "B) Tenemos un espacio, pero la iluminación o el entorno es limitado",
        value: "recursos_limitados",
        icon: "🛠️",
      },
      {
        label: "C) No contamos con un espacio preparado para crear contenido",
        value: "sin_espacio_preparado",
        icon: "📭",
      },
    ],
  },
  {
    id: QUESTION_IDS.CAMERA,
    category: "📱 Cámara",
    type: "single",
    text: "Calidad de cámara disponible:",
    options: [
      {
        label: "A) Celular con cámara de buena calidad (imágenes nítidas y claras)",
        value: "camara_buena",
        icon: "📸",
      },
      {
        label: "B) Celular con cámara de calidad media (se ve bien, pero no profesional)",
        value: "camara_media",
        icon: "📲",
      },
      {
        label: "C) Celular con cámara básica (calidad limitada)",
        value: "camara_basica",
        icon: "☎️",
      },
    ],
  },
  {
    id: QUESTION_IDS.SALES_CHANNELS,
    category: "🛒 Canales",
    type: "single",
    text: "¿Qué canales de ventas usan actualmente?",
    options: [
      {
        label: "A) Instagram o redes sociales.",
        value: "canales_instagram_redes",
        icon: "📱",
      },
      {
        label: "B) WhatsApp.",
        value: "canales_whatsapp",
        icon: "💬",
      },
      {
        label: "C) Local físico o web.",
        value: "canales_local_o_web",
        icon: "🏬",
      },
      {
        label: "D) Todas las anteriores.",
        value: "canales_todos",
        icon: "🌐",
      },
    ],
  },
  {
    id: QUESTION_IDS.PRIORITY_CHANNEL,
    category: "📈 Canal",
    type: "single",
    text: "¿Qué canal quieren potenciar más?",
    options: [
      {
        label: "A) Instagram.",
        value: "potenciar_instagram",
        icon: "📸",
      },
      {
        label: "B) WhatsApp.",
        value: "potenciar_whatsapp",
        icon: "💬",
      },
      {
        label: "C) Página web.",
        value: "potenciar_web",
        icon: "🌍",
      },
      {
        label: "D) Todas las anteriores.",
        value: "potenciar_todos",
        icon: "🧭",
      },
    ],
  },
  {
    id: QUESTION_IDS.TYPOGRAPHY,
    category: "🔤 Tipografía",
    type: "single",
    text: "¿Cuentan con una tipografía definida?",
    options: [
      {
        label: "A) Sí, tenemos una definida.",
        value: "tipografia_definida",
        icon: "✒️",
      },
      {
        label: "B) Tenemos algo, pero no está bien definido.",
        value: "tipografia_parcial",
        icon: "✍️",
      },
      {
        label: "C) No tenemos.",
        value: "tipografia_no_definida",
        icon: "📄",
      },
    ],
  },
  {
    id: QUESTION_IDS.SOCIAL_PRIORITY,
    category: "📣 Prioridad",
    type: "single",
    text: "¿Cuál es su prioridad principal en redes sociales ahora?",
    options: [
      {
        label: "A) Atraer nuevos clientes.",
        value: "atraer_nuevos_clientes",
        icon: "🧲",
      },
      {
        label: "B) Generar confianza con contenido de alta calidad.",
        value: "generar_confianza",
        icon: "🛡️",
      },
      {
        label: "C) Fidelizar a clientes que ya nos visitaron.",
        value: "fidelizar_clientes",
        icon: "🔁",
      },
    ],
  },
  {
    id: QUESTION_IDS.HUMANIZATION,
    category: "🤝 Humanización",
    type: "single",
    text: "¿Qué importancia le dan a humanizar la marca?",
    options: [
      {
        label: "A) Mostramos al equipo y el día a día.",
        value: "humanizacion_alta",
        icon: "🎥",
      },
      {
        label: "B) A veces mostramos personas.",
        value: "humanizacion_media",
        icon: "🙂",
      },
      {
        label: "C) Preferimos mostrar solo el producto.",
        value: "humanizacion_baja",
        icon: "📦",
      },
    ],
  },
  {
    id: QUESTION_IDS.PRODUCT_LOOK,
    category: "📸 Look del Producto",
    type: "single",
    text: "¿Cómo quieres que se vea tu producto en la pantalla?",
    options: [
      {
        label: "A) Provocativo e irresistible.",
        value: "look_provocativo",
        icon: "🔥",
      },
      {
        label: "B) Real y cercano.",
        value: "look_real_cercano",
        icon: "🤍",
      },
      {
        label: "C) Elegante y premium.",
        value: "look_elegante_premium",
        icon: "✨",
      },
    ],
  },
  {
    id: QUESTION_IDS.FREQUENCY,
    category: "⏱️ Frecuencia",
    type: "single",
    text: "¿Qué tan seguido están dispuestos a aparecer en redes?",
    options: [
      {
        label: "A) 1 vez por semana.",
        value: "frecuencia_1_por_semana",
        icon: "🗓️",
      },
      {
        label: "B) 2–4 veces por semana.",
        value: "frecuencia_2_4_por_semana",
        icon: "⏰",
      },
      {
        label: "C) Todos los días.",
        value: "frecuencia_todos_los_dias",
        icon: "🚀",
      },
    ],
  },
  {
    id: QUESTION_IDS.BRAND_FEELING,
    category: "💫 Sensación",
    type: "single",
    text: "¿Qué sensación quieres que sientan al consumir tu producto?",
    options: [
      {
        label: "A) Transformación: Que sientan que su día cambió por completo.",
        value: "sensacion_transformacion",
        icon: "🦋",
      },
      {
        label: "B) Reconocimiento: Que se sientan importantes por comer en el sitio de moda.",
        value: "sensacion_reconocimiento",
        icon: "🏅",
      },
      {
        label: "C) Pertenencia: Que se sientan en familia o con amigos.",
        value: "sensacion_pertenencia",
        icon: "🏡",
      },
      {
        label: "D) Innovación: Que sientan que probaron algo que no existía antes.",
        value: "sensacion_innovacion",
        icon: "💡",
      },
    ],
  },
  {
    id: QUESTION_IDS.COLOR_PALETTE_DEFINED,
    category: "🎨 Paleta",
    type: "single",
    text: "Con respecto al color, ¿Tienen una paleta de color definida?",
    options: [
      {
        label: "A) Si, ya tengo una paleta de color definida.",
        value: "si_paleta_definida",
        icon: "✅",
      },
      {
        label: "B) Si, pero me gustaría cambiarlo o probar algo diferente.",
        value: "si_pero_quiero_cambiar",
        icon: "🔄",
      },
      {
        label: "C) No, es la primera vez que escucho esto.",
        value: "no_tengo_paleta",
        icon: "🌱",
      },
    ],
  },
  {
    id: QUESTION_IDS.BRAND_COLORS,
    category: "🖌️ Colores",
    type: "text",
    showIf: {
      questionId: QUESTION_IDS.COLOR_PALETTE_DEFINED,
      values: ["si_pero_quiero_cambiar", "no_tengo_paleta"],
    },
    text: "¿Con cuáles colores identifica tu marca? Elegí hasta 3 opciones",
    description: "Escribir colores.",
    placeholder: "Ejemplo: negro, crema, índigo",
  },
  {
    id: QUESTION_IDS.BRAND_PERCEPTION,
    category: "🪞 Percepción",
    type: "single",
    text: "¿Cómo te gustaría que las personas perciban tu marca?",
    options: [
      {
        label: "A) Cercana y humana.",
        value: "cercana_y_humana",
        icon: "🤲",
      },
      {
        label: "B) Profesional y confiable.",
        value: "profesional_y_confiable",
        icon: "🧠",
      },
      {
        label: "C) Creativa y diferente.",
        value: "creativa_y_diferente",
        icon: "🎭",
      },
    ],
  },
];

const PROCESSING_MESSAGES = [
  "✨ Interpretando el ADN de tu marca...",
  "🧠 Definiendo tus arquetipos visuales...",
  "🎨 Configurando tu paleta de colores exclusiva...",
  "🚀 Tu universo visual está casi listo.",
  "¡Bienvenidos a Polarist!",
] as const;

const PROCESSING_MESSAGE_MS = 1700;
const PROCESSING_FADE_MS = 320;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const Onboarding = () => {
  const { updateProfile } = useBusinessProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);
  const [processingMessageVisible, setProcessingMessageVisible] = useState(true);
  const processingRunIdRef = useRef(0);

  useEffect(
    () => () => {
      processingRunIdRef.current += 1;
    },
    [],
  );

  const visibleQuestions = useMemo(
    () =>
      QUESTIONS.filter((question) => {
        if (!question.showIf) {
          return true;
        }

        const parentAnswer = answers[question.showIf.questionId];
        return question.showIf.values.includes(parentAnswer);
      }),
    [answers],
  );

  useEffect(() => {
    if (step >= visibleQuestions.length) {
      setStep(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [step, visibleQuestions.length]);

  const currentQuestion = visibleQuestions[step];
  const progress = visibleQuestions.length === 0 ? 0 : ((step + 1) / visibleQuestions.length) * 100;

  const canContinue = () => {
    if (!currentQuestion) {
      return false;
    }

    if (currentQuestion.type === "text") {
      if (currentQuestion.optional) {
        return true;
      }
      return Boolean(answers[currentQuestion.id]?.trim());
    }

    return Boolean(answers[currentQuestion.id]);
  };

  const handleSelect = (value: string) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleTextChange = (value: string) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (!currentQuestion || isSubmitting) {
      return;
    }

    if (step < visibleQuestions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    await handleSubmit();
  };

  const handleBack = () => {
    if (step > 0 && !isSubmitting) {
      setStep((prev) => prev - 1);
    }
  };

  const getAnswerLabel = (question: Question) => {
    const value = answers[question.id];
    if (!value) {
      return "";
    }

    if (question.type === "text") {
      return value;
    }

    const option = question.options?.find((item) => item.value === value);
    return option?.label ?? value;
  };

  const playProcessingSequence = async (runId: number) => {
    setProcessingMessageIndex(0);
    setProcessingMessageVisible(true);

    for (let index = 0; index < PROCESSING_MESSAGES.length; index += 1) {
      if (processingRunIdRef.current !== runId) {
        return;
      }

      setProcessingMessageIndex(index);
      setProcessingMessageVisible(true);
      await wait(PROCESSING_MESSAGE_MS - PROCESSING_FADE_MS);

      if (index < PROCESSING_MESSAGES.length - 1) {
        if (processingRunIdRef.current !== runId) {
          return;
        }

        setProcessingMessageVisible(false);
        await wait(PROCESSING_FADE_MS);
      }
    }
  };

  const handleSubmit = async () => {
    const runId = processingRunIdRef.current + 1;
    processingRunIdRef.current = runId;

    setIsSubmitting(true);
    const processingSequence = playProcessingSequence(runId);

    const profileData = {
      business_category: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.BRAND_CATEGORY)!),
      brand_history: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.BRAND_HISTORY)!),
      brand_differential: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.DIFFERENTIAL)!),
      target_audience: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.CLIENT_IDEAL)!),
      target_audience_extra: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.CLIENT_IDEAL_EXTRA)!),
      promotions: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.PROMOTIONS)!),
      promotions_extra: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.PROMOTIONS_EXTRA)!),
      products_to_highlight: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.PRODUCTS)!),
      operation_type: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.OPERATION)!),
      shipping_scope: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.SHIPPING)!),
      content_type_preferred: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.CONTENT_TYPE)!),
      content_resources: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.RESOURCES)!),
      camera_quality: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.CAMERA)!),
      sales_channels: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.SALES_CHANNELS)!),
      priority_sales_channel: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.PRIORITY_CHANNEL)!),
      typography_status: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.TYPOGRAPHY)!),
      social_priority_goal: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.SOCIAL_PRIORITY)!),
      humanization_level: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.HUMANIZATION)!),
      product_visual_style: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.PRODUCT_LOOK)!),
      posting_frequency: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.FREQUENCY)!),
      brand_feeling: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.BRAND_FEELING)!),
      color_palette_status: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.COLOR_PALETTE_DEFINED)!),
      brand_colors_extra: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.BRAND_COLORS)!),
      brand_perception: getAnswerLabel(QUESTIONS.find((q) => q.id === QUESTION_IDS.BRAND_PERCEPTION)!),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id);

      if (error) {
        throw error;
      }

      await processingSequence;

      if (processingRunIdRef.current !== runId) {
        return;
      }

      updateProfile({
        businessCategory: profileData.business_category,
        brandHistory: profileData.brand_history,
        brandDifferential: profileData.brand_differential,
        targetAudience: profileData.target_audience,
        targetAudienceExtra: profileData.target_audience_extra,
        promotions: profileData.promotions,
        promotionsExtra: profileData.promotions_extra,
        productsToHighlight: profileData.products_to_highlight,
        operationType: profileData.operation_type,
        shippingScope: profileData.shipping_scope,
        contentTypePreferred: profileData.content_type_preferred,
        contentResources: profileData.content_resources,
        cameraQuality: profileData.camera_quality,
        salesChannels: profileData.sales_channels,
        prioritySalesChannel: profileData.priority_sales_channel,
        typographyStatus: profileData.typography_status,
        socialPriorityGoal: profileData.social_priority_goal,
        humanizationLevel: profileData.humanization_level,
        productVisualStyle: profileData.product_visual_style,
        postingFrequency: profileData.posting_frequency,
        brandFeeling: profileData.brand_feeling,
        colorPaletteStatus: profileData.color_palette_status,
        brandColorsExtra: profileData.brand_colors_extra,
        brandPerception: profileData.brand_perception,
        onboardingComplete: true,
      });

      toast({
        title: "Perfil creado",
        description: "Tu cuestionario quedó guardado correctamente.",
      });

      navigate("/dashboard");
    } catch (error) {
      processingRunIdRef.current += 1;
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      if (processingRunIdRef.current === runId) {
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        setProcessingMessageIndex(0);
        setProcessingMessageVisible(true);
      }
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-4">
        <div className="flex w-full max-w-[400px] flex-col items-center justify-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/8 to-white p-7 text-center shadow-soft">
          <h1 className="font-heading text-5xl leading-tight tracking-[0.02em] text-foreground md:text-5xl">
            ✨ ¡Elevemos tu marca!
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Configuraremos un motor visual exclusivo para tus productos. 📸
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            ⏱️ Solo te llevará 5 minutos.
          </p>
          <Button
            size="lg"
            className="mt-7 bg-[#D0F000] px-8 text-accent-foreground hover:bg-[#D0F000]/90"
            onClick={() => setHasStarted(true)}
          >
            Empezar cuestionario
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const questionTitleClass =
    currentQuestion.text.length <= 48
      ? "text-4xl md:text-5xl"
      : currentQuestion.text.length <= 88
        ? "text-3xl md:text-4xl"
        : "text-2xl md:text-3xl";

  if (isSubmitting) {
    const processingProgress = ((processingMessageIndex + 1) / PROCESSING_MESSAGES.length) * 100;

    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-xl text-center">
          <p className="font-heading text-sm tracking-[0.2em] text-[#1A1A1A]/60 uppercase">Procesando Estilo</p>

          <div className="mx-auto mt-5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]/10">
            <div
              className="h-full rounded-full bg-[#D0F000] transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>

          <div className="mx-auto mt-6 h-11 w-11 animate-spin rounded-full border-2 border-[#1A1A1A]/10 border-t-[#D0F000]" />

          <p
            className={`mt-7 font-heading text-2xl leading-tight tracking-[0.01em] text-[#1A1A1A] transition-opacity duration-300 md:text-3xl ${processingMessageVisible ? "opacity-100" : "opacity-0"
              }`}
          >
            {PROCESSING_MESSAGES[processingMessageIndex]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#FAFAFA]">
      <div className="h-2.5 w-full bg-primary/10">
        <div
          className="h-full bg-[#D0F000] shadow-[0_0_20px_rgba(208,240,0,0.45)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 w-full flex-col justify-between px-4 pt-3 md:px-6 md:pt-5">
        <header className="shrink-0 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/7 to-white px-3 py-3 shadow-soft md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground md:text-sm">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              Pregunta {Math.min(step + 1, visibleQuestions.length)} de {visibleQuestions.length}
            </span>
            <span className="rounded-full border border-primary/18 bg-white/85 px-2 py-1">{currentQuestion.category}</span>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col justify-center py-4 md:py-6">
          <div className="mb-6 md:mb-7">
            <h1 className={`font-heading leading-tight tracking-[0.012em] text-foreground ${questionTitleClass}`}>
              {currentQuestion.text}
            </h1>
            {currentQuestion.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base">{currentQuestion.description}</p>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-2">
            {currentQuestion.type === "single" ? (
              <div className="flex w-full flex-col gap-4 md:gap-5">
                {currentQuestion.options?.map((option, optionIndex) => {
                  const isSelected = answers[currentQuestion.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`group w-full rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 animate-fade-in md:px-5 md:py-3.5
                        ${isSelected
                          ? "border-[#D0F000] bg-[#D0F000]/12 shadow-soft"
                          : "border-primary/25 bg-white/75 hover:border-[#D0F000]"
                        }`}
                      style={{ animationDelay: `${optionIndex * 70}ms`, animationFillMode: "both" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm md:h-8 md:w-8 ${isSelected ? "border-[#D0F000]/80 bg-[#D0F000]/20" : "border-primary/20 bg-white"
                              }`}
                            aria-hidden
                          >
                            {option.icon}
                          </span>
                          <div>
                            <h3 className={`text-[15px] font-medium leading-snug md:text-base ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {option.label}
                            </h3>
                            {option.description ? (
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{option.description}</p>
                            ) : null}
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="rounded-full bg-[#D0F000] p-1 text-accent-foreground animate-in zoom-in" aria-hidden>
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-primary/25 bg-white/80 p-3 md:p-4">
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(event) => handleTextChange(event.target.value)}
                  placeholder={currentQuestion.placeholder || "Escribí tu respuesta..."}
                  className="h-32 w-full resize-none rounded-lg border border-primary/15 bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#D0F000] md:h-40 md:text-base"
                />
                {currentQuestion.optional ? <p className="mt-2 text-xs text-muted-foreground">Opcional</p> : null}
              </div>
            )}
          </div>
        </main>

        <footer className="sticky bottom-0 z-20 mt-auto shrink-0 border-t border-primary/12 bg-[#FAFAFA]/95 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0 || isSubmitting}
              className={step === 0 ? "invisible" : "h-10 px-3"}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Anterior
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={!canContinue() || isSubmitting}
              className="h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/92"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : step === visibleQuestions.length - 1 ? (
                <>
                  Finalizar
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
