import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import InferenceGlobeHero from "@/components/landing/InferenceGlobeHero";
import { routes } from "@/lib/routes";
import { FinalCTA } from "@/components/layout/FinalCTA";
import { GlowCard } from "@/components/ui/spotlight-card";
import ScrollExpansionDemo from "@/components/landing/ScrollExpansionDemo";
import SpatialProductShowcase from "@/components/ui/spatial-product-showcase";
import { InteractiveFeatureCard } from "@/components/ui/interactive-feature-card";
import FlipHover from "@/components/ui/flip-hover";
import Preloader from "@/components/ui/preloader";
import { PolaristInterstitialReveal } from "@/components/ui/polarist-interstitial-reveal";
import { isVideoAsset } from "@/lib/assetPaths";
gsap.registerPlugin(ScrollTrigger);

const featureBlocks = [
  {
    title: "Delega lo repetitivo",
    description:
      "Automatiza procesos y dejá que la IA se encargue de las tareas que te roban tiempo y no te aportan valor.",
    imgUrl: "/images/landing/delega-lo-repetitivo.webm",
    tag: "Automatización",
  },
  {
    title: "Traé a la realidad tus ideas",
    description:
      "El límite técnico bajó y lo que antes era inaccesible ahora está al alcance. Nunca fue tan fácil darle vida a tus ideas.",
    imgUrl: "/images/landing/trae-a-la-realidad-tus-ideas.webm",
    tag: "Analytics",
  },
  {
    title: "Elegí que aprender de IA",
    description:
      "No es aprenderlo todo sobre herramientas o tendencias, sino lo que a vos te aporte valor.",
    imgUrl: "/images/landing/elegi-que-aprender.webm",
    tag: "Integración",
  },
] as const;

const problemBlocks = [
  {
    title: "Repetimos día tras día la\u00A0misma\u00A0tarea",
    description:
      "Copiamos datos de un lado a otro, actualizamos las mismas planillas o hacemos el mismo proceso tedioso que no nos aporta nada de valor",
    imgUrl: "/images/landing/repetimos-misma-tarea.webm",
    tag: "Organización",
    stat: "14 hrs"
  },
  {
    title: "Sabemos que hacer pero no\u00A0sabemos\u00A0el\u00A0cómo",
    description:
      "Tenemos ideas y mejoras en nuestra cabeza, pero creemos que son caras, inaccesibles para nosotros o que si hay algo que puede ayudarte, crees que lleva mucho tiempo aprenderlo.",
    imgUrl: "/images/landing/sabemos-que-hacer.webm",
    tag: "Procesos",
    stat: "60% Riesgo"
  },
  {
    title: "Tenemos mucha información y no le damos uso",
    description:
      "Guardamos datos, tenemos información dispersa y la dejamos allí para usarla en el futuro, pero nunca lo terminamos haciendo porque no sabemos cómo organizarla y darle el valor correspondiente",
    imgUrl: "/images/landing/tenemos-mucha-informacion.webm",
    tag: "Adopción",
    stat: "Barrera AI"
  },
  {
    title: "Leemos de IA y colapsamos",
    description:
      "Cuando escribimos IA en cualquier red social, automáticamente empezamos a saturarnos de noticias, aparece la sobreinformación y terminamos creyendo que debemos saber todo para empezar.",
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

const Landing = () => {
  const [showPreloader, setShowPreloader] = useState(!hasShownLandingPreloader);
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

      // Removed obsolete GSAP why-section logic since it is replaced by SpatialProductShowcase

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
      <div ref={problemsSectionRef} className="relative z-[15] px-6 py-24 sm:px-10 lg:px-20" style={{ background: bk.pureWhite }}>
        <div className="mx-auto max-w-[1200px] mb-14 text-center">
          <h2
            className="section-title leading-none"
            style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1px', lineHeight: 1.1, color: bk.black }}
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

      {/* ─── SCROLL EXPANSION HERO ─── */}
      <ScrollExpansionDemo />

      <PolaristInterstitialReveal
        title="Polarist"
        description="Somos el puente entre vos y las nuevas herramientas de IA. Nuestro objetivo es mostrarte lo que es posible hoy en día, sin que tengas que ser un experto en tecnología."
      />

      {/* ─── SOLUCIONES ─── */}
      <div
        ref={videoSectionRef}
        className="relative z-20 overflow-hidden"
        style={{ perspective: "1200px", background: bk.black }}
      >
        <section className="relative z-20 flex w-full flex-col items-center justify-center px-6 pb-24 pt-14 sm:px-10 sm:pb-28 sm:pt-18 lg:px-16 lg:pb-32 lg:pt-20" style={{ background: bk.black }}>
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
      <FinalCTA />
    </div>
  );
};

export default Landing;
