import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LegalPageLayout from "./LegalPageLayout";

const AboutUs = () => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <LegalPageLayout
      eyebrow="Sobre Polarist"
      title="¿Quiénes somos?"
      description="Creamos Polarist para acercar herramientas útiles a negocios reales sin convertir la experiencia en una barrera técnica."
      showSecondaryGlow={false}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="mission" className="border-white/10">
          <AccordionTrigger 
            style={sequelStyle}
            className="text-xl font-semibold tracking-tight text-[#F6F6F6] hover:no-underline hover:text-[#CAFE5B] transition-colors"
          >
            Nuestra misión
          </AccordionTrigger>
          <AccordionContent 
            style={sequelStyle}
            className="text-sm leading-7 text-[#F6F6F6]/70 font-normal"
          >
            Somos un equipo obsesionado con eliminar la fricción entre la IA y los negocios tradicionales. Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </LegalPageLayout>
  );
};

export default AboutUs;
