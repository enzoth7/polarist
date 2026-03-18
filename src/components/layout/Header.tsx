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
  { label: "Radar", to: routes.appRadar },
  { label: "Top Herramientas", to: routes.appTools },
  { label: "Guias", to: routes.appGuides },
  { label: "Comunidad", to: routes.appCommunity },
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
    status === "authenticated" ? [...baseNavItems, { label: "Perfil", to: profileRoute }] : baseNavItems;

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
      <div className="flex items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={routes.landing} aria-label="Ir al inicio" className="shrink-0">
            <BrandLogo showLabel={false} imageClassName="h-10 w-10 rounded-xl border-border/60" />
          </Link>
          <p className="truncate text-base font-black tracking-tight text-foreground md:text-lg">{greetingLabel}</p>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <DesktopNavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {status !== "authenticated" ? (
            <Button
              asChild
              className="hidden rounded-full border-0 bg-[#CCFF00] px-5 font-semibold text-[#0f1402] shadow-none transition-colors hover:bg-[#d8ff4a] md:inline-flex"
            >
              <Link to={routes.login}>
                Comenzar
                <LogIn className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}

          <button
            type="button"
            aria-label="Buscar"
            className="group flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/75 text-muted-foreground transition-all hover:text-foreground md:hover:w-32"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[72px] group-hover:opacity-100">
              Buscar
            </span>
          </button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full border-border/80 bg-background/75 text-foreground hover:bg-muted"
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
