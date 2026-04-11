import { Link, NavLink } from "react-router-dom";
import { LogIn, Menu } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DesktopNavItem = ({ label, to }: { label: string; to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "rounded-lg px-4 py-2 text-[15px] font-semibold text-muted-foreground transition-colors hover:text-primary",
        isActive && "text-foreground",
      )
    }
  >
    {label}
  </NavLink>
);

const Header = () => {
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
        { label: "Biblioteca", to: profileRoute }
      ]
      : [
        { label: "Inicio", to: routes.landing },
        { label: "Tendencias", to: routes.appRadar },
        { label: "Herramientas", to: routes.appTools },
      ];

  let greeting = "Hola";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Buenos días";
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  const firstName = profile?.fullName?.trim().split(/\s+/)[0];
  const isAuthenticated = status === "authenticated";
  const desktopGreetingLabel =
    isAuthenticated ? (firstName ? `${greeting}, ${firstName}` : greeting) : "Polarist";
  const mobileGreetingLabel = isAuthenticated ? greeting : "Polarist";

  const mobileNavItems =
    status === "authenticated" ?
      [
        { label: "Inicio", to: routes.landing },
        { label: "Tendencias", to: routes.appRadar },
        { label: "Herramientas", to: routes.appTools },
        { label: "Recursos", to: routes.appGuides },
        { label: "Biblioteca", to: profileRoute },
      ]
      : [
        { label: "Inicio", to: routes.landing },
        { label: "Tendencias", to: routes.appRadar },
        { label: "Herramientas", to: routes.appTools },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-4 md:max-w-[2000px] md:grid-cols-3 md:px-16 lg:px-24 xl:px-28">
        {/* Lado Izquierdo */}
        <div className="flex items-center justify-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/80 bg-background/75 text-foreground transition-colors hover:bg-muted md:hidden"
                title="Abrir menú"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] bg-background/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {mobileNavItems.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className="rounded-xl border border-border/60 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                {status !== "authenticated" ? (
                  <SheetClose asChild>
                    <Link
                      to={routes.login}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#CCFF00] px-4 py-3 text-sm font-bold text-[#0f1402] transition-colors hover:bg-[#d8ff4a]"
                    >
                      <LogIn className="h-4 w-4" />
                      Iniciar sesión
                    </Link>
                  </SheetClose>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 items-center gap-3 md:flex">
            <Link to={routes.landing} aria-label="Ir al inicio" className="shrink-0">
              <BrandLogo showLabel={false} imageClassName="h-10 w-10 rounded-xl border-border/60" />
            </Link>
            <p className="text-base font-black tracking-tight text-foreground md:text-lg">
              {desktopGreetingLabel}
            </p>
          </div>
        </div>

        {/* Centro */}
        <div className="flex min-w-0 items-center justify-center gap-2 md:hidden">
          <Link to={routes.landing} aria-label="Ir al inicio" className="shrink-0">
            <BrandLogo showLabel={false} imageClassName="h-10 w-10 rounded-xl border-border/60" />
          </Link>
          <p className="whitespace-nowrap text-sm font-black tracking-tight text-foreground">
            {mobileGreetingLabel}
          </p>
        </div>

        <nav className="hidden items-center justify-center gap-10 md:flex">
          {navItems.map((item) => (
            <DesktopNavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Lado Derecho */}
        <div className="flex items-center justify-end gap-3">
          {status !== "authenticated" && (
            <Button
              asChild
              className="hidden h-11 rounded-full bg-[#CCFF00] px-8 text-[15px] font-bold text-[#0f1402] transition-all hover:bg-[#d8ff4a] md:inline-flex"
            >
              <Link to={routes.login}>
                Iniciar sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
