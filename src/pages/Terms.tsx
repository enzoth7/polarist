import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">{t("terms.title")}</h1>
          <p className="font-body text-sm text-muted-foreground">{t("terms.lastUpdate")}</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.1.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.1.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.2.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.2.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.3.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.3.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.4.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.4.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.5.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.5.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.6.title")}</h2>
          <p className="font-body text-muted-foreground">{t("terms.sections.6.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-medium">{t("terms.sections.7.title")}</h2>
          <p className="font-body text-muted-foreground">
            {t("terms.sections.7.bodyBefore")}{" "}
            <a className="underline underline-offset-4" href="mailto:polarist@gmail.com">
              polarist@gmail.com
            </a>
            .
          </p>
        </section>

        <Button asChild variant="outline">
          <Link to="/">{t("common.returnHome")}</Link>
        </Button>
      </div>
    </main>
  );
};

export default Terms;
