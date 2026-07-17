import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShinyButton } from "@/components/ui/shiny-button";
import { routes } from "@/lib/routes";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

const Services = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 md:pt-40 pb-24"
      style={{ backgroundColor: "#010101" }}
    >
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 bg-grid-white/[0.02] pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full blur-[140px]"
        style={{ backgroundColor: "rgba(202,254,91,0.03)" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-[1400px] flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 flex flex-col items-center max-w-4xl px-4 mx-auto">
          <h1
            className="mb-8"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "clamp(40px, 8vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              color: "#F6F6F6",
            }}
          >
            Servicios a tu medida
          </h1>

          <h3
            className="mb-8 text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-[#8B5BF5]"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Criterio y responsabilidad
          </h3>
          <p
            className="text-[17px] md:text-[20px] leading-relaxed text-[#F6F6F6]/70 font-light max-w-3xl"
            style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
          >
            No buscamos implementar Inteligencia Artificial en todos los lados ya que creemos que <strong className="text-[#F6F6F6] font-semibold">el criterio humano es muy importante</strong>. Queremos potenciar las habilidades humanas y que las empresas puedan obtener un beneficio mucho más tangible y real.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-24 relative">

          {/* Card: Soluciones — violeta */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group flex flex-col rounded-[2rem] p-8 lg:p-10 border border-[#8B5BF5]/20 shadow-2xl hover:border-[#8B5BF5]/60 hover:shadow-[0_0_40px_rgba(139,91,245,0.15)]"
            style={{ backgroundColor: "transparent" }}
          >
            <h2
              className="text-center"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(32px, 5vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#F6F6F6",
                minHeight: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
              }}
            >
              Soluciones
            </h2>
            <ul className="flex flex-col gap-10 flex-1 justify-start">
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#8B5BF5] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#F6F6F6" }}>
                  <strong className="font-bold text-[#8B5BF5]">Automatización</strong> inteligente de los procesos
                </p>
              </li>
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#8B5BF5] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#F6F6F6" }}>
                  <strong className="font-bold text-[#8B5BF5]">Agentes Conversacionales</strong> que interactúan, ejecutan y califican
                </p>
              </li>
            </ul>
          </motion.div>

          {/* Card: Asesorías — fondo blanco */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group flex flex-col rounded-[2rem] p-8 lg:p-10 border border-transparent shadow-2xl hover:shadow-[0_0_40px_rgba(246,246,246,0.12)]"
            style={{ backgroundColor: "#F6F6F6" }}
          >
            <h2
              className="text-center"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(32px, 5vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#010101",
                minHeight: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
              }}
            >
              Asesorías
            </h2>
            <ul className="flex flex-col gap-10 flex-1 justify-start">
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#010101] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#010101" }}>
                  <strong className="font-bold text-[#010101]">Potenciar el trabajo humano</strong> para rendir más y ahorrar tiempo
                </p>
              </li>
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#010101] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#010101" }}>
                  <strong className="font-bold text-[#010101]">Empezar a usar</strong> estas nuevas tecnologías sin fricción
                </p>
              </li>
            </ul>
          </motion.div>

          {/* Card: Formaciones — verde */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group flex flex-col rounded-[2rem] p-8 lg:p-10 border border-[#CAFE5B]/20 shadow-2xl hover:border-[#CAFE5B]/60 hover:shadow-[0_0_40px_rgba(202,254,91,0.12)]"
            style={{ backgroundColor: "transparent" }}
          >
            <h2
              className="text-center"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(32px, 5vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#F6F6F6",
                minHeight: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
              }}
            >
              Formaciones
            </h2>
            <ul className="flex flex-col gap-10 flex-1 justify-start">
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#CAFE5B] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#F6F6F6" }}>
                  <strong className="font-bold text-[#CAFE5B]">Equipos de hasta 10 personas</strong> que quieren adoptar IA sin fricción
                </p>
              </li>
              <li className="flex items-start gap-5">
                <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#CAFE5B] group-hover:scale-110 transition-transform" />
                <p style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, lineHeight: 1.4, color: "#F6F6F6" }}>
                  <strong className="font-bold text-[#CAFE5B]">Diagnóstico 360°</strong> de operaciones y marketing para escalar
                </p>
              </li>
            </ul>
          </motion.div>
        </div>


        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 mt-8">
          <div className="text-center px-4">
            <h3
              className="mb-8 md:whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-2px",
                lineHeight: 1.1,
                color: "#F6F6F6",
              }}
            >
              ¿Querés ver cómo te <span className="block md:inline">podemos ayudar?</span>
            </h3>
            <p
              className="text-[17px] md:text-[20px] leading-relaxed text-[#F6F6F6]/70 font-light max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
            >
              Descubrí en minutos cuál es el estado actual de tu empresa y qué oportunidades concretas de IA podemos activar para vos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full sm:w-auto">
            <ShinyButton
              asChild
              className="inline-flex w-full sm:w-auto justify-center px-10 py-5 text-[17px] font-bold tracking-[0.5px] no-underline"
              style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
            >
              <Link to={routes.appDiagnosis}>
                Hacer el diagnóstico de mi empresa
              </Link>
            </ShinyButton>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
