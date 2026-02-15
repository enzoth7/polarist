import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface QuestionnaireItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface BusinessProfile {
  brandName: string;
  onboardingComplete: boolean;
  questionnaire: QuestionnaireItem[];
}

const defaultProfile: BusinessProfile = {
  brandName: "",
  onboardingComplete: false,
  questionnaire: [],
};

interface BusinessProfileContextType {
  profile: BusinessProfile;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  resetProfile: () => void;
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

  return (
    <BusinessProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const ctx = useContext(BusinessProfileContext);
  if (!ctx) throw new Error("useBusinessProfile must be used within BusinessProfileProvider");
  return ctx;
}
