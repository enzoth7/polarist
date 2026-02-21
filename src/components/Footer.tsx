import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full border-t border-border bg-[#F0F0F0]/95 px-4 py-5">
      <div className="mx-auto flex w-full max-w-6xl flex-nowrap items-center justify-center gap-x-1 sm:gap-x-2">
        <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
          <Link to="/contact">{t("footer.links.contact")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
          <Link to="/about">{t("footer.links.about")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
          <Link to="/privacy">{t("footer.links.privacy")}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
          <Link to="/terms">{t("footer.links.terms")}</Link>
        </Button>
      </div>
      <div className="mx-auto mt-3 flex w-full max-w-6xl items-center justify-center">
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
