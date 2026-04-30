import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAIBenchmarks, type AIBenchmarkRow } from "@/hooks/useAIBenchmarks";

type ChartKey = "intelligence" | "speed" | "price";

const CHARTS: { title: string; subtitle: string; key: ChartKey }[] = [
  { title: "Inteligencia", subtitle: "Más alto es mejor", key: "intelligence" },
  { title: "Velocidad",    subtitle: "Más alto es mejor", key: "speed"        },
  { title: "Precio",       subtitle: "Más bajo es mejor", key: "price"        },
];

const BAR_COLOR = "#CAFE5B";

function getTopModels(rows: AIBenchmarkRow[], key: ChartKey, limit = 10) {
  const sorted = [...rows].sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    return key === "price" ? av - bv : bv - av;
  });

  return sorted.slice(0, limit).map((row, i) => ({
    ...row,
    rank: (i + 1).toString().padStart(2, "0"),
    value: row[key] ?? 0,
  }));
}

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ReturnType<typeof getTopModels>[number] }[];
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-md">
      <p className="text-sm font-bold text-white">{item.name}</p>
      <p className="mt-1 text-xs text-[#CAFE5B]">
        {item.value < 1 ? item.value.toFixed(4) : item.value.toLocaleString()}
      </p>
    </div>
  );
};

const AIBenchmarkCharts = () => {
  const { data = [], isLoading } = useAIBenchmarks();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-20 bg-[#050505]">
      <div className="mb-16 text-center">
        <h2
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
        >
          Empresas tecnológicas que llevan el liderazgo
        </h2>
        <p className="mt-4 text-zinc-500 text-base max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sequel, sans-serif)" }}>
          Cuadros comparativos de inteligencia, velocidad y precio que ofrece cada motor de IA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {CHARTS.map((chart) => {
          const chartData = getTopModels(data, chart.key);
          return (
            <div
              key={chart.key}
              className="flex flex-col rounded-[2rem] bg-[#0A0A0A] border border-white/5 p-8 shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
                >
                  {chart.title}
                </h3>
                <div className="text-[10px] font-bold text-zinc-600 px-2 py-1 rounded border border-white/5 bg-white/[0.02]">
                  —
                </div>
              </div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-sequel, sans-serif)" }}>
                {chart.subtitle}
              </p>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 10 }}>
                    <CartesianGrid vertical={false} stroke="#1a1a1a" strokeDasharray="0 0" />
                    <XAxis
                      dataKey="rank"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#525252", fontSize: 9, fontWeight: 800 }}
                      dy={8}
                    />
                    <YAxis hide domain={[0, "auto"]} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLOR} fillOpacity={0.7} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="top"
                        formatter={(val: number) =>
                          val < 1 ? val.toFixed(1) : Math.round(val)
                        }
                        style={{ fill: "#efefef", fontSize: 9, fontWeight: 800 }}
                        offset={8}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-3 justify-center">
                {chartData.map((item) => (
                  <div
                    key={item.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                    title={item.name}
                  >
                    {item.icon_filename ? (
                      <img
                        src={`/logos/ai/${item.icon_filename}`}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-[8px] font-black text-zinc-500">
                        {item.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIBenchmarkCharts;
