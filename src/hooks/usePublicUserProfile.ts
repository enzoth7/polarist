import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export type PublicUserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  occupation: string | null;
  country: string | null;
};

export function usePublicUserProfile(username?: string) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(username));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (!username) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: profileError } = await supabase
          .from("polarist_usuarios")
          .select("id, email, full_name, username, avatar_url, occupation, country")
          .eq("username", username)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (isActive) {
          setProfile((data as PublicUserProfile | null) ?? null);
        }
      } catch (nextError) {
        if (isActive) {
          setProfile(null);
          setError(nextError instanceof Error ? nextError.message : "No pudimos cargar el perfil.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [username]);

  return {
    profile,
    loading,
    error,
  };
}
