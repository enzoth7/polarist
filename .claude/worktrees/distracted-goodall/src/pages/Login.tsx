import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

const ParticleSphere = () => {
  // Generamos 80 puntos para la esfera
  const points = Array.from({ length: 80 }).map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / 80);
    const theta = Math.sqrt(80 * Math.PI) * phi;
    return {
      x: 120 * Math.sin(phi) * Math.cos(theta),
      y: 120 * Math.sin(phi) * Math.sin(theta),
      z: 120 * Math.cos(phi),
    };
  });

  return (
    <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360, rotateX: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {points.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-foreground shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            style={{
              width: "2.5px",
              height: "2.5px",
              left: "50%",
              top: "50%",
              x: p.x,
              y: p.y,
              z: p.z,
              transformStyle: "preserve-3d",
            }}
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>
      
      {/* Aura/Resplandor Central de Marca - Adaptativo */}
      <div className="absolute inset-0 m-auto h-[180px] w-[180px] rounded-full bg-[#CCFF00]/10 dark:bg-[#CCFF00]/5 blur-[70px] -z-10" />
      
      {/* Sombreado de Profundidad Sutil */}
      <div className="absolute inset-0 m-auto h-[120px] w-[120px] rounded-full bg-foreground/5 blur-[40px] -z-10" />
    </div>
  );
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
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-6 pb-12 pt-12 transition-colors duration-500 text-foreground">
      {/* Overlay de Carga Mejorado */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md"
          >
            <div className="relative flex flex-col items-center gap-6">
              <Loader2 className="h-10 w-10 animate-spin text-[#CCFF00]" />
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-bold tracking-[0.3em] text-foreground uppercase"
              >
                Iniciando Sesión...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo arriba del todo */}
       <div className="mb-12 flex justify-center z-50">
        <BrandLogo
          className="gap-3"
          imageClassName="h-12 w-12 rounded-xl"
          labelClassName="text-[14px] tracking-[0.25em] font-bold"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-lg">
        
        {/* Esfera de Partículas con Aura Adaptativa */}
        <div className="mb-8 flex items-center justify-center">
          <ParticleSphere />
        </div>

        <div className="w-full text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            Bienvenidos
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-md text-base font-medium leading-relaxed text-muted-foreground opacity-90 sm:text-lg"
          >
            Tu punto de partida para dominar la IA.
          </motion.p>
        </div>
      </div>

      {/* Botones abajo */}
      <div className="mt-auto flex w-full max-w-sm flex-col gap-4 z-10 px-4">
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="h-[60px] w-full rounded-2xl border-none bg-foreground text-[17px] font-bold tracking-wide text-background shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98]"
          variant="default"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        <Button asChild variant="ghost" className="h-[55px] group rounded-2xl text-muted-foreground transition-all hover:bg-[#CCFF00] hover:text-[#0f1402] hover:shadow-[0_12px_32px_rgba(204,255,0,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 text-sm font-bold">
          <Link to={routes.landing} className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-colors group-hover:text-[#0f1402]" />
            Volver al inicio
          </Link>
        </Button>

        <p className="mt-4 px-8 text-center text-[11px] font-medium leading-relaxed text-muted-foreground opacity-60">
          Tu privacidad es nuestra prioridad.
          <br />
          Explora con confianza.
        </p>
      </div>

      {/* Brillo de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-foreground/5 blur-[120px]" />
    </div>
  );
};

export default Login;
