import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, CircleUserRound, Home, Trophy, Users, type LucideIcon } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NavItem = ({
  to,
  icon: Icon,
  label,
  customIcon,
}: {
  to: string;
  icon?: LucideIcon;
  label: string;
  customIcon?: ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex h-16 w-full flex-col items-center justify-center pt-2 pb-1 text-xs transition-colors duration-200",
        isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground/80",
      )
    }
  >
    {customIcon ? customIcon : Icon ? <Icon className="mb-1 h-6 w-6 stroke-[1.5px]" /> : null}
    <span>{label}</span>
  </NavLink>
);

const MobileNav = () => {
  const { avatarUrl, status } = useAuth();
  const showAuthAvatar = status === "authenticated" && avatarUrl && avatarUrl !== "/avatar.jpg";

  return (
    <nav className="flex h-[calc(env(safe-area-inset-bottom,16px)+64px)] w-full border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md">
      <NavItem to={routes.appRadar} icon={Home} label="Inicio" />
      <NavItem to={routes.appTools} icon={Trophy} label="Top" />
      <NavItem to={routes.appGuides} icon={BookOpen} label="Guias" />
      <NavItem to={routes.appCommunity} icon={Users} label="Comunidad" />
      <NavItem
        to={routes.appProfile}
        label="Perfil"
        customIcon={
          <div className="mb-1 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-muted/30">
            {showAuthAvatar ? (
              <img src={avatarUrl} alt="User avatar" className="h-full w-full object-cover" />
            ) : (
              <CircleUserRound className="h-5 w-5 text-muted-foreground stroke-[1.8px]" />
            )}
          </div>
        }
      />
    </nav>
  );
};

export default MobileNav;
