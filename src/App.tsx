import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/hooks/useTheme";

import Radar from "./pages/Radar";
import Shortcuts from "./pages/Shortcuts";
import Tools from "./pages/Tools";
import Community from "./pages/Community";
import Guides from "./pages/Guides";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MobileLayout from "./components/layout/MobileLayout";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Global listener component for auth events
const AuthListener = () => {
  useEffect(() => {
    const handleAuthRequired = () => {
      toast.error("Acceso restringido", {
        description: "Debes iniciar sesión con Google para usar esta función y personalizar tu perfil.",
        action: {
          label: "Iniciar Sesión",
          onClick: () => {
            window.location.href = "/login";
          }
        },
        duration: 5000,
      });
    };

    window.addEventListener("polarist-auth-required", handleAuthRequired);
    return () => window.removeEventListener("polarist-auth-required", handleAuthRequired);
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthListener />
          <Toaster />
          <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Redirect root to Radar for MVP simplicity */}
            <Route path="/" element={<Navigate to="/radar" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* The main 5 tabs wrapped in the mobile bottom bar */}
            <Route element={<MobileLayout />}>
              <Route path="/radar" element={<Radar />} />
              <Route path="/shortcuts" element={<Shortcuts />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/community" element={<Community />} />
              <Route path="/guides" element={<Guides />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
