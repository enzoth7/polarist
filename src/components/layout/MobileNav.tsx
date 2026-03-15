import { NavLink } from "react-router-dom";
import { Compass, Zap, Wrench, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center justify-center w-full h-16 pt-2 pb-1",
        "text-xs transition-colors duration-200",
        isActive 
          ? "text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground"
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={cn("mb-1 w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const MobileNav = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-md border-t border-border flex w-full h-[env(safe-area-inset-bottom,16px)+64px] pb-[env(safe-area-inset-bottom,0px)]">
      <NavItem to="/radar" icon={Compass} label="Radar" />
      <NavItem to="/shortcuts" icon={Zap} label="Shortcuts" />
      <NavItem to="/tools" icon={Wrench} label="Tools" />
      <NavItem to="/community" icon={Users} label="Community" />
      <NavItem to="/guides" icon={BookOpen} label="Guides" />
    </nav>
  );
};

export default MobileNav;
