import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import BrandLogo from "@/components/BrandLogo";
import { Camera, Settings, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

const Landing = () => {
  const { isInstallable, installApp } = useInstallPrompt();
  const { t } = useTranslation();
  const originalPhoto = "/products/burger.jpeg";
  const studioPhoto = "/products/burger_photo.jpeg";
  const designPhoto = "/products/burger_design.png";
  const studioExample = {
    beforeSrc: originalPhoto,
    afterSrc: studioPhoto,
    beforeAltKey: "landing.showcase.examples.burgerAlt",
    afterAltKey: "landing.showcase.examples.burgerphotoAlt",
  };
  const designExample = {
    beforeSrc: studioPhoto,
    afterSrc: designPhoto,
    beforeAltKey: "landing.showcase.examples.burgerAlt",
    afterAltKey: "landing.showcase.examples.burgerdesignAlt",
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen min-h-[100dvh] flex-col overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_58%)]"
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/72 backdrop-blur-[6px]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <BrandLogo labelClassName="text-[11px] uppercase tracking-[0.12em] text-foreground/75" />

          <div className="flex items-center gap-2">
            {isInstallable && (
              <Button
                onClick={installApp}
                variant="secondary"
                size="sm"
                className="h-9 bg-[#685BC8] px-2 text-xs text-white shadow-soft hover:bg-[#5a4db5] hover:text-white"
              >
                {t("landing.navbar.installApp")}
              </Button>
            )}
            <Button
              size="sm"
              className="hidden h-9 bg-primary px-4 text-xs tracking-[0.04em] text-primary-foreground shadow-soft hover:bg-primary/90 md:inline-flex"
              onClick={signInWithGoogle}
            >
              <img src="/google-logo.png" alt={t("landing.navbar.googleLogoAlt")} className="mr-2 h-4 w-4 object-contain" />
              {t("landing.navbar.continueWithGoogle")}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-24 pt-36 md:px-10 md:pb-28 md:pt-44">
        <section className="flex w-full max-w-6xl flex-col items-center gap-14 text-center md:gap-20">
          <div className="max-w-4xl space-y-6">
            <h1 className="font-heading text-5xl leading-[1.02] tracking-[0.045em] md:text-7xl">
              {t("landing.hero.title")}
            </h1>
            <p className="text-2xl font-semibold text-primary md:text-3xl">
              {t("landing.hero.salesSubtitle")}
            </p>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("landing.hero.description")}
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="flex flex-col items-center gap-12">
              <div className="group relative w-full">
                <BeforeAfterSlider
                  examples={[studioExample]}
                  showHeader={false}
                  showControls={false}
                  className="max-w-none"
                  aspectClassName="aspect-[4/5]"
                  ariaLabel="Comparador original a estudio"
                />
                <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70 opacity-60 transition-opacity group-hover:opacity-100">
                  Original
                </span>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70 opacity-60 transition-opacity group-hover:opacity-100">
                  Estudio
                </span>
              </div>

              <div className="group relative w-full">
                <BeforeAfterSlider
                  examples={[designExample]}
                  showHeader={false}
                  showControls={false}
                  className="max-w-none"
                  aspectClassName="aspect-[3/4]"
                  beforeImageClassName="object-cover"
                  afterImageClassName="object-cover"
                  ariaLabel="Comparador estudio a diseño publicitario"
                />
                <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70 opacity-60 transition-opacity group-hover:opacity-100">
                  Estudio
                </span>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70 opacity-60 transition-opacity group-hover:opacity-100">
                  Diseño
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <Button
              size="lg"
              className="h-14 w-full bg-primary text-lg tracking-[0.04em] text-primary-foreground shadow-soft hover:bg-primary/90"
              onClick={signInWithGoogle}
            >
              <img src="/google-logo.png" alt={t("landing.navbar.googleLogoAlt")} className="mr-2 h-4 w-4 object-contain" />
              {t("landing.navbar.continueWithGoogle")}
            </Button>
            <p className="text-xs text-muted-foreground">{t("landing.hero.googleDisclaimer")}</p>
          </div>
          <div className="w-full max-w-6xl pt-4">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cómo funciona</p>
              <h2 className="mt-2 font-heading text-2xl md:text-3xl">Tres pasos simples</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Paso 1: Toma una foto.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Saca la foto de tu plato, prenda o producto con tu celular.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Paso 2: Configura tu marca.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nuestro sistema analiza tus colores y el estilo único de tu negocio para mantener tu identidad.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Paso 3: Calidad de Estudio.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Descarga una imagen publicitaria impecable, lista para publicar en Instagram, WhatsApp o tu catálogo y generar confianza al instante.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="mt-auto w-full shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
