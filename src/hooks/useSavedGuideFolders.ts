import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export function useSavedGuideFolders() {
  const { status, user } = useAuth();
  const [savedFolderIds, setSavedFolderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSaves = useCallback(async () => {
    if (status !== "authenticated" || !user) {
      setSavedFolderIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("resource_saves")
        .select("resource_id")
        .eq("user_id", user.id);

      if (fetchError) {
        throw fetchError;
      }

      setSavedFolderIds((data ?? []).map((row) => row.resource_id));
    } catch (nextError) {
      console.error("Error loading saved guide folders:", nextError);
      setError(nextError instanceof Error ? nextError.message : "Error cargando recursos guardados.");
    } finally {
      setLoading(false);
    }
  }, [status, user]);

  useEffect(() => {
    void loadSaves();
  }, [loadSaves]);

  const savedFolderIdSet = useMemo(() => new Set(savedFolderIds), [savedFolderIds]);
  const isSaved = (folderId: string) => savedFolderIdSet.has(folderId);

  const toggleSavedFolder = async (folderId: string) => {
    if (status !== "authenticated" || !user) {
      throw new Error("AUTH_REQUIRED");
    }

    const wasSaved = savedFolderIdSet.has(folderId);
    
    // Optimistic UI update
    setSavedFolderIds((current) =>
      wasSaved ? current.filter((id) => id !== folderId) : [...current, folderId]
    );

    try {
      if (wasSaved) {
        const { error: deleteError } = await supabase
          .from("resource_saves")
          .delete()
          .eq("user_id", user.id)
          .eq("resource_id", folderId);

        if (deleteError) {
          throw deleteError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("resource_saves")
          .insert({ user_id: user.id, resource_id: folderId });

        if (insertError) {
          throw insertError;
        }
      }
      return !wasSaved;
    } catch (nextError) {
      // Revert optimistic update
      setSavedFolderIds((current) =>
        wasSaved ? [...current, folderId] : current.filter((id) => id !== folderId)
      );
      throw nextError;
    }
  };

  return {
    savedFolderIds,
    savedFolderIdSet,
    isSaved,
    toggleSavedFolder,
    loading,
    error,
  };
}
