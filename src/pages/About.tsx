import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const About = () => {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-border bg-card/50 p-8 shadow-card md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="font-heading text-3xl tracking-tight">{t("about.title")}</h1>
          <p className="font-body text-base leading-relaxed text-muted-foreground">{t("about.paragraph1")}</p>
          <p className="font-body text-base leading-relaxed text-muted-foreground">{t("about.paragraph2")}</p>
          <Button asChild variant="outline">
            <Link to="/">{t("common.returnHome")}</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center">
          {imageError ? (
            <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-background/70 p-6">
              <Sparkles className="h-16 w-16 text-primary" strokeWidth={1.5} />
              <p className="font-body text-sm text-muted-foreground">{t("about.logoFallback")}</p>
            </div>
          ) : (
            <img
              src="/Logo1080x720.jpg.jpeg"
              alt={t("brand.logoAlt")}
              className="h-100 w-full rounded-xl border object-contain p-0"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default About;
