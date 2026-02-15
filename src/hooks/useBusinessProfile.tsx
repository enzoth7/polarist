import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface BusinessProfile {
  businessName: string; // db: business_name
  businessCategory: string; // db: business_category
  onboardingComplete: boolean; // db: onboarding_completed

  // 10 Questionnaire Fields
  goal: string;
  personality: string;
  target_audience: string;
  colors: string;
  visual_style: string;
  lighting: string;
  image_focus: string;
  tone_of_voice: string;
  content_type: string;
  wow_factor: string;
}

const defaultProfile: BusinessProfile = {
  businessName: "",
  businessCategory: "",
  onboardingComplete: false,
  goal: "",
  personality: "",
  target_audience: "",
  colors: "",
  visual_style: "",
  lighting: "",
  image_focus: "",
  tone_of_voice: "",
  content_type: "",
  wow_factor: "",
};

interface BusinessProfileContextType {
  profile: BusinessProfile;
  loading: boolean;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  resetProfile: () => void;

  fetchProfile: () => Promise<void>;
  completeMission: (date: string) => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | null>(null);

// NO localStorage. Pure Supabase.
export function BusinessProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(defaultProfile);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          businessName: data.business_name || "",
          businessCategory: data.business_category || "",
          onboardingComplete: data.onboarding_completed || false,
          goal: data.goal || "",
          personality: data.personality || "",
          target_audience: data.target_audience || "",
          colors: data.colors || "",
          visual_style: data.visual_style || "",
          lighting: data.lighting || "",
          image_focus: data.image_focus || "",
          tone_of_voice: data.tone_of_voice || "",
          content_type: data.content_type || "",
          wow_factor: data.wow_factor || "",
        });
      }
    } catch (e) {
      console.error("Error fetching profile from Supabase:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update local state immediately, then sync to Supabase
  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };



  const completeMission = (date: string) => {
    console.log("Mission completed on", date);
    // TODO: Implement streak logic or DB update
  };

  const resetProfile = () => setProfile(defaultProfile);

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Re-fetch when auth state changes (login/logout)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile();
        } else {
          setProfile(defaultProfile);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <BusinessProfileContext.Provider value={{ profile, loading, updateProfile, resetProfile, fetchProfile, completeMission }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const ctx = useContext(BusinessProfileContext);
  if (!ctx) throw new Error("useBusinessProfile must be used within BusinessProfileProvider");
  return ctx;
}
