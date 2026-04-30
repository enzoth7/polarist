import { useQuery } from "@tanstack/react-query";

import { toModernImageAsset } from "@/lib/assetPaths";
import { supabase } from "@/lib/supabase";
import type { CinematicSliderItem } from "@/components/radar/CinematicSlider";

type TrendRow = {
  id: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  glow: string;
  sort_order: number;
  created_at: string;
};

const mapTrendRow = (row: TrendRow): CinematicSliderItem => ({
  title: row.title,
  description: row.description,
  image: toModernImageAsset(row.image) ?? row.image,
  accent: row.accent,
  glow: row.glow,
});

async function fetchTrends(): Promise<CinematicSliderItem[]> {
  const { data, error } = await supabase
    .from("trends")
    .select("id, title, description, image, accent, glow, sort_order, created_at")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as TrendRow[]).map(mapTrendRow);
}

export function useTrends() {
  return useQuery({
    queryKey: ["trends"],
    queryFn: fetchTrends,
    staleTime: 5 * 60_000,
  });
}
