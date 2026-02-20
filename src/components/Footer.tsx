import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-[#F0F0F0]/95 px-4 py-5">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:gap-x-2">
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
    </footer>
  );
};

export default Footer;
