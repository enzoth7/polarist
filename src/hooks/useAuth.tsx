import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";

type AuthState = "loading" | "anonymous" | "authenticated";

type PolaristUserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  occupation: string;
};

interface AuthContextType {
  status: AuthState;
  session: Session | null;
  user: User | null;
  profile: PolaristUserProfile | null;
  loginAsGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  avatarUrl: string;
}

const FALLBACK_AVATAR = "/avatar.jpg";

const getProviderAvatar = (user: User) => {
  const metadataAvatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.photo_url;

  if (typeof metadataAvatar === "string" && metadataAvatar.trim()) {
    return metadataAvatar.trim();
  }

  const identityAvatar =
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture ||
    user.identities?.[0]?.identity_data?.photo_url;

  if (typeof identityAvatar === "string" && identityAvatar.trim()) {
    return identityAvatar.trim();
  }

  return FALLBACK_AVATAR;
};

const AuthContext = createContext<AuthContextType | null>(null);

const getFallbackName = (user: User) => {
  const metadataName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Usuario Polarist";
};

const getFallbackOccupation = (user: User) => {
  const metadataOccupation = user.user_metadata?.occupation || user.user_metadata?.role;

  if (typeof metadataOccupation === "string" && metadataOccupation.trim()) {
    return metadataOccupation.trim();
  }

  return "Miembro de Polarist";
};

const buildProfilePayload = (user: User) => ({
  id: user.id,
  email: user.email || "",
  full_name: getFallbackName(user),
  avatar_url: getProviderAvatar(user),
  occupation: getFallbackOccupation(user),
});

const ensureUserProfileRow = async (user: User) => {
  const payload = buildProfilePayload(user);

  const { data, error } = await supabase
    .from("polarist_usuarios")
    .upsert(payload, { onConflict: "id" })
    .select("id, full_name, avatar_url, occupation, email")
    .single();

  if (error) {
    console.error("Error creating missing polarist_usuarios row:", error.message);
    return null;
  }

  return data;
};

const resolveUserProfile = async (user: User): Promise<PolaristUserProfile> => {
  const { data, error } = await supabase
    .from("polarist_usuarios")
    .select("id, full_name, avatar_url, occupation, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching polarist_usuarios:", error.message);
  }

  const providerAvatar = getProviderAvatar(user);
  const shouldRepairAvatar =
    data &&
    (!data.avatar_url?.trim() || data.avatar_url.trim() === FALLBACK_AVATAR) &&
    providerAvatar !== FALLBACK_AVATAR;

  const profileRow =
    shouldRepairAvatar ?
      await ensureUserProfileRow(user)
    : data ?? await ensureUserProfileRow(user);

  return {
    id: user.id,
    email:
      (typeof profileRow?.email === "string" && profileRow.email.trim()) ? profileRow.email.trim() : user.email || "",
    fullName:
      (typeof profileRow?.full_name === "string" && profileRow.full_name.trim()) ? profileRow.full_name.trim() : getFallbackName(user),
    avatarUrl:
      (typeof profileRow?.avatar_url === "string" &&
        profileRow.avatar_url.trim() &&
        profileRow.avatar_url.trim() !== FALLBACK_AVATAR) ?
        profileRow.avatar_url.trim()
      : providerAvatar,
    occupation:
      (typeof profileRow?.occupation === "string" && profileRow.occupation.trim()) ? profileRow.occupation.trim() : getFallbackOccupation(user),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthState>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PolaristUserProfile | null>(null);

  useEffect(() => {
    let isActive = true;

    const applySession = async (nextSession: Session | null) => {
      if (!isActive) {
        return;
      }

      if (nextSession?.user) {
        setSession(nextSession);
        setUser(nextSession.user);
        setProfile(null);
        setStatus("authenticated");

        const nextProfile = await resolveUserProfile(nextSession.user);

        if (!isActive) {
          return;
        }

        setProfile(nextProfile);
        return;
      }

      setSession(null);
      setUser(null);
      setProfile(null);
      setStatus("anonymous");
    };

    const bootstrapAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting Supabase session:", error.message);
      }

      await applySession(data.session ?? null);
    };

    void bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAsGoogle = async () => {
    setStatus("loading");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${routes.appRadar}`,
      },
    });

    if (error) {
      setStatus("anonymous");
      throw error;
    }
  };

  const logout = async () => {
    if (!session) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setStatus("anonymous");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
    setProfile(null);
    setStatus("anonymous");
  };

  const refreshProfile = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error refreshing Supabase user:", error.message);
      throw error;
    }

    if (!data.user) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setStatus("anonymous");
      return;
    }

    setUser(data.user);
    setStatus("authenticated");
    setProfile(await resolveUserProfile(data.user));
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        session,
        user,
        profile,
        loginAsGoogle,
        logout,
        refreshProfile,
        avatarUrl: profile?.avatarUrl || (user ? getProviderAvatar(user) : FALLBACK_AVATAR),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
