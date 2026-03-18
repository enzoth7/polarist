import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const LegalPageLayout = ({ eyebrow, title, description, children }: LegalPageLayoutProps) => {
  return (
    <div className="relative min-h-full overflow-hidden bg-background px-4 py-10 md:px-8 md:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_38%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.12),transparent_28%)]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">{description}</p>
        </div>

        <Card className="rounded-[2rem] border-border/60 bg-card/95 shadow-card backdrop-blur-xl">
          <CardContent className="p-6 md:p-8">{children}</CardContent>
        </Card>
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
    <section className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5 shadow-soft">
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardDescription className="px-0 pt-0 text-sm leading-7 text-muted-foreground">{children}</CardDescription>
    </section>
  );
};

export default LegalPageLayout;
