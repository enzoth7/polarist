import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const navigate = useNavigate();
  const { avatarUrl, profile, refreshProfile, status } = useAuth();
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.fullName || "");
    setOccupation(profile?.occupation || "");
    setEmail(profile?.email || "");
  }, [profile]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      toast.error("No encontramos una sesión activa");
      return;
    }

    const normalizedFullName = fullName.trim();
    const normalizedOccupation = occupation.trim();
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedFullName) {
      toast.error("El nombre completo es obligatorio");
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
            occupation: normalizedOccupation,
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
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" && !profile) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <p className="text-sm font-medium text-muted-foreground">Cargando configuración...</p>
      </div>
    );
  }

  if (status !== "authenticated" || !profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Necesitas iniciar sesión</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Inicia sesión con Google para editar tu perfil y la configuración de tu cuenta.
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
              Configuración
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Ajusta tu cuenta
            </h1>
          </div>

          <Button asChild variant="ghost" className="rounded-full">
            <Link to={routes.appProfile}>
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
                  Esta imagen viene desde tu cuenta de Google y aquí es solo de lectura.
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
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupación</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  placeholder="Tu ocupación"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-secondary/25 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Gestión de cuenta</h2>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Cambiar Email</Label>
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
                <Label htmlFor="password">Cambiar Contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nueva contraseña"
                    autoComplete="new-password"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Déjalo vacío si no quieres cambiar tu contraseña.
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
