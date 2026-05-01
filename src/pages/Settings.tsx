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
import { ShinyButton } from "@/components/ui/shiny-button";
import { AvatarUploader } from "@/components/ui/avatar-uploader";

const NON_COUNTRY_REGION_CODES = new Set([
  "AC", "CP", "DG", "EA", "EU", "EZ", "IC", "TA", "UN",
]);

const countryDisplayNames = new Intl.DisplayNames(["es"], { type: "region" });
const WORLD_COUNTRIES = Array.from({ length: 26 }, (_, firstIndex) => firstIndex + 65)
  .flatMap((firstCode) =>
    Array.from({ length: 26 }, (_, secondIndex) => {
      const code = `${String.fromCharCode(firstCode)}${String.fromCharCode(secondIndex + 65)}`;
      if (NON_COUNTRY_REGION_CODES.has(code)) return null;
      const translatedName = countryDisplayNames.of(code);
      if (!translatedName || translatedName === code) return null;
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
    neutral: "border-white/10 bg-[#0d1219]/88 text-white",
    success: "border-[#CAFE5B]/45 bg-[#CAFE5B] text-[#010101]",
    danger: "border-red-500/35 bg-red-500 text-white",
  };

  toast.custom(
    () => (
      <div className={cn("pointer-events-auto mr-3 w-[min(92vw,360px)] rounded-[18px] border px-4 py-3 shadow-[0_18px_38px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mr-5", toneClasses[tone])}>
        <p className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}>{title}</p>
        {description ? <p className="mt-1 text-xs leading-5 opacity-85" style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}>{description}</p> : null}
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

  const onAvatarUpload = async (file: File) => {
    if (!profile) return { success: false };
    try {
      setIsUploadingAvatar(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const { error: profileError } = await supabase.from("polarist_usuarios").update({ avatar_url: publicUrl }).eq("id", profile.id);
      if (profileError) throw profileError;
      setLocalAvatarUrl(publicUrl);
      await refreshProfile();
      return { success: true };
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Ocurrió un error al subir la imagen.");
      return { success: false };
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) { toast.error("No encontramos una sesión activa"); return; }
    const normalizedFullName = fullName.trim();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedOccupation = occupation.trim();
    const normalizedCountry = country.trim();
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();
    if (!normalizedFullName) { toast.error("El nombre completo es obligatorio"); return; }
    if (!normalizedUsername) { toast.error("El nombre de usuario es obligatorio"); return; }
    if (/\s/.test(normalizedUsername)) { toast.error("El nombre de usuario no puede tener espacios"); return; }
    if (!normalizedEmail) { toast.error("El email es obligatorio"); return; }
    try {
      setIsSaving(true);
      
      // 1. Actualizar Auth si es necesario
      const shouldUpdateAuth = normalizedEmail !== profile.email || normalizedPassword.length > 0;
      if (shouldUpdateAuth) {
        const { error: authError } = await supabase.auth.updateUser({
          email: normalizedEmail !== profile.email ? normalizedEmail : undefined,
          password: normalizedPassword || undefined,
        });
        if (authError) throw authError;
      }
      
      // 2. Actualizar Perfil en la tabla (usamos update para evitar conflictos de upsert)
      const { error: profileError } = await supabase
        .from("polarist_usuarios")
        .update({ 
          full_name: normalizedFullName, 
          username: normalizedUsername, 
          occupation: normalizedOccupation, 
          country: normalizedCountry || null, 
          email: normalizedEmail, 
          avatar_url: localAvatarUrl 
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;
      
      await refreshProfile();
      setPassword("");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      
      // Reportar error al usuario de forma legible
      const message = error.message || "";
      if (message.includes("unique_idx") || message.includes("duplicate")) {
        toast.error("Ese nombre de usuario ya está en uso");
      } else if (message.includes("email")) {
        toast.error("Hubo un problema con el email");
      } else {
        toast.error("No se pudieron guardar los cambios");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Clases del sistema de diseño (Brand Kit B Sutil) ─────────────────
  const cardClass = "relative overflow-hidden rounded-[32px] bg-white/[0.03] p-6 md:p-8 backdrop-blur-md";
  const inputClass = "h-12 rounded-2xl border-transparent bg-white/[0.05] text-[#F6F6F6] placeholder:text-[#F6F6F6]/30 ring-0 ring-offset-0 focus:bg-white/[0.05] focus:border-white/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-none";
  const labelClass = "text-[11px] font-bold uppercase tracking-[0.2em] text-[#F6F6F6]/40";
  const sequelStyle = { fontFamily: 'var(--font-sequel, sans-serif)' };

  // ─── Estados de carga ────────────────────────────────────────────────
  if (status === "loading" && !profile) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#010101] p-6">
        <p className="text-sm font-bold text-[#F6F6F6]/40" style={sequelStyle}>Cargando configuración...</p>
      </div>
    );
  }

  if (status !== "authenticated" || !profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-[#010101] p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#F6F6F6]" style={sequelStyle}>Necesitás iniciar sesión</h1>
        <p className="max-w-sm text-sm font-medium text-[#F6F6F6]/60" style={sequelStyle}>
          Iniciá sesión con tu cuenta para editar tu perfil y la configuración.
        </p>
        <Button onClick={() => navigate(routes.login)} className="rounded-full px-8 py-6 bg-[#CAFE5B] text-[#010101] hover:bg-[#CAFE5B]/90 font-bold" style={sequelStyle}>Ir al login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#010101] px-5 pb-32 pt-10 md:px-8 md:pt-16">
      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 
              className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight leading-none text-[#F6F6F6]"
              style={{ ...sequelStyle, letterSpacing: '-0.04em' }}
            >
              Configuración
            </h1>
          </div>
          <Link
            to={profileRoute}
            className="flex items-center gap-2 rounded-full bg-white/[0.05] px-5 py-2.5 text-[12px] font-bold text-[#F6F6F6]/80 backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:scale-105 active:scale-95"
            style={sequelStyle}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">

          {/* ─── Foto de perfil ──────────────────────────────────── */}
          <section className={cardClass}>
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="group relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05]">
                  {isUploadingAvatar ? (
                    <Loader2 className="h-7 w-7 animate-spin text-[#CAFE5B]" />
                  ) : (
                    <img src={localAvatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                  )}
                </div>
                </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold tracking-tight text-[#F6F6F6]" style={sequelStyle}>Foto de perfil</h2>
                <p className="text-[13px] font-medium text-[#F6F6F6]/40 mt-1" style={sequelStyle}>JPG, PNG o WebP. Máximo 5 MB.</p>
                <AvatarUploader onUpload={onAvatarUpload}>
                  <button
                    type="button"
                    className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white/[0.05] px-4 py-2 text-[11px] font-bold text-[#F6F6F6]/80 transition-all hover:bg-white/[0.1]"
                    style={sequelStyle}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? "Subiendo..." : "Actualizar foto"}
                  </button>
                </AvatarUploader>
              </div>
            </div>
          </section>

          {/* ─── Perfil ──────────────────────────────────────────── */}
          <section className={cardClass}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#F6F6F6]" style={sequelStyle}>Perfil</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={labelClass} style={sequelStyle}>Nombre completo</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" className={cn(inputClass, "px-4")} style={sequelStyle} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className={labelClass} style={sequelStyle}>Ocupación</Label>
                <Input id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Tu ocupación" className={cn(inputClass, "px-4")} style={sequelStyle} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className={labelClass} style={sequelStyle}>Nombre de usuario</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tuusuario" className={cn(inputClass, "px-4")} style={sequelStyle} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className={labelClass} style={sequelStyle}>País</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F6F6F6]/20" />
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej: Uruguay" list="country-options" className={cn(inputClass, "pl-11 pr-4")} style={sequelStyle} />
                  <datalist id="country-options">
                    {WORLD_COUNTRIES.map((countryName) => (
                      <option key={countryName} value={countryName} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Cuenta ──────────────────────────────────────────── */}
          <section className={cardClass}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#F6F6F6]" style={sequelStyle}>Gestión de cuenta</h2>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass} style={sequelStyle}>Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className={cn(inputClass, "px-4")} style={sequelStyle} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={labelClass} style={sequelStyle}>Contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F6F6F6]/20" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva contraseña" className={cn(inputClass, "pl-11 pr-4")} style={sequelStyle} />
                </div>
                <p className="text-[11px] font-medium text-[#F6F6F6]/30 mt-2" style={sequelStyle}>Dejalo vacío si no querés cambiar la contraseña.</p>
              </div>
            </div>
          </section>

          {/* ─── Guardar ─────────────────────────────────────────── */}
          <div className="flex justify-center pt-4">
            <ShinyButton
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center px-8 py-3 text-[14px] font-semibold tracking-[0.5px] no-underline min-w-[170px]"
              style={sequelStyle}
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </ShinyButton>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
