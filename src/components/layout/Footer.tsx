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
      className={cn("relative w-full overflow-hidden px-6 py-6", className)}
      style={{ background: "var(--polarist-black, #010101)" }}
    >
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-5 text-center">
        {/* LÍNEA 1: Logo y Slogan */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-1.5">
            <BrandLogo showLabel={false} imageClassName="h-6 w-6 rounded-md" />
          </div>
          <p style={{ fontFamily: 'var(--font-sequel, sans-serif)', fontWeight: 400, fontSize: '15px', color: 'rgba(255,255,255,0.8)' }} className="tracking-tight">
            Tu camino más fácil hacia la IA.
          </p>
        </div>

        {/* LÍNEA 2: Links */}
        <nav className="flex flex-wrap items-center justify-center gap-2.5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="inline-flex items-center px-1 py-1 transition-colors hover:text-white"
              style={{ fontFamily: 'var(--font-sequel, sans-serif)', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* LÍNEA 3: Derechos e Instagram */}
        <div
          className="flex w-full flex-row items-center justify-center gap-3 px-2 py-1"
          style={{ fontFamily: 'var(--font-sequel, sans-serif)', fontWeight: 300, fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}
        >
          <span>© 2026 Polarist. Todos los derechos reservados.</span>
          <a
            href="https://instagram.com/polarist.uy/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
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
