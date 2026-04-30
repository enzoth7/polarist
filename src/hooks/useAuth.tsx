import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";

type AuthState = "loading" | "anonymous" | "authenticated";

type PolaristUserProfile = {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  occupation: string;
  country: string;
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

const FALLBACK_AVATAR = "/avatar.webp";

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

const getFallbackUsername = (user: User) => {
  const metadataUsername = user.user_metadata?.username || user.user_metadata?.user_name;

  if (typeof metadataUsername === "string" && metadataUsername.trim()) {
    return metadataUsername.trim().toLowerCase().replace(/\s+/g, "");
  }

  const emailPrefix = user.email?.split("@")[0]?.trim().toLowerCase().replace(/\s+/g, "");

  if (emailPrefix) {
    return emailPrefix.replace(/[^a-z0-9._-]/g, "") || `user${user.id.slice(0, 8)}`;
  }

  return `user${user.id.slice(0, 8)}`;
};

const buildProfilePayload = (user: User, username?: string | null) => ({
  id: user.id,
  email: user.email || "",
  full_name: getFallbackName(user),
  username: username?.trim() || getFallbackUsername(user),
  avatar_url: getProviderAvatar(user),
  occupation: getFallbackOccupation(user),
  country: null,
});

const ensureUserProfileRow = async (user: User, username?: string | null) => {
  const payload = buildProfilePayload(user, username);

  const { data, error } = await supabase
    .from("polarist_usuarios")
    .upsert(payload, { onConflict: "id" })
    .select("id, full_name, username, avatar_url, occupation, email, country")
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
    .select("id, full_name, username, avatar_url, occupation, email, country")
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
  const shouldRepairUsername = data && (!data.username?.trim() || /\s/.test(data.username));
  const preservedUsername = shouldRepairUsername ? getFallbackUsername(user) : data?.username;

  const profileRow =
    shouldRepairAvatar || shouldRepairUsername ?
      await ensureUserProfileRow(user, preservedUsername)
    : data ?? await ensureUserProfileRow(user, preservedUsername);

  return {
    id: user.id,
    email:
      (typeof profileRow?.email === "string" && profileRow.email.trim()) ? profileRow.email.trim() : user.email || "",
    fullName:
      (typeof profileRow?.full_name === "string" && profileRow.full_name.trim()) ? profileRow.full_name.trim() : getFallbackName(user),
    username:
      (typeof profileRow?.username === "string" && profileRow.username.trim()) ? profileRow.username.trim() : getFallbackUsername(user),
    avatarUrl:
      (typeof profileRow?.avatar_url === "string" &&
        profileRow.avatar_url.trim() &&
        profileRow.avatar_url.trim() !== FALLBACK_AVATAR) ?
        profileRow.avatar_url.trim()
      : providerAvatar,
    occupation:
      (typeof profileRow?.occupation === "string" && profileRow.occupation.trim()) ? profileRow.occupation.trim() : getFallbackOccupation(user),
    country:
      (typeof profileRow?.country === "string" && profileRow.country.trim()) ? profileRow.country.trim() : "",
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
        redirectTo: `${window.location.origin}${routes.appProfile}`,
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
        avatarUrl:
          (profile?.avatarUrl && profile.avatarUrl !== FALLBACK_AVATAR) ?
            profile.avatarUrl
          : user ?
            getProviderAvatar(user)
          : FALLBACK_AVATAR,
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
