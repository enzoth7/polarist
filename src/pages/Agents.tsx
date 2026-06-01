import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { MaskedSlideReveal } from "@/components/ui/masked-slide-reveal";
import { ShinyButton } from "@/components/ui/shiny-button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { InteractiveFeatureCard } from "@/components/ui/interactive-feature-card";
import { PolaristInterstitialReveal } from "@/components/ui/polarist-interstitial-reveal";
import { FinalCTA } from "@/components/layout/FinalCTA";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { isVideoAsset } from "@/lib/assetPaths";
import { useToolsQuery, getToolHref } from "@/hooks/useTools";
import { ToolLogo } from "@/components/tools/ToolLogo";
import Modal from "@/components/ui/modal-drop";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Brand Kit ── */
const bk = {
  fontSans: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif",
  fontSerif: "'Arno Pro', Georgia, serif",
  green: "#CAFE5B",
  black: "#010101",
  white: "#F6F6F6",
  pureWhite: "#FFFFFF",
  rLg: "24px",
  rPill: "999px",
};

/* ── Los 5 pilares de un Agente ── */
const anatomyParts = [
  {
    title: "Trigger & Loop",
    description:
      "Es el reloj y horario del asistente. Decide en qué momento se 'despierta' para trabajar. Puede iniciar por un horario fijo, reaccionar cuando ocurre algo nuevo, o simplemente funcionar sin parar.",
    imgUrl: "/images/agents/trigger.mp4",
  },
  {
    title: "Contexto & Identidad",
    description:
      "Define la personalidad del asistente y las reglas que debe respetar. Le da acceso a los documentos de tu empresa para que siempre responda con datos reales y nunca invente información.",
    imgUrl: "/images/agents/context.webm",
  },
  {
    title: "Cerebro (LLM)",
    description:
      "Es la inteligencia principal, la mente del asistente. Se encarga de leer la información, entender muy bien lo que le pides, pensar el mejor plan y tomar las decisiones correctas para ayudarte.",
    imgUrl: "/images/agents/brain.webm",
  },
  {
    title: "Skills",
    description:
      "Son las habilidades que el asistente sabe hacer paso a paso, como redactar o resumir. Le permiten recordar cosas, buscar datos en internet por sí solo y aprender a mejorar constantemente.",
    imgUrl: "/images/agents/skills.mp4",
  },
  {
    title: "Herramientas & Conectores",
    description:
      "Son las manos del asistente. Le sirven para conectarse y usar los programas que empleas a diario, como tu correo electrónico, tus chats o tus carpetas, haciendo el trabajo directamente por ti.",
    imgUrl: "/images/agents/tools1.webm",
  },
] as const;

/* ── Casos de Uso ── */
const useCases = [
  {
    title: "Agente de Ventas",
    description:
      "Califica leads automáticamente, responde consultas 24/7 y agenda reuniones en tu calendario. Tu equipo comercial nunca duerme.",
    imgUrl: "/images/agents/sales_agent.webm",
    stat: "15hs/sem",
    statLabel: "ahorro promedio",
  },
  {
    title: "Agente de Contenido",
    description:
      "Monitorea tendencias, redacta borradores y programa publicaciones. Mantiene tu presencia digital activa sin esfuerzo manual constante.",
    imgUrl: "/images/agents/content_agent1.webm",
    stat: "x3",
    statLabel: "más contenido",
  },
  {
    title: "Agente de Operaciones",
    description:
      "Concilia facturas, procesa datos y notifica anomalías. Automatiza los procesos tediosos que consumen horas de trabajo manual cada semana.",
    imgUrl: "/images/agents/operations_agent1.webm",
    stat: "0%",
    statLabel: "error humano",
  },
] as const;

/* ── Diferencias chatbot vs agente ── */
const comparisonRows = [
  { aspect: "Autonomía", chatbot: "Responde solo cuando le preguntas", agent: "Actúa proactivamente sin que lo pidas" },
  { aspect: "Herramientas", chatbot: "Solo genera texto", agent: "Ejecuta acciones reales (emails, CRM, APIs)" },
  { aspect: "Memoria", chatbot: "Empieza de cero en cada conversación", agent: "Recuerda contexto y preferencias" },
  { aspect: "Decisiones", chatbot: "Sigue instrucciones literales", agent: "Razona, planifica y elige la mejor acción" },
  { aspect: "Integración", chatbot: "Aislado en una ventana de chat", agent: "Conectado a tu ecosistema de trabajo" },
];

/* ── Floating Particles Canvas ── */
const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const starCount = 150;
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      baseOpacity: number;
      twinkleSpeed: number;
      phase: number;
    }> = [];

    const maxDepth = 1000;
    const speed = 1.0;

    const initStar = (index: number, randomZ = false) => {
      const w = canvas.offsetWidth || window.innerWidth;
      const h = canvas.offsetHeight || window.innerHeight;
      stars[index] = {
        x: (Math.random() - 0.5) * w * 3,
        y: (Math.random() - 0.5) * h * 3,
        z: randomZ ? Math.random() * maxDepth : maxDepth,
        size: Math.random() * 1.6 + 0.4,
        baseOpacity: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < starCount; i++) {
      initStar(i, true);
    }

    let animId: number;
    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];

        s.z -= speed;

        if (s.z <= 0) {
          initStar(i, false);
          continue;
        }

        s.phase += s.twinkleSpeed;
        const twinkle = Math.sin(s.phase) * 0.15;
        let opacity = Math.max(0.1, Math.min(1, s.baseOpacity + twinkle));

        if (s.z > maxDepth * 0.8) {
          const factor = (maxDepth - s.z) / (maxDepth * 0.2);
          opacity *= factor;
        }

        const fov = 150;
        const px = (s.x / s.z) * fov + w / 2;
        const py = (s.y / s.z) * fov + h / 2;

        const sizeOnScreen = s.size * (1 - s.z / maxDepth) * 2.8;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.2, sizeOnScreen), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(246, 246, 246, ${opacity})`;
          ctx.fill();
        } else if (s.z < maxDepth * 0.2) {
          initStar(i, false);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.8 }}
    />
  );
};

/* ── Animated Counter ── */
const AnimatedStat = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "text-3xl font-bold transition-all duration-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{ fontFamily: bk.fontSans, color: bk.green }}
      >
        {value}
      </div>
      <div
        className="text-xs uppercase tracking-widest"
        style={{ fontFamily: bk.fontSans, color: "rgba(246, 246, 246, 0.5)" }}
      >
        {label}
      </div>
    </div>
  );
};

const Agents = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const anatomyRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const platformsSectionRef = useRef<HTMLDivElement>(null);
  const interstitialRef = useRef<HTMLDivElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  const scrollToWhatIsAgent = () => {
    interstitialRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { data: allTools = [] } = useToolsQuery();
  const agentPlatforms = allTools.filter((t) => t.category === "Agentes de IA");

  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useGSAP(
    () => {
      /* ── Hero animations ── */
      if (heroRef.current) {
        gsap.from(".agents-hero-subtitle", {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 1.2,
          ease: "power3.out",
        });
      }

      /* ── Anatomy cards stagger ── */
      if (anatomyRef.current) {
        gsap.from(".anatomy-title", {
          scrollTrigger: {
            trigger: anatomyRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.utils.toArray<HTMLElement>(".anatomy-card").forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 60,
            scale: 0.92,
            filter: "blur(8px)",
            duration: 0.8,
            delay: i * 0.15,
            ease: "power2.out",
            clearProps: "opacity,transform,filter",
          });
        });
      }

      /* ── Comparison table rows ── */
      if (comparisonRef.current) {
        gsap.from(".comparison-title", {
          scrollTrigger: {
            trigger: comparisonRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.utils
          .toArray<HTMLElement>(".comparison-row")
          .forEach((row, i) => {
            gsap.from(row, {
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                toggleActions: "play none none none",
              },
              opacity: 0,
              x: isMobile ? 0 : i % 2 === 0 ? -40 : 40,
              y: isMobile ? 30 : 0,
              duration: 0.7,
              ease: "power2.out",
            });
          });
      }

      /* ── Platforms Grid ── */
      if (platformsSectionRef.current) {
        gsap.from(".platforms-title", {
          scrollTrigger: {
            trigger: platformsSectionRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.from(".platform-mini-card", {
          scrollTrigger: {
            trigger: platformsSectionRef.current,
            start: "top 70%",
            once: true,
          },
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });
      }

      /* ── Use Cases Grid ── */
      if (useCasesRef.current) {
        gsap.from(".usecases-title", {
          scrollTrigger: {
            trigger: useCasesRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.from(".usecase-card", {
          scrollTrigger: {
            trigger: useCasesRef.current,
            start: "top 50%",
            once: true,
          },
          opacity: 0,
          y: 80,
          scale: 0.85,
          filter: "blur(10px)",
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "opacity,transform,filter",
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, revertOnUpdate: true }
  );

  return (
    <div ref={containerRef} className="w-full" style={{ background: bk.black }}>
      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16"
        style={{ background: bk.black }}
      >
        <FloatingParticles />

        <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
          {/* Title */}
          <h1
            style={{
              fontFamily: bk.fontSans,
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-2.5px",
              lineHeight: 0.92,
              color: bk.white,
            }}
          >
            <MaskedSlideReveal text="El futuro no se" delay={0.3} />
            <br />
            <MaskedSlideReveal text="chatea." delay={0.5} />
            <div style={{ display: "inline", color: bk.green }}>
              <MaskedSlideReveal text=" Se delega." delay={0.65} />
            </div>
          </h1>

          {/* Subtitle */}
          <p
            className="agents-hero-subtitle mt-8 max-w-2xl text-balance text-lg leading-relaxed md:text-xl"
            style={{
              fontFamily: bk.fontSans,
              fontWeight: 400,
              color: "rgba(246, 246, 246, 0.65)",
            }}
          >
            Un agente de IA no es un chatbot. Es un empleado digital autónomo
            que percibe, razona, decide y ejecuta acciones reales por vos.
          </p>

          {/* CTA */}
          <div className="mt-12">
            <ShinyButton
              onClick={scrollToWhatIsAgent}
              className="inline-flex px-10 py-4 text-[16px] font-semibold tracking-[0.5px] no-underline"
              style={{ fontFamily: bk.fontSans }}
            >
              Quiero construir un agente
            </ShinyButton>
          </div>
        </div>
      </section>

      {/* ═══ QUÉ ES UN AGENTE (Interstitial) ═══ */}
      <div ref={interstitialRef} className="scroll-mt-24">
        <PolaristInterstitialReveal
          title="¿Qué es un Agente de IA?"
          description="Un agente de IA es un sistema autónomo que combina un modelo de lenguaje con memoria y herramientas para ejecutar tareas complejas de forma independiente. No necesita que le digas cada paso: él decide cómo resolver el problema."
        />
      </div>

      {/* ═══ ANATOMÍA ═══ */}
      <div
        ref={anatomyRef}
        className={cn(
          "relative z-[15] px-6 lg:px-10 xl:px-16",
          isMobile ? "pt-16 pb-16" : "py-28 sm:px-10"
        )}
        style={{ background: bk.black }}
      >
        <div className={cn("mx-auto max-w-[1450px] xl:max-w-[1650px] text-center", isMobile ? "mb-10" : "mb-16")}>
          <h2
            className="anatomy-title leading-none"
            style={{
              fontFamily: bk.fontSans,
              fontWeight: 700,
              fontSize: isMobile ? "28px" : "clamp(28px, 5vw, 48px)",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: bk.white,
            }}
          >
            Los 5 pilares de un
            <div style={{ color: bk.green, display: "inline" }}> Agente</div>
          </h2>
          <p
            className="anatomy-title mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{
              fontFamily: bk.fontSans,
              fontWeight: 400,
              color: "rgba(246, 246, 246, 0.5)",
            }}
          >
            Un agente empresarial de alto rendimiento combina cinco pilares fundamentales para operar de forma totalmente autónoma.
          </p>
        </div>

        <div className="mx-auto max-w-[1450px] xl:max-w-[1650px] 2xl:max-w-[1750px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {anatomyParts.map((part) => (
            <div key={part.title} className="anatomy-card">
              <GlowCard
                customSize
                glowColor="polarist"
                className="h-full w-full !p-0 overflow-hidden cursor-pointer group min-h-[430px] sm:min-h-[455px] lg:min-h-[475px] xl:min-h-[510px] 2xl:min-h-[530px]"
                style={{
                  borderRadius: bk.rLg,
                  background: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Image */}
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden"
                    style={{ borderRadius: `${bk.rLg} ${bk.rLg} 0 0` }}
                  >
                    {isVideoAsset(part.imgUrl) ? (
                      <video
                        key={part.imgUrl}
                        src={part.imgUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ opacity: 0.7 }}
                      />
                    ) : (
                      <img
                        src={part.imgUrl}
                        alt={part.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ opacity: 0.7, mixBlendMode: "screen" }}
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${bk.black} 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 px-5 xl:px-7 pb-8 pt-2">
                    <h3
                      className="text-lg lg:text-[14px] xl:text-[17px] 2xl:text-xl font-bold tracking-tight whitespace-nowrap"
                      style={{ fontFamily: bk.fontSans, color: bk.white }}
                    >
                      {part.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: bk.fontSans,
                        fontWeight: 400,
                        color: "rgba(246, 246, 246, 0.55)",
                      }}
                    >
                      {part.description}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CHATBOT vs AGENTE ═══ */}
      <div
        ref={comparisonRef}
        className={cn(
          "relative z-[15] px-6 lg:px-20",
          isMobile ? "pt-10 pb-16" : "py-28 sm:px-10"
        )}
        style={{ background: bk.black }}
      >
        {/* Background grid */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="agents-grid"
              width="120"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="72"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#agents-grid)" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[900px]">
          <div className={cn("text-center", isMobile ? "mb-10" : "mb-16")}>
            <h2
              className="comparison-title leading-none"
              style={{
                fontFamily: bk.fontSans,
                fontWeight: 700,
                fontSize: isMobile ? "26px" : "clamp(28px, 5vw, 44px)",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                color: bk.white,
              }}
            >
              Chatbot
              <div style={{ color: "rgba(246, 246, 246, 0.35)", display: "inline" }}>
                {" "}vs{" "}
              </div>
              <div style={{ color: bk.green, display: "inline" }}>Agente</div>
            </h2>
          </div>

          {/* Table header */}
          <div
            className="mb-4 grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-6 md:gap-6"
          >
            <div
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ fontFamily: bk.fontSans, color: "rgba(246, 246, 246, 0.3)" }}
            />
            <div
              className="text-center text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ fontFamily: bk.fontSans, color: "rgba(246, 246, 246, 0.3)" }}
            >
              CHATBOT
            </div>
            <div
              className="text-center text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ fontFamily: bk.fontSans, color: bk.green }}
            >
              AGENTE IA
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3">
            {comparisonRows.map((row) => (
              <div
                key={row.aspect}
                className="comparison-row glass-brand grid grid-cols-[1.2fr_1fr_1fr] items-center gap-4 px-6 py-5 md:gap-6"
                style={{ borderRadius: "16px" }}
              >
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: bk.fontSans, color: bk.white }}
                >
                  {row.aspect}
                </div>
                <div
                  className="text-center text-xs leading-relaxed"
                  style={{
                    fontFamily: bk.fontSans,
                    color: "rgba(246, 246, 246, 0.4)",
                  }}
                >
                  {row.chatbot}
                </div>
                <div
                  className="text-center text-xs font-bold leading-relaxed"
                  style={{ fontFamily: bk.fontSans, color: bk.white }}
                >
                  {row.agent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PLATAFORMAS DE CONSTRUCCIÓN ═══ */}
      <div
        ref={platformsSectionRef}
        className={cn(
          "relative z-[15] px-6 lg:px-20",
          isMobile ? "pt-16 pb-16" : "py-28 sm:px-10"
        )}
        style={{ background: bk.black }}
      >
        <div className={cn("mx-auto max-w-[1200px] text-center", isMobile ? "mb-10" : "mb-16")}>
          <h2
            className="platforms-title leading-none text-balance"
            style={{
              fontFamily: bk.fontSans,
              fontWeight: 700,
              fontSize: isMobile ? "28px" : "clamp(28px, 5vw, 44px)",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: bk.white,
            }}
          >
            Plataformas para construir
            <div style={{ color: bk.green, display: "inline" }}> Agentes</div>
          </h2>
          <p
            className="platforms-title mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg text-balance"
            style={{
              fontFamily: bk.fontSans,
              fontWeight: 400,
              color: "rgba(246, 246, 246, 0.5)",
            }}
          >
            Estos son los mejores arneses (agent harness) para comenzar a desarrollar y automatizar tus propios agentes digitales.
          </p>
        </div>

        <div className="mx-auto max-w-[1200px] flex flex-wrap items-start justify-center gap-6">
          {agentPlatforms.map((platform) => (
            <div
              key={platform.name}
              className="platform-mini-card group flex w-[140px] flex-col items-center justify-start transition-transform duration-300 hover:scale-[1.05]"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlatform(platform)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPlatform(platform);
                  }
                }}
                className="flex flex-col items-center justify-start p-4 w-full h-full cursor-pointer focus:outline-none"
              >
                <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-[16px] bg-white transition-transform duration-300 group-hover:scale-110 p-2.5 shadow-[0_4px_12px_rgba(255,255,255,0.06)]">
                  <img
                    src={`/images/agents/${platform.logoFilename}`}
                    alt={`Logo de ${platform.name}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p
                  className="mt-4 text-center text-xs font-semibold tracking-wide text-white/70 transition-colors group-hover:text-white"
                  style={{ fontFamily: bk.fontSans }}
                >
                  {platform.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PLATFORM DETAIL DIALOG ═══ */}
      <Modal
        isOpen={!!selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
        type="blur"
        animationType="scale"
        centerOnMobile
        className="dark border border-white/10 !bg-[#010101]/95 text-[#F6F6F6] max-w-[90%] sm:max-w-md rounded-2xl"
        showCloseButton={true}
      >
        {selectedPlatform ? (
          <div className="flex flex-col items-center text-center gap-6 p-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[20px] bg-white p-3 shadow-lg">
              <img
                src={`/images/agents/${selectedPlatform.logoFilename}`}
                alt={`Logo de ${selectedPlatform.name}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2
                style={{ fontFamily: bk.fontSans, fontWeight: 700, fontSize: "28px" }}
                className="text-white tracking-tight"
              >
                {selectedPlatform.name}
              </h2>
              <span
                style={{ fontFamily: bk.fontSans, color: bk.green, fontSize: "12.5px" }}
                className="tracking-[0.06em] font-bold"
              >
                {selectedPlatform.kind ? selectedPlatform.kind.charAt(0).toUpperCase() + selectedPlatform.kind.slice(1).toLowerCase() : "Plataforma"}
              </span>
            </div>
            
            <p
              style={{ fontFamily: bk.fontSans, fontSize: "15px", lineHeight: 1.6 }}
              className="text-white/60 max-w-sm"
            >
              {selectedPlatform.description}
            </p>
            
            {selectedPlatform.url && (
              <a
                href={getToolHref(selectedPlatform)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#F6F6F6] transition-colors hover:text-[#CAFE5B]"
                style={{ fontFamily: bk.fontSans }}
              >
                Página oficial
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : null}
      </Modal>

      {/* ═══ CASOS DE USO ═══ */}
      <div
        ref={useCasesRef}
        className="relative z-20 overflow-hidden"
        style={{ perspective: "1200px", background: bk.black }}
      >
        <section
          className={cn(
            "relative z-20 flex w-full flex-col items-center justify-center px-6 pt-14 sm:px-10 sm:pt-18 lg:px-16 lg:pt-24",
            isMobile ? "pb-8" : "pb-24 sm:pb-28 lg:pb-32"
          )}
          style={{ background: bk.black }}
        >
          <div className={cn("text-center w-full max-w-[1200px]", isMobile ? "mb-10" : "mb-16")}>
            <h2
              className="usecases-title leading-none"
              style={{
                fontFamily: bk.fontSans,
                fontWeight: 700,
                fontSize: isMobile ? "26px" : "clamp(28px, 5vw, 44px)",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                color: bk.white,
              }}
            >
              Agentes que ya
              <div style={{ color: bk.green, display: "inline" }}> tenemos trabajando</div>
            </h2>
            <p
              className="usecases-title mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{
                fontFamily: bk.fontSans,
                fontWeight: 400,
                color: "rgba(246, 246, 246, 0.5)",
              }}
            >
              Estos son algunos de los agentes que estamos construyendo.
            </p>
          </div>

          <div className="grid w-full max-w-[95vw] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6 xl:max-w-[85vw]">
            {useCases.map((uc) => (
              <div key={uc.title} className="usecase-card">
                <GlowCard
                  customSize
                  glowColor="polarist"
                  className="h-full w-full !p-0 overflow-hidden cursor-pointer group"
                  style={{
                    borderRadius: bk.rLg,
                    background: "rgba(255, 255, 255, 0.02)",
                    minHeight: "420px",
                  }}
                >
                  <div className="flex h-full flex-col justify-between p-8 md:p-9">
                    {/* Stat */}
                    <div className="mb-6">
                      <AnimatedStat value={uc.stat} label={uc.statLabel} />
                    </div>

                    {/* Image */}
                    <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-[16px]">
                      {isVideoAsset(uc.imgUrl) ? (
                        <video
                          key={uc.imgUrl}
                          src={uc.imgUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ opacity: 0.9 }}
                        />
                      ) : (
                        <img
                          src={uc.imgUrl}
                          alt={uc.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ opacity: 0.9 }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                      <h3
                        className="text-xl font-bold tracking-tight"
                        style={{ fontFamily: bk.fontSans, color: bk.white }}
                      >
                        {uc.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: bk.fontSans,
                          fontWeight: 400,
                          color: "rgba(246, 246, 246, 0.55)",
                        }}
                      >
                        {uc.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ═══ CÓMO LO CONSTRUIMOS ═══ */}
      <PolaristInterstitialReveal
        title="¿Cómo construimos un agente?"
        description="Conectamos un modelo de lenguaje con las herramientas de tu negocio. Definimos su objetivo, le damos memoria y lo entrenamos con tus datos. El resultado: un empleado digital que trabaja 24/7 sin descanso."
        singleLine
      />

      {/* ═══ CTA FINAL ═══ */}
      <FinalCTA
        title="¿Querés construir un agente para tu empresa?"
        description="Dejá que la IA trabaje por vos. Empezá hoy."
        buttonText="Contactanos"
        to={routes.contact}
      />

      {/* ── Keyframes for scroll indicator ── */}
      <style>{`
        @keyframes scrollIndicator {
          0% { top: -12px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 32px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Agents;
