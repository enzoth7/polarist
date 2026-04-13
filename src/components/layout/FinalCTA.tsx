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
    <section className="relative z-30 flex w-full flex-col items-center justify-center bg-[#111113] px-6 py-24 md:py-32">
      <div className="flex flex-col items-center text-center">
        <h2
          className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/50">
          {description}
        </p>
        <div className="mt-10">
          <Link
            to={to}
            className="inline-flex items-center rounded-[28px] border border-white/80 bg-gradient-to-b from-white to-[#f4f4f7] px-10 py-4 text-[17px] font-bold tracking-tight text-[#1a1a1a] shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,1)] ring-1 ring-black/[0.04] transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,1)] active:scale-95"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};
