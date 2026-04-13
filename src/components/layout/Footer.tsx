import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

import BrandLogo from "@/components/BrandLogo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
  dark?: boolean;
};

const footerLinks = [
  { label: "Términos y Condiciones", to: routes.terms },
  { label: "Política de Privacidad", to: routes.privacy },
  { label: "¿Quiénes somos?", to: routes.about },
  { label: "Contacto", to: routes.contact },
] as const;

const Footer = ({ className, dark }: FooterProps) => {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden px-6 py-8",
        dark
          ? "border-none bg-[#111113]"
          : "border-t border-black/10 bg-background dark:border-white/[0.06] dark:bg-[#050505]",
        className,
      )}
    >
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-5 text-center">
        {/* LÍNEA 1: Logo y Slogan */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1.5">
            <BrandLogo showLabel={false} imageClassName="h-5 w-5 rounded-md" />
            <p className={cn("text-[13px] font-semibold tracking-tight", dark ? "text-white/60" : "text-foreground/82")}>
              Polarist
            </p>
          </div>
          <p className={cn("text-[15px] font-semibold tracking-tight", dark ? "text-white/80" : "text-foreground")}>
            La forma más simple de usar IA en tu vida
          </p>
        </div>

        {/* LÍNEA 2: Links */}
        <nav className="flex flex-wrap items-center justify-center gap-2.5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                "inline-flex items-center px-1 py-1 text-sm font-semibold transition-colors",
                dark
                  ? "text-white/50 hover:text-white"
                  : "text-foreground/82 hover:text-foreground dark:text-white/80 dark:hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* LÍNEA 3: Derechos e Instagram */}
        <div
          className={cn(
            "flex w-full flex-row items-center justify-center gap-3 px-2 py-1 text-sm",
            dark ? "text-white/40" : "text-muted-foreground",
          )}
        >
          <span>© 2026 Polarist. Todos los derechos reservados.</span>
          <a
            href="https://instagram.com/polarist.uy/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("transition-colors hover:text-primary", dark ? "text-white/40" : "text-muted-foreground")}
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
