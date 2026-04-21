import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY_PREFIX = "polarist_saved_guide_folders_v1";

const getStorageKey = (ownerId?: string | null) =>
  `${STORAGE_KEY_PREFIX}:${ownerId?.trim() || "guest"}`;

const readSavedFolderIds = (storageKey: string) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Error reading saved guide folders:", error);
    return [];
  }
};

const writeSavedFolderIds = (storageKey: string, folderIds: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(folderIds));
  } catch (error) {
    console.error("Error writing saved guide folders:", error);
  }
};

export function useSavedGuideFolders(ownerId?: string | null) {
  const storageKey = useMemo(() => getStorageKey(ownerId), [ownerId]);
  const [savedFolderIds, setSavedFolderIds] = useState<string[]>(() => readSavedFolderIds(storageKey));

  useEffect(() => {
    setSavedFolderIds(readSavedFolderIds(storageKey));
  }, [storageKey]);

  const savedFolderIdSet = useMemo(() => new Set(savedFolderIds), [savedFolderIds]);

  const isSaved = (folderId: string) => savedFolderIdSet.has(folderId);

  const toggleSavedFolder = (folderId: string) => {
    let nextFolderIds: string[] = [];

    setSavedFolderIds((currentFolderIds) => {
      if (currentFolderIds.includes(folderId)) {
        nextFolderIds = currentFolderIds.filter((currentId) => currentId !== folderId);
      } else {
        nextFolderIds = [...currentFolderIds, folderId];
      }

      writeSavedFolderIds(storageKey, nextFolderIds);
      return nextFolderIds;
    });

    return !savedFolderIdSet.has(folderId);
  };

  return {
    savedFolderIds,
    savedFolderIdSet,
    isSaved,
    toggleSavedFolder,
  };
}
