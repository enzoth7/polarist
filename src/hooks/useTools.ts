import { useQuery } from "@tanstack/react-query";

import { type ToolNicheKey, toolNicheMap } from "@/data/aiToolsCatalog";
import { supabase } from "@/lib/supabase";

type ToolRow = {
  id: string;
  name: string;
  url: string | null;
  category: string;
  kind: string;
  description: string | null;
  who_is_it_for: string | null;
  what_is_it_really_for: string | null;
  otros_usos: string | null;
  is_beta: boolean;
  created_at: string;
  logo_filename: string | null;
};

export type ToolItem = {
  id: string;
  name: string;
  url: string | null;
  category: string;
  kind: string;
  description: string | null;
  whoIsItFor: string | null;
  whatIsItReallyFor: string | null;
  otrosUsos: string | null;
  isBeta: boolean;
  createdAt: string;
  logoFilename: string | null;
};

type FetchToolsOptions = {
  isBeta?: boolean;
  names?: string[];
  ids?: string[];
  limit?: number;
};

type UseToolsQueryOptions = FetchToolsOptions & {
  enabled?: boolean;
};

const TOOL_SELECT_COLUMNS = `
  id,
  name,
  url,
  category,
  kind,
  description,
  who_is_it_for,
  what_is_it_really_for,
  otros_usos,
  is_beta,
  created_at,
  logo_filename
`;

const isToolNicheKey = (value: string): value is ToolNicheKey => value in toolNicheMap;

const normalizeToolNames = (names?: string[]) =>
  Array.from(
    new Set(
      (names ?? [])
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  );

const mapNicheTags = (value: ToolRow["niche_tags"]): Partial<Record<ToolNicheKey, string>> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [ToolNicheKey, string] =>
        isToolNicheKey(entry[0]) && typeof entry[1] === "string",
    ),
  );
};

const mapToolRow = (row: ToolRow): ToolItem => ({
  id: row.id,
  name: row.name,
  url: row.url,
  category: row.category,
  kind: row.kind,
  description: row.description,
  whoIsItFor: row.who_is_it_for,
  whatIsItReallyFor: row.what_is_it_really_for,
  otrosUsos: row.otros_usos,
  isBeta: row.is_beta,
  createdAt: row.created_at,
  logoFilename: row.logo_filename,
});

export const getToolHref = (tool: Pick<ToolItem, "url">) => {
  const rawUrl = tool.url?.trim();

  if (!rawUrl) {
    return "#";
  }

  return /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
};

export async function fetchTools(options: FetchToolsOptions = {}) {
  const normalizedNames = normalizeToolNames(options.names);
  const normalizedIds = normalizeToolNames(options.ids);

  // Until the schema has an explicit rank column, created_at is our ordering source.
  let query = supabase
    .from("tools")
    .select(TOOL_SELECT_COLUMNS)
    .order("created_at", { ascending: true });

  if (typeof options.isBeta === "boolean") {
    query = query.eq("is_beta", options.isBeta);
  }

  if (normalizedNames.length > 0) {
    query = query.in("name", normalizedNames);
  }

  if (normalizedIds.length > 0) {
    query = query.in("id", normalizedIds);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  let tools = ((data ?? []) as ToolRow[]).map(mapToolRow);

  if (normalizedNames.length > 0) {
    const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));
    tools = normalizedNames
      .map((name) => toolsByName.get(name))
      .filter((tool): tool is ToolItem => Boolean(tool));
  }

  if (normalizedIds.length > 0) {
    const toolsById = new Map(tools.map((tool) => [tool.id, tool]));
    tools = normalizedIds
      .map((id) => toolsById.get(id))
      .filter((tool): tool is ToolItem => Boolean(tool));
  }

  if (typeof options.limit === "number") {
    tools = tools.slice(0, options.limit);
  }

  return tools;
}

export function useToolsQuery(options: UseToolsQueryOptions = {}) {
  const { enabled = true, ...fetchOptions } = options;

  return useQuery({
    queryKey: [
      "tools",
      {
        isBeta: fetchOptions.isBeta ?? null,
        names: normalizeToolNames(fetchOptions.names),
        ids: normalizeToolNames(fetchOptions.ids),
        limit: fetchOptions.limit ?? null,
      },
    ],
    queryFn: () => fetchTools(fetchOptions),
    enabled,
    staleTime: 60_000,
  });
}
