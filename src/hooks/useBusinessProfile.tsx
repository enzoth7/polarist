import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BusinessProfile {
  brandName: string;
  industry: string;
  socialNetworks: string[];
  onboardingComplete: boolean;
  completedMissions: string[]; // dates as ISO strings
}

const defaultProfile: BusinessProfile = {
  brandName: "",
  industry: "",
  socialNetworks: [],
  onboardingComplete: false,
  completedMissions: [],
};

interface BusinessProfileContextType {
  profile: BusinessProfile;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  completeMission: (date: string) => void;
  resetProfile: () => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | null>(null);

const STORAGE_KEY = "marketingfacil_profile";

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

  const completeMission = (date: string) => {
    setProfile((prev) => ({
      ...prev,
      completedMissions: [...new Set([...prev.completedMissions, date])],
    }));
  };

  const resetProfile = () => setProfile(defaultProfile);

  return (
    <BusinessProfileContext.Provider value={{ profile, updateProfile, completeMission, resetProfile }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const ctx = useContext(BusinessProfileContext);
  if (!ctx) throw new Error("useBusinessProfile must be used within BusinessProfileProvider");
  return ctx;
}
