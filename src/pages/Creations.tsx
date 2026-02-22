import { useTranslation } from "react-i18next";

const Creations = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-heading text-foreground">{t("dashboard.actions.creations")}</h1>
        <p className="mt-2 text-muted-foreground">Próximamente</p>
      </div>
    </div>
  );
};

export default Creations;
