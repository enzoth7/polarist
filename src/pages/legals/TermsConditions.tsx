import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import LegalPageLayout from "./LegalPageLayout";

const termsSections = [
  {
    title: "Uso de la plataforma",
    content:
      "Polarist ofrece contenido, atajos, herramientas y espacios de exploración pensados para ayudar a dueños de negocios a ahorrar tiempo. El uso de la plataforma debe hacerse de forma responsable y conforme a la ley.",
  },
  {
    title: "Cuenta e inicio de sesión",
    content:
      "El usuario es responsable de la información que utiliza para iniciar sesión y del uso que se haga desde su cuenta. Debe mantener el control de sus accesos y avisar si detecta actividad no autorizada.",
  },
  {
    title: "Contenido y comunidad",
    content:
      "La comunidad debe usarse con respeto. No está permitido publicar contenido ofensivo, ilegal, engañoso o que perjudique a otros usuarios. Polarist podrá moderar o retirar contenido cuando sea necesario.",
  },
  {
    title: "Limitación de responsabilidad",
    content:
      "Polarist comparte información, herramientas y materiales de apoyo con fines prácticos, pero cada usuario debe evaluar si una recomendación encaja con su negocio antes de aplicarla.",
  },
  {
    title: "Disponibilidad y cambios",
    content:
      "La aplicación puede actualizar funciones, textos, contenidos o condiciones de uso en cualquier momento para mejorar la experiencia o cumplir requisitos técnicos y legales.",
  },
] as const;

const TermsConditions = () => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <LegalPageLayout
      eyebrow="Condiciones"
      title="Términos y Condiciones"
      description="Estas condiciones regulan de manera general el uso de Polarist, incluyendo la navegación dentro de la aplicación y la participación en espacios de comunidad."
      showSecondaryGlow={false}
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        {termsSections.map((section, idx) => (
          <AccordionItem 
            key={section.title} 
            value={`item-${idx}`}
            className="border-white/10"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                style={sequelStyle}
                className="flex flex-1 items-center justify-between gap-4 py-4 text-left text-xl font-semibold tracking-tight text-[#F6F6F6] transition-colors hover:text-[#CAFE5B] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180"
              >
                <span>{section.title}</span>
                <Plus
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 opacity-70 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent 
              style={sequelStyle}
              className="text-sm leading-7 text-[#F6F6F6]/70 font-normal"
            >
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LegalPageLayout>
  );
};

export default TermsConditions;
