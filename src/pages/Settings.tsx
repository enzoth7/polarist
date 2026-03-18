import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const navigate = useNavigate();
  const { avatarUrl, profile, refreshProfile, status } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [occupation, setOccupation] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;

  useEffect(() => {
    setFullName(profile?.fullName || "");
    setUsername(profile?.username || "");
    setOccupation(profile?.occupation || "");
    setCountry(profile?.country || "");
    setEmail(profile?.email || "");
  }, [profile]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      toast.error("No encontramos una sesion activa");
      return;
    }

    const normalizedFullName = fullName.trim();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedOccupation = occupation.trim();
    const normalizedCountry = country.trim();
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedFullName) {
      toast.error("El nombre completo es obligatorio");
      return;
    }

    if (!normalizedUsername) {
      toast.error("El username es obligatorio");
      return;
    }

    if (/\s/.test(normalizedUsername)) {
      toast.error("El username no puede tener espacios");
      return;
    }

    if (!normalizedEmail) {
      toast.error("El email es obligatorio");
      return;
    }

    try {
      setIsSaving(true);

      const shouldUpdateAuth =
        normalizedEmail !== profile.email || normalizedPassword.length > 0;

      if (shouldUpdateAuth) {
        const { error: authError } = await supabase.auth.updateUser({
          email: normalizedEmail !== profile.email ? normalizedEmail : undefined,
          password: normalizedPassword || undefined,
        });

        if (authError) {
          throw authError;
        }
      }

      const { error: profileError } = await supabase
        .from("polarist_usuarios")
        .upsert(
          {
            id: profile.id,
            full_name: normalizedFullName,
            username: normalizedUsername,
            occupation: normalizedOccupation,
            country: normalizedCountry || null,
            email: normalizedEmail,
            avatar_url: profile.avatarUrl,
          },
          { onConflict: "id" },
        )
        .select("id")
        .single();

      if (profileError) {
        throw profileError;
      }

      await refreshProfile();
      setPassword("");

      if (normalizedEmail !== profile.email) {
        toast.success("Cambios guardados. Revisa tu correo para confirmar el nuevo email.");
      } else {
        toast.success("Cambios guardados");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("username") || message.toLowerCase().includes("duplicate")) {
        toast.error("Ese username ya esta en uso");
      } else {
        toast.error("No se pudieron guardar los cambios");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" && !profile) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <p className="text-sm font-medium text-muted-foreground">Cargando configuracion...</p>
      </div>
    );
  }

  if (status !== "authenticated" || !profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Necesitas iniciar sesion</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Inicia sesion con Google para editar tu perfil y la configuracion de tu cuenta.
        </p>
        <Button onClick={() => navigate(routes.login)}>Ir a login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background px-5 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Configuracion
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Ajusta tu cuenta
            </h1>
          </div>

          <Button asChild variant="ghost" className="rounded-full">
            <Link to={profileRoute}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          <section className="rounded-[28px] bg-secondary/25 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-muted">
                <img src={avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Foto de perfil</h2>
                <p className="text-sm text-muted-foreground">
                  Esta imagen viene desde tu cuenta de Google y aqui es solo de lectura.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-secondary/25 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupacion</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  placeholder="Tu ocupacion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="tuusuario"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pais</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="country"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Ej: Uruguay"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-secondary/25 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Gestion de cuenta</h2>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Cambiar email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Cambiar contrasena</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nueva contrasena"
                    autoComplete="new-password"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Dejalo vacio si no quieres cambiar tu contrasena.
                </p>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="rounded-full px-7"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
