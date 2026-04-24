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

/* ── Estilos Brand Kit inline ── */
const bk = {
  fontSans: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif",
  fontSerif: "'Arno Pro', Georgia, serif",
  green: '#CAFE5B',
  black: '#010101',
  white: '#F6F6F6',
  pureWhite: '#FFFFFF',
  rLg: '24px',
  rPill: '999px',
};

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

        gsap.utils.toArray<HTMLElement>(".problem-row").forEach((row, i) => {
          const isEven = i % 2 === 0;
          gsap.from(row, {
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
            x: isEven ? -80 : 80,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          });
        });
      }

      const whySection = document.querySelector(".why-section");
      if (whySection) {
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
    <div ref={containerRef} className="w-full" style={{ background: bk.black }}>
      <div className="relative z-10">
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden"
          style={{ background: bk.black }}
        >
          <div className="relative z-10 w-full">
            <InferenceGlobeHero />
          </div>
        </section>
      </div>

      {/* ─── PROBLEMAS ─── */}
      <div ref={problemsSectionRef} className="relative z-[15] px-6 py-24 sm:px-10 lg:px-20" style={{ background: bk.pureWhite }}>
        <div className="mx-auto max-w-[1200px] mb-14 text-center">
          <h2
            className="section-title leading-none"
            style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: bk.black }}
          >
            ¿Te suena familiar?
          </h2>
        </div>

        {/* Filas alternadas (Full Width layout) */}
        <div className="mx-auto max-w-[1200px] flex flex-col gap-24 sm:gap-32 mt-10">
          {problemBlocks.map((problem, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={problem.title} 
                className={`problem-row flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16 w-full`}
              >
                {/* Contenedor de la Imagen */}
                <div className="flex-1 w-full max-w-[600px] overflow-hidden" style={{ borderRadius: bk.rLg, boxShadow: '0 20px 40px rgba(1,1,1,0.06)' }}>
                  <div className="relative aspect-[4/3] w-full" style={{ background: '#F8F9FB' }}>
                    <img src={(problem as any).imgUrl} alt={problem.title} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                  </div>
                </div>

                {/* Contenido (Fuera del contenedor de la imagen) */}
                <div className="flex-1 flex flex-col items-start text-left w-full justify-center">
                  <h3 style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-1px', lineHeight: 1.15, color: bk.black, marginBottom: '20px' }}>
                    {problem.title}
                  </h3>
                  <p style={{ fontFamily: bk.fontSans, fontWeight: 400, fontSize: '18px', lineHeight: 1.6, color: 'rgba(1,1,1,0.6)' }}>
                    {problem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SOLUCIONES ─── */}
      <div
        ref={videoSectionRef}
        className="relative z-20 overflow-hidden"
        style={{ perspective: "1200px", background: bk.black }}
      >
        <section className="relative z-20 flex w-full flex-col items-center justify-center px-6 py-24 sm:px-10 lg:px-16" style={{ background: bk.black }}>
          <div className="w-full max-w-[95vw] xl:max-w-[85vw] mb-14 text-center">
            <h2
              className="solutions-title"
              style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: bk.pureWhite }}
            >
              Las soluciones
            </h2>
          </div>
          <div className="solutions-grid grid w-full max-w-[95vw] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6 xl:max-w-[85vw]">
            {featureBlocks.map((block) => (
              <div
                key={block.title}
                className="feature-card flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: bk.rLg,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6)'; e.currentTarget.style.borderColor = `rgba(202,254,91,0.3)`; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div className="relative h-52 overflow-hidden" style={{ background: '#111' }}>
                  <img
                    src={(block as any).imgUrl}
                    alt={block.title}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to top, rgba(16,16,16,1), transparent)` }} />
                </div>
                <div className="p-7 -mt-6 relative z-10 flex flex-col flex-1" style={{ background: 'transparent' }}>
                  <h2
                    className="feature-title mb-3"
                    style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1.2, color: bk.pureWhite }}
                  >
                    {block.title}
                  </h2>
                  <p
                    className="feature-desc"
                    style={{ fontFamily: bk.fontSans, fontWeight: 400, fontSize: '14px', lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}
                  >
                    {block.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── SECCIÓN COMPARATIVA ─── */}
      <section className="why-section relative z-30 w-full px-6 py-24 sm:px-10 lg:px-20" style={{ background: bk.white }}>
        <div className="mx-auto max-w-[1200px] mb-16 text-center">
          <h2
            className="why-title leading-none"
            style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: bk.black }}
          >
            ¿Por qué usar Polarist?
          </h2>
        </div>

        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sin Polarist */}
          <div className="why-left flex flex-col overflow-hidden p-8 md:p-10" style={{ background: bk.pureWhite, borderRadius: bk.rLg, border: '1px solid rgba(1,1,1,0.06)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center shrink-0" style={{ borderRadius: '50%', background: 'rgba(1,1,1,0.06)', fontSize: '16px' }}>✕</div>
              <h3 style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', color: bk.black }}>Sin usar Polarist</h3>
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
                  <div className="mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center" style={{ borderRadius: '50%', background: 'rgba(1,1,1,0.06)', color: 'rgba(1,1,1,0.35)', fontSize: '10px', fontWeight: 700 }}>✕</div>
                  <div style={{ fontFamily: bk.fontSans, fontWeight: 400, fontSize: '14px', lineHeight: 1.65, color: 'rgba(1,1,1,0.55)' }}>{item}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Con Polarist */}
          <div className="why-right flex flex-col overflow-hidden p-8 md:p-10" style={{ background: bk.black, borderRadius: bk.rLg, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center shrink-0" style={{ borderRadius: '50%', background: 'rgba(202,254,91,0.2)', fontSize: '16px', color: bk.green }}>✓</div>
              <h3 style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', color: bk.white }}>Con Polarist</h3>
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
                  <div className="mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center" style={{ borderRadius: '50%', background: 'rgba(202,254,91,0.2)', color: bk.green, fontSize: '10px', fontWeight: 700 }}>✓</div>
                  <div style={{ fontFamily: bk.fontSans, fontWeight: 400, fontSize: '14px', lineHeight: 1.65, color: 'rgba(246,246,246,0.55)' }}>{item}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <FinalCTA />
    </div>
  );
};

export default Landing;
