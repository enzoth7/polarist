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
  return (
    <div className="relative min-h-full overflow-hidden bg-[#F0F2F6] px-4 py-20 md:px-8 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_40%)]"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="max-w-3xl px-4 md:px-0">
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter text-zinc-900 leading-[0.95]">{title}</h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-500">{description}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] border border-white/60">
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
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">{title}</h2>
      <div className="text-[15px] leading-relaxed font-medium text-zinc-500">{children}</div>
    </section>
  );
};

export default LegalPageLayout;
