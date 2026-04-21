import { useState, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/ui/AuthModal";

type NavItem = { label: string; to: string; protected?: boolean };

const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;

  const navItems: NavItem[] = [
    { label: "Tendencias", to: routes.appRadar },
    { label: "Herramientas", to: routes.appTools },
    { label: "Recursos", to: routes.appGuides, protected: true },
    {
      label: "Biblioteca",
      to: isAuthenticated ? profileRoute : routes.login,
      protected: true,
    },
  ];

  const handleProtectedClick = (
    e: MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    if (item.protected && !isAuthenticated) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <nav className="flex h-[calc(env(safe-area-inset-bottom,16px)+56px)] w-full items-center justify-center border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md">
      <div className="grid w-full grid-cols-4 items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            to={item.to}
            label={item.label}
            onClick={(e) => handleProtectedClick(e, item)}
          />
        ))}
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  );
};

export default MobileNav;
