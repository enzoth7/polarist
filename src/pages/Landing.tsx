import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import InferenceGlobeHero from "@/components/landing/InferenceGlobeHero";
import { routes } from "@/lib/routes";
import { FinalCTA } from "@/components/layout/FinalCTA";

gsap.registerPlugin(ScrollTrigger);

const featureBlocks = [
  {
    title: "Automatizá lo repetitivo",
    description:
      "Dejá que la IA se encargue de las tareas que te roban tiempo. Configuralo una vez, olvidate para siempre.",
    imgUrl: "/images/placeholders/feat_automatiza_1776045412125.png",
    tag: "Automatización",
  },
  {
    title: "Decisiones con datos reales",
    description:
      "Accedé a insights en tiempo real que te ayudan a tomar mejores decisiones para tu negocio.",
    imgUrl: "/images/placeholders/feat_datos_1776045426648.png",
    tag: "Analytics",
  },
  {
    title: "Todo integrado en un lugar",
    description:
      "Herramientas, tendencias y recursos conectados. Sin saltar entre plataformas.",
    imgUrl: "/images/placeholders/feat_integrado_1776045444997.png",
    tag: "Integración",
  },
] as const;

const problemBlocks = [
  {
    title: "Perdés horas en tareas manuales",
    description:
      "Copiar datos de un lado a otro, enviar los mismos mails, actualizar planillas. Tu tiempo vale más que eso.",
    imgUrl: "/images/placeholders/landing_prob_1_1776044770643.png",
    tag: "Organización",
    stat: "14 hrs"
  },
  {
    title: "Tus datos están dispersos y desconectados",
    description:
      "Tenés información en 10 plataformas distintas y no podés cruzar nada. Las decisiones se toman a ciegas.",
    imgUrl: "/images/placeholders/landing_prob_2_1776044784698.png",
    tag: "Procesos",
    stat: "60% Riesgo"
  },
  {
    title: "La IA parece compleja e inaccesible",
    description:
      "Sabés que la inteligencia artificial puede ayudarte, pero no sabés por dónde empezar ni cómo aplicarla.",
    imgUrl: "/images/placeholders/landing_prob_3_1776044798647.png",
    tag: "Adopción",
    stat: "Barrera AI"
  },
  {
    title: "No tenés visibilidad de lo que funciona",
    description:
      "Publicás, invertís, ejecutás. Pero sin métricas claras, no sabés qué está generando resultados y qué no.",
    imgUrl: "/images/placeholders/landing_prob_1_1776044770643.png",
    tag: "Visibilidad",
    stat: "Sin métricas"
  },
] as const;

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          pin: true,
          pinSpacing: false,
          start: "top top",
          end: "bottom top",
        });
      }

      if (videoSectionRef.current) {
        gsap.from(".solutions-grid", {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: 1,
          },
          scale: 0.7,
          y: 150,
          rotateX: 15,
          opacity: 0,
          ease: "none",
          transformOrigin: "center bottom",
        });

        const cardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 45%",
            once: true,
          },
        });

        cardsTl
          .from(".feature-card", {
            opacity: 0,
            y: 80,
            scale: 0.8,
            filter: "blur(10px)",
            duration: 0.3,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "opacity,transform,filter",
          })
          .from(
            ".feature-title",
            {
              opacity: 0,
              y: 20,
              scale: 0.95,
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.8",
          )
          .from(
            ".feature-desc",
            {
              opacity: 0,
              y: 15,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.5",
          );
      }

      if (problemsSectionRef.current) {
        // Título "¿Te suena familiar?" — bidireccional
        gsap.from(".section-title", {
          scrollTrigger: {
            trigger: problemsSectionRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        // Título "Las soluciones" — una sola vez
        gsap.from(".solutions-title", {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 85%",
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        // Cards columna izquierda: entran y salen por la izquierda
        gsap.utils.toArray<HTMLElement>(".problem-left").forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
            x: -100,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          });
        });

        // Cards columna derecha: entran y salen por la derecha
        gsap.utils.toArray<HTMLElement>(".problem-right").forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
            x: 100,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          });
        });
      }

      // ─── Sección comparativa ¿Por qué Polarist? ───────────────────
      const whySection = document.querySelector(".why-section");
      if (whySection) {
        // Título "¿Por qué usar Polarist?" — una sola vez
        gsap.from(".why-title", {
          scrollTrigger: {
            trigger: ".why-section",
            start: "top 85%",
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.from(".why-left", {
          scrollTrigger: {
            trigger: ".why-section",
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        gsap.from(".why-right", {
          scrollTrigger: {
            trigger: ".why-section",
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="w-full bg-background">
      <div className="relative z-10">
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-background"
        >
          <div className="relative z-10 w-full">
            <InferenceGlobeHero />
          </div>
        </section>
      </div>

      <div ref={problemsSectionRef} className="relative z-[15] bg-[#F0F2F6] px-6 py-20 sm:px-10 lg:px-20">
        {/* Título centrado, grande */}
        <div className="mx-auto max-w-[1200px] mb-14 text-center">
          <h2 className="section-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-none">
            ¿Te suena familiar?
          </h2>
        </div>

        {/* Desktop: masonry offset — columna derecha desplazada abajo */}
        <div className="mx-auto max-w-[1200px] hidden sm:flex gap-5 items-start">
          {/* Columna Izquierda: problemas 1 y 3 */}
          <div className="flex flex-col gap-5 flex-1">
            {([problemBlocks[0], problemBlocks[2]] as const).map((problem, i) => (
              <div key={problem.title} className="problem-left flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/70">
                <div className="relative h-52 overflow-hidden bg-[#F8F9FB]">
                  <img src={(problem as any).imgUrl} alt={problem.title} className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-zinc-600 border border-zinc-200/60">{(problem as any).tag}</span>
                </div>
                <div className="flex flex-col flex-1 p-7 -mt-4 relative z-10 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Problema {i === 0 ? 1 : 3}</span>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 mb-3 leading-tight">{problem.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 font-medium flex-1">{problem.description}</p>
                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-[12px] font-bold text-zinc-700">Pérdida estimada: {(problem as any).stat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Columna Derecha: problemas 2 y 4 — desplazada hacia abajo */}
          <div className="flex flex-col gap-5 flex-1 mt-20">
            {([problemBlocks[1], problemBlocks[3]] as const).map((problem, i) => (
              <div key={problem.title} className="problem-right flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/70">
                <div className="relative h-52 overflow-hidden bg-[#F8F9FB]">
                  <img src={(problem as any).imgUrl} alt={problem.title} className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-zinc-600 border border-zinc-200/60">{(problem as any).tag}</span>
                </div>
                <div className="flex flex-col flex-1 p-7 -mt-4 relative z-10 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Problema {i === 0 ? 2 : 4}</span>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 mb-3 leading-tight">{problem.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 font-medium flex-1">{problem.description}</p>
                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-[12px] font-bold text-zinc-700">Pérdida estimada: {(problem as any).stat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Móvil: columna única */}
        <div className="mx-auto max-w-[600px] flex flex-col sm:hidden gap-5">
          {problemBlocks.map((problem, index) => (
            <div key={problem.title} className="problem-item flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/70">
              <div className="relative h-52 overflow-hidden bg-[#F8F9FB]">
                <img src={(problem as any).imgUrl} alt={problem.title} className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-zinc-600 border border-zinc-200/60">{(problem as any).tag}</span>
              </div>
              <div className="flex flex-col flex-1 p-7 -mt-4 relative z-10 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Problema {index + 1}</span>
                <h3 className="text-xl font-black tracking-tight text-zinc-900 mb-3 leading-tight">{problem.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 font-medium flex-1">{problem.description}</p>
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-[12px] font-bold text-zinc-700">Pérdida estimada: {(problem as any).stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={videoSectionRef}
        className="relative z-20 overflow-hidden bg-background"
        style={{ perspective: "1200px" }}
      >
        <section className="relative z-20 flex w-full flex-col items-center justify-center bg-[#F0F2F6] px-6 py-20 sm:px-10 lg:px-16">
          {/* Título sección soluciones */}
          <div className="w-full max-w-[95vw] xl:max-w-[85vw] mb-10 text-center">
            <h2 className="solutions-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900">Las soluciones</h2>
          </div>
          <div className="solutions-grid grid w-full max-w-[95vw] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6 xl:max-w-[85vw]">
            {featureBlocks.map((block) => (
              <div
                key={block.title}
                className="feature-card flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.04)] border border-white group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]"
              >
                {/* Image Area */}
                <div className="relative h-52 overflow-hidden bg-[#F8F9FB]">
                  <img
                    src={(block as any).imgUrl}
                    alt={block.title}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {(block as any).tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Content Area */}
                <div className="p-7 -mt-6 relative z-10 bg-white flex flex-col flex-1">
                  <h2 className="feature-title text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl mb-3">
                    {block.title}
                  </h2>
                  <p className="feature-desc text-sm leading-relaxed text-zinc-500 font-medium">
                    {block.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── SECCIÓN COMPARATIVA ─────────────────────────────────────── */}
      <section className="why-section relative z-30 w-full bg-[#F0F2F6] px-6 py-20 sm:px-10 lg:px-20">
        {/* Título */}
        <div className="mx-auto max-w-[1200px] mb-16 text-center">
          <h2 className="why-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-none">
            ¿Por qué usar Polarist?
          </h2>
        </div>

        {/* Columnas */}
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sin Polarist */}
          <div className="why-left flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/70 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-lg shrink-0">✕</span>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">Sin usar Polarist</h3>
            </div>
            <ul className="flex flex-col gap-5">
              {[
                "Horas perdidas en tareas repetitivas que podrías automatizar",
                "Decisiones tomadas a ciegas, sin datos ni métricas reales",
                "10 herramientas de IA sueltas que no hablán entre sí",
                "Curva de aprendizaje larga y frustrante con la tecnología",
                "Competidores más ágiles que avanzan mientras vos te quedás",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold">✕</span>
                  <span className="text-sm font-medium leading-relaxed text-zinc-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con Polarist */}
          <div className="why-right flex flex-col bg-[#111113] rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ccff00]/20 text-lg shrink-0">✓</span>
              <h3 className="text-2xl font-black tracking-tight text-white">Con Polarist</h3>
            </div>
            <ul className="flex flex-col gap-5">
              {[
                "Automatizás procesos y recuperás horas reales de tu semana",
                "Tomás decisiones informadas con datos centralizados",
                "Acceso simple y curado a las mejores herramientas de IA",
                "Aprendés a aplicar IA en minutos, no en meses",
                "Adelantás a tu competencia con tecnología que trabaja para vos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#ccff00]/20 flex items-center justify-center text-[#ccff00] text-xs font-bold">✓</span>
                  <span className="text-sm font-medium leading-relaxed text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL OSCURO ─────────────────────────────────────────── */}
      <FinalCTA />
    </div>
  );
};

export default Landing;
