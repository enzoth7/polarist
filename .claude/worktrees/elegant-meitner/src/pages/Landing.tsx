import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WorldMapSVG from "@/components/landing/WorldMapSVG";
import { routes } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";

gsap.registerPlugin(ScrollTrigger);

const featureBlocks = [
  {
    title: "Automatizá lo repetitivo",
    description:
      "Dejá que la IA se encargue de las tareas que te roban tiempo. Configuralo una vez, olvidate para siempre.",
  },
  {
    title: "Decisiones con datos reales",
    description:
      "Accedé a insights en tiempo real que te ayudan a tomar mejores decisiones para tu negocio.",
  },
  {
    title: "Todo integrado en un lugar",
    description:
      "Herramientas, tendencias y recursos conectados. Sin saltar entre plataformas.",
  },
] as const;

const problemBlocks = [
  {
    title: "Perdés horas en tareas manuales",
    description:
      "Copiar datos de un lado a otro, enviar los mismos mails, actualizar planillas. Tu tiempo vale más que eso.",
  },
  {
    title: "Tus datos están dispersos y desconectados",
    description:
      "Tenés información en 10 plataformas distintas y no podés cruzar nada. Las decisiones se toman a ciegas.",
  },
  {
    title: "La IA parece compleja e inaccesible",
    description:
      "Sabés que la inteligencia artificial puede ayudarte, pero no sabés por dónde empezar ni cómo aplicarla.",
  },
] as const;

const Landing = () => {
  const { status } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
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

      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      if (titleRef.current) {
        heroTl.from(titleRef.current, { opacity: 0, y: 40 });
      }

      if (descRef.current) {
        heroTl.from(descRef.current, { opacity: 0, y: 30 }, "-=0.5");
      }

      if (ctaRef.current) {
        heroTl.from(ctaRef.current, { opacity: 0, y: 20 }, "-=0.4");
      }

      if (mapRef.current) {
        heroTl.from(mapRef.current, { opacity: 0, y: 30 }, "-=0.3");

        gsap.to(mapRef.current, {
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: -60,
          scale: 1.03,
          ease: "none",
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
        const problemItems = gsap.utils.toArray<HTMLElement>(".problem-item");

        problemItems.forEach((item, index) => {
          const isEven = index % 2 === 0;
          const imageEl = item.querySelector(".problem-image");
          const textEl = item.querySelector(".problem-text");
          const itemTl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 30%",
              scrub: false,
              once: true,
            },
          });

          if (imageEl) {
            itemTl.from(imageEl, {
              x: isEven ? -120 : 120,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
            });
          }

          if (textEl) {
            itemTl.from(
              textEl,
              {
                x: isEven ? 60 : -60,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
              },
              "-=0.6",
            );
          }
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [status], revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="w-full bg-background">
      <div className="relative z-10">
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 pt-[15vh]"
        >
          <div className="flex w-full flex-col items-center justify-center text-center">
            <div className="max-w-none">
              <h1
                ref={titleRef}
                className="whitespace-nowrap text-center font-bold tracking-tight text-[#1a1a1a] leading-[1.05]"
                style={{ fontSize: "clamp(1.8rem, 5vw, 5rem)", letterSpacing: "-0.04em" }}
              >
                La forma más simple de usar IA en tu vida
              </h1>
            </div>

            <p
              ref={descRef}
              className="mt-6 max-w-3xl text-center text-base leading-relaxed text-[#555555] sm:mt-8 sm:text-lg lg:text-xl"
            >
              Polarist es una plataforma digital que conecta a las personas con herramientas e
              información clave para mejorar procesos a través de Inteligencia Artificial.
            </p>

            {status !== "authenticated" && (
              <div ref={ctaRef} className="mt-12 rounded-full sm:mt-14">
                <Button
                  asChild
                  className="rounded-full border-0 bg-[#CCFF00] px-10 py-6 text-lg font-bold text-[#0f1402] shadow-[0_15px_35px_rgba(204,255,0,0.25)] transition-all hover:scale-105 hover:bg-[#d8ff4a] hover:shadow-[0_0_40px_rgba(204,255,0,0.5),0_0_80px_rgba(204,255,0,0.2)] active:scale-95"
                >
                  <Link to={routes.login}>Comenzar</Link>
                </Button>
              </div>
            )}
          </div>

          <div ref={mapRef} className="mt-16 flex w-full items-center justify-center sm:mt-24">
            <WorldMapSVG />
          </div>
        </section>
      </div>

      <div ref={problemsSectionRef} className="relative z-[15] bg-background">
        {problemBlocks.map((problem, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={problem.title}
              className="problem-item flex min-h-screen w-full items-center bg-background px-6 sm:px-10 lg:px-20"
            >
              <div
                className={`mx-auto flex w-full max-w-[90vw] flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="problem-image flex-1">
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl border border-border/40 bg-muted/30">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span className="text-sm">Imagen</span>
                    </div>
                  </div>
                </div>

                <div className="problem-text flex-1">
                  <span
                    className="text-sm font-semibold uppercase tracking-widest"
                    style={{ color: "#FF5729" }}
                  >
                    Problema {index + 1}
                  </span>
                  <h2
                    className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {problem.title}
                  </h2>
                  <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div
        ref={videoSectionRef}
        className="relative z-20 overflow-hidden bg-white"
        style={{ perspective: "1200px" }}
      >
        <section className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 sm:px-10 lg:px-16">
          <div className="solutions-grid grid w-full max-w-[95vw] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6 xl:max-w-[85vw]">
            {featureBlocks.map((block) => (
              <div
                key={block.title}
                className="feature-card flex flex-col transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]"
              >
                <div className="relative flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-[#e0e0e0] bg-[#f0f0f0] transition-all duration-500 hover:border-[#CCFF00]/60 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20">
                    <div className="ml-1 h-0 w-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white" />
                  </div>
                </div>

                <h2
                  className="feature-title mt-6 text-xl font-semibold tracking-tight text-[#1a1a1a] sm:text-2xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {block.title}
                </h2>

                <p className="feature-desc mt-3 text-base leading-relaxed text-[#555555]">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="relative z-30 flex min-h-[60vh] w-full flex-col items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center text-center">
          <h2
            className="text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: "'Arno Pro Display', 'Arno Pro', Georgia, serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Unite a los que ya están usando inteligencia artificial para trabajar mejor, no más.
          </p>
          <div className="mt-10">
            <Link
              to={routes.login}
              className="inline-flex items-center rounded-full border-2 border-white/80 bg-white px-12 py-4 text-lg font-semibold text-[#0a0a0a] shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
