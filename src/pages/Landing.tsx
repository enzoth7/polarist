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
              <img src="/google-logo.png" alt="Google" className="h-6 w-6 object-contain" />
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
