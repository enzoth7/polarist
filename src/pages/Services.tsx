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
        className="z-10 w-full max-w-5xl flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1
            className="mb-4"
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
          <p
            className="mx-auto max-w-2xl"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "clamp(16px, 2vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(246,246,246,0.5)",
            }}
          >
            Implementamos IA y automatizaciones reales para que tu negocio rinda más, con menos esfuerzo.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-16">
          {/* Card: Soluciones */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col rounded-3xl p-10 lg:p-14 shadow-2xl transition-transform hover:-translate-y-2"
            style={{ backgroundColor: "#F6F6F6" }}
          >
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(32px, 5vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#010101",
              }}
            >
              Soluciones
            </h2>
            <ul className="flex flex-col gap-8 flex-1 justify-center">
              <li className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#010101]" />
                <p
                  style={{
                    fontFamily: "var(--font-sequel, sans-serif)",
                    fontSize: "clamp(18px, 2.5vw, 22px)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#010101",
                  }}
                >
                  <strong className="font-bold">Automatización</strong> inteligente de los procesos
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#010101]" />
                <p
                  style={{
                    fontFamily: "var(--font-sequel, sans-serif)",
                    fontSize: "clamp(18px, 2.5vw, 22px)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#010101",
                  }}
                >
                  <strong className="font-bold">Chatbots avanzados</strong> que interactúan, ejecutan y califican
                </p>
              </li>
            </ul>
          </motion.div>

          {/* Card: Asesorías */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col rounded-3xl p-10 lg:p-14 shadow-[0_0_60px_rgba(202,254,91,0.15)] transition-transform hover:-translate-y-2"
            style={{ backgroundColor: "#CAFE5B" }}
          >
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: "var(--font-sequel, sans-serif)",
                fontSize: "clamp(32px, 5vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#010101",
              }}
            >
              Asesorías
            </h2>
            <ul className="flex flex-col gap-8 flex-1 justify-center">
              <li className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#010101]" />
                <p
                  style={{
                    fontFamily: "var(--font-sequel, sans-serif)",
                    fontSize: "clamp(18px, 2.5vw, 22px)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#010101",
                  }}
                >
                  <strong className="font-bold">Potenciar el trabajo humano</strong> para rendir más y ahorrar tiempo
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#010101]" />
                <p
                  style={{
                    fontFamily: "var(--font-sequel, sans-serif)",
                    fontSize: "clamp(18px, 2.5vw, 22px)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#010101",
                  }}
                >
                  <strong className="font-bold">Empezar a usar</strong> estas nuevas tecnologías sin fricción
                </p>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-24 flex flex-col items-center text-center max-w-4xl px-4 mt-8">
          <h3 
            className="mb-12 text-4xl md:text-5xl lg:text-6xl font-normal tracking-normal text-[#F6F6F6]"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Criterio y responsabilidad
          </h3>
          <p 
            className="text-[17px] md:text-[20px] leading-relaxed text-[#F6F6F6]/70 font-light max-w-3xl"
            style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
          >
            No buscamos implementar Inteligencia Artificail en todos los lados ya que creemos que <strong className="text-[#F6F6F6] font-semibold">el criterio humano es muy importante</strong>. Queremos potenciar las habilidades se puedan potenciar las habilidades humanas y que las empresas pueda obtener un beneficio mucho más tangible y real.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <ShinyButton
            asChild
            className="inline-flex px-12 py-5 text-[17px] font-bold tracking-[0.5px] no-underline"
            style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
          >
            <Link to={routes.contact}>Contáctanos</Link>
          </ShinyButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
