import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      eyebrow="Privacidad"
      title="Política de Privacidad"
      description="Esta política explica de forma general qué datos usamos, por qué los usamos y cómo cuidamos la información dentro de Polarist."
    >
      <div className="space-y-4">
        <LegalSection title="Información que recopilamos">
          Podemos recopilar datos básicos de acceso como nombre, correo electrónico y la información mínima necesaria para iniciar sesión y usar la aplicación. Si ingresas con un proveedor externo como Google, también podemos recibir los datos autorizados por ese inicio de sesión.
        </LegalSection>

        <LegalSection title="Uso de cookies y datos de navegación">
          Polarist puede usar cookies o tecnologías similares para mantener la sesión iniciada, recordar preferencias y mejorar la experiencia general de navegación dentro del sitio.
        </LegalSection>

        <LegalSection title="Cómo usamos la información">
          Usamos la información para permitir el acceso a la aplicación, mejorar el funcionamiento de la experiencia, ofrecer contenido relevante y mantener segura la cuenta del usuario.
        </LegalSection>

        <LegalSection title="Almacenamiento y seguridad">
          La información se almacena mediante servicios de infraestructura y autenticación, incluyendo Supabase, con medidas razonables de seguridad para proteger los datos contra accesos no autorizados, pérdidas o usos indebidos.
        </LegalSection>

        <LegalSection title="Comunidad y contenido compartido">
          Si participas en espacios comunitarios, debes asumir que el contenido que publiques puede ser visible para otros usuarios dentro del entorno habilitado para la comunidad.
        </LegalSection>

        <LegalSection title="Tus derechos">
          Puedes solicitar actualizar o eliminar la información personal que hayas compartido con Polarist, dentro de lo razonablemente posible y conforme a las obligaciones legales aplicables.
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
