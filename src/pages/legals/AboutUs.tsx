import LegalPageLayout from "./LegalPageLayout";

const AboutUs = () => {
  return (
    <LegalPageLayout
      eyebrow="Sobre Polarist"
      title="¿Quiénes somos?"
      description="Creamos Polarist para acercar herramientas útiles a negocios reales sin convertir la experiencia en una barrera técnica."
      showSecondaryGlow={false}
    >
      <div className="space-y-4">
        <section className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 shadow-[0_20px_34px_-28px_rgba(0,0,0,0.68)] backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06]">
          <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">
            Nuestra misión
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-white/72">
            Somos un equipo obsesionado con eliminar la fricción entre la IA y los negocios tradicionales. Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default AboutUs;
