import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const loginPortraits = [
  {
    src: "/login/hero-left.jpg",
    alt: "Imagen izquierda del login",
    fallbackSrc: "/login/hero-center.jpg",
  },
  {
    src: "/login/hero-center.jpg",
    alt: "Imagen central del login",
    fallbackSrc: "/login/hero-left.jpg",
  },
  {
    src: "/login/hero-right.jpg",
    alt: "Imagen derecha del login",
    fallbackSrc: "/login/hero-center.jpg",
  },
] as const;

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
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

const LoginPortrait = ({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
}) => {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <div className={cn("h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted/30 shadow-[0_18px_36px_-28px_rgba(0,0,0,0.38)] sm:h-24 sm:w-24")}>
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-cover object-center"
        loading="eager"
        onError={() => {
          if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
          }
        }}
      />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { loginAsGoogle, status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      navigate(routes.appRadar, { replace: true });
    }
  }, [navigate, status]);

  const handleGoogleLogin = async () => {
    try {
      await loginAsGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("No se pudo iniciar sesion con Google");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-6 pb-10 pt-20">
      <div className="absolute left-[-20%] top-[-10%] -z-10 h-[60%] w-[140%] rounded-full bg-primary/20 blur-[120px]" />

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="mb-8 flex w-full items-center justify-center gap-3 sm:mb-10">
          {loginPortraits.map((portrait) => (
            <LoginPortrait key={portrait.src} {...portrait} />
          ))}
        </div>

        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <BrandLogo
              className="gap-3"
              imageClassName="h-11 w-11 rounded-xl"
              labelClassName="text-[12px] tracking-[0.2em]"
            />
          </div>

          <h1 className="mb-4 text-[2.2rem] font-black leading-[1.1] tracking-tight text-foreground">
            Descubre tu proximo
            <br />
            atajo de negocio
          </h1>

          <p className="px-2 text-[14px] font-medium leading-relaxed text-muted-foreground">
            Automatizaciones, manuales de neuroventas y herramientas para escalar hoy mismo.
          </p>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button
          onClick={handleGoogleLogin}
          className="h-[56px] w-full rounded-2xl border-none bg-foreground text-[16px] font-bold tracking-wide text-background shadow-card transition-all hover:scale-[1.02] hover:bg-foreground/80 active:scale-[0.98]"
          variant="default"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        <Button asChild variant="ghost" className="rounded-full px-4">
          <Link to={routes.landing}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>

        <p className="mt-4 px-8 text-center text-[10px] font-medium leading-relaxed text-muted-foreground opacity-70">
          Tu privacidad es nuestra prioridad.
          <br />
          Nunca compartiremos tus datos sin tu consentimiento.
        </p>
      </div>
    </div>
  );
};

export default Login;
