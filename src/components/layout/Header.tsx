import { Link, NavLink } from "react-router-dom";
import { LogIn, Moon, Search, Sun } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const baseNavItems = [
  { label: "Inicio", to: routes.landing },
  { label: "Tendencias", to: routes.appRadar },
  { label: "Herramientas", to: routes.appTools },
  { label: "Recursos", to: routes.appGuides },
  // { label: "Comunidad", to: routes.appCommunity }, // Guardado para después
] as const;

const DesktopNavItem = ({ label, to }: { label: string; to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "text-sm font-semibold text-muted-foreground transition-colors hover:text-primary",
        isActive && "text-foreground",
      )
    }
  >
    {label}
  </NavLink>
);

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { profile, status } = useAuth();
  const today = new Date();
  const currentHour = today.getHours();
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;
  const navItems =
    status === "authenticated" 
      ? [
          { label: "Tendencias", to: routes.appRadar },
          { label: "Herramientas", to: routes.appTools },
          { label: "Recursos", to: routes.appGuides },
          { label: "Perfil", to: profileRoute }
        ]
      : [
          { label: "Inicio", to: routes.landing },
          { label: "Tendencias", to: routes.appRadar },
          { label: "Herramientas", to: routes.appTools },
          { label: "Recursos", to: routes.appGuides }
        ];

  let greeting = "Hola";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Buenos dias";
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  const firstName = profile?.fullName?.trim().split(/\s+/)[0];
  const greetingLabel =
    status === "authenticated" && firstName ? `${greeting}, ${firstName}` : greeting;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="grid grid-cols-3 items-center px-4 py-3 md:px-8 max-w-[2000px] mx-auto">
        {/* Lado Izquierdo: Logo y Saludo */}
        <div className="flex items-center gap-3 overflow-hidden">
          <Link to={routes.landing} aria-label="Ir al inicio" className="shrink-0">
            <BrandLogo showLabel={false} imageClassName="h-10 w-10 rounded-xl border-border/60" />
          </Link>
          <p className="truncate text-base font-black tracking-tight text-foreground md:text-lg">{greetingLabel}</p>
        </div>

        {/* Centro: Navegación Principal (Absolutamente Centrada) */}
        <nav className="hidden items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <DesktopNavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Lado Derecho: Acciones y Tema */}
        <div className="flex items-center justify-end gap-3">
          {status !== "authenticated" && (
            <Button
              asChild
              className="h-10 px-6 rounded-full bg-[#CCFF00] font-bold text-[#0f1402] hover:bg-[#d8ff4a] transition-all hidden md:flex"
            >
              <Link to={routes.login}>
                Iniciar sesión
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full border-border/80 bg-background/75 text-foreground hover:bg-muted transition-colors"
            title="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
