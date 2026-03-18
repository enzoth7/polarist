import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { legacyAppRoutes, routes } from "@/lib/routes";

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

const queryClient = new QueryClient();

const PublicLayout = () => {
  const location = useLocation();
  const isLandingRoute = location.pathname === routes.landing;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className={`min-h-0 flex-1 ${isLandingRoute ? "pb-[calc(env(safe-area-inset-bottom,16px)+72px)] md:pb-0" : ""}`}>
        <Outlet />
      </main>
      <Footer />

      {isLandingRoute ? (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 md:hidden">
          <div className="pointer-events-auto w-full">
            <MobileNav />
          </div>
        </div>
      ) : null}
    </div>
  );
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
        <Route path="guides" element={<Guides />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="library" element={<Library />} />
        <Route path="settings" element={<Settings />} />
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
