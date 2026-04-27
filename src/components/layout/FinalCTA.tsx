import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { routes } from "@/lib/routes";

interface FinalCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  to?: string;
}

export const FinalCTA = ({
  title = "¿Listo para usar la IA a tu favor?",
  description = "",
  buttonText = "Empezar ahora",
  to = routes.login,
}: FinalCTAProps) => {
  const navigate = useNavigate();
  const useLiquidButton = buttonText === "Ver herramientas";

  return (
    <section className="relative z-30 flex w-full flex-col items-center justify-start px-6 pb-48 pt-32 md:pb-64 md:pt-44" style={{ background: 'var(--polarist-black, #010101)' }}>
      <div className="flex flex-col items-center text-center">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--polarist-white, #F6F6F6)' }}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-6 max-w-none text-lg leading-relaxed whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: '#F6F6F6' }}>
            {description}
          </p>
        ) : null}
        <div className="mt-10">
          {useLiquidButton ? (
            <LiquidMetalButton label={buttonText} onClick={() => navigate(to)} />
          ) : (
            <ShinyButton
              asChild
              className="inline-flex px-[42px] py-[18px] text-[16px] font-semibold tracking-[0.5px] no-underline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Link to={to}>{buttonText}</Link>
            </ShinyButton>
          )}
        </div>
      </div>
    </section>
  );
};
