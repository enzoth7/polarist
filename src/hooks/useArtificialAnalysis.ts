import { useQuery } from "@tanstack/react-query";

import {
  buildRadarMetricCardsFromSupabase,
  type RadarMetricCard,
  type RadarMetricKey,
  type RadarMetricPoint,
} from "@/lib/artificialAnalysisMetrics";
import { fetchAIBenchmarks } from "@/hooks/useAIBenchmarks";

export function useArtificialAnalysis() {
  return useQuery({
    queryKey: ["ai_benchmarks", "radar-metrics"],
    queryFn: () => fetchAIBenchmarks(),
    select: (rows) => buildRadarMetricCardsFromSupabase(rows),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export type { RadarMetricCard, RadarMetricKey, RadarMetricPoint };

export type { ArtificialAnalysisModel } from "@/lib/artificialAnalysisMetrics";
export { RADAR_MOCK_MODELS, buildRadarMetricCards } from "@/lib/artificialAnalysisMetrics";
