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
    neutral: "border-black/12 bg-white/75 text-foreground dark:border-white/20 dark:bg-[#0d1219]/88 dark:text-white",
    success: "border-primary/45 bg-primary text-primary-foreground dark:border-primary/45 dark:bg-primary dark:text-primary-foreground",
    danger: "border-red-500/35 bg-[linear-gradient(145deg,rgba(255,225,225,0.9),rgba(255,194,194,0.74))] text-[#401212]",
  };

  toast.custom(
    () => (
      <div className={cn("pointer-events-auto mr-3 w-[min(92vw,360px)] rounded-[18px] border px-4 py-3 shadow-[0_18px_38px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mr-5", toneClasses[tone])}>
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
    if (!file.type.startsWith("image/")) { toast.error("Por favor, sube una imagen válida."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("La imagen debe pesar menos de 5MB."); return; }
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
      const shouldUpdateAuth = normalizedEmail !== profile.email || normalizedPassword.length > 0;
      if (shouldUpdateAuth) {
        const { error: authError } = await supabase.auth.updateUser({
          email: normalizedEmail !== profile.email ? normalizedEmail : undefined,
          password: normalizedPassword || undefined,
        });
        if (authError) throw authError;
      }
      const { error: profileError } = await supabase
        .from("polarist_usuarios")
        .upsert({ id: profile.id, full_name: normalizedFullName, username: normalizedUsername, occupation: normalizedOccupation, country: normalizedCountry || null, email: normalizedEmail, avatar_url: localAvatarUrl }, { onConflict: "id" })
        .select("id").single();
      if (profileError) throw profileError;
      await refreshProfile();
      setPassword("");
      showBubbleToast({
        title: "Cambios guardados",
        description: normalizedEmail !== profile.email ? "Revisá tu correo para confirmar el nuevo email." : "Tu perfil se actualizó correctamente.",
        tone: "success",
      });
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

  // ─── Clases del sistema de diseño ───────────────────────────────────
  const cardClass = "relative overflow-hidden rounded-[28px] bg-white border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-6 md:p-8";
  const inputClass = "h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 transition-colors";
  const labelClass = "text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-500";

  // ─── Estados de carga ────────────────────────────────────────────────
  if (status === "loading" && !profile) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F0F2F6] p-6">
        <p className="text-sm font-bold text-zinc-400">Cargando configuración...</p>
      </div>
    );
  }

  if (status !== "authenticated" || !profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#F0F2F6] p-6 text-center">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Necesitás iniciar sesión</h1>
        <p className="max-w-sm text-sm font-medium text-zinc-500">
          Iniciá sesión con Google para editar tu perfil y la configuración de tu cuenta.
        </p>
        <Button onClick={() => navigate(routes.login)}>Ir al login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F0F2F6] px-5 pb-24 pt-6 md:px-8 md:pb-16 md:pt-10">
      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-5">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Cuenta</span>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight leading-none text-zinc-900 mt-0.5">
              Configuración
            </h1>
          </div>
          <Link
            to={profileRoute}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">

          {/* ─── Foto de perfil ──────────────────────────────────── */}
          <section className={cardClass}>
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="group relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
                  {isUploadingAvatar ? (
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  ) : (
                    <img src={localAvatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                </label>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-base font-black tracking-tight text-zinc-900">Foto de perfil</h2>
                <p className="text-sm font-medium text-zinc-400 mt-0.5">Máximo 5 MB. JPG, PNG o WebP.</p>
                <label
                  htmlFor="avatar-upload"
                  className="mt-3 inline-flex cursor-pointer items-center rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[12px] font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50"
                >
                  {isUploadingAvatar ? "Subiendo..." : "Cambiar foto"}
                </label>
              </div>
            </div>
          </section>

          {/* ─── Perfil ──────────────────────────────────────────── */}
          <section className={cardClass}>
            <div className="flex items-center gap-2 mb-5">
              <UserRound className="h-4 w-4 text-zinc-400" />
              <h2 className="text-base font-black tracking-tight text-zinc-900">Perfil</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className={labelClass}>Nombre completo</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" autoComplete="name" className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occupation" className={labelClass}>Ocupación</Label>
                <Input id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Tu ocupación" className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username" className={labelClass}>Nombre de usuario</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tuusuario" autoCapitalize="none" autoCorrect="off" className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country" className={labelClass}>País</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej: Uruguay" list="country-options" autoComplete="off" className={`pl-9 ${inputClass}`} />
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
            <div className="flex items-center gap-2 mb-5">
              <Mail className="h-4 w-4 text-zinc-400" />
              <h2 className="text-base font-black tracking-tight text-zinc-900">Gestión de cuenta</h2>
            </div>

            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={labelClass}>Contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva contraseña" autoComplete="new-password" className={`pl-9 ${inputClass}`} />
                </div>
                <p className="text-xs font-medium text-zinc-400">Dejalo vacío si no querés cambiar la contraseña.</p>
              </div>
            </div>
          </section>

          {/* ─── Guardar ─────────────────────────────────────────── */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center rounded-[28px] border border-white/80 bg-gradient-to-b from-white to-[#f4f4f7] px-8 py-3.5 text-[15px] font-bold tracking-tight text-[#1a1a1a] shadow-[0_8px_20px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] ring-1 ring-black/[0.04] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
