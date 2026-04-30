import { useQuery } from "@tanstack/react-query";

import { fetchTools, type ToolItem } from "@/hooks/useTools";
import { supabase } from "@/lib/supabase";

type PublicSavedToolRow = {
  tool_id: string;
  created_at: string;
};

type UserSavedToolsResult = {
  tools: ToolItem[];
  savedToolCreatedAtById: Record<string, string>;
};

const fetchUserSavedTools = async (userId: string): Promise<UserSavedToolsResult> => {
  const { data, error } = await supabase
    .from("tool_saves")
    .select("tool_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const toolRows = (data ?? []) as PublicSavedToolRow[];
  const savedToolNames = toolRows.map((row) => row.tool_id);

  if (savedToolNames.length === 0) {
    return {
      tools: [],
      savedToolCreatedAtById: {},
    };
  }

  const tools = await fetchTools({ names: savedToolNames });
  const savedToolCreatedAtById = Object.fromEntries(
    toolRows.map((row) => [row.tool_id, row.created_at]),
  );

  return {
    tools,
    savedToolCreatedAtById,
  };
};

export function useUserSavedTools(userId?: string) {
  const query = useQuery({
    queryKey: ["public-user-saved-tools", userId ?? null],
    queryFn: () => fetchUserSavedTools(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  return {
    tools: query.data?.tools ?? [],
    savedToolCreatedAtById: query.data?.savedToolCreatedAtById ?? {},
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
