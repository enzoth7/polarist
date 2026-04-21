import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

type ToolRow = {
  tool_id: string;
};

type FavoriteCountRow = {
  tool_id: string;
  favorites_count: number;
};

const emptyToolRowsResponse = {
  data: [] as ToolRow[],
  error: null,
};

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

const setPendingState = (
  setter: Dispatch<SetStateAction<Record<string, boolean>>>,
  toolId: string,
  isPending: boolean,
) => {
  setter((current) => {
    if (isPending) {
      return { ...current, [toolId]: true };
    }

    const next = { ...current };
    delete next[toolId];
    return next;
  });
};

export function useToolInteractions(toolIds: string[]) {
  const { status, user } = useAuth();
  const normalizedToolIds = useMemo(() => normalizeToolIds(toolIds), [toolIds]);
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({});
  const [favoriteToolIds, setFavoriteToolIds] = useState<string[]>([]);
  const [savedToolIds, setSavedToolIds] = useState<string[]>([]);
  const [favoritePendingById, setFavoritePendingById] = useState<Record<string, boolean>>({});
  const [savePendingById, setSavePendingById] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoriteToolIdSet = useMemo(() => new Set(favoriteToolIds), [favoriteToolIds]);
  const savedToolIdSet = useMemo(() => new Set(savedToolIds), [savedToolIds]);

  const loadInteractions = useCallback(async () => {
    if (normalizedToolIds.length === 0) {
      setFavoriteCounts({});
      setFavoriteToolIds([]);
      setSavedToolIds([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const countsPromise = supabase.rpc("get_tool_favorite_counts", {
        requested_tool_ids: normalizedToolIds,
      });

      const favoriteRowsPromise =
        status === "authenticated" && user ?
          supabase
            .from("tool_favorites")
            .select("tool_id")
            .eq("user_id", user.id)
            .in("tool_id", normalizedToolIds)
        : Promise.resolve(emptyToolRowsResponse);

      const savedRowsPromise =
        status === "authenticated" && user ?
          supabase
            .from("tool_saves")
            .select("tool_id")
            .eq("user_id", user.id)
            .in("tool_id", normalizedToolIds)
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

      setFavoriteCounts(buildCountsRecord(normalizedToolIds, (countsData as FavoriteCountRow[] | null) ?? null));
      setFavoriteToolIds((favoriteRows ?? []).map((row) => row.tool_id));
      setSavedToolIds((savedRows ?? []).map((row) => row.tool_id));
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "No pudimos cargar tus interacciones.";

      console.error("Error loading tool interactions:", message);
      setFavoriteCounts(buildCountsRecord(normalizedToolIds, null));
      setFavoriteToolIds([]);
      setSavedToolIds([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [normalizedToolIds, status, user]);

  useEffect(() => {
    void loadInteractions();
  }, [loadInteractions]);

  const toggleFavorite = useCallback(
    async (toolId: string) => {
      if (!user) {
        throw new Error("AUTH_REQUIRED");
      }

      const wasFavorite = favoriteToolIdSet.has(toolId);

      setPendingState(setFavoritePendingById, toolId, true);
      setFavoriteToolIds((current) =>
        wasFavorite ? current.filter((currentToolId) => currentToolId !== toolId) : [...current, toolId],
      );
      setFavoriteCounts((current) => ({
        ...current,
        [toolId]: Math.max(0, (current[toolId] ?? 0) + (wasFavorite ? -1 : 1)),
      }));

      try {
        if (wasFavorite) {
          const { error: deleteError } = await supabase
            .from("tool_favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("tool_id", toolId);

          if (deleteError) {
            throw deleteError;
          }
        } else {
          const { error: insertError } = await supabase
            .from("tool_favorites")
            .insert({ user_id: user.id, tool_id: toolId });

          if (insertError) {
            throw insertError;
          }
        }
      } catch (nextError) {
        setFavoriteToolIds((current) =>
          wasFavorite ? [...current, toolId] : current.filter((currentToolId) => currentToolId !== toolId),
        );
        setFavoriteCounts((current) => ({
          ...current,
          [toolId]: Math.max(0, (current[toolId] ?? 0) + (wasFavorite ? 1 : -1)),
        }));
        throw nextError;
      } finally {
        setPendingState(setFavoritePendingById, toolId, false);
      }
    },
    [favoriteToolIdSet, user],
  );

  const toggleSave = useCallback(
    async (toolId: string) => {
      if (!user) {
        throw new Error("AUTH_REQUIRED");
      }

      const wasSaved = savedToolIdSet.has(toolId);

      setPendingState(setSavePendingById, toolId, true);
      setSavedToolIds((current) =>
        wasSaved ? current.filter((currentToolId) => currentToolId !== toolId) : [...current, toolId],
      );

      try {
        if (wasSaved) {
          const { error: deleteError } = await supabase
            .from("tool_saves")
            .delete()
            .eq("user_id", user.id)
            .eq("tool_id", toolId);

          if (deleteError) {
            throw deleteError;
          }
        } else {
          const { error: insertError } = await supabase
            .from("tool_saves")
            .insert({ user_id: user.id, tool_id: toolId });

          if (insertError) {
            throw insertError;
          }
        }
      } catch (nextError) {
        setSavedToolIds((current) =>
          wasSaved ? [...current, toolId] : current.filter((currentToolId) => currentToolId !== toolId),
        );
        throw nextError;
      } finally {
        setPendingState(setSavePendingById, toolId, false);
      }
    },
    [savedToolIdSet, user],
  );

  return {
    error,
    favoriteCounts,
    favoriteToolIds,
    favoriteToolIdSet,
    loading,
    savedToolIds,
    savedToolIdSet,
    getFavoriteCount: (toolId: string) => favoriteCounts[toolId] ?? 0,
    isFavoritePending: (toolId: string) => Boolean(favoritePendingById[toolId]),
    isFavorited: (toolId: string) => favoriteToolIdSet.has(toolId),
    isSavePending: (toolId: string) => Boolean(savePendingById[toolId]),
    isSaved: (toolId: string) => savedToolIdSet.has(toolId),
    refreshInteractions: loadInteractions,
    toggleFavorite,
    toggleSave,
  };
}
