import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import {
  PageFocusOverlay,
  PageFocusOverlayProvider,
} from "@/hooks/usePageFocusOverlay";
import { getAppUserProfileRoute, legacyAppRoutes, routes } from "@/lib/routes";

import { StickyFooter } from "@/components/ui/sticky-footer";
import Header from "./components/layout/Header";
import MobileLayout from "./components/layout/MobileLayout";
import AboutUs from "./pages/legals/AboutUs";
import Contact from "./pages/legals/Contact";
import Community from "./pages/Community";
import PrivacyPolicy from "./pages/legals/PrivacyPolicy";
import TermsConditions from "./pages/legals/TermsConditions";
import Guides from "./pages/Guides";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ResourcesComingSoon from "./pages/ResourcesComingSoon";
import Profile from "./pages/Profile";
import Radar from "./pages/Radar";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const PublicLayout = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <Header />
      <main className="relative min-h-0 flex-1">
        <Outlet />
        <PageFocusOverlay />
      </main>
      <StickyFooter />
    </div>
  );
};

const ProfileRouteResolver = () => {
  const { profile, status } = useAuth();

  if (status === "loading") {
    return <div className="min-h-full bg-background" />;
  }

  if (status !== "authenticated") {
    return <Navigate to={routes.landing} replace />;
  }

  if (status === "authenticated" && profile?.username?.trim()) {
    return <Navigate to={getAppUserProfileRoute(profile.username.trim())} replace />;
  }

  return <Profile />;
};

const RequireAuthenticatedRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="min-h-full bg-background" />;
  }

  if (status !== "authenticated") {
    return <Navigate to={routes.landing} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={routes.landing} element={<Landing />} />
        <Route path={routes.privacy} element={<PrivacyPolicy />} />
        <Route path={routes.terms} element={<TermsConditions />} />
        <Route path={routes.about} element={<AboutUs />} />
        <Route path={routes.contact} element={<Contact />} />
      </Route>

      <Route path={routes.login} element={<Login />} />
      <Route path={routes.resourcesComingSoon} element={<ResourcesComingSoon />} />
      <Route path="/signup" element={<Navigate to={routes.login} replace />} />

      <Route path={routes.appRoot} element={<MobileLayout />}>
        <Route index element={<Navigate to={routes.appProfile} replace />} />
        <Route path="radar" element={<Radar />} />
        <Route path="tools" element={<Tools />} />
        <Route path="guides" element={<Guides />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<ProfileRouteResolver />} />
        <Route path="profile/:username" element={<UserProfile />} />
        <Route element={<RequireAuthenticatedRoute />}>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {legacyAppRoutes.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

import { Analytics } from "@vercel/analytics/react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <PageFocusOverlayProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <Analytics />
          </PageFocusOverlayProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
