import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface BusinessProfile {
  businessName: string; // db: business_name
  businessCategory: string; // db: business_category
  avatarUrl: string; // db: avatar_url
  onboardingComplete: boolean; // db: onboarding_completed
  contactInstagram: string;
  contactWebsite: string;
  contactWhatsapp: string;
  contactEmail: string;

  brandHistory: string;
  brandDifferential: string;
  targetAudience: string;
  targetAudienceExtra: string;
  promotions: string;
  promotionsExtra: string;
  productsToHighlight: string;
  operationType: string;
  shippingScope: string;
  contentTypePreferred: string;
  contentResources: string;
  cameraQuality: string;
  salesChannels: string;
  prioritySalesChannel: string;
  typographyStatus: string;
  socialPriorityGoal: string;
  humanizationLevel: string;
  productVisualStyle: string;
  postingFrequency: string;
  brandFeeling: string;
  colorPaletteStatus: string;
  brandColorsExtra: string;
  brandPerception: string;
}

const defaultProfile: BusinessProfile = {
  businessName: "",
  businessCategory: "",
  avatarUrl: "",
  onboardingComplete: false,
  contactInstagram: "",
  contactWebsite: "",
  contactWhatsapp: "",
  contactEmail: "",
  brandHistory: "",
  brandDifferential: "",
  targetAudience: "",
  targetAudienceExtra: "",
  promotions: "",
  promotionsExtra: "",
  productsToHighlight: "",
  operationType: "",
  shippingScope: "",
  contentTypePreferred: "",
  contentResources: "",
  cameraQuality: "",
  salesChannels: "",
  prioritySalesChannel: "",
  typographyStatus: "",
  socialPriorityGoal: "",
  humanizationLevel: "",
  productVisualStyle: "",
  postingFrequency: "",
  brandFeeling: "",
  colorPaletteStatus: "",
  brandColorsExtra: "",
  brandPerception: "",
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
          avatarUrl: data.avatar_url || "",
          onboardingComplete: data.onboarding_completed || false,
          contactInstagram: data.contact_instagram || "",
          contactWebsite: data.contact_website || "",
          contactWhatsapp: data.contact_whatsapp || "",
          contactEmail: user.email || "",
          brandHistory: data.brand_history || "",
          brandDifferential: data.brand_differential || "",
          targetAudience: data.target_audience || "",
          targetAudienceExtra: data.target_audience_extra || "",
          promotions: data.promotions || "",
          promotionsExtra: data.promotions_extra || "",
          productsToHighlight: data.products_to_highlight || "",
          operationType: data.operation_type || "",
          shippingScope: data.shipping_scope || "",
          contentTypePreferred: data.content_type_preferred || "",
          contentResources: data.content_resources || "",
          cameraQuality: data.camera_quality || "",
          salesChannels: data.sales_channels || "",
          prioritySalesChannel: data.priority_sales_channel || "",
          typographyStatus: data.typography_status || "",
          socialPriorityGoal: data.social_priority_goal || "",
          humanizationLevel: data.humanization_level || "",
          productVisualStyle: data.product_visual_style || "",
          postingFrequency: data.posting_frequency || "",
          brandFeeling: data.brand_feeling || "",
          colorPaletteStatus: data.color_palette_status || "",
          brandColorsExtra: data.brand_colors_extra || "",
          brandPerception: data.brand_perception || "",
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
