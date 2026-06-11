import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

type ResourceRow = {
  id: string;
  title: string;
  description: string;
  kind: string;
  image: string | null;
  content: string | null;
  created_at: string;
  nivel: string | null;
};

export type ResourceItem = {
  id: string;
  title: string;
  description: string;
  kind: string;
  image: string | null;
  content: string | null;
  createdAt: string;
  nivel: string | null;
};

const mapResourceRow = (row: ResourceRow): ResourceItem => ({
  id: row.id,
  title: row.title,
  description: row.description,
  kind: row.kind,
  image: row.image,
  content: row.content,
  createdAt: row.created_at,
  nivel: row.nivel,
});

export function useResourcesQuery() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description, kind, image, content, created_at, nivel")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return ((data ?? []) as ResourceRow[]).map(mapResourceRow);
    },
    staleTime: 60_000,
  });
}
