import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

import BrandLogo from "@/components/BrandLogo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

const footerLinks = [
  { label: "Términos y Condiciones", to: routes.terms },
  { label: "Política de Privacidad", to: routes.privacy },
  { label: "¿Quiénes somos?", to: routes.about },
  { label: "Contacto", to: routes.contact },
] as const;

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("w-full border-t border-border/60 bg-muted/20 px-6 py-10", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
        {/* LÍNEA 1: Logo y Slogan */}
        <div className="flex flex-row items-center justify-center gap-2">
          <BrandLogo showLabel={false} imageClassName="h-5 w-5 rounded-md" />
          <p className="text-base font-bold tracking-tight text-foreground">
            Polarist - Atajos de IA para dueños de negocios
          </p>
        </div>

        {/* LÍNEA 2: Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* LÍNEA 3: Derechos e Instagram SOLO LOGO */}
        <div className="flex w-full flex-row items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>© 2026 Polarist. Todos los derechos reservados.</span>
          <a
            href="https://instagram.com/polarist.uy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="Instagram oficial de Polarist"
          >
            <Instagram className="h-6 w-6 stroke-[1.5px]" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
