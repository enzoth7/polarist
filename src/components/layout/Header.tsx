import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, LogIn, LogOut, Menu, Settings, User, Star, Truck, Eye, Heart, Users, Library } from "lucide-react";
import { UserProfileSidebar } from "@/components/ui/menu";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { CommunityCalendar } from "@/components/ui/community-calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        "relative z-[1] pointer-events-auto px-4 py-2 text-[14px] font-normal tracking-[0.01em] text-[#6e6e73] transition-colors hover:text-[#1d1d1f]",
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
          className="relative z-[110] px-4 py-2 text-[14px] font-normal tracking-[0.01em] text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
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
        <CommunityCalendar />
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
  const navItems = isAuthenticated ? [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Tendencias", to: routes.appTrends, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: routes.resourcesComingSoon, showAlways: true },
    { label: "Biblioteca", to: profileRoute, showAlways: true },
  ] : [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Tendencias", to: routes.appTrends, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: routes.resourcesComingSoon, showAlways: true },
    { label: "Biblioteca", to: routes.appProfile, showAlways: true },
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
    { label: "Tendencias", to: routes.appTrends, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: routes.resourcesComingSoon, showAlways: true },
    { label: "Comunidad", to: routes.appCommunity, showAlways: true },
    { label: "Biblioteca", to: profileRoute, showAlways: true },
  ] : [
    { label: "Inicio", to: routes.landing, showAlways: true },
    { label: "Tendencias", to: routes.appTrends, showAlways: true },
    { label: "Herramientas", to: routes.appTools, showAlways: true },
    { label: "Recursos", to: routes.resourcesComingSoon, showAlways: true },
    { label: "Comunidad", to: routes.appCommunity, showAlways: true },
    { label: "Biblioteca", to: routes.appProfile, showAlways: true },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 isolate z-[1000] w-full border-b border-black/5 bg-[#F6F6F6] backdrop-blur-lg saturate-150 transition-all duration-300">
      <div className="mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-2.5 md:max-w-[2000px] md:grid-cols-3 md:px-10 lg:px-14 xl:px-16">
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
                  avatarUrl: avatarUrl || "/avatar.webp"
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

        <nav className="relative z-[1] hidden items-center justify-center gap-5 md:flex lg:gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="contents">
              <DesktopNavItem {...item} />
              {item.label === "Recursos" ? <DesktopCommunityItem /> : null}
            </div>
          ))}
        </nav>

        {/* Lado Derecho */}
        <div className="flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden items-center gap-2 whitespace-nowrap p-0 transition-opacity hover:opacity-80 md:inline-flex"
                  aria-label="Abrir menú de perfil"
                >
                  <span 
                    className="whitespace-nowrap text-[15px] font-bold tracking-[-0.01em] text-[#1d1d1f] md:text-base"
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-3 bg-white border border-zinc-100 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] backdrop-blur-sm"
              >
                {/* Cabecera con avatar + nombre */}
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-[#f6f6f6] text-zinc-700">
                    {avatarUrl && avatarUrl !== "/avatar.webp" ? (
                      <img 
                        src={avatarUrl} 
                        alt={cleanFullName || "Avatar"} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-[17px] w-[17px]" strokeWidth={1.9} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p 
                      className="truncate text-[13px] font-bold tracking-[-0.02em] text-zinc-900"
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    >
                      {cleanFullName || "Mi perfil"}
                    </p>
                    <p 
                      className="text-[11px] font-medium text-zinc-400 truncate"
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    >
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-zinc-100 my-1" />

                <DropdownMenuItem asChild className="cursor-pointer text-[13px] font-bold tracking-tight text-zinc-700 focus:bg-zinc-50 focus:text-zinc-900 py-2.5 px-3 rounded-xl gap-2.5" style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}>
                  <Link to={routes.appSettings}>
                    <Settings className="h-[16px] w-[16px] shrink-0" strokeWidth={2.5} />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                  className="cursor-pointer text-[13px] font-bold tracking-tight text-red-500 focus:bg-red-50 focus:text-red-600 py-2.5 px-3 rounded-xl gap-2.5"
                  style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                >
                  <LogOut className="h-[16px] w-[16px] shrink-0" strokeWidth={2.5} />
                  {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="hidden h-10 rounded-full bg-primary px-7 text-[14px] font-bold tracking-[0.01em] text-primary-foreground transition-all hover:bg-primary/90 md:inline-flex shadow-lg shadow-black/5"
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
