import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Search, User as UserIcon, BookOpen, Clock, TrendingUp, Zap, Settings, LogOut, Home, Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { status, requireAuth, avatarUrl } = useAuth();

  const handleProfileClick = requireAuth(() => {
    toast("Perfil personal", {
        description: "Próximamente: Personaliza tus prompts guardados y herramientas favoritas aquí."
    });
  });

  // Fetch local date formatted
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const formattedDate = new Intl.DateTimeFormat('es-ES', dateOptions).format(today);

  // Fallback greeting names
  const userName = status === 'authenticated' ? 'Creativo' : 'Invitado';
  const userEmail = status === 'authenticated' ? 'creativo@polarist.ai' : 'Inicia sesión para más info';

  // Dynamic greeting based on time of day
  const currentHour = today.getHours();
  let timeGreeting = "Hola";
  if (currentHour >= 5 && currentHour < 12) {
    timeGreeting = "Buenos días";
  } else if (currentHour >= 12 && currentHour < 20) {
    timeGreeting = "Buenas tardes";
  } else {
    timeGreeting = "Buenas noches";
  }

  const menuItems = [
    { icon: Clock, label: "Historia de la inteligencia artificial", path: "#" },
    { icon: BookOpen, label: "Conceptos básicos de IA", path: "#" },
    { icon: TrendingUp, label: "Recomendaciones para crear contenido", path: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md pt-5 pb-3">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-5">
        
        {/* Top Row: Profile, Greeting, Theme Toggle */}
        <div className="flex items-center justify-between w-full">
          {/* Left Side: User Profile / Avatar + Sidebar (Sheet) */}
          <div className="flex items-center justify-start w-1/4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="outline-none flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                  <Menu className="w-6 h-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:max-w-md p-0 bg-background border-r border-border/50">
                 <div className="flex flex-col h-full">
                   {/* Sidebar Header (Empty spacing) */}
                   <div className="pt-12 pb-2 px-6">
                      <div className="flex items-center gap-4">
                      </div>
                   </div>

                   {/* Sidebar Content (Menu) */}
                   <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                      {menuItems.map((item, idx) => (
                        <Link 
                          key={idx} 
                          to={item.path}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-colors text-foreground group"
                        >
                           <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                           <span className="text-[15px] font-semibold">{item.label}</span>
                        </Link>
                      ))}
                   </div>

                   {/* Removed Sidebar Footer (Settings / Logout) */}
                 </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Greeting & Date */}
          <div className="flex flex-col items-center justify-center w-2/4 text-center">
              <h2 className="text-[17px] font-bold tracking-tight text-foreground leading-tight truncate w-full capitalize">{timeGreeting}</h2>
              <span className="text-[13px] font-medium text-muted-foreground/80 lowercase mt-0.5">Hoy {formattedDate}.</span>
          </div>

          {/* Right Side: Theme Toggle */}
          <div className="flex items-center justify-end w-1/4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full w-12 h-12 border-border/80 bg-transparent hover:bg-muted text-foreground transition-all"
              title="Alternar Tema"
            >
              {theme === "light" ? (
                <Moon className="w-[1.2rem] h-[1.2rem] stroke-[2px]" />
              ) : (
                <Sun className="w-[1.2rem] h-[1.2rem] stroke-[2px]" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Search Bar */}
        <div className="w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input 
            type="text" 
            placeholder="Search here" 
            className="w-full bg-muted/60 hover:bg-muted/80 focus:bg-muted transition-colors text-[15px] font-medium text-foreground placeholder:text-muted-foreground/70 rounded-[20px] py-3.5 pl-11 pr-4 outline-none ring-0 border border-transparent focus:border-border/40"
          />
        </div>

      </div>
    </header>
  );
};

export default Header;
