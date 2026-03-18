import { NavLink } from "react-router-dom";
import { Home, Zap, BookOpen, Users, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NavItem = ({ to, icon: Icon, label, customIcon }: { to: string, icon?: any, label: string, customIcon?: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center justify-center w-full h-16 pt-2 pb-1",
        "text-xs transition-colors duration-200",
        isActive 
          ? "text-foreground font-medium" 
          : "text-muted-foreground hover:text-foreground/80"
      )
    }
  >
    {({ isActive }) => (
      <>
        {customIcon ? customIcon : (Icon && <Icon className="mb-1 w-6 h-6 stroke-[1.5px]" />)}
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const MobileNav = () => {
  const { status, avatarUrl } = useAuth();

  return (
    <nav className="bg-background/95 backdrop-blur-md border-t border-border flex w-full h-[env(safe-area-inset-bottom,16px)+64px] pb-[env(safe-area-inset-bottom,0px)]">
      <NavItem to="/radar" icon={Home} label="Inicio" />
      <NavItem to="/shortcuts" icon={Zap} label="Prompts" />
      <NavItem to="/guides" icon={BookOpen} label="Guías" />
      <NavItem to="/community" icon={Users} label="Comunidad" />
      <NavItem 
        to="/profile" 
        label="Perfil"
        customIcon={
          <div className="mb-1 w-6 h-6 rounded-full overflow-hidden border border-border/50 flex items-center justify-center bg-muted/30">
            {status === 'authenticated' ? (
               <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
               <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
            )}
          </div>
        } 
      />
    </nav>
  );
};

export default MobileNav;
