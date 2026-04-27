import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { routes } from "@/lib/routes";

interface FinalCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  to?: string;
}

export const FinalCTA = ({
  title = "¿Listo para dejarte guiar y usar la inteligencia artificial a tu favor?",
  description = "Unite a Polarist y empezá a aprovechar la tecnología a tu favor hoy mismo. Descubrí tu atajo y hacé que la IA trabaje para vos.",
  buttonText = "Empezar ahora",
  to = routes.login,
}: FinalCTAProps) => {
  const navigate = useNavigate();
  const useLiquidButton = buttonText === "Ver herramientas";

  return (
    <section className="relative z-30 flex w-full flex-col items-center justify-start px-6 pt-2 pb-48 md:pt-2 md:pb-64" style={{ background: 'var(--polarist-black, #010101)' }}>
      <div className="flex flex-col items-center text-center">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--polarist-white, #F6F6F6)' }}
        >
          {title}
        </h2>
        <p className="mt-6 max-w-none text-lg leading-relaxed whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: '#F6F6F6' }}>
          {description}
        </p>
        <div className="mt-10">
          {useLiquidButton ? (
            <LiquidMetalButton label={buttonText} onClick={() => navigate(to)} />
          ) : (
            <Link
              to={to}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                padding: '18px 42px',
                background: 'var(--polarist-green, #CAFE5B)',
                color: 'var(--polarist-black, #010101)',
                borderRadius: 'var(--r-pill, 999px)',
                display: 'inline-block',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
