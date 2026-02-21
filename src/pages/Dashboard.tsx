import { useNavigate } from "react-router-dom";
import { ArrowRight, Crosshair, Layers3, Loader2, Moon, Settings, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import AvatarUpload from "@/components/AvatarUpload";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useTheme } from "@/hooks/useTheme";

type PhotoTip = {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
};

const photoTips: PhotoTip[] = [
  {
    icon: Sun,
    titleKey: "dashboard.tips.items.light.title",
    descriptionKey: "dashboard.tips.items.light.description",
  },
  {
    icon: Layers3,
    titleKey: "dashboard.tips.items.background.title",
    descriptionKey: "dashboard.tips.items.background.description",
  },
  {
    icon: Crosshair,
    titleKey: "dashboard.tips.items.center.title",
    descriptionKey: "dashboard.tips.items.center.description",
  },
];

const Dashboard = () => {
  const { profile, loading, updateProfile, fetchProfile } = useBusinessProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const brandName = profile.businessName?.trim() || t("dashboard.brandFallback");
  const stripPrefix = (value: string) => value.replace(/^[A-Z]\)\s*/i, "");
  const personality = profile.brandPerception ? stripPrefix(profile.brandPerception).replace(/_/g, " ") : t("common.notDefined");
  const goal = profile.socialPriorityGoal ? stripPrefix(profile.socialPriorityGoal).replace(/_/g, " ") : t("common.notDefined");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greetings.morning");
    if (hour < 19) return t("dashboard.greetings.afternoon");
    return t("dashboard.greetings.night");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/88 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <BrandLogo />
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-foreground/65 hover:text-foreground"
              title={theme === "light" ? "Modo oscuro" : "Modo claro"}
              aria-label={theme === "light" ? "Modo oscuro" : "Modo claro"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/preferences")}
              className="h-8 w-8 text-foreground/65 hover:text-foreground"
              title={t("dashboard.goToSettings")}
              aria-label={t("dashboard.goToSettings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-24 md:gap-8 md:px-6 md:pt-28">
        <section className="w-fit rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <div className="flex items-center gap-4">
            <AvatarUpload
              avatarUrl={profile.avatarUrl || null}
              onUpload={(url) => {
                updateProfile({ avatarUrl: url });
              }}
              size={48}
            />
            <p className="whitespace-nowrap font-body text-base tracking-[0.02em] text-foreground">
              {greeting()}, {brandName}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h2 className="font-heading text-xl tracking-[0.02em] text-foreground">{t("dashboard.visualStyle.title")}</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-border/80 bg-background/70 p-4">
              <span className="font-body mb-1 block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("dashboard.visualStyle.personality")}
              </span>
              <p className="font-body text-base capitalize text-foreground">{personality}</p>
            </article>
            <article className="rounded-xl border border-border/80 bg-background/70 p-4">
              <span className="font-body mb-1 block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("dashboard.visualStyle.goal")}
              </span>
              <p className="font-body text-base capitalize text-foreground">{goal}</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-card p-6 shadow-card">
          <div className="inline-flex items-center rounded-full border border-accent/60 bg-accent/55 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-accent-foreground">
            {t("dashboard.catalog.badge")}
          </div>
          <h3 className="font-heading mt-4 text-2xl tracking-[0.02em] text-foreground">{t("dashboard.catalog.title")}</h3>
          <p className="font-body mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {t("dashboard.catalog.description")}
          </p>

          <Button
            size="lg"
            className="mt-5 bg-primary px-8 text-primary-foreground hover:bg-primary/92"
            onClick={() => navigate("/gallery")}
          >
            {t("dashboard.catalog.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        <section className="rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h3 className="font-heading mb-4 text-lg tracking-[0.02em] text-foreground">{t("dashboard.tips.title")}</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {photoTips.map((tip) => (
              <article key={tip.titleKey} className="rounded-xl border border-border/80 bg-background/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden>
                    <tip.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <p className="font-heading text-sm tracking-[0.02em] text-foreground">{t(tip.titleKey)}</p>
                </div>
                <p className="font-body text-sm text-muted-foreground">{t(tip.descriptionKey)}</p>
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
