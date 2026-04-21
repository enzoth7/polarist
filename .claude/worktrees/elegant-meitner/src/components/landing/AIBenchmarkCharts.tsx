import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

const API_URL = "/api/metrics";

interface ModelData {
  id: string;
  name: string;
  slug: string;
  model_creator: { name: string; slug: string };
  evaluations: { artificial_analysis_intelligence_index: number };
  pricing: { price_1m_blended_3_to_1: number };
  median_output_tokens_per_second: number;
}

type ChartEntry = ModelData & { value: number; color: string };

const CREATOR_COLORS: Record<string, string> = {
  google:    '#4285F4',
  openai:    '#10a37f',
  anthropic: '#cc785c',
  meta:      '#0668E1',
  mistral:   '#d97706',
  deepseek:  '#4d6edb',
  xai:       '#374151',
  nvidia:    '#76b900',
  alibaba:   '#ff6a00',
  cohere:    '#3d5afe',
};

/* ── Tick SVG: SOLO el logo, sin texto ── */
const LogoTick = ({
  x, y, payload, models,
}: {
  x: number; y: number;
  payload: { value: string };
  models: ChartEntry[];
}) => {
  const model = models.find(m => m.name === payload.value);
  const slug  = model?.model_creator?.slug ?? '';
  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={`/logos/ai/${slug}.png`}
        x={-12} y={6}
        width={24} height={24}
      />
    </g>
  );
};

/* ── Tooltip ── */
const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ChartEntry;
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-2xl">
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
        {item.model_creator.name}
      </p>
      <p className="mt-0.5 text-sm font-bold text-gray-900">{item.name}</p>
      <p className="mt-2 text-base font-black" style={{ color: item.color }}>
        {item.value < 1 ? item.value.toFixed(2) : item.value.toLocaleString('es-ES')}
      </p>
    </div>
  );
};

/* ── Main ── */
const AIBenchmarkCharts = () => {
  const [data,    setData]    = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(API_URL);
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        if (json.data) setData(json.data);
      } catch (e) {
        console.error('AIBenchmarkCharts:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTopModels = (key: 'intelligence' | 'speed' | 'price', limit = 10): ChartEntry[] => {
    const sorted = [...data];
    if (key === 'intelligence') {
      sorted.sort((a, b) =>
        (b.evaluations.artificial_analysis_intelligence_index ?? 0) -
        (a.evaluations.artificial_analysis_intelligence_index ?? 0));
    } else if (key === 'speed') {
      sorted.sort((a, b) =>
        (b.median_output_tokens_per_second ?? 0) -
        (a.median_output_tokens_per_second ?? 0));
    } else {
      sorted.sort((a, b) =>
        (a.pricing.price_1m_blended_3_to_1 ?? 0) -
        (b.pricing.price_1m_blended_3_to_1 ?? 0));
    }
    return sorted.slice(0, limit).map(m => ({
      ...m,
      value:
        key === 'intelligence' ? (m.evaluations.artificial_analysis_intelligence_index ?? 0) :
        key === 'speed'        ? (m.median_output_tokens_per_second ?? 0) :
                                 (m.pricing.price_1m_blended_3_to_1 ?? 0),
      color: CREATOR_COLORS[m.model_creator.slug] ?? '#8884d8',
    }));
  };

  const CHARTS = [
    { key: 'intelligence' as const, title: 'Intelligence', accent: '#7c3aed',
      subtitle: 'Artificial Analysis Intelligence Index; Higher is better' },
    { key: 'speed'        as const, title: 'Speed',        accent: '#d97706',
      subtitle: 'Median output tokens per second; Higher is better' },
    { key: 'price'        as const, title: 'Price',        accent: '#ef4444',
      subtitle: 'Price, blended 3:1 input/output ($/1M tokens); Lower is better' },
  ];

  const updatedAt = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="flex h-96 items-center justify-center bg-[#0a0a0a]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-20 bg-[#0a0a0a]">

      {/* Header */}
      <div className="mb-14 text-center">
        <h2
          className="text-4xl font-bold text-white sm:text-5xl lg:text-[3.25rem] leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Radar de modelos de IA
        </h2>
        <p className="mt-4 text-base font-light text-zinc-400 max-w-xl mx-auto">
          Benchmarks comparativos de inteligencia, velocidad y precio,
          con una lectura visual limpia.
        </p>
        <p className="mt-2 text-xs text-zinc-600 tracking-wide">
          Fuente: Artificial Analysis&nbsp;&nbsp;|&nbsp;&nbsp;Actualizado {updatedAt}
        </p>
      </div>

      {/* ── 3 cards, proporción 5:4 ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {CHARTS.map(({ key, title, subtitle, accent }) => {
          const chartData = getTopModels(key);

          return (
            <div
              key={key}
              className="flex flex-col rounded-2xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.18)]"
              style={{ aspectRatio: '5 / 4' }}
            >
              {/* ── Cabecera ── */}
              <div className="flex items-start gap-3 px-6 pt-6 pb-3">
                <div
                  className="mt-[6px] h-3 w-3 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: accent }}
                />
                <div>
                  <h3
                    className="text-2xl font-bold leading-tight text-gray-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 text-[10.5px] leading-snug text-gray-400">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* ── Área de gráfico + etiquetas ── */}
              <div className="flex flex-1 flex-col px-4 pb-5 min-h-0">

                {/* Recharts: barras + logos en XAxis */}
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 18, right: 6, left: 0, bottom: 36 }}
                      barCategoryGap="40%"
                    >
                      <CartesianGrid vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        height={36}
                        tick={(props: any) => (
                          <LogoTick {...props} models={chartData} />
                        )}
                      />
                      <YAxis hide width={0} />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                        content={(p: any) => <ChartTooltip {...p} />}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={22}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="top"
                          offset={5}
                          formatter={(v: number) =>
                            v < 1 ? v.toFixed(1) : Math.round(v).toLocaleString()
                          }
                          style={{
                            fill: '#64748b', fontSize: 9,
                            fontWeight: 700,
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ── Fila de nombres: elemento HTML separado ── */}
                <div
                  className="mt-1"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${chartData.length}, 1fr)`,
                  }}
                >
                  {chartData.map((m) => {
                    const short = m.name.length > 9 ? m.name.slice(0, 9) + '…' : m.name;
                    return (
                      <div
                        key={m.id}
                        className="flex flex-col items-center"
                        title={m.name}
                      >
                        <span
                          className="text-center leading-tight text-gray-400"
                          style={{
                            fontSize: '7px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            wordBreak: 'break-all',
                          }}
                        >
                          {short}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="text-[11px] text-zinc-600 tracking-widest uppercase font-medium">
          Powered by{' '}
          <a
            href="https://artificialanalysis.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
          >
            Artificial Analysis
          </a>
        </p>
      </div>
    </section>
  );
};

export default AIBenchmarkCharts;
