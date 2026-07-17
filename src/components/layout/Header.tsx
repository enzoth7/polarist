import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, LogIn, LogOut, Menu, Settings, User, Star, Truck, Eye, Heart, Users, Library } from "lucide-react";
import { UserProfileSidebar } from "@/components/ui/menu";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { CommunityCalendar } from "@/components/ui/community-calendar";
// DropdownMenu no longer used as we link directly to Library
import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePageFocusOverlay } from "@/hooks/usePageFocusOverlay";

const DesktopNavItem = ({ label, to }: { label: string; to: string }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "relative z-[1] pointer-events-auto px-2 lg:px-3 xl:px-4 py-2 text-[13px] lg:text-[14px] font-normal tracking-[0.01em] text-[#6e6e73] transition-colors hover:text-[#1d1d1f]",
        isActive && "text-[#1d1d1f]",
      )
    }
    style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
  >
    {label}
  </NavLink>
);

const DesktopCommunityItem = () => {
  const [open, setOpen] = useState(false);
  const { isPageFocusOverlayOpen, setPageFocusOverlayOpen } =
    usePageFocusOverlay();

  useEffect(() => {
    if (!isPageFocusOverlayOpen) {
      setOpen(false);
    }
  }, [isPageFocusOverlayOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setPageFocusOverlayOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative z-[110] px-2 lg:px-3 xl:px-4 py-2 text-[13px] lg:text-[14px] font-normal tracking-[0.01em] text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
          style={{ fontFamily: "var(--font-sequel, sans-serif)" }}
        >
          Comunidad
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={16}
        className="z-[110] w-auto border-0 bg-transparent p-0 shadow-none"
      >
        <CommunityCalendar 
          showExploreButton={true} 
          onExploreClick={() => handleOpenChange(false)} 
        />
      </PopoverContent>
    </Popover>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { logout, profile, status, user, avatarUrl } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const today = new Date();
  const currentHour = today.getHours();
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;
  const isAuthenticated = status === "authenticated";
  const resourcesNavRoute = routes.appResources;
  const navItems = isAuthenticated ? [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Servicios", to: routes.services, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: resourcesNavRoute, showAlways: true },
  ] : [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Servicios", to: routes.services, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: resourcesNavRoute, showAlways: true },
  ];

  let greeting = "Hola";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Buenos días";
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  const cleanFullName = profile?.fullName
    ?.replace(/@/g, "")
    ?.replace(/filmmaker/gi, "")
    ?.replace(/uruguay/gi, "")
    ?.trim();
  const firstName = cleanFullName?.split(/\s+/)[0];
  const desktopGreetingLabel = isAuthenticated ? (firstName ? `${greeting}, ${firstName}` : greeting) : "";

  const handleLogout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await logout();
      navigate(routes.landing, { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const mobileNavItems = isAuthenticated ? [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Servicios", to: routes.services, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: resourcesNavRoute, showAlways: true },
    { label: "Comunidad", to: routes.appCommunity, showAlways: true },
    { label: "Diagnóstico", to: routes.appDiagnosis, showAlways: true },
  ] : [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Servicios", to: routes.services, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: resourcesNavRoute, showAlways: true },
    { label: "Comunidad", to: routes.appCommunity, showAlways: true },
    { label: "Diagnóstico", to: routes.appDiagnosis, showAlways: true },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 isolate z-[1000] w-full border-b border-black/5 bg-[#F6F6F6] backdrop-blur-lg saturate-150 transition-all duration-300">
      <div className="mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-2.5 md:max-w-[2000px] md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-10 xl:px-16">
        {/* Lado Izquierdo */}
        <div className="flex items-center justify-start">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-black/10 bg-white text-[#1d1d1f] transition-colors hover:bg-black/[0.03] md:hidden"
                title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">{isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] p-0 border-none bg-transparent">
              <UserProfileSidebar 
                user={isAuthenticated ? {
                  name: cleanFullName || "Usuario",
                  email: user?.email || "",
                  avatarUrl: avatarUrl || "/avatar.webp",
                  profileRoute: profileRoute
                } : undefined}
                navItems={mobileNavItems.map((item) => ({
                  label: item.label,
                  href: item.to,
                }))}
                settingsItem={isAuthenticated ? {
                  label: "Configuración",
                  href: routes.appSettings,
                  icon: <Settings className="h-full w-full" />
                } : undefined}
                onItemClick={closeMobileMenu}
                logoutItem={isAuthenticated ? {
                  label: isSigningOut ? "Cerrando..." : "Cerrar sesión",
                  icon: <LogOut className="h-full w-full" />,
                  onClick: handleLogout
                } : {
                  label: "Iniciar sesión",
                  icon: <LogIn className="h-full w-full" />,
                  onClick: () => navigate(routes.login)
                }}
                className="h-full max-w-none rounded-none border-none bg-[#F6F6F6] pt-20"
              />
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <Link to={routes.landing} className="shrink-0" aria-label="Marca Polarist">
              <BrandLogo showLabel={false} imageClassName="header-brand-logo-image h-9 w-auto" />
            </Link>
          </div>
        </div>

        {/* Centro */}
        <div className="flex min-w-0 items-center justify-center gap-2 md:hidden">
          <Link to={routes.landing} className="shrink-0" aria-label="Marca Polarist">
            <BrandLogo showLabel={false} imageClassName="header-brand-logo-image h-9 w-auto" />
          </Link>
        </div>

        <nav className="relative z-[1] hidden items-center justify-center gap-1 md:flex lg:gap-3 xl:gap-5">
          {navItems.map((item) => (
            <div key={item.label} className="contents">
              <DesktopNavItem {...item} />
              {item.label === "Recursos" ? <DesktopCommunityItem /> : null}
            </div>
          ))}
          <NavLink
            to={routes.appDiagnosis}
            className={({ isActive }) =>
              cn(
                "hidden md:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] lg:px-4 lg:py-1.5 lg:text-[13px] font-bold tracking-[0.01em] transition-all duration-300 whitespace-nowrap ml-1 lg:ml-2.5",
                isActive
                  ? "bg-[#CAFE5B] text-[#010101] shadow-[0_0_16px_rgba(202,254,91,0.4)]"
                  : "bg-[#CAFE5B]/90 text-[#010101] hover:bg-[#CAFE5B] hover:shadow-[0_0_20px_rgba(202,254,91,0.35)] hover:scale-[1.04]"
              )
            }
            style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
          >
            Diagnóstico
          </NavLink>
        </nav>

        {/* Lado Derecho */}
        <div className="flex items-center justify-end gap-1.5 lg:gap-3">
          {isAuthenticated ? (
            <Link
              to={profileRoute}
              className="hidden items-center gap-1.5 whitespace-nowrap p-0 transition-opacity hover:opacity-80 md:inline-flex no-underline"
              aria-label="Ir a mi biblioteca"
            >
              <span 
                className="whitespace-nowrap text-[13px] lg:text-[15px] font-bold tracking-[-0.01em] text-[#1d1d1f] md:text-base"
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                {desktopGreetingLabel}
              </span>
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#F6F6F6] text-[#1d1d1f]/68">
                {avatarUrl && avatarUrl !== "/avatar.webp" ? (
                  <img 
                    src={avatarUrl} 
                    alt={cleanFullName || "Avatar"} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-[17px] w-[17px]" strokeWidth={1.9} />
                )}
              </span>
            </Link>
          ) : (
            <Button
              asChild
              className="hidden h-9 lg:h-10 rounded-full bg-primary px-4 lg:px-7 text-[12px] lg:text-[14px] font-bold tracking-[0.01em] text-primary-foreground transition-all hover:bg-primary/90 md:inline-flex shadow-lg shadow-black/5"
            >
              <Link to={routes.login}>
                Iniciar sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
