import { useQuery } from "@tanstack/react-query";

import { type ResourceItem } from "@/hooks/useResources";
import { supabase } from "@/lib/supabase";

type PublicSavedResourceRow = {
  resource_id: string;
  created_at: string;
};

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

type UserSavedResourcesResult = {
  resources: ResourceItem[];
  savedResourceCreatedAtById: Record<string, string>;
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

const fetchUserSavedResources = async (userId: string): Promise<UserSavedResourcesResult> => {
  const { data, error } = await supabase
    .from("resource_saves")
    .select("resource_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const saveRows = (data ?? []) as PublicSavedResourceRow[];
  const savedResourceIds = saveRows.map((row) => row.resource_id);

  if (savedResourceIds.length === 0) {
    return {
      resources: [],
      savedResourceCreatedAtById: {},
    };
  }

  const { data: resourcesData, error: resourcesError } = await supabase
    .from("resources")
    .select("id, eyebrow, title, description, kind, image, content, created_at")
    .in("id", savedResourceIds);

  if (resourcesError) {
    throw resourcesError;
  }

  const resourceById = new Map(
    ((resourcesData ?? []) as ResourceRow[]).map((row) => [row.id, mapResourceRow(row)]),
  );

  return {
    resources: savedResourceIds
      .map((resourceId) => resourceById.get(resourceId))
      .filter((resource): resource is ResourceItem => Boolean(resource)),
    savedResourceCreatedAtById: Object.fromEntries(
      saveRows.map((row) => [row.resource_id, row.created_at]),
    ),
  };
};

export function useUserSavedResources(userId?: string) {
  const query = useQuery({
    queryKey: ["public-user-saved-resources", userId ?? null],
    queryFn: () => fetchUserSavedResources(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  return {
    resources: query.data?.resources ?? [],
    savedResourceCreatedAtById: query.data?.savedResourceCreatedAtById ?? {},
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
