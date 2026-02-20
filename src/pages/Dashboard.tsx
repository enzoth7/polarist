import { useNavigate } from "react-router-dom";
import { ArrowRight, Crosshair, Layers3, Loader2, Settings, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";

type PhotoTip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const photoTips: PhotoTip[] = [
  {
    icon: Sun,
    title: "Luz es todo",
    description: "Busca siempre una ventana con luz natural, eso hace el 80% del trabajo.",
  },
  {
    icon: Layers3,
    title: "Fondo simple",
    description: "Si no tienes un fondo blanco, pon dos hojas blancas de papel alrededor del producto. Ayuda muchísimo.",
  },
  {
    icon: Crosshair,
    title: "Tu producto al centro",
    description: "Mantenlo centrado para que podamos darle el mejor acabado.",
  },
];

const Dashboard = () => {
  const { profile, loading } = useBusinessProfile();
  const navigate = useNavigate();

  const brandName = profile.businessName?.trim() || "Tu marca";
  const stripPrefix = (val: string) => val.replace(/^[A-Z]\)\s*/i, "");
  const personality = profile.brandPerception ? stripPrefix(profile.brandPerception).replace(/_/g, " ") : "Definir";
  const goal = profile.socialPriorityGoal ? stripPrefix(profile.socialPriorityGoal).replace(/_/g, " ") : "Definir";

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F0F0]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-[#F0F0F0]/88 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <BrandLogo />
          <div className="flex items-center gap-1.5">
            <p className="font-body text-right text-xs text-foreground/75 md:text-sm">
              {greeting()}, {brandName}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/preferences")}
              className="h-8 w-8 text-foreground/65 hover:text-foreground"
              title="Configuración"
              aria-label="Ir a configuración"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-24 md:gap-8 md:px-6 md:pt-28">
        <section className="rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h2 className="font-heading text-xl tracking-[0.02em] text-foreground">Mi Estilo Visual</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-border/80 bg-background/70 p-4">
              <span className="font-body mb-1 block text-xs uppercase tracking-[0.12em] text-muted-foreground">Personalidad</span>
              <p className="font-body text-base capitalize text-foreground">{personality}</p>
            </article>
            <article className="rounded-xl border border-border/80 bg-background/70 p-4">
              <span className="font-body mb-1 block text-xs uppercase tracking-[0.12em] text-muted-foreground">Mi objetivo</span>
              <p className="font-body text-base capitalize text-foreground">{goal}</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-card p-6 shadow-card">
          <div className="inline-flex items-center rounded-full border border-accent/60 bg-accent/55 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-accent-foreground">
            Catálogo
          </div>
          <h3 className="font-heading mt-4 text-2xl tracking-[0.02em] text-foreground">Galerías de productos</h3>
          <p className="font-body mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Entra a tus galerías para revisar tus imágenes, organizar tus productos y avanzar con tu contenido visual.
          </p>

          <Button
            size="lg"
            className="mt-5 bg-primary px-8 text-primary-foreground hover:bg-primary/92"
            onClick={() => navigate("/gallery")}
          >
            Ir a mis galerías
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        <section className="rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h3 className="font-heading mb-4 text-lg tracking-[0.02em] text-foreground">Tips para una buena foto</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {photoTips.map((tip) => (
              <article key={tip.title} className="rounded-xl border border-border/80 bg-background/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden>
                    <tip.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <p className="font-heading text-sm tracking-[0.02em] text-foreground">{tip.title}</p>
                </div>
                <p className="font-body text-sm text-muted-foreground">{tip.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
