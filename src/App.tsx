import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { getAppUserProfileRoute, legacyAppRoutes, routes } from "@/lib/routes";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MobileLayout from "./components/layout/MobileLayout";
import MobileNav from "./components/layout/MobileNav";
import AboutUs from "./pages/legals/AboutUs";
import Contact from "./pages/legals/Contact";
import PrivacyPolicy from "./pages/legals/PrivacyPolicy";
import TermsConditions from "./pages/legals/TermsConditions";
import Community from "./pages/Community";
import Guides from "./pages/Guides";
import Landing from "./pages/Landing";
import Library from "./pages/Library";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Radar from "./pages/Radar";
import Settings from "./pages/Settings";
import Shortcuts from "./pages/Shortcuts";
import Tools from "./pages/Tools";
import ToolsDiscoveries from "./pages/ToolsDiscoveries";
import ToolsRanking from "./pages/ToolsRanking";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const PublicLayout = () => {
  const location = useLocation();
  const isLandingRoute = location.pathname === routes.landing;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
      <Footer />


    </div>
  );
};

const ProfileRouteResolver = () => {
  const { profile, status } = useAuth();

  if (status === "loading" || (status === "authenticated" && !profile)) {
    return <div className="min-h-full bg-background" />;
  }

  if (status !== "authenticated") {
    return <Navigate to={routes.login} replace />;
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
    return <Navigate to={routes.login} replace state={{ from: location.pathname }} />;
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
      <Route path="/signup" element={<Navigate to={routes.login} replace />} />
      <Route path="/onboarding" element={<Navigate to={routes.appRadar} replace />} />

      <Route path={routes.appRoot} element={<MobileLayout />}>
        <Route index element={<Navigate to={routes.appRadar} replace />} />
        <Route path="radar" element={<Radar />} />
        <Route path="shortcuts" element={<Shortcuts />} />
        <Route path="tools" element={<Tools />} />
        <Route path="tools/ranking" element={<ToolsRanking />} />
        <Route path="tools/descubrimientos" element={<ToolsDiscoveries />} />
        <Route path="guides" element={<Guides />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<ProfileRouteResolver />} />
        <Route path="profile/:username" element={<UserProfile />} />
        <Route path="library" element={<Library />} />
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
