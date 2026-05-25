import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import LegalPageLayout from "./LegalPageLayout";

const AboutUs = () => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <LegalPageLayout
      eyebrow="Sobre Polarist"
      title="¿Quiénes somos?"
      description="Somos un equipo efocado en eliminar la fricción entre la IA y los negocios tradicionales."
      showSecondaryGlow={false}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="mission" className="border-white/10">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              style={sequelStyle}
              className="flex flex-1 items-center justify-between gap-4 py-4 text-left text-xl font-semibold tracking-tight text-[#F6F6F6] transition-colors hover:text-[#CAFE5B] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180"
            >
              <span>Nuestra misión</span>
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
             Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico. Creamos Polarist para acercar herramientas útiles a negocios reales sin convertir la experiencia en una barrera técnica.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </LegalPageLayout>
  );
};

export default AboutUs;
