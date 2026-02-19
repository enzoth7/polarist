import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/95 px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-1 overflow-x-auto whitespace-nowrap sm:gap-2">
        <Button asChild variant="ghost" size="sm" className="shrink-0 font-body text-muted-foreground hover:text-foreground">
          <Link to="/contact">Contacto</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="shrink-0 font-body text-muted-foreground hover:text-foreground">
          <Link to="/about">Quiénes Somos</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="shrink-0 font-body text-muted-foreground hover:text-foreground">
          <Link to="/privacy">Privacidad</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="shrink-0 font-body text-muted-foreground hover:text-foreground">
          <Link to="/terms">Términos</Link>
        </Button>
        <a
          href="https://www.instagram.com/jaquematefilms/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
