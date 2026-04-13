import LegalPageLayout from "./LegalPageLayout";

const AboutUs = () => {
  return (
    <LegalPageLayout
      eyebrow="Sobre Polarist"
      title="¿Quiénes somos?"
      description="Creamos Polarist para acercar herramientas útiles a negocios reales sin convertir la experiencia en una barrera técnica."
      showSecondaryGlow={false}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">
          Nuestra misión
        </h2>
        <p className="text-sm leading-7 text-muted-foreground dark:text-white/72">
          Somos un equipo obsesionado con eliminar la fricción entre la IA y los negocios tradicionales. Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default AboutUs;
