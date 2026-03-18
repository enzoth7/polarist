import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  LogOut,
  MapPin,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { PostCard } from "@/pages/Community";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { usePublicUserProfile } from "@/hooks/usePublicUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import { useUserSavedTools } from "@/hooks/useUserSavedTools";
import { routes } from "@/lib/routes";

const getInitials = (name?: string | null) => name?.trim().slice(0, 2).toUpperCase() || "PU";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { profile, loading: profileLoading } = usePublicUserProfile(username);
  const { posts, loading: postsLoading, refreshPosts } = useUserPosts(profile?.id);
  const { tools, loading: toolsLoading } = useUserSavedTools(profile?.id);
  const { toggleLike } = useCommunity({ enabled: false });
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isOwnProfile = Boolean(user && profile && user.id === profile.id);
  const libraryLabel = isOwnProfile ? "Mi biblioteca" : "Biblioteca";

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      navigate(routes.login, { replace: true });
    } catch (error) {
      console.error("Error signing out from profile:", error);
      toast.error("No se pudo cerrar sesion");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!username) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">No encontramos ese perfil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-6 md:pb-12">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to={routes.appCommunity}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>

          {isOwnProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={routes.appSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Ir a configuracion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isSigningOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isSigningOut ? "Cerrando sesion..." : "Cerrar sesion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        <section className="rounded-[28px] border border-border/40 bg-background px-5 py-6 md:px-6">
          {profileLoading ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          ) : profile ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-muted text-2xl font-semibold text-foreground">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "Perfil"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{getInitials(profile.full_name)}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {profile.full_name || "Usuario Polarist"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    @{profile.username || username}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {profile.occupation ? (
                    <div className="inline-flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4" />
                      <span>{profile.occupation}</span>
                    </div>
                  ) : null}

                  {profile.country ? (
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.country}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <h1 className="text-xl font-semibold text-foreground">Perfil no disponible</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                No encontramos informacion publica para este usuario.
              </p>
            </div>
          )}
        </section>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="h-auto w-full justify-start rounded-full bg-muted/40 p-1">
            <TabsTrigger value="activity" className="rounded-full px-4 py-2">
              Actividad
            </TabsTrigger>
            <TabsTrigger value="library" className="rounded-full px-4 py-2">
              {libraryLabel}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <section className="overflow-hidden rounded-[28px] border border-border/40 bg-background">
              {postsLoading ? (
                <div className="space-y-4 px-5 py-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-3">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div>
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onReplyCreated={refreshPosts}
                      toggleLike={toggleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <h2 className="text-lg font-semibold text-foreground">Sin actividad publica</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Este perfil aun no ha publicado en la comunidad.
                  </p>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            <section className="rounded-[28px] border border-border/40 bg-background p-5 md:p-6">
              {toolsLoading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-border/40 p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tools.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {tools.map((tool) => (
                    <article key={tool.name} className="rounded-2xl border border-border/40 p-4">
                      <div className="flex items-center gap-3">
                        <ToolLogo
                          name={tool.name}
                          domain={tool.domain}
                          className="h-12 w-12 border-none bg-transparent"
                          imageClassName="p-0.5"
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-foreground">
                            {tool.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                            >
                              {tool.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                            >
                              {tool.kind}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="text-lg font-semibold text-foreground">
                    Aun no ha guardado herramientas
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cuando guarde herramientas en su biblioteca, apareceran aqui.
                  </p>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
