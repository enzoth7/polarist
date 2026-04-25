import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

const LoginGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const shellGeometry = new THREE.BufferGeometry();
    const shellPositions = new Float32Array(2600 * 3);
    for (let i = 0; i < 2600 * 3; i += 3) {
      const radius = 2.6 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      shellPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      shellPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      shellPositions[i + 2] = radius * Math.cos(phi);
    }
    shellGeometry.setAttribute("position", new THREE.BufferAttribute(shellPositions, 3));
    const shellMaterial = new THREE.PointsMaterial({ size: 0.013, color: 0xffffff, transparent: true, opacity: 0.62, blending: THREE.NormalBlending, depthWrite: false });
    const shell = new THREE.Points(shellGeometry, shellMaterial);
    scene.add(shell);

    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(1400 * 3);
    for (let i = 0; i < 1400 * 3; i += 3) {
      const radius = Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      corePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      corePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      corePositions[i + 2] = radius * Math.cos(phi);
    }
    coreGeometry.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));
    const coreMaterial = new THREE.PointsMaterial({ size: 0.022, color: 0xCAFE5B, transparent: true, opacity: 0.9, blending: THREE.NormalBlending, depthWrite: false });
    const core = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(core);

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      shell.rotation.y += 0.0012;
      core.rotation.y -= 0.0018;
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.04;
      core.scale.set(pulse, pulse, pulse);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      shellGeometry.dispose();
      coreGeometry.dispose();
      shellMaterial.dispose();
      coreMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: 280, height: 280 }} />;
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

const Login = () => {
  const navigate = useNavigate();
  const { loginAsGoogle, status } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate(routes.appRadar, { replace: true });
    }
  }, [navigate, status]);

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

      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-lg relative z-10">
        <div className="mb-10 flex items-center justify-center">
          <LoginGlobe />
        </div>

        <div className="w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "clamp(48px, 12vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "#F6F6F6",
            }}
          >
            Bienvenidos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-sm"
            style={{
              fontFamily: "var(--font-sequel, sans-serif)",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(246,246,246,0.45)",
            }}
          >
            Tu punto de partida para{" "}
            <strong style={{ color: "#F6F6F6", fontWeight: 700 }}>dominar la IA.</strong>
          </motion.p>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-4 z-10 px-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60"
          style={{
            fontFamily: "var(--font-sequel, sans-serif)",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            padding: "17px 38px",
            backgroundColor: "#FFFFFF",
            color: "#010101",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <Link
          to={routes.landing}
          className="group w-full flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97]"
          style={{
            fontFamily: "var(--font-sequel, sans-serif)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.3px",
            padding: "15px 38px",
            backgroundColor: "transparent",
            color: "rgba(246,246,246,0.65)",
            borderRadius: "999px",
            border: "1px solid rgba(246,246,246,0.18)",
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <p
          className="mt-4 text-center whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sequel, sans-serif)",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "3px",
            color: "rgba(246,246,246,0.35)",
          }}
        >
          Privacidad garantizada • Polarist 2026
        </p>
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ backgroundColor: "rgba(202,254,91,0.05)" }}
      />
    </div>
  );
};

export default Login;
