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
  return (
    <LegalPageLayout
      eyebrow="Condiciones"
      title="Términos y Condiciones"
      description="Estas condiciones regulan de manera general el uso de Polarist, incluyendo la navegación dentro de la aplicación y la participación en espacios de comunidad."
      showSecondaryGlow={false}
    >
      <div className="space-y-4">
        {termsSections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">
              {section.title}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground dark:text-white/72">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
};

export default TermsConditions;
