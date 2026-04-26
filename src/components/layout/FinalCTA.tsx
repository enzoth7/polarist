import { Link } from "react-router-dom";
import { routes } from "@/lib/routes";

interface FinalCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  to?: string;
}

export const FinalCTA = ({
  title = "¿Listo para transformar tu negocio?",
  description = "Unite a los que ya están usando inteligencia artificial para trabajar mejor.",
  buttonText = "Empezar ahora",
  to = routes.login,
}: FinalCTAProps) => {
  return (
    <section className="relative z-30 flex w-full flex-col items-center justify-start px-6 pt-2 pb-48 md:pt-2 md:pb-64" style={{ background: 'var(--polarist-black, #010101)' }}>
      <div className="flex flex-col items-center text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--polarist-white, #F6F6F6)' }}
        >
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: 'rgba(246,246,246,0.45)' }}>
          {description}
        </p>
        <div className="mt-10">
          <Link
            to={to}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              padding: '13px 26px',
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
        </div>
      </div>
    </section>
  );
};
