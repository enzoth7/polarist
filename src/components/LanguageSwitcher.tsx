import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS = [
  { code: "es", fullLabelKey: "footer.languageSwitcher.spanish" },
  { code: "en", fullLabelKey: "footer.languageSwitcher.english" },
] as const;

type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

const SpainFlagIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 overflow-hidden rounded-full" aria-hidden>
    <rect width="24" height="24" fill="#AA151B" />
    <rect y="6" width="24" height="12" fill="#F1BF00" />
  </svg>
);

const UsaFlagIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 overflow-hidden rounded-full" aria-hidden>
    <rect width="24" height="24" fill="#FFFFFF" />
    <rect y="0" width="24" height="2.4" fill="#B22234" />
    <rect y="4.8" width="24" height="2.4" fill="#B22234" />
    <rect y="9.6" width="24" height="2.4" fill="#B22234" />
    <rect y="14.4" width="24" height="2.4" fill="#B22234" />
    <rect y="19.2" width="24" height="2.4" fill="#B22234" />
    <rect width="10.8" height="10.2" fill="#3C3B6E" />
  </svg>
);

const FlagIcon = ({ language }: { language: LanguageCode }) =>
  language === "es" ? <SpainFlagIcon /> : <UsaFlagIcon />;

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "es").split("-")[0] as LanguageCode;

  const handleLanguageChange = (language: LanguageCode) => {
    if (language !== currentLanguage) {
      void i18n.changeLanguage(language);
    }
  };

  return (
    <div
      role="group"
      aria-label={t("footer.languageSwitcher.label")}
      className="inline-flex items-center rounded-md border border-border/70 bg-background/55 p-1 shadow-soft"
    >
      {LANGUAGE_OPTIONS.map((language) => {
        const isActive = currentLanguage === language.code;

        return (
          <Button
            key={language.code}
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={isActive}
            aria-label={t(language.fullLabelKey)}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "h-7 w-8 px-0 text-muted-foreground hover:text-foreground",
              isActive && "bg-secondary text-foreground",
            )}
          >
            <FlagIcon language={language.code} />
          </Button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
