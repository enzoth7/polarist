import { useNavigate } from "react-router-dom";
import { Download, LogIn, Sparkles, UserPlus } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { supabase } from "@/lib/supabase";

const Landing = () => {
  const navigate = useNavigate();
  const { isInstallable, installApp } = useInstallPrompt();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-12 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
                <Sparkles className="relative h-20 w-20 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-5xl tracking-tight md:text-6xl">Polarist</h1>
              <p className="font-body text-xl font-light text-muted-foreground md:text-2xl">
                Contenido visual profesional para tu negocio
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md space-y-4">
            <Button
              size="lg"
              className="flex h-14 w-full items-center justify-center gap-3 border-2 border-slate-200 bg-white text-lg text-black hover:bg-white/90"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                  },
                });
                if (error) {
                  console.error("OAuth error:", error.message);
                }
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 font-body text-muted-foreground">O usar otros métodos</span>
              </div>
            </div>

            {isInstallable && (
              <Button onClick={installApp} size="lg" variant="secondary" className="h-14 w-full text-lg">
                <Download className="mr-2 h-5 w-5" />
                Instalar App
              </Button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => navigate("/signup")} variant="ghost" className="h-12 text-sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Signup
              </Button>
              <Button onClick={() => navigate("/login")} variant="ghost" className="h-12 text-sm">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          </div>

          <p className="pt-2 font-body text-sm text-muted-foreground">Crea contenido visual que destaque</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
