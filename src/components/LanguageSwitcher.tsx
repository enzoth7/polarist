import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS = [
  { code: "es", fullLabelKey: "footer.languageSwitcher.spanish" },
  { code: "en", fullLabelKey: "footer.languageSwitcher.english" },
] as const;

type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

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
            <span className="font-semibold text-xs tracking-wide">{language.code.toUpperCase()}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
