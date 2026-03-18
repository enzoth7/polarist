import { useEffect, useState } from "react";

import { fullToolsRanking, type ToolRankingItem } from "@/data/aiToolsCatalog";
import { supabase } from "@/lib/supabase";

type PublicSavedToolRow = {
  tool_id: string;
  created_at: string;
};

export function useUserSavedTools(userId?: string) {
  const [tools, setTools] = useState<ToolRankingItem[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSavedTools = async () => {
      if (!userId) {
        setTools([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: savedToolsError } = await supabase.rpc("get_public_user_saved_tools", {
          profile_user_id: userId,
        });

        if (savedToolsError) {
          throw savedToolsError;
        }

        const toolRows = (data || []) as PublicSavedToolRow[];
        const catalogByName = new Map(fullToolsRanking.map((tool) => [tool.name, tool]));
        const nextTools = toolRows
          .map((row) => catalogByName.get(row.tool_id))
          .filter((tool): tool is ToolRankingItem => Boolean(tool));

        if (isActive) {
          setTools(nextTools);
        }
      } catch (nextError) {
        if (isActive) {
          setTools([]);
          setError(nextError instanceof Error ? nextError.message : "No pudimos cargar el stack.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadSavedTools();

    return () => {
      isActive = false;
    };
  }, [userId]);

  return {
    tools,
    loading,
    error,
  };
}
