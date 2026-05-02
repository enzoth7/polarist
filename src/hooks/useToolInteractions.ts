import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import type { ToolItem } from "@/hooks/useTools";
import { supabase } from "@/lib/supabase";

type ToolRow = {
  tool_id: string;
};

type FavoriteCountRow = {
  tool_id: string;
  favorites_count: number;
};

type ToolInteractionsSnapshot = {
  favoriteCounts: Record<string, number>;
  favoriteToolIds: string[];
  savedToolIds: string[];
};

type UserSavedToolsSnapshot = {
  tools: ToolItem[];
  savedToolCreatedAtById: Record<string, string>;
};

const emptyToolRowsResponse = {
  data: [] as ToolRow[],
  error: null,
};

const buildEmptySnapshot = (toolIds: string[]): ToolInteractionsSnapshot => ({
  favoriteCounts: Object.fromEntries(toolIds.map((toolId) => [toolId, 0])) as Record<string, number>,
  favoriteToolIds: [],
  savedToolIds: [],
});

const normalizeToolIds = (toolIds: string[]) =>
  Array.from(
    new Set(
      toolIds
        .map((toolId) => toolId.trim())
        .filter(Boolean),
    ),
  );

const buildCountsRecord = (toolIds: string[], rows: FavoriteCountRow[] | null) => {
  const counts = Object.fromEntries(toolIds.map((toolId) => [toolId, 0])) as Record<string, number>;

  for (const row of rows ?? []) {
    counts[row.tool_id] = Number(row.favorites_count ?? 0);
  }

  return counts;
};

const buildToolInteractionsQueryKey = (userId: string | null, toolIds: string[]) => [
  "tool-interactions",
  userId ?? "anonymous",
  toolIds.join("|"),
] as const;

const fetchToolInteractions = async (
  toolIds: string[],
  isAuthenticated: boolean,
  userId?: string,
): Promise<ToolInteractionsSnapshot> => {
  if (toolIds.length === 0) {
    return buildEmptySnapshot(toolIds);
  }

  const countsPromise = supabase.rpc("get_tool_favorite_counts", {
    requested_tool_ids: toolIds,
  });

  const favoriteRowsPromise =
    isAuthenticated && userId ?
      supabase
        .from("tool_favorites")
        .select("tool_id")
        .eq("user_id", userId)
        .in("tool_id", toolIds)
    : Promise.resolve(emptyToolRowsResponse);

  const savedRowsPromise =
    isAuthenticated && userId ?
      supabase
        .from("tool_saves")
        .select("tool_id")
        .eq("user_id", userId)
        .in("tool_id", toolIds)
    : Promise.resolve(emptyToolRowsResponse);

  const [
    { data: countsData, error: countsError },
    { data: favoriteRows, error: favoritesError },
    { data: savedRows, error: savesError },
  ] = await Promise.all([countsPromise, favoriteRowsPromise, savedRowsPromise]);

  if (countsError) {
    console.error("Error fetching tool favorite counts:", countsError.message);
  }

  if (favoritesError) {
    throw favoritesError;
  }

  if (savesError) {
    throw savesError;
  }

  return {
    favoriteCounts: buildCountsRecord(toolIds, (countsData as FavoriteCountRow[] | null) ?? null),
    favoriteToolIds: (favoriteRows ?? []).map((row) => row.tool_id),
    savedToolIds: (savedRows ?? []).map((row) => row.tool_id),
  };
};

const updateInteractionsAcrossQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  updater: (snapshot: ToolInteractionsSnapshot, toolIds: string[]) => ToolInteractionsSnapshot,
) => {
  queryClient.setQueriesData<ToolInteractionsSnapshot>(
    { queryKey: ["tool-interactions", userId] },
    (current, query) => {
      if (!current) {
        return current;
      }

      const joinedToolIds = typeof query.queryKey[2] === "string" ? query.queryKey[2] : "";
      const toolIds = joinedToolIds ? joinedToolIds.split("|").filter(Boolean) : [];
      return updater(current, toolIds);
    },
  );
};

const findToolInToolsCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  toolId: string,
) => {
  const toolQueries = queryClient.getQueriesData<ToolItem[]>({ queryKey: ["tools"] });

  for (const [, tools] of toolQueries) {
    const matchedTool = tools?.find((tool) => tool.name === toolId);
    if (matchedTool) {
      return matchedTool;
    }
  }

  return null;
};

const updateSavedToolsCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  toolId: string,
  wasSaved: boolean,
) => {
  queryClient.setQueryData<UserSavedToolsSnapshot>(
    ["public-user-saved-tools", userId],
    (current) => {
      if (!current) {
        return current;
      }

      if (wasSaved) {
        const nextCreatedAtById = { ...current.savedToolCreatedAtById };
        delete nextCreatedAtById[toolId];

        return {
          tools: current.tools.filter((tool) => tool.name !== toolId),
          savedToolCreatedAtById: nextCreatedAtById,
        };
      }

      const matchedTool = findToolInToolsCache(queryClient, toolId);
      if (!matchedTool || current.tools.some((tool) => tool.name === toolId)) {
        return current;
      }

      return {
        tools: [matchedTool, ...current.tools],
        savedToolCreatedAtById: {
          ...current.savedToolCreatedAtById,
          [toolId]: new Date().toISOString(),
        },
      };
    },
  );
};

export function useToolInteractions(toolIds: string[]) {
  const { status, user } = useAuth();
  const queryClient = useQueryClient();
  const normalizedToolIds = useMemo(() => normalizeToolIds(toolIds), [toolIds]);
  const queryKey = useMemo(
    () => buildToolInteractionsQueryKey(user?.id ?? null, normalizedToolIds),
    [normalizedToolIds, user?.id],
  );
  const [favoritePendingById, setFavoritePendingById] = useState<Record<string, boolean>>({});
  const [savePendingById, setSavePendingById] = useState<Record<string, boolean>>({});

  const query = useQuery({
    queryKey,
    queryFn: () => fetchToolInteractions(normalizedToolIds, status === "authenticated", user?.id),
    staleTime: 60_000,
  });

  const snapshot = query.data ?? buildEmptySnapshot(normalizedToolIds);
  const favoriteToolIdSet = useMemo(() => new Set(snapshot.favoriteToolIds), [snapshot.favoriteToolIds]);
  const savedToolIdSet = useMemo(() => new Set(snapshot.savedToolIds), [snapshot.savedToolIds]);

  const favoriteMutation = useMutation({
    mutationFn: async ({ toolId, wasFavorite }: { toolId: string; wasFavorite: boolean }) => {
      if (!user) {
        throw new Error("AUTH_REQUIRED");
      }

      if (wasFavorite) {
        const { error } = await supabase
          .from("tool_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_id", toolId);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("tool_favorites")
          .upsert({ user_id: user.id, tool_id: toolId }, { onConflict: "user_id,tool_id" });

        if (error) {
          throw error;
        }
      }
    },
    onSuccess: (_data, variables) => {
      if (!user) {
        return;
      }

      updateInteractionsAcrossQueries(queryClient, user.id, (current, currentToolIds) => {
        if (!currentToolIds.includes(variables.toolId)) {
          return current;
        }

        const favoriteToolIdSet = new Set(current.favoriteToolIds);
        if (variables.wasFavorite) {
          favoriteToolIdSet.delete(variables.toolId);
        } else {
          favoriteToolIdSet.add(variables.toolId);
        }

        const currentCount = current.favoriteCounts[variables.toolId] ?? 0;
        return {
          favoriteCounts: {
            ...current.favoriteCounts,
            [variables.toolId]: Math.max(0, currentCount + (variables.wasFavorite ? -1 : 1)),
          },
          favoriteToolIds: Array.from(favoriteToolIdSet),
          savedToolIds: current.savedToolIds,
        };
      });
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: ["tool-interactions", user.id] });
        void queryClient.invalidateQueries({ queryKey: ["public-user-saved-tools", user.id] });
      } else {
        void queryClient.invalidateQueries({ queryKey: ["tool-interactions", "anonymous"] });
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ toolId, wasSaved }: { toolId: string; wasSaved: boolean }) => {
      if (!user) {
        throw new Error("AUTH_REQUIRED");
      }

      if (wasSaved) {
        const { error } = await supabase
          .from("tool_saves")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_id", toolId);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("tool_saves")
          .upsert({ user_id: user.id, tool_id: toolId }, { onConflict: "user_id,tool_id" });

        if (error) {
          throw error;
        }
      }
    },
    onSuccess: (_data, variables) => {
      if (!user) {
        return;
      }

      updateInteractionsAcrossQueries(queryClient, user.id, (current, currentToolIds) => {
        if (!currentToolIds.includes(variables.toolId)) {
          return current;
        }

        const savedToolIdSet = new Set(current.savedToolIds);
        if (variables.wasSaved) {
          savedToolIdSet.delete(variables.toolId);
        } else {
          savedToolIdSet.add(variables.toolId);
        }

        return {
          favoriteCounts: current.favoriteCounts,
          favoriteToolIds: current.favoriteToolIds,
          savedToolIds: Array.from(savedToolIdSet),
        };
      });
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: ["tool-interactions", user.id] });
      } else {
        void queryClient.invalidateQueries({ queryKey: ["tool-interactions", "anonymous"] });
      }
    },
  });

  const toggleFavorite = async (toolId: string) => {
    if (!user) {
      throw new Error("AUTH_REQUIRED");
    }

    setFavoritePendingById((current) => ({ ...current, [toolId]: true }));

    try {
      await favoriteMutation.mutateAsync({
        toolId,
        wasFavorite: favoriteToolIdSet.has(toolId),
      });
    } finally {
      setFavoritePendingById((current) => {
        const next = { ...current };
        delete next[toolId];
        return next;
      });
    }
  };

  const toggleSave = async (toolId: string) => {
    if (!user) {
      throw new Error("AUTH_REQUIRED");
    }

    setSavePendingById((current) => ({ ...current, [toolId]: true }));

    try {
      await saveMutation.mutateAsync({
        toolId,
        wasSaved: savedToolIdSet.has(toolId),
      });
    } finally {
      setSavePendingById((current) => {
        const next = { ...current };
        delete next[toolId];
        return next;
      });
    }
  };

  return {
    error: query.error instanceof Error ? query.error.message : null,
    favoriteCounts: snapshot.favoriteCounts,
    favoriteToolIds: snapshot.favoriteToolIds,
    favoriteToolIdSet,
    loading: query.isLoading,
    savedToolIds: snapshot.savedToolIds,
    savedToolIdSet,
    getFavoriteCount: (toolId: string) => snapshot.favoriteCounts[toolId] ?? 0,
    isFavoritePending: (toolId: string) => Boolean(favoritePendingById[toolId]),
    isFavorited: (toolId: string) => favoriteToolIdSet.has(toolId),
    isSavePending: (toolId: string) => Boolean(savePendingById[toolId]),
    isSaved: (toolId: string) => savedToolIdSet.has(toolId),
    refreshInteractions: () => queryClient.invalidateQueries({ queryKey }),
    toggleFavorite,
    toggleSave,
  };
}
