import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, User, Menu, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { status, requireAuth } = useAuth();

  const handleProfileClick = requireAuth(() => {
    toast("Perfil personal", {
        description: "Próximamente: Personaliza tus prompts guardados y herramientas favoritas aquí."
    });
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md pt-2 pb-1 border-b border-border/40">
      <div className="flex items-center justify-between h-14 px-4 w-full max-w-md mx-auto">
        <div className="flex items-center gap-1 w-1/3">
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-muted/50">
            <Menu className="w-5 h-5 opacity-80" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        <div className="flex items-center justify-center w-1/3">
           <Link to="/" className="text-xl font-extrabold tracking-tighter">
              <span className="text-primary font-black">Pola</span>rist
           </Link>
        </div>

        <div className="flex items-center justify-end gap-1 w-1/3 border-r-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 hover:bg-muted/50 text-muted-foreground"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {status === 'authenticated' ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-9 h-9 hover:bg-muted/50 text-foreground"
              onClick={() => {
                toast("Perfil personal", {
                  description: "Próximamente: Personaliza tus prompts guardados y herramientas favoritas aquí."
                });
              }}
            >
              <User className="w-4 h-4" />
              <span className="sr-only">Perfil y Cuenta</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-9 h-9 hover:bg-muted/50 text-muted-foreground"
              onClick={handleProfileClick}
            >
              <User className="w-4 h-4" />
              <span className="sr-only">Perfil y Cuenta</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
