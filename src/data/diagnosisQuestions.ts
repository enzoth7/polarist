export type Recommendation = 'formacion' | 'asesoria' | 'implementacion' | 'mix' | 'inicial' | 'intermedio' | 'avanzado';

export interface Option {
  value: string;
  label: string;
  score?: Partial<Record<Recommendation, number>>;
}

export interface DiagnosisQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi' | 'select' | 'text';
  options?: Option[];
  placeholder?: string;
  showIf?: (answers: Record<string, any>) => boolean;
}

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: 'user_type',
    question: '¿Buscás soluciones para potenciar tu [perfil] profesional o para tu empresa/equipo?',
    type: 'single',
    options: [
      { value: 'persona', label: 'Para mí (Profesional independiente / Freelance)', score: { asesoria: 3, formacion: 1 } },
      { value: 'empresa', label: 'Para mi empresa o equipo', score: { implementacion: 1, formacion: 1 } }
    ]
  },
  // ----------------------------------------------------
  // PREGUNTAS PARA PERSONA
  // ----------------------------------------------------
  {
    id: 'persona_profession',
    question: '¿A qué te [dedicás] hoy?',
    type: 'single',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'freelance', label: 'Soy freelance / profesional independiente', score: { asesoria: 2 } },
      { value: 'empleado', label: 'Trabajo en relación de dependencia', score: { formacion: 3 } },
      { value: 'emprendedor', label: 'Tengo mi propio proyecto o emprendimiento', score: { asesoria: 2 } }
    ]
  },
  {
    id: 'persona_industry',
    question: '¿En qué [área] o sector te desempeñás?',
    type: 'select',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'salud', label: 'Salud' },
      { value: 'legal', label: 'Legal' },
      { value: 'finanzas', label: 'Finanzas' },
      { value: 'marketing', label: 'Marketing y Ventas' },
      { value: 'it', label: 'Tecnología / IT' },
      { value: 'educacion', label: 'Educación' },
      { value: 'otro', label: 'Otro' }
    ]
  },
  {
    id: 'persona_education',
    question: '¿Cuál es tu nivel de [formación] técnica actual?',
    type: 'single',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'universitario', label: 'Universitario/Terciario' },
      { value: 'autodidacta', label: 'Autodidacta' },
      { value: 'cursos', label: 'Cursos cortos/Bootcamps' },
      { value: 'sin_tecnica', label: 'Sin formación técnica' }
    ]
  },
  {
    id: 'persona_tools',
    question: '¿Qué [herramientas] de trabajo usás a diario en tu compu?',
    type: 'multi',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'excel', label: 'Excel/Google Sheets' },
      { value: 'diseno', label: 'Diseño (Figma, Adobe)' },
      { value: 'crm', label: 'CRM / Gestión (Notion, Trello, HubSpot)' },
      { value: 'dev', label: 'Herramientas de desarrollo / código' },
      { value: 'ninguna', label: 'Ninguna en particular' }
    ]
  },
  {
    id: 'persona_ai_level',
    question: '¿Cómo venís con la [organización] tecnológica y la IA en tu día a día?',
    type: 'single',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'inicial', label: 'Nada, hago casi todo manual', score: { formacion: 3, asesoria: 1 } },
      { value: 'intermedio', label: 'Uso herramientas básicas o IA (ChatGPT) ocasionalmente', score: { formacion: 2, asesoria: 2 } },
      { value: 'avanzado', label: 'Tengo procesos armados y uso herramientas avanzadas a diario', score: { asesoria: 3, implementacion: 1 } },
      { value: 'experto', label: 'Automatizaciones complejas (Make/n8n/APIs)', score: { implementacion: 3, asesoria: 1 } }
    ]
  },
  {
    id: 'persona_ai_tools',
    question: '¿Qué [herramientas de IA] o automatización probaste?',
    type: 'multi',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'chatgpt', label: 'ChatGPT / Claude' },
      { value: 'midjourney', label: 'Generadores de imágenes o video' },
      { value: 'copilot', label: 'Asistentes de código (Copilot, Cursor)' },
      { value: 'zapier', label: 'Zapier / Make / n8n' },
      { value: 'ninguna', label: 'Ninguna' }
    ]
  },
  {
    id: 'persona_goal',
    question: '¿Qué estás [buscando] lograr mejorando tus procesos?',
    type: 'single',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'tiempo', label: 'Optimizar mi tiempo y dejar de apagar incendios', score: { implementacion: 2, asesoria: 1 } },
      { value: 'calidad', label: 'Mejorar la calidad y estructura de mi trabajo', score: { formacion: 2, asesoria: 1 } },
      { value: 'negocio', label: 'Crear un nuevo servicio o escalar mis ingresos', score: { asesoria: 3 } }
    ]
  },
  {
    id: 'persona_obstacle',
    question: '¿Cuál es tu mayor [traba] hoy para estructurarte mejor?',
    type: 'single',
    showIf: (a) => a.user_type === 'persona',
    options: [
      { value: 'tiempo', label: 'Falta de tiempo para frenar y organizar', score: { implementacion: 3 } },
      { value: 'herramientas', label: 'Hay demasiadas herramientas, no sé cuál elegir', score: { asesoria: 3, formacion: 1 } },
      { value: 'teoria', label: 'Me abruma la teoría técnica', score: { asesoria: 2, formacion: 2 } },
      { value: 'nicho', label: 'No veo cómo aplicarlo exactamente a mi rubro', score: { asesoria: 3 } }
    ]
  },

  // ----------------------------------------------------
  // PREGUNTAS PARA EMPRESA
  // ----------------------------------------------------
  {
    id: 'company_industry',
    question: '¿En qué [sector] o industria opera tu negocio?',
    type: 'select',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'salud', label: 'Salud' },
      { value: 'legal', label: 'Legal' },
      { value: 'finanzas', label: 'Finanzas' },
      { value: 'marketing', label: 'Marketing y Ventas' },
      { value: 'it', label: 'Tecnología / IT' },
      { value: 'educacion', label: 'Educación' },
      { value: 'otro', label: 'Otro' }
    ]
  },
  {
    id: 'company_size',
    question: '¿Cuántas [personas] forman parte del equipo?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: '1-10', label: 'Hasta 10 personas', score: { formacion: 3 } },
      { value: '11-50', label: 'Entre 11 y 50 personas', score: { implementacion: 2, mix: 1 } },
      { value: '50+', label: 'Más de 50 personas', score: { implementacion: 3 } }
    ]
  },
  {
    id: 'business_type',
    question: '¿Qué [ofrecen] principalmente?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'productos', label: 'Productos físicos o digitales', score: { implementacion: 1 } },
      { value: 'servicios', label: 'Servicios o consultoría', score: { formacion: 2 } },
      { value: 'ambos', label: 'Un mix de ambos', score: { mix: 1 } }
    ]
  },
  {
    id: 'infra',
    question: '¿Cómo [gestionan] la operación hoy? (Podés elegir varias)',
    type: 'multi',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'spreadsheets', label: 'Planillas (Excel, Google Sheets)', score: { formacion: 2, mix: 1 } },
      { value: 'crm_erp', label: 'CRM o ERP (HubSpot, Salesforce, SAP, etc.)', score: { implementacion: 3 } },
      { value: 'ecommerce', label: 'Plataforma de E-commerce (Shopify, Tiendanube)', score: { implementacion: 2 } },
      { value: 'custom', label: 'Software a medida', score: { implementacion: 3 } },
      { value: 'nada', label: 'Nada formal, todo manual o por WhatsApp', score: { formacion: 3 } }
    ]
  },
  {
    id: 'biggest_pain',
    question: 'Si tuvieras que elegir UN [dolor] principal hoy, ¿cuál sería?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'operativa', label: 'Demasiadas tareas operativas, manuales y repetitivas', score: { implementacion: 3, mix: 1 } },
      { value: 'atencion', label: 'Atención al cliente desbordada o lenta', score: { implementacion: 3 } },
      { value: 'estrategia', label: 'Falta de procesos claros y estrategia para escalar', score: { formacion: 3, mix: 1 } },
      { value: 'desconocimiento', label: 'Sabemos que necesitamos orden y tecnología pero no sabemos por dónde arrancar', score: { formacion: 3, mix: 2 } }
    ]
  },
  {
    id: 'ai_maturity',
    question: '¿Qué tan [estandarizados] o tecnificados están sus procesos diarios?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'nada', label: 'Nada, cada uno hace las cosas a su manera', score: { formacion: 3 } },
      { value: 'basico', label: 'Tenemos algunas herramientas sueltas o usamos IA para redactar', score: { formacion: 2, mix: 1 } },
      { value: 'avanzado', label: 'Ya tenemos automatizaciones y procesos bien definidos', score: { implementacion: 3 } }
    ]
  },
  {
    id: 'urgency',
    question: '¿Para cuándo [necesitan] ver impacto y resultados de esta mejora?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'ayer', label: 'Para ayer. El caos ya nos está costando plata.', score: { implementacion: 3, mix: 2 } },
      { value: 'corto', label: 'En los próximos 1 a 3 meses', score: { formacion: 2, mix: 1 } },
      { value: 'explorando', label: 'Estamos explorando opciones sin apuro', score: { formacion: 3 } }
    ]
  },
  {
    id: 'budget',
    question: 'Pensando en el retorno de inversión, ¿qué nivel de [presupuesto] tienen en mente?',
    type: 'single',
    showIf: (a) => a.user_type === 'empresa',
    options: [
      { value: 'low', label: 'Menos de $1.000 USD', score: { formacion: 3 } },
      { value: 'mid', label: 'Entre $1.000 y $5.000 USD', score: { formacion: 2, implementacion: 1, mix: 3 } },
      { value: 'high', label: 'Más de $5.000 USD', score: { implementacion: 4 } }
    ]
  }
];

export interface DiagnosisResult {
  primary: Recommendation;
  secondary?: Recommendation;
  explanation: string;
}

export function calculateRecommendation(answers: Record<string, any>): DiagnosisResult {
  const isPersona = answers['user_type'] === 'persona';

  const scores: Record<Recommendation, number> = {
    formacion: 0,
    asesoria: 0,
    implementacion: 0,
    mix: 0,
    inicial: 0,
    intermedio: 0,
    avanzado: 0
  };

  diagnosisQuestions.forEach((q) => {
    if (q.showIf && !q.showIf(answers)) return;
    const answer = answers[q.id];
    if (!answer) return;

    if (q.type === 'single' || q.type === 'select') {
      const option = q.options?.find(o => o.value === answer);
      if (option?.score) {
        Object.entries(option.score).forEach(([rec, points]) => {
          scores[rec as Recommendation] += (points as number);
        });
      }
    } else if (q.type === 'multi' && Array.isArray(answer)) {
      answer.forEach(val => {
        const option = q.options?.find(o => o.value === val);
        if (option?.score) {
          Object.entries(option.score).forEach(([rec, points]) => {
            scores[rec as Recommendation] += (points as number);
          });
        }
      });
    }
  });

  let primary: Recommendation = isPersona ? 'inicial' : 'formacion';
  let secondary: Recommendation | undefined = undefined;

  if (isPersona) {
    let level = answers.persona_ai_level;
    if (level === 'experto') level = 'avanzado';
    
    primary = ['inicial', 'intermedio', 'avanzado'].includes(level) ? (level as Recommendation) : 'inicial';
    
    const serviceScores = Object.entries(scores)
      .filter(([rec]) => ['asesoria', 'implementacion'].includes(rec))
      .sort((a, b) => b[1] - a[1])
      .filter(item => item[1] > 0);
      
    if (serviceScores.length > 0) {
      secondary = serviceScores[0][0] as Recommendation;
    } else {
      secondary = 'asesoria';
    }
  } else {
    // For companies, recommendations can only be 'formacion', 'implementacion' or 'mix'
    const companyScores = Object.entries(scores)
      .filter(([rec]) => ['formacion', 'implementacion', 'mix'].includes(rec))
      .sort((a, b) => b[1] - a[1])
      .filter(item => item[1] > 0);

    if (companyScores.length > 0) {
      primary = companyScores[0][0] as Recommendation;
      if (companyScores.length > 1) {
        secondary = companyScores[1][0] as Recommendation;
      }
    } else {
      primary = 'formacion';
    }

    if (primary === 'mix' && secondary) {
      primary = secondary;
      secondary = 'mix';
    } else if (companyScores.length > 1 && companyScores[0][1] - companyScores[1][1] <= 2) {
      if (primary !== 'mix' && secondary !== 'mix') {
        secondary = 'mix';
      }
    }
  }

  const explanation = generateExplanation(primary, secondary, answers);

  return {
    primary,
    secondary,
    explanation
  };
}

function generateExplanation(primary: Recommendation, secondary: Recommendation | undefined, answers: Record<string, any>): string {
  const isCompany = answers['user_type'] === 'empresa';
  
  if (!isCompany) {
    const aiLevel = primary;
    
    if (aiLevel === 'avanzado') {
      return "Notamos que ya dominás las herramientas tecnológicas y tenés un nivel avanzado de automatización u organización. Posiblemente no necesites nuestros servicios estándar de base. De todas formas, nos vamos a poner en contacto para charlar y ver si realmente hay una oportunidad de trabajo conjunto para potenciar lo que ya tenés armado, sin hacerte perder el tiempo.";
    }

    let levelText = '';
    if (aiLevel === 'inicial') {
      levelText = "Tenés un nivel inicial en la sistematización de tu trabajo. Estás en el punto de partida perfecto para empezar a delegar tareas repetitivas y ganar tiempo para lo que verdaderamente aporta valor.";
    } else if (aiLevel === 'intermedio') {
      levelText = "Tenés un nivel intermedio de organización y tecnología. Ya usás algunas herramientas sueltas, pero te falta ese salto para estructurar procesos reales y conectar las piezas para que tu día a día fluya mejor.";
    } else {
      levelText = "Estás en un momento clave para ordenar tu operativa y potenciar tu perfil profesional.";
    }

    const service = secondary || 'asesoria';

    if (service === 'asesoria') {
      return `${levelText} La Asesoría 1:1 es el paso ideal para vos. Vamos a sentarnos a ver tus cuellos de botella y armarte un plan de acción directo al grano para estructurarte mejor, sin dar vueltas.`;
    }

    if (service === 'implementacion') {
      return `${levelText} Por lo que nos contás, necesitás sacarte de encima urgencias operativas. Una implementación técnica te ayudaría a conectar tus herramientas y automatizar el flujo de trabajo de forma directa.`;
    }

    return `${levelText} Viendo tus respuestas, lo mejor sería arrancar con una asesoría estratégica para ordenarte y armar un mapa de ruta personalizado a tu realidad.`;
  }

  // Textos para empresa
  if (primary === 'implementacion') {
    return "Por el volumen de operación y el dolor principal que nos comentás, el equipo se vería muy beneficiado con una implementación a medida. Armar flujos de trabajo inteligentes, conectar sus sistemas o integrar automatizaciones les va a devolver horas y permitir escalar sin contratar a ciegas.";
  }
  
  if (primary === 'formacion') {
    return "Viendo la etapa en la que se encuentran y la necesidad de estandarizar procesos, la ruta más sólida es una Formación. Hacemos un diagnóstico 360° de su operativa y capacitamos al equipo para que incorporen estructura y tecnología en su día a día, logrando autonomía sin depender siempre de externos.";
  }

  return "Viendo sus respuestas, lo ideal sería un enfoque híbrido (Mix): arrancar con un diagnóstico y formación estratégica para alinear al equipo, y luego evaluar si avanzamos con una implementación técnica específica para destrabar los cuellos de botella más grandes.";
}
