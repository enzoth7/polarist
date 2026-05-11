import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type DownloadRow = {
  id: string;
  title: string;
  description: string | null;
  type: "link" | "download";
  url: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type DownloadItem = {
  id: string;
  title: string;
  description: string | null;
  type: "link" | "download";
  url: string;
  imageUrl: string | null;
  sortOrder: number;
};

export function useResourceDownloadsQuery() {
  return useQuery({
    queryKey: ["resource_downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resource_downloads")
        .select("id, title, description, type, url, image_url, sort_order, created_at")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return ((data ?? []) as DownloadRow[]).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        url: row.url,
        imageUrl: row.image_url,
        sortOrder: row.sort_order,
      }));
    },
    staleTime: 60_000,
  });
}
