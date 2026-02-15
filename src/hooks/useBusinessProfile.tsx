import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  resetProfile: () => void;
  fetchProfile: () => Promise<void>;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | null>(null);

const STORAGE_KEY = "visual_growth_system_profile";

export function BusinessProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetProfile = () => setProfile(defaultProfile);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      console.error("Error fetching profile", e);
    }
  };

  // Fetch on mount if user is logged in
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <BusinessProfileContext.Provider value={{ profile, updateProfile, resetProfile, fetchProfile }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const ctx = useContext(BusinessProfileContext);
  if (!ctx) throw new Error("useBusinessProfile must be used within BusinessProfileProvider");
  return ctx;
}
