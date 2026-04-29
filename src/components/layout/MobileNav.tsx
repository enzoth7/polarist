import { Link, NavLink } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex h-14 w-full items-center justify-center px-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
      )
    }
  >
    <span>{label}</span>
  </NavLink>
);

const MobileNav = () => {
  const { profile, status } = useAuth();
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;

  return (
    <nav className="flex h-[calc(env(safe-area-inset-bottom,16px)+56px)] w-full items-center justify-center border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md">
      {status === "authenticated" ? (
        <div className="grid w-full grid-cols-5 items-center">
          <NavItem to={routes.appRadar} label="Tendencias" />
          <NavItem to={routes.appTools} label="Herramientas" />
          <NavItem to={routes.appGuides} label="Recursos" />
          <NavItem to={routes.appCommunity} label="Comunidad" />
          <NavItem to={profileRoute} label="Biblioteca" />
        </div>
      ) : (
        <div className="grid w-full grid-cols-5 items-center">
          <NavItem to={routes.landing} label="Inicio" />
          <NavItem to={routes.appRadar} label="Tendencias" />
          <NavItem to={routes.appTools} label="Herramientas" />
          <NavItem to={routes.appGuides} label="Recursos" />
          <NavItem to={routes.appCommunity} label="Comunidad" />
        </div>
      )}
    </nav>
  );
};

export default MobileNav;
