import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LegalPageLayout from "./LegalPageLayout";

const privacySections = [
  {
    title: "Información que recopilamos",
    content:
      "Podemos recopilar datos básicos de acceso como nombre, correo electrónico y la información mínima necesaria para iniciar sesión y usar la aplicación. Si ingresas con un proveedor externo como Google, también podemos recibir los datos autorizados por ese inicio de sesión.",
  },
  {
    title: "Uso de cookies y datos de navegación",
    content:
      "Polarist puede usar cookies o tecnologías similares para mantener la sesión iniciada, recordar preferencias y mejorar la experiencia general de navegación dentro del sitio.",
  },
  {
    title: "Cómo usamos la información",
    content:
      "Usamos la información para permitir el acceso a la aplicación, mejorar el funcionamiento de la experiencia, ofrecer contenido relevante y mantener segura la cuenta del usuario.",
  },
  {
    title: "Almacenamiento y seguridad",
    content:
      "La información se almacena mediante servicios de infraestructura y autenticación, incluyendo Supabase, con medidas razonables de seguridad para proteger los datos contra accesos no autorizados, pérdidas o usos indeis.",
  },
  {
    title: "Comunidad y contenido compartido",
    content:
      "Si participas en espacios comunitarios, debes asumir que el contenido que publiques puede ser visible para otros usuarios dentro del entorno habilitado para la comunidad.",
  },
  {
    title: "Tus derechos",
    content:
      "Puedes solicitar actualizar o eliminar la información personal que hayas compartido con Polarist, dentro de lo razonablemente posible y conforme a las obligaciones legales aplicables.",
  },
] as const;

const PrivacyPolicy = () => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <LegalPageLayout
      eyebrow="Privacidad"
      title="Política de Privacidad"
      description="Esta política explica de forma general qué datos usamos, por qué los usamos y cómo cuidamos la información dentro de Polarist."
      showSecondaryGlow={false}
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        {privacySections.map((section, idx) => (
          <AccordionItem 
            key={section.title} 
            value={`item-${idx}`}
            className="border-white/10"
          >
            <AccordionTrigger 
              style={sequelStyle}
              className="text-xl font-semibold tracking-tight text-[#F6F6F6] hover:no-underline hover:text-[#CAFE5B] transition-colors"
            >
              {section.title}
            </AccordionTrigger>
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

export default PrivacyPolicy;
