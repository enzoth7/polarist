import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

const Profile = () => {
  const navigate = useNavigate();
  const { avatarUrl, logout, profile, status } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate(routes.login, { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("No se pudo cerrar sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const goToSettings = () => {
    navigate(routes.appSettings);
  };

  const goToLibrary = () => {
    navigate(routes.appLibrary);
  };

  const userInitial = profile?.fullName?.charAt(0)?.toUpperCase() || "P";
  const userSubtitle =
    profile?.occupation || profile?.email || (status === "authenticated" ? "Miembro de Polarist" : "Visitante");

  return (
    <div className="flex min-h-full flex-col bg-background p-5 pb-24">
      <button
        type="button"
        onClick={goToSettings}
        className="mb-8 mt-2 flex w-full items-center gap-4 rounded-[24px] text-left transition-colors hover:bg-secondary/30"
      >
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border/50 bg-muted text-2xl font-semibold text-foreground shadow-sm">
          {avatarUrl && avatarUrl !== "/avatar.jpg" ? (
            <img src={avatarUrl} alt={profile?.fullName || "Perfil"} className="h-full w-full object-cover" />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-bold leading-tight text-foreground">
            {profile?.fullName || "Tu perfil"}
          </h1>
          <p className="truncate text-[14px] font-medium text-muted-foreground">{userSubtitle}</p>
        </div>
      </button>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/30 pt-4">
        <button
          type="button"
          onClick={goToLibrary}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary/50"
        >
          <Bookmark className="h-5 w-5 text-foreground/70" />
          <span className="text-[15px] font-medium text-foreground/90">Tu biblioteca</span>
        </button>

        <button
          type="button"
          onClick={goToSettings}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary/50"
        >
          <Settings className="h-5 w-5 text-foreground/70" />
          <span className="text-[15px] font-medium text-foreground/90">Configuración</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[15px] font-medium">
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
