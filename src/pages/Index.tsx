import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { profile } = useBusinessProfile();
  
  if (profile.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/onboarding" replace />;
};

export default Index;
