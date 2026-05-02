import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export type PublicUserProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  occupation: string | null;
  country: string | null;
};

export function usePublicUserProfile(username?: string) {
  const query = useQuery({
    queryKey: ["public-user-profiles", username ?? null],
    queryFn: async (): Promise<PublicUserProfile | null> => {
      const { data, error } = await supabase.rpc("get_public_profile_by_username", {
        p_username: username,
      });

      if (error) {
        throw error;
      }

      const row = Array.isArray(data) ? data[0] : data;
      return (row as PublicUserProfile | null) ?? null;
    },
    enabled: Boolean(username),
    staleTime: 60_000,
  });

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
