import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import { ShinyButton } from "@/components/ui/shiny-button";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

const LoginGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 18000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + (Math.random() - 0.5) * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.2) {
        color.setHex(0xCAFE5B);
      } else if (rand < 0.8) {
        color.setHex(0xFFFFFF);
      } else {
        color.setHex(0xAAAAAA);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(16, 16, 16, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.011,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      map: texture,
      alphaTest: 0.1,
    });

    const wovenPoints = new THREE.Points(geometry, material);
    scene.add(wovenPoints);

    const fitRenderer = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    fitRenderer();
    window.addEventListener("resize", fitRenderer);

    const clock = new THREE.Clock();

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      wovenPoints.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", fitRenderer);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: 340, height: 340 }} />;
};

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 mr-3">
    <path
      d="M21.35 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.23a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.92-4.2 2.92-7.4Z"
      fill="#4285F4"
    />
    <path
      d="M12 21.75c2.63 0 4.84-.87 6.46-2.37l-3.14-2.44c-.87.58-1.99.93-3.32.93-2.55 0-4.7-1.72-5.47-4.03H3.29v2.52A9.75 9.75 0 0 0 12 21.75Z"
      fill="#34A853"
    />
    <path
      d="M6.53 13.84A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.25.31-1.84V7.64H3.29A9.75 9.75 0 0 0 2.25 12c0 1.56.37 3.03 1.04 4.36l3.24-2.52Z"
      fill="#FBBC05"
    />
    <path
      d="M12 6.13c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.23 14.62 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.52C7.3 7.85 9.45 6.13 12 6.13Z"
      fill="#EA4335"
    />
  </svg>
);

const RESOURCES_COUNTDOWN_TARGET = new Date("2026-05-04T20:00:00-03:00").getTime();

const getTimeRemaining = () => {
  const diff = Math.max(RESOURCES_COUNTDOWN_TARGET - Date.now(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const countdownItems = [
  { key: "days", label: "DÍAS" },
  { key: "hours", label: "HORAS" },
  { key: "minutes", label: "MINUTOS" },
  { key: "seconds", label: "SEGUNDOS" },
] as const;

const CountdownValue = ({ value }: { value: string }) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        minWidth: "clamp(86px, 19vw, 220px)",
        height: "clamp(62px, 12vw, 126px)",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -22, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 18, filter: "blur(5px)" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "var(--font-sequel, sans-serif)",
            fontSize: "clamp(52px, 12vw, 126px)",
            fontWeight: 400,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            color: "#F6F6F6",
            textShadow: "0 0 18px rgba(255,255,255,0.08)",
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-8"
        style={{ background: "linear-gradient(to bottom, rgba(1,1,1,0.42), transparent)" }}
      />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { loginAsGoogle, status } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  useEffect(() => {
    if (status === "authenticated") {
      navigate(routes.appProfile, { replace: true });
    }
  }, [navigate, status]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginAsGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("No se pudo iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 pb-12 pt-12"
      style={{ backgroundColor: "#010101" }}
    >
      <div className="absolute inset-0 z-0 bg-grid-white/[0.02] pointer-events-none" />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md"
            style={{ backgroundColor: "rgba(1,1,1,0.95)" }}
          >
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#CAFE5B" }} />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="uppercase"
                style={{ fontFamily: "var(--font-sequel, sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "3px", color: "#F6F6F6" }}
              >
                Iniciando sesión...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl text-center"
        >
          <div className="mb-6 flex justify-center md:mb-8">
            <ShinyButton
              onClick={() => navigate(routes.landing)}
              className="px-8 py-4 text-sm font-medium"
            >
              Volver al inicio
            </ShinyButton>
          </div>

          <div className="flex items-start justify-center gap-1 sm:gap-3 md:gap-5">
            {countdownItems.map((item, index) => {
              const value = String(timeRemaining[item.key]).padStart(2, "0");

              return (
                <div key={item.label} className="flex items-start gap-1 sm:gap-3 md:gap-5">
                  <div className="flex min-w-0 flex-col items-center">
                    <CountdownValue value={value} />
                    <span
                      className="mt-2"
                      style={{
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontSize: "clamp(10px, 1.6vw, 18px)",
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        color: "rgba(246,246,246,0.7)",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < countdownItems.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="translate-y-[0.08em]"
                      style={{
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontSize: "clamp(44px, 10vw, 110px)",
                        fontWeight: 300,
                        lineHeight: 0.9,
                        color: "#F6F6F6",
                      }}
                    >
                      :
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ backgroundColor: "rgba(202,254,91,0.05)" }}
      />
    </div>
  );
};

export default Login;
