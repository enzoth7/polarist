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
  const { data, error } = await supabase.rpc("get_public_user_saved_tools", {
    profile_user_id: userId,
  });

  if (error) {
    throw error;
  }

  const toolRows = (data ?? []) as PublicSavedToolRow[];
  const sortedToolRows = [...toolRows].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
  const toolIds = sortedToolRows.map((row) => row.tool_id);

  if (toolIds.length === 0) {
    return {
      tools: [],
      savedToolCreatedAtById: {},
    };
  }

  const tools = await fetchTools({ ids: toolIds });
  const savedToolCreatedAtById = Object.fromEntries(
    sortedToolRows.map((row) => [row.tool_id, row.created_at]),
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
