import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

const AboutUs = () => {
  return (
    <LegalPageLayout
      eyebrow="Sobre Polarist"
      title="¿Quiénes somos?"
      description="Creamos Polarist para acercar herramientas útiles a negocios reales sin convertir la experiencia en una barrera técnica."
    >
      <div className="space-y-4">
        <LegalSection title="Nuestra misión">
          Somos un equipo obsesionado con eliminar la fricción entre la IA y los negocios tradicionales. Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico.
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
};

export default AboutUs;
