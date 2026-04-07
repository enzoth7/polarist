import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

type MetricPoint = {
  label: string;
  value: number;
  displayValue: string;
  barClassName: string;
};

type MetricCard = {
  key: string;
  title: string;
  better: "higher" | "lower";
  points: MetricPoint[];
};

const metricCards: MetricCard[] = [
  {
    key: "intelligence",
    title: "INTELIGENCIA",
    better: "higher",
    points: [
      {
        label: "Gemini 3.1 Pro Preview",
        value: 57,
        displayValue: "57",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "GPT-5.4 (xhigh)",
        value: 57,
        displayValue: "57",
        barClassName: "bg-[#24262b]",
      },
      {
        label: "Claude Opus 4.6 (max)",
        value: 53,
        displayValue: "53",
        barClassName: "bg-[#c97e60]",
      },
      {
        label: "Claude Sonnet 4.6 (max)",
        value: 52,
        displayValue: "52",
        barClassName: "bg-[#c97f62]",
      },
      {
        label: "GLM-5",
        value: 50,
        displayValue: "50",
        barClassName: "bg-[#2f7cdb]",
      },
      {
        label: "Grok 4.20 Beta 0309",
        value: 48,
        displayValue: "48",
        barClassName: "bg-[#706ac6]",
      },
      {
        label: "Gemini 3 Flash",
        value: 46,
        displayValue: "46",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "DeepSeek V3.2",
        value: 42,
        displayValue: "42",
        barClassName: "bg-[#3351d5]",
      },
      {
        label: "NVIDIA Nemotron Super 49B",
        value: 36,
        displayValue: "36",
        barClassName: "bg-[#86b03b]",
      },
      {
        label: "gpt-oss-120B (high)",
        value: 33,
        displayValue: "33",
        barClassName: "bg-[#2a2b31]",
      },
    ],
  },
  {
    key: "speed",
    title: "VELOCIDAD",
    better: "higher",
    points: [
      {
        label: "Grok 4.20 Beta 0309",
        value: 271,
        displayValue: "271",
        barClassName: "bg-[#706ac6]",
      },
      {
        label: "gpt-oss-120B (high)",
        value: 236,
        displayValue: "236",
        barClassName: "bg-[#24262b]",
      },
      {
        label: "Gemini 3 Flash",
        value: 179,
        displayValue: "179",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "NVIDIA Nemotron Super 49B",
        value: 155,
        displayValue: "155",
        barClassName: "bg-[#86b03b]",
      },
      {
        label: "Gemini 3.1 Pro Preview",
        value: 127,
        displayValue: "127",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "GPT-5.4 (xhigh)",
        value: 74,
        displayValue: "74",
        barClassName: "bg-[#2a2b31]",
      },
      {
        label: "GLM-5",
        value: 70,
        displayValue: "70",
        barClassName: "bg-[#2f7cdb]",
      },
      {
        label: "Claude Sonnet 4.6 (max)",
        value: 67,
        displayValue: "67",
        barClassName: "bg-[#c97e60]",
      },
      {
        label: "DeepSeek V3.2",
        value: 50,
        displayValue: "50",
        barClassName: "bg-[#3351d5]",
      },
      {
        label: "Claude Opus 4.6 (max)",
        value: 49,
        displayValue: "49",
        barClassName: "bg-[#c97f62]",
      },
    ],
  },
  {
    key: "price",
    title: "PRECIO",
    better: "lower",
    points: [
      {
        label: "gpt-oss-120B (high)",
        value: 0.3,
        displayValue: "0.3",
        barClassName: "bg-[#24262b]",
      },
      {
        label: "DeepSeek V3.2",
        value: 0.3,
        displayValue: "0.3",
        barClassName: "bg-[#3351d5]",
      },
      {
        label: "NVIDIA Nemotron Super 49B",
        value: 0.4,
        displayValue: "0.4",
        barClassName: "bg-[#86b03b]",
      },
      {
        label: "Gemini 3 Flash",
        value: 1.1,
        displayValue: "1.1",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "GLM-5",
        value: 1.6,
        displayValue: "1.6",
        barClassName: "bg-[#2f7cdb]",
      },
      {
        label: "Grok 4.20 Beta 0309",
        value: 3,
        displayValue: "3",
        barClassName: "bg-[#706ac6]",
      },
      {
        label: "Gemini 3.1 Pro Preview",
        value: 4.5,
        displayValue: "4.5",
        barClassName: "bg-[#3cae5f]",
      },
      {
        label: "GPT-5.4 (xhigh)",
        value: 5.6,
        displayValue: "5.6",
        barClassName: "bg-[#2a2b31]",
      },
      {
        label: "Claude Sonnet 4.6 (max)",
        value: 6,
        displayValue: "6",
        barClassName: "bg-[#c97e60]",
      },
      {
        label: "Claude Opus 4.6 (max)",
        value: 10,
        displayValue: "10",
        barClassName: "bg-[#c97f62]",
      },
    ],
  },
] as const;

const isBestPoint = (card: MetricCard, value: number) => {
  const values = card.points.map((point) => point.value);
  const bestValue = card.better === "higher" ? Math.max(...values) : Math.min(...values);
  return value === bestValue;
};

export function RadarMetricsBoard() {
  return (
    <section className="space-y-6 pb-3 pt-2 md:space-y-7 md:pb-4 md:pt-3">
      <header className="space-y-4 py-3 text-center md:space-y-5 md:py-5">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
          Análisis de herramientas de IA
        </h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Entender cuál te conviene según lo que necesitás.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {metricCards.map((card) => {
          const maxValue = Math.max(...card.points.map((point) => point.value));

          return (
            <article
              key={card.key}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#060b11]/90 p-5 shadow-[0_28px_64px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_32%,rgba(5,8,13,0.92)_100%)]" />
              <div className="pointer-events-none absolute -top-14 left-1/2 h-24 w-52 -translate-x-1/2 rounded-full bg-[#6ef0aa]/22 blur-3xl" />
              <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-white/20" />

              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-[-0.02em] text-white md:text-2xl">{card.title}</h3>

                <div className="mt-5 h-44">
                  <div className="grid h-full grid-cols-10 items-end gap-2">
                    {card.points.map((point, index) => {
                      const height = Math.max((point.value / maxValue) * 100, 3);
                      const highlight = isBestPoint(card, point.value);

                      return (
                        <div key={`${card.key}-${point.label}`} className="flex h-full flex-col items-center justify-end gap-1">
                          <span className="text-[10px] font-semibold text-white/82">{point.displayValue}</span>
                          <div
                            className={`relative w-full rounded-t-[9px] ${highlight ? "bg-gradient-to-b from-[#cffff2] via-[#4af3c4] to-[#77ff57] shadow-[0_0_22px_rgba(80,255,189,0.45)]" : point.barClassName}`}
                            style={{ height: `${height}%` }}
                            title={`${point.label}: ${point.displayValue}`}
                          />
                          <span className="text-[9px] font-semibold text-white/58">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/56">
                    Referencia
                  </p>
                  <div className="mt-2 grid gap-x-3 gap-y-1.5 sm:grid-cols-2">
                    {card.points.map((point, index) => (
                      <div
                        key={`${card.key}-${point.label}-legend`}
                        className="flex items-center gap-2 text-[10px] text-white/72"
                        title={point.label}
                      >
                        <span
                          className={`inline-flex h-4 min-w-5 items-center justify-center rounded-md px-1 font-semibold ${
                            index === 0 ? "bg-[#CCFF00] text-[#0d1204]" : "bg-white/10 text-white/85"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{point.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button asChild className="rounded-full px-6">
          <Link to={routes.appTools}>
            Ver Herramientas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
