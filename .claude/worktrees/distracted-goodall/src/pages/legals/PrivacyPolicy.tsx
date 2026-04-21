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
      "La información se almacena mediante servicios de infraestructura y autenticación, incluyendo Supabase, con medidas razonables de seguridad para proteger los datos contra accesos no autorizados, pérdidas o usos indebidos.",
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
  return (
    <LegalPageLayout
      eyebrow="Privacidad"
      title="Política de Privacidad"
      description="Esta política explica de forma general qué datos usamos, por qué los usamos y cómo cuidamos la información dentro de Polarist."
      showSecondaryGlow={false}
    >
      <div className="space-y-4">
        {privacySections.map((section) => (
          <section
            key={section.title}
            className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 shadow-[0_20px_34px_-28px_rgba(0,0,0,0.68)] backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06]"
          >
            <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-white/72">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
