import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type DownloadRow = {
  id: string;
  title: string;
  description: string | null;
  type: "link" | "download";
  url: string;
  sort_order: number;
  folder: string;
  subfolder: string | null;
  logo: string | null;
  created_at: string;
};

export type DownloadItem = {
  id: string;
  title: string;
  description: string | null;
  type: "link" | "download";
  url: string;
  sortOrder: number;
  folder: string;
  subfolder: string | null;
  logo: string | null;
};

export function useResourceDownloadsQuery() {
  return useQuery({
    queryKey: ["resource_downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resource_downloads")
        .select("id, title, description, type, url, sort_order, folder, subfolder, logo, created_at")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return ((data ?? []) as DownloadRow[]).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        url: row.url,
        sortOrder: row.sort_order,
        folder: row.folder,
        subfolder: row.subfolder,
        logo: row.logo,
      }));
    },
    staleTime: 60_000,
  });
}
