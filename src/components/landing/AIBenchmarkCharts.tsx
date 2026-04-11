import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';

const API_URL = "/api/metrics";

interface ModelData {
  id: string;
  name: string;
  slug: string;
  model_creator: {
    name: string;
    slug: string;
  };
  evaluations: {
    artificial_analysis_intelligence_index: number;
  };
  pricing: {
    price_1m_blended_3_to_1: number;
  };
  median_output_tokens_per_second: number;
}

const CREATOR_COLORS: Record<string, string> = {
  google: "#4285F4",
  openai: "#10a37f",
  anthropic: "#cc785c",
  meta: "#0668E1",
  mistral: "#f5d142",
  deepseek: "#4d6edb",
  xai: "#ffffff",
  nvidia: "#76b900",
  alibaba: "#ff6a00",
  cohere: "#3d5afe"
};

const AIBenchmarkCharts = () => {
  const [data, setData] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Metrics proxy error: ${response.status}`);
        }
        const json = await response.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching AI benchmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTopModels = (key: 'intelligence' | 'speed' | 'price', limit = 10) => {
    const sorted = [...data];
    if (key === 'intelligence') {
      sorted.sort((a, b) => (b.evaluations.artificial_analysis_intelligence_index || 0) - (a.evaluations.artificial_analysis_intelligence_index || 0));
    } else if (key === 'speed') {
      sorted.sort((a, b) => (b.median_output_tokens_per_second || 0) - (a.median_output_tokens_per_second || 0));
    } else {
      sorted.sort((a, b) => (a.pricing.price_1m_blended_3_to_1 || 0) - (b.pricing.price_1m_blended_3_to_1 || 0));
    }
    return sorted.slice(0, limit).map((m, i) => ({
      ...m,
      displayIndex: (i + 1).toString().padStart(2, '0'),
      value: key === 'intelligence' 
        ? (m.evaluations.artificial_analysis_intelligence_index || 0)
        : key === 'speed' 
          ? (m.median_output_tokens_per_second || 0)
          : (m.pricing.price_1m_blended_3_to_1 || 0),
      color: CREATOR_COLORS[m.model_creator.slug] || "#8884d8"
    }));
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center bg-black">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#CCFF00] border-t-transparent"></div>
    </div>
  );

  const charts = [
    { title: "INTELIGENCIA", key: 'intelligence' as const, color: "#9333ea" },
    { title: "VELOCIDAD", key: 'speed' as const, color: "#CCFF00" },
    { title: "PRECIO", key: 'price' as const, color: "#f97316" }
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-20 bg-[#050505]">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl lg:text-7xl">
          Análisis de benchmarks
        </h2>
        <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
          Comparamos los modelos más avanzados del mundo en tiempo real utilizando la API de Artificial Analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {charts.map((chart) => {
          const chartData = getTopModels(chart.key);
          return (
            <div key={chart.key} className="flex flex-col rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 p-8 shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chart.color, boxShadow: `0 0 10px ${chart.color}` }}></div>
                  <h3 className="text-xl font-bold tracking-widest text-white uppercase">{chart.title}</h3>
                </div>
                <div className="text-[10px] font-bold text-zinc-600 px-2 py-1 rounded border border-white/5 bg-white/[0.02]">TOP 10</div>
              </div>

              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 20 }}>
                    <CartesianGrid vertical={false} stroke="#1f1f1f" strokeDasharray="0 0" />
                    <XAxis 
                      dataKey="displayIndex" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#525252', fontSize: 10, fontWeight: '800' }} 
                      dy={10}
                    />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-md">
                              <p className="text-[10px] font-bold text-zinc-500 mb-1">{item.model_creator.name}</p>
                              <p className="text-sm font-black text-white">{item.name}</p>
                              <p className="mt-2 text-xs font-bold" style={{ color: item.color }}>
                                {item.value < 1 ? item.value.toFixed(4) : item.value.toLocaleString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          fillOpacity={0.8}
                        />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="top" 
                        formatter={(val: number) => val < 1 ? val.toFixed(1) : Math.round(val)}
                        style={{ fill: '#efefef', fontSize: 10, fontWeight: '800' }}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-auto pt-10 border-t border-white/5">
                <div className="grid grid-cols-1 gap-y-3">
                  {chartData.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-700 w-4">{item.displayIndex}</span>
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 overflow-hidden">
                          <img 
                            src={`/logos/ai/${item.model_creator.slug}.png`} 
                            alt={item.model_creator.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=artificialanalysis.ai&sz=64";
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors truncate max-w-[150px]">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-white">
                        {item.value < 1 ? item.value.toFixed(1) : Math.round(item.value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
          Powered by <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="text-[#CCFF00] hover:underline">Artificial Analysis</a>
        </p>
      </div>
    </div>
  );
};

export default AIBenchmarkCharts;
