import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import InferenceGlobeHero from "@/components/landing/InferenceGlobeHero";
import { routes } from "@/lib/routes";
import { FinalCTA } from "@/components/layout/FinalCTA";
import { GlowCard } from "@/components/ui/spotlight-card";
import SpatialProductShowcase from "@/components/ui/spatial-product-showcase";
import { InteractiveFeatureCard } from "@/components/ui/interactive-feature-card";
import FlipHover from "@/components/ui/flip-hover";
import Preloader from "@/components/ui/preloader";
import { Button } from "@/components/ui/button";
import { isVideoAsset } from "@/lib/assetPaths";
import { cn } from "@/lib/utils";
gsap.registerPlugin(ScrollTrigger);

const featureBlocks = [
  {
    title: "Asesorías prácticas",
    description:
      "Filtramos el ruido. Dominás las herramientas exactas para transformar tu forma de trabajar.",
    imgUrl: "/images/landing/delega-lo-repetitivo.webm",
    tag: "Automatización",
  },
  {
    title: "Sistemas inteligentes",
    description:
      "Automatizamos la operativa de tu empresa. Reducimos las horas en procesos repetitivos para vos y tu equipo con Agentes de IA.",
    imgUrl: "/images/landing/trae-a-la-realidad-tus-ideas.webm",
    tag: "Analytics",
  },
  {
    title: "Socio tecnológico",
    description:
      "Integramos y mantenemos toda la infraestructura. Nosotros resolvemos la parte técnica para que vos te enfoques en tu negocio.",
    imgUrl: "/images/landing/elegi-que-aprender.webm",
    tag: "Integración",
  },
] as const;

const problemBlocks = [
  {
    title: "Te perdés en un mar de información",
    description:
      "Querés integrar la Inteligencia Artificial en tu día a día, pero el exceso de herramientas y tutoriales hace que no sepas por dónde empezar ni qué sirve de verdad.",
    imgUrl: "/images/landing/repetimos-misma-tarea.webm",
    tag: "Organización",
    stat: "14 hrs"
  },
  {
    title: "Tu negocio pierde horas en tareas repetitivas",
    description:
      "Sabés que tu empresa podría ser mucho más ágil, pero seguís atascado en procesos manuales y operativos que consumen tiempo y frenan tu crecimiento.",
    imgUrl: "/images/landing/sabemos-que-hacer.webm",
    tag: "Procesos",
    stat: "60% Riesgo"
  },
  {
    title: "Te falta el respaldo técnico",
    description:
      "Tenés clara la visión de hacia dónde ir, pero armar, capacitar y mantener un equipo de desarrollo tradicional resulta complejo, lento y costoso.",
    imgUrl: "/images/landing/leemos-de-ia-y-colapsamos.webm",
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

let hasShownLandingPreloader = false;

const isBot = typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);


const Landing = () => {
  const [searchParams] = useSearchParams();
  const skipLoaderParam = searchParams.get("skipLoader") === "true";
  const [showPreloader, setShowPreloader] = useState(!hasShownLandingPreloader && !skipLoaderParam && !isBot);
  const isMobile = typeof window !== 'undefined' ? window.matchMedia("(max-width: 768px)").matches : false;
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const handlePreloaderComplete = useCallback(() => {
    hasShownLandingPreloader = true;
    setShowPreloader(false);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useGSAP(
    () => {
      if (isBot) return;

      if (videoSectionRef.current) {
        gsap.from(".section-title-solutions", {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

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
            paddingRight: "0.05em",
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

        gsap.utils.toArray<HTMLElement>(".problem-row").forEach((row, i) => {
          const isEven = i % 2 === 0;
          gsap.from(row, {
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
            x: isMobile ? 0 : (isEven ? -80 : 80),
            y: isMobile ? 40 : 0,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          });
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="w-full" style={{ background: bk.black }}>
      {showPreloader ? <Preloader onComplete={handlePreloaderComplete} /> : null}
      <div className="relative z-10">
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden"
          style={{ background: bk.black }}
        >
          <div className="relative z-10 w-full">
            {!showPreloader ? <InferenceGlobeHero /> : null}
          </div>
        </section>
      </div>

      {/* ─── PROBLEMAS ─── */}
      <div id="landing-problems" ref={problemsSectionRef} className={cn("relative z-[15] px-6 lg:px-20", isMobile ? "pt-10 pb-24" : "py-24 sm:px-10")} style={{ background: bk.pureWhite }}>
        <div className={cn("mx-auto max-w-[1200px] text-center", isMobile ? "mb-10" : "mb-14")}>
          <h2
            className="section-title leading-none"
            style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: isMobile ? '25px' : 'clamp(24px, 7vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: bk.black }}
          >
            A todos nos ha pasado que...
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
                {/* Contenedor de la Imagen con Efecto Spotlight */}
                <FlipHover className="flex-1 aspect-[4/3] w-full max-w-[600px]" style={{ borderRadius: bk.rLg }}>
                  <GlowCard
                    customSize
                    glowColor="polarist"
                    className="h-full w-full !p-0 overflow-hidden cursor-pointer group"
                    style={{ borderRadius: bk.rLg, boxShadow: '0 20px 40px rgba(1,1,1,0.06)' }}
                  >
                    <div className="relative aspect-[4/3] w-full" style={{ background: '#F8F9FB' }}>
                      {isVideoAsset((problem as any).imgUrl) ? (
                        <video
                          src={(problem as any).imgUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          aria-label={problem.title}
                        />
                      ) : (
                        <img src={(problem as any).imgUrl} alt={problem.title} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                      )}
                    </div>
                  </GlowCard>
                </FlipHover>

                {/* Contenido (Fuera del contenedor de la imagen) */}
                <div className={cn("flex-1 flex flex-col w-full justify-center", isMobile ? "items-center text-center" : "items-start text-left")}>
                  <h3
                    className="text-balance"
                    style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: isMobile ? '20px' : 'clamp(20px, 2.5vw, 28px)', letterSpacing: '-0.5px', lineHeight: 1.15, color: bk.black, marginBottom: '16px' }}
                  >
                    {problem.title}
                  </h3>
                  <p style={{ fontFamily: bk.fontSans, fontWeight: 400, fontSize: isMobile ? '14px' : '15px', lineHeight: 1.6, color: 'rgba(1,1,1,0.6)' }}>
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
        <section className={cn("relative z-20 flex w-full flex-col items-center justify-center px-6 pt-14 sm:px-10 sm:pt-18 lg:px-16 lg:pt-20", isMobile ? "pb-4" : "pb-12 sm:pb-14 lg:pb-16")} style={{ background: bk.black }}>
          <div className={cn("mx-auto max-w-[1200px] text-center w-full", isMobile ? "mb-10" : "mb-14")}>
            <h2
              className="section-title-solutions leading-none"
              style={{
                fontFamily: bk.fontSans,
                fontWeight: 700,
                fontSize: isMobile ? '25px' : 'clamp(24px, 7vw, 52px)',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                color: bk.white
              }}
            >
              Para eso creamos <div style={{ display: 'inline', color: bk.green }}>Polarist</div>
            </h2>
          </div>

          <div className="solutions-grid grid w-full max-w-[95vw] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6 xl:max-w-[85vw]">
            {featureBlocks.map((block) => (
              <InteractiveFeatureCard
                key={block.title}
                title={block.title}
                description={block.description}
                imageUrl={(block as any).imgUrl}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ─── SECCIÓN COMPARATIVA ─── */}
      <section className="why-section relative z-30 w-full" style={{ background: bk.black }}>
        <SpatialProductShowcase />
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative z-30 w-full py-24 px-6 overflow-hidden" style={{ background: bk.black }}>
        <div className="absolute inset-0 bg-[#8B5BF5]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-[#8B5BF5]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 font-serif text-white">
            Es momento de dar el salto tecnológico.
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-3xl mx-auto font-sans font-light leading-relaxed">
            Ya sea que necesites transformar la forma en la que opera tu empresa o quieras potenciar tus propias habilidades, estamos listos para acompañarte.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-[#8B5BF5] text-white hover:bg-[#8B5BF5]/90 rounded-full px-8 py-6 text-base font-bold font-sans border-none w-full sm:w-auto transition-transform hover:scale-[1.03]"
            >
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdHrdP8Mu63cawo3uFjFoQCmyWXCvyu9bd5FEjePPvDjoGELQ/viewform" target="_blank" rel="noopener noreferrer">
                Hablemos de mi empresa
              </a>
            </Button>
            <Button
              asChild
              className="bg-[#F6F6F6] text-[#010101] hover:bg-white/90 rounded-full px-8 py-6 text-base font-bold font-sans border-none w-full sm:w-auto transition-transform hover:scale-[1.03]"
            >
              <Link to={routes.appAsesorias}>
                Unirme a las asesorías
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
