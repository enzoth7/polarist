import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getAppUserProfileRoute, routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const NON_COUNTRY_REGION_CODES = new Set([
  "AC",
  "CP",
  "DG",
  "EA",
  "EU",
  "EZ",
  "IC",
  "TA",
  "UN",
]);

const countryDisplayNames = new Intl.DisplayNames(["es"], { type: "region" });
const WORLD_COUNTRIES = Array.from({ length: 26 }, (_, firstIndex) => firstIndex + 65)
  .flatMap((firstCode) =>
    Array.from({ length: 26 }, (_, secondIndex) => {
      const code = `${String.fromCharCode(firstCode)}${String.fromCharCode(secondIndex + 65)}`;

      if (NON_COUNTRY_REGION_CODES.has(code)) {
        return null;
      }

      const translatedName = countryDisplayNames.of(code);
      if (!translatedName || translatedName === code) {
        return null;
      }

      return translatedName;
    }),
  )
  .filter((countryName): countryName is string => Boolean(countryName))
  .filter((countryName, index, allNames) => allNames.indexOf(countryName) === index)
  .sort((countryA, countryB) => countryA.localeCompare(countryB, "es"));

type BubbleToastTone = "neutral" | "success" | "danger";

const showBubbleToast = ({
  title,
  description,
  tone = "neutral",
}: {
  title: string;
  description?: string;
  tone?: BubbleToastTone;
}) => {
  const toneClasses: Record<BubbleToastTone, string> = {
    neutral:
      "border-black/12 bg-white/75 text-foreground dark:border-white/20 dark:bg-[#0d1219]/88 dark:text-white",
    success:
      "border-[#ccff00]/45 bg-[linear-gradient(145deg,rgba(224,255,145,0.78),rgba(202,255,64,0.56))] text-[#111a06] dark:border-[#ccff00]/45 dark:bg-[linear-gradient(145deg,rgba(36,58,18,0.92),rgba(74,116,22,0.84))] dark:text-[#e8ffb8]",
    danger:
      "border-red-500/35 bg-[linear-gradient(145deg,rgba(255,225,225,0.9),rgba(255,194,194,0.74))] text-[#401212] dark:border-red-400/40 dark:bg-[linear-gradient(145deg,rgba(55,20,20,0.95),rgba(90,24,24,0.9))] dark:text-red-100",
  };

  toast.custom(
    () => (
      <div
        className={cn(
          "pointer-events-auto mr-3 w-[min(92vw,360px)] rounded-[18px] border px-4 py-3 shadow-[0_18px_38px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mr-5",
          toneClasses[tone],
        )}
      >
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        {description ? <p className="mt-1 text-xs leading-5 opacity-85">{description}</p> : null}
      </div>
    ),
    { duration: 2200, position: "top-right" },
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const { avatarUrl, profile, refreshProfile, status } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [occupation, setOccupation] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localAvatarUrl, setLocalAvatarUrl] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileRoute =
    profile?.username?.trim() ? getAppUserProfileRoute(profile.username.trim()) : routes.appProfile;

  useEffect(() => {
    setFullName(profile?.fullName || "");
    setUsername(profile?.username || "");
    setOccupation(profile?.occupation || "");
    setCountry(profile?.country || "");
    setEmail(profile?.email || "");
    setLocalAvatarUrl(profile?.avatarUrl || avatarUrl);
  }, [profile, avatarUrl]);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, sube una imagen valida.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 5MB.");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: profileError } = await supabase
        .from("polarist_usuarios")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);
      
      if (profileError) throw profileError;

      setLocalAvatarUrl(publicUrl);
      await refreshProfile();
      toast.success("Foto de perfil actualizada.");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Ocurrió un error al subir la imagen.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      toast.error("No encontramos una sesión activa");
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
      toast.error("El nombre de usuario es obligatorio");
      return;
    }

    if (/\s/.test(normalizedUsername)) {
      toast.error("El nombre de usuario no puede tener espacios");
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
            avatar_url: localAvatarUrl,
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
        showBubbleToast({
          title: "Cambios guardados",
          description: "Revisa tu correo para confirmar el nuevo email.",
          tone: "success",
        });
      } else {
        showBubbleToast({
          title: "Cambios guardados",
          description: "Tu perfil se actualizó correctamente.",
          tone: "success",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("username") || message.toLowerCase().includes("duplicate")) {
        toast.error("Ese nombre de usuario ya está en uso");
      } else {
        toast.error("No se pudieron guardar los cambios");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const sectionBubbleClass =
    "relative overflow-hidden rounded-[30px] border border-black/10 bg-white/60 p-5 shadow-[0_18px_36px_-26px_rgba(0,0,0,0.62)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] md:p-6";
  const inputBubbleClass =
    "h-11 rounded-xl border-black/10 bg-white/70 text-foreground shadow-[0_10px_24px_-20px_rgba(0,0,0,0.55)] placeholder:text-foreground/45 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/45";

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
        <Button onClick={() => navigate(routes.login)}>Ir al login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background px-5 pb-24 pt-5 md:px-8 md:pb-12">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_10%_6%,rgba(184,219,77,0.22),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(145,198,171,0.2),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,244,239,0.95)_100%)] dark:bg-[radial-gradient(circle_at_10%_6%,rgba(204,255,0,0.12),transparent_34%),radial-gradient(circle_at_88%_90%,rgba(129,255,190,0.09),transparent_40%),linear-gradient(180deg,rgba(8,15,11,0.9)_0%,rgba(6,11,8,0.98)_100%)]" />

        <section className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/60 px-5 py-6 text-foreground shadow-[0_22px_45px_-30px_rgba(9,15,12,0.75)] backdrop-blur-[18px] dark:border-white/20 dark:bg-white/[0.06] dark:text-white md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_26%,rgba(255,255,255,0.08)_52%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.54),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(177,215,66,0.2),transparent_46%)] dark:bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.14),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(204,255,0,0.08),transparent_46%)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-black/10 dark:bg-white/30" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                Configuración
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground dark:text-white">
                Ajusta tu cuenta
              </h1>
            </div>

            <Button
              asChild
              variant="ghost"
              className="h-auto rounded-full border border-[#CCFF00] bg-[#CCFF00] px-3.5 py-1.5 text-xs font-semibold text-[#0d1204] backdrop-blur-md transition hover:border-[#d8ff4a] hover:bg-[#d8ff4a] hover:text-[#0d1204] focus-visible:ring-[#CCFF00]/70 dark:border-[#CCFF00] dark:bg-[#CCFF00] dark:text-[#0d1204] dark:hover:border-[#d8ff4a] dark:hover:bg-[#d8ff4a] dark:hover:text-[#0d1204]"
            >
              <Link to={profileRoute}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
        </section>

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          <section className={sectionBubbleClass}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.28)_34%,rgba(255,255,255,0.06)_60%,rgba(8,13,10,0.08)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_56%,rgba(8,14,10,0.32)_100%)]" />
            <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />

            <div className="relative mb-3 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="group relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-white/55 backdrop-blur-sm dark:border-white/20 dark:bg-white/[0.08]">
                  {isUploadingAvatar ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <img src={localAvatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                  )}
                </div>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/70 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:border-white/20 dark:bg-white/[0.12] dark:hover:bg-white/[0.2]"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">Foto de perfil</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Máximo 5 MB.
                </p>
                <div className="mt-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-black/10 bg-white/65 shadow-none backdrop-blur-sm hover:bg-white/85 dark:border-white/20 dark:bg-white/[0.1] dark:hover:bg-white/[0.16]"
                    disabled={isUploadingAvatar}
                    asChild
                  >
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      {isUploadingAvatar ? "Subiendo..." : "Cambiar foto"}
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionBubbleClass}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.28)_34%,rgba(255,255,255,0.06)_60%,rgba(8,13,10,0.08)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_56%,rgba(8,14,10,0.32)_100%)]" />
            <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />

            <div className="relative mb-5 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
            </div>

            <div className="relative grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className={inputBubbleClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupación</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  placeholder="Tu ocupación"
                  className={inputBubbleClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="tuusuario"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className={inputBubbleClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="country"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Ej: Uruguay"
                    list="country-options"
                    autoComplete="off"
                    className={`pl-10 ${inputBubbleClass}`}
                  />
                  <datalist id="country-options">
                    {WORLD_COUNTRIES.map((countryName) => (
                      <option key={countryName} value={countryName} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionBubbleClass}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.28)_34%,rgba(255,255,255,0.06)_60%,rgba(8,13,10,0.08)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_56%,rgba(8,14,10,0.32)_100%)]" />
            <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />

            <div className="relative mb-5 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Gestion de cuenta</h2>
            </div>

            <div className="relative grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Cambiar email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputBubbleClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Cambiar contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nueva contraseña"
                    autoComplete="new-password"
                    className={`pl-10 ${inputBubbleClass}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Dejalo vacio si no quieres cambiar tu contraseña.
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
