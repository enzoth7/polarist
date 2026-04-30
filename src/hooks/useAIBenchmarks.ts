import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export type AIBenchmarkRow = {
  id: number;
  name: string;
  icon_filename: string | null;
  intelligence: number | null;
  speed: number | null;
  price: number | null;
};

export async function fetchAIBenchmarks(): Promise<AIBenchmarkRow[]> {
  const { data, error } = await supabase
    .from("ai_benchmarks")
    .select("id, name, icon_filename, intelligence, speed, price");

  if (error) throw error;
  return (data ?? []) as AIBenchmarkRow[];
}

export function useAIBenchmarks() {
  return useQuery({
    queryKey: ["ai_benchmarks"],
    queryFn: fetchAIBenchmarks,
    staleTime: 5 * 60_000,
  });
}
