import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

type ResourceRow = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  kind: string;
  image: string | null;
  content: string | null;
  created_at: string;
};

export type ResourceItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  kind: string;
  image: string | null;
  content: string | null;
  createdAt: string;
};

const mapResourceRow = (row: ResourceRow): ResourceItem => ({
  id: row.id,
  eyebrow: row.eyebrow,
  title: row.title,
  description: row.description,
  kind: row.kind,
  image: row.image,
  content: row.content,
  createdAt: row.created_at,
});

export function useResourcesQuery() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, eyebrow, title, description, kind, image, content, created_at")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return ((data ?? []) as ResourceRow[]).map(mapResourceRow);
    },
    staleTime: 60_000,
  });
}
