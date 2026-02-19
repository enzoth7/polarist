import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/95 px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-3">
        {/* Left spacer - hidden on mobile, helps center nav on desktop */}
        <div className="hidden md:block" />

        {/* Center Navigation */}
        <nav
          aria-label="Footer links"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-muted-foreground"
        >
          <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
            <Link to="/contact">Contacto</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
            <Link to="/about">Quiénes Somos</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
            <Link to="/privacy">Privacidad</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground">
            <Link to="/terms">Términos</Link>
          </Button>
        </nav>

        {/* Right Social Icons */}
        <div className="flex items-center justify-center gap-4 md:justify-end">
          <a
            href="https://www.instagram.com/jaquematefilms/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
