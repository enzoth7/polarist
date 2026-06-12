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
import { Seo } from "@/components/Seo";
import Header from "./components/layout/Header";
import MobileLayout from "./components/layout/MobileLayout";
import AboutUs from "./pages/legals/AboutUs";
import Contact from "./pages/legals/Contact";
import Community from "./pages/Community";
import PrivacyPolicy from "./pages/legals/PrivacyPolicy";
import TermsConditions from "./pages/legals/TermsConditions";
import Resources from "./pages/Resources";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import Library from "./pages/Library";
import Agents from "./pages/Agents";
import Services from "./pages/Services";
import Asesorias from "./pages/Asesorias";

const queryClient = new QueryClient();

const PublicLayout = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white overflow-x-hidden">
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

  // Esperamos explícitamente a que el estado de carga termine
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010101]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#CAFE5B] border-t-transparent" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to={routes.login} replace />;
  }

  // Si estamos autenticados pero el perfil aún no cargó, esperamos un poco más
  if (!profile && status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010101]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#CAFE5B] border-t-transparent" />
      </div>
    );
  }

  if (profile?.username?.trim()) {
    return <Navigate to={getAppUserProfileRoute(profile.username.trim())} replace />;
  }

  return <Library />;
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
        <Route path={routes.agents} element={<Agents />} />
        <Route path={routes.appAsesorias} element={<Asesorias />} />
      </Route>

      <Route path={routes.login} element={<Login />} />
      <Route path="/signup" element={<Navigate to={routes.login} replace />} />

      <Route element={<MobileLayout />}>
        <Route path={routes.services} element={<Services />} />
        <Route path={routes.appTools} element={<Tools />} />
        <Route path={routes.appResources} element={<Resources />} />
        <Route path={routes.appCommunity} element={<Community />} />
        <Route path={routes.appProfile} element={<ProfileRouteResolver />} />
        <Route path="/library/:username" element={<Library />} />
        <Route element={<RequireAuthenticatedRoute />}>
          <Route path={routes.appSettings} element={<Settings />} />
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
import { ErrorBoundary } from "@/components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <PageFocusOverlayProvider>
              <Toaster />
              <Sonner position="top-center" />
              <BrowserRouter>
                <Seo />
                <AppRoutes />
              </BrowserRouter>
              <Analytics />
            </PageFocusOverlayProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);


export default App;
