import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

const Landing = () => {
  const { isInstallable, installApp } = useInstallPrompt();
  const { t } = useTranslation();

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
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_58%)]"
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/72 backdrop-blur-[6px]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <BrandLogo labelClassName="text-[11px] uppercase tracking-[0.12em] text-foreground/75" />

          <div className="flex items-center gap-2">
            {isInstallable && (
              <Button onClick={installApp} variant="secondary" size="sm" className="h-9 px-4 text-xs shadow-soft">
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
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("landing.hero.description")}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[58rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-8 h-24 w-[68%] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
            />
            <BeforeAfterSlider />
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
          </div>
          <p className="pt-2 text-sm text-muted-foreground">Crea contenido visual que destaque</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
