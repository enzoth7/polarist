import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

const TermsConditions = () => {
  return (
    <LegalPageLayout
      eyebrow="Condiciones"
      title="Términos y Condiciones"
      description="Estas condiciones regulan de manera general el uso de Polarist, incluyendo la navegación dentro de la aplicación y la participación en espacios de comunidad."
    >
      <div className="space-y-4">
        <LegalSection title="Uso de la plataforma">
          Polarist ofrece contenido, atajos, herramientas y espacios de exploración pensados para ayudar a dueños de negocios a ahorrar tiempo. El uso de la plataforma debe hacerse de forma responsable y conforme a la ley.
        </LegalSection>

        <LegalSection title="Cuenta e inicio de sesión">
          El usuario es responsable de la información que utiliza para iniciar sesión y del uso que se haga desde su cuenta. Debe mantener el control de sus accesos y avisar si detecta actividad no autorizada.
        </LegalSection>

        <LegalSection title="Contenido y comunidad">
          La comunidad debe usarse con respeto. No está permitido publicar contenido ofensivo, ilegal, engañoso o que perjudique a otros usuarios. Polarist podrá moderar o retirar contenido cuando sea necesario.
        </LegalSection>

        <LegalSection title="Limitación de responsabilidad">
          Polarist comparte información, herramientas y materiales de apoyo con fines prácticos, pero cada usuario debe evaluar si una recomendación encaja con su negocio antes de aplicarla.
        </LegalSection>

        <LegalSection title="Disponibilidad y cambios">
          La aplicación puede actualizar funciones, textos, contenidos o condiciones de uso en cualquier momento para mejorar la experiencia o cumplir requisitos técnicos y legales.
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
};

export default TermsConditions;
