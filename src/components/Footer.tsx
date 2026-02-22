import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full border-t border-border/40 bg-background/95 px-4 pt-1 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-6xl flex-nowrap items-center justify-center gap-x-0 sm:gap-x-0.5">
        <Button asChild variant="ghost" size="sm" className="font-body !px-1.5 text-muted-foreground hover:text-foreground sm:!px-2">
          <Link to="/contact">{t("footer.links.contact")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body !px-1.5 text-muted-foreground hover:text-foreground sm:!px-2">
          <Link to="/about">{t("footer.links.about")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body !px-1.5 text-muted-foreground hover:text-foreground sm:!px-2">
          <Link to="/privacy">{t("footer.links.privacy")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body !px-1.5 text-muted-foreground hover:text-foreground sm:!px-2">
          <Link to="/terms">{t("footer.links.terms")}</Link>
        </Button>
      </div>
      <div className="mx-auto mt-3 flex w-full max-w-6xl items-center justify-start">
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
        <a
          href="https://www.instagram.com/polarist.uy/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("footer.social.instagramAriaLabel")}
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
