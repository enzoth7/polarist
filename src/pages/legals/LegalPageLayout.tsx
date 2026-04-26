import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  showSecondaryGlow?: boolean;
};

const LegalPageLayout = ({
  eyebrow,
  title,
  description,
  children,
  showSecondaryGlow = true,
}: LegalPageLayoutProps) => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <div className="relative min-h-full overflow-hidden bg-[#010101] px-4 py-20 md:px-8 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,254,91,0.05),transparent_40%)]"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="max-w-3xl px-4 md:px-0">
          <h1 
            style={sequelStyle}
            className="mt-4 text-[clamp(2.2rem,6vw,4rem)] font-bold tracking-tighter text-[#F6F6F6] leading-[0.95]"
          >
            {title}
          </h1>
          <p 
            style={sequelStyle}
            className="mt-6 text-lg font-normal leading-relaxed text-[#F6F6F6]/60"
          >
            {description}
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 border border-white/10">
          <div className="space-y-10 py-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export const LegalSection = ({ title, children }: LegalSectionProps) => {
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  return (
    <section className="space-y-4">
      <h2 
        style={sequelStyle}
        className="text-2xl font-bold tracking-tight text-[#F6F6F6]"
      >
        {title}
      </h2>
      <div 
        style={sequelStyle}
        className="text-[15px] leading-relaxed font-normal text-[#F6F6F6]/70"
      >
        {children}
      </div>
    </section>
  );
};

export default LegalPageLayout;
