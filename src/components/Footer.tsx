import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/95 px-4 py-4">
      <nav
        aria-label="Footer links"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 text-muted-foreground"
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
    </footer>
  );
};

export default Footer;
