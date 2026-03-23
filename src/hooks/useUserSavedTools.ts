import { useQuery } from "@tanstack/react-query";

import { fetchTools, type ToolItem } from "@/hooks/useTools";
import { supabase } from "@/lib/supabase";

type PublicSavedToolRow = {
  tool_id: string;
  created_at: string;
};

const fetchUserSavedTools = async (userId: string): Promise<ToolItem[]> => {
  const { data, error } = await supabase.rpc("get_public_user_saved_tools", {
    profile_user_id: userId,
  });

  if (error) {
    throw error;
  }

  const toolRows = (data ?? []) as PublicSavedToolRow[];
  const toolIds = toolRows.map((row) => row.tool_id);

  if (toolIds.length === 0) {
    return [];
  }

  return fetchTools({ names: toolIds });
};

export function useUserSavedTools(userId?: string) {
  const query = useQuery({
    queryKey: ["public-user-saved-tools", userId ?? null],
    queryFn: () => fetchUserSavedTools(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  return {
    tools: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
