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
    <footer
      className={cn(
        "relative w-full overflow-hidden border-t border-black/10 bg-white/50 px-6 py-8 backdrop-blur-[16px] dark:border-white/[0.06] dark:bg-[#050505]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.08)_100%)] dark:bg-none" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(184,219,77,0.2),transparent_34%),radial-gradient(circle_at_82%_86%,rgba(145,198,171,0.16),transparent_40%)] dark:bg-none" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-5 text-center">
        {/* LÍNEA 1: Logo y Slogan */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1.5">
            <BrandLogo showLabel={false} imageClassName="h-5 w-5 rounded-md" />
            <p className="text-[13px] font-semibold tracking-tight text-foreground/82">Polarist</p>
          </div>
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            La forma más simple de usar IA en tu negocio
          </p>
        </div>

        {/* LÍNEA 2: Links */}
        <nav className="flex flex-wrap items-center justify-center gap-2.5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="inline-flex items-center rounded-full border border-black/10 bg-white/55 px-4 py-1.5 text-sm font-semibold text-foreground/82 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.65)] transition-colors hover:bg-white/80 hover:text-foreground dark:border-white/10 dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-white/[0.10] dark:hover:text-white"
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
