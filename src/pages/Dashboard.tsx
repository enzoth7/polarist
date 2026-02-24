import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bell, Camera, Loader2, Moon, Palette, Settings, Sparkles, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import AvatarUpload from "@/components/AvatarUpload";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { profile, loading, updateProfile } = useBusinessProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [hasNewEnhanced, setHasNewEnhanced] = useState(false);

  const brandName = profile.businessName?.trim() || t("dashboard.brandFallback");
  const stripPrefix = (value: string) => value.replace(/^[A-Z]\)\s*/i, "");
  const normalizeAnswer = (value: string) => stripPrefix(value).replace(/_/g, " ").trim();
  const targetAudience = profile.targetAudience
    ? normalizeAnswer(profile.targetAudience)
    : t("dashboard.visualStyle.addTargetAudience");
  const goal = profile.socialPriorityGoal
    ? normalizeAnswer(profile.socialPriorityGoal)
    : t("dashboard.visualStyle.addGoal");
  const contentVisualStyle = profile.productVisualStyle
    ? normalizeAnswer(profile.productVisualStyle)
    : t("dashboard.visualStyle.addContentStyle", { defaultValue: "Toca para agregar estilo visual" });
  const typography = profile.typographyStatus
    ? normalizeAnswer(profile.typographyStatus)
    : t("dashboard.visualStyle.addTypography", { defaultValue: "Toca para definir tipografía" });

  const extractHexColors = (value: string) => {
    if (!value) return [];
    const sources: string[] = [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (typeof item === "string") sources.push(item);
        });
      }
    } catch {
      // Ignore JSON parse errors and treat as plain string
    }
    if (sources.length === 0) sources.push(value);

    const matches = sources.flatMap((item) => item.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) ?? []);
    return Array.from(new Set(matches));
  };

  const brandPalette = extractHexColors(profile.brandColorsExtra);
  const paletteFallback = t("dashboard.visualStyle.addPalette", { defaultValue: "Toca para agregar colores" });

  const profileItems = [
    {
      key: "targetAudience",
      label: t("dashboard.visualStyle.targetAudience"),
      value: targetAudience,
      type: "text",
    },
    {
      key: "goal",
      label: t("dashboard.visualStyle.goal"),
      value: goal,
      type: "text",
    },
    {
      key: "contentStyle",
      label: t("dashboard.visualStyle.contentStyle", { defaultValue: "Estilo visual del contenido" }),
      value: contentVisualStyle,
      type: "text",
    },
    {
      key: "palette",
      label: t("dashboard.visualStyle.palette", { defaultValue: "Paleta de colores" }),
      colors: brandPalette,
      fallback: paletteFallback,
      type: "palette",
    },
    {
      key: "typography",
      label: t("dashboard.visualStyle.typography", { defaultValue: "Tipografía" }),
      value: typography,
      type: "text",
    },
  ] as const;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return t("dashboard.greetings.morning");
    if (hour >= 12 && hour < 19) return t("dashboard.greetings.afternoon");
    return t("dashboard.greetings.night");
  };

  const [greetingText, setGreetingText] = useState(getGreeting);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setGreetingText(getGreeting());
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [t]);

  const checkForNewEnhanced = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setHasNewEnhanced(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_images")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", "enhanced")
        .eq("viewed", false)
        .limit(1);

      if (error) throw error;
      setHasNewEnhanced((data?.length ?? 0) > 0);
    } catch (error) {
      console.error("Error checking new photos:", error);
      setHasNewEnhanced(false);
    }
  };

  useEffect(() => {
    void checkForNewEnhanced();
  }, []);

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

      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-10 pt-24 md:px-6 md:pt-28">
        <section className="flex items-center gap-4">
          <AvatarUpload
            avatarUrl={profile.avatarUrl || null}
            onUpload={(url) => {
              updateProfile({ avatarUrl: url });
            }}
            size={64}
          />
          <div className="flex w-full items-center">
            <div className="flex flex-col rounded-xl border border-border bg-card px-5 py-3">
              <span className="text-sm text-muted-foreground">{greetingText}</span>
              <span className="text-xl md:text-3xl font-heading font-bold text-foreground">{brandName}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/gallery")}
              className="ml-auto mr-6 relative flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label={t("dashboard.notifications")}
              title={t("dashboard.notifications")}
            >
              <Bell
                className={`h-7 w-7 ${hasNewEnhanced ? "text-green-500" : "text-muted-foreground"}`}
                strokeWidth={1.8}
              />
              {hasNewEnhanced ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" aria-hidden />
              ) : null}
            </button>
          </div>
        </section>

        <div className="mt-6 space-y-4 rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h2 className="text-2xl md:text-2xl font-heading text-foreground whitespace-nowrap">
            {t("dashboard.heroQuestion")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("dashboard.heroHelper")}</p>
          <section className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/gallery")}
              className="flex w-full min-h-[140px] flex-col items-start justify-between rounded-2xl bg-[#685BC8] p-4 text-left text-white transition hover:bg-[#5a4db5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:min-h-[160px] cursor-pointer"
            >
              <Camera className="h-10 w-10 text-white/80" strokeWidth={1.8} />
              <span className="text-xl md:text-2xl font-heading font-bold text-white">{t("dashboard.actions.photo")}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/design")}
              className="flex w-full min-h-[140px] flex-col items-start justify-between rounded-2xl bg-[#685BC8] p-4 text-left text-white transition hover:bg-[#5a4db5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:min-h-[160px] cursor-pointer"
            >
              <Palette className="h-10 w-10 text-white/80" strokeWidth={1.8} />
              <span className="text-xl md:text-2xl font-heading font-bold text-white">{t("dashboard.actions.design")}</span>
            </button>
          </section>

          <section>
            <button
              type="button"
              onClick={() => navigate("/creations")}
              className="flex w-full items-center justify-between rounded-2xl bg-[#FF5729] px-5 py-4 text-left text-white transition hover:bg-[#e84d24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-white/80" strokeWidth={1.8} />
                <span className="text-base font-heading font-semibold text-white">{t("dashboard.actions.creations")}</span>
              </span>
              <ArrowRight className="h-5 w-5 text-white/80" />
            </button>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-black/5 bg-card p-5 shadow-soft md:p-6">
          <h2 className="font-heading text-xl tracking-[0.02em] text-foreground">{t("dashboard.visualStyle.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.visualStyle.helper")}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profileItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate("/preferences")}
                className="rounded-xl border border-border/80 bg-background/70 p-4 text-left cursor-pointer"
              >
                <span className="font-body mb-1 block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </span>
                {item.type === "palette" ? (
                  item.colors.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {item.colors.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: color }}
                          title={color}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-base text-foreground">{item.fallback}</p>
                  )
                ) : (
                  <p className="font-body text-base capitalize text-foreground">{item.value}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
