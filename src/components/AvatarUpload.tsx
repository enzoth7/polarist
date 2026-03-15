import { useState, useRef } from "react";
import { Camera, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
    avatarUrl: string | null;
    onUpload: (url: string) => void;
    size?: number;
}

const AvatarUpload = ({ avatarUrl, onUpload, size = 48 }: AvatarUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No autenticado");

            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            if (updateError) throw updateError;

            onUpload(publicUrl);
            toast({ title: "Foto de perfil actualizada" });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            toast({ title: "Error al subir imagen", description: message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-full"
            style={{ width: size, height: size, minWidth: size }}
            onClick={() => fileInputRef.current?.click()}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <User className="h-1/2 w-1/2" />
                </div>
            )}

            {/* Hover/Uploading overlay */}
            <div
                className={`absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity ${
                    uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            >
                {uploading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Camera className="h-4 w-4 text-white" />
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
            />
        </div>
    );
};

export default AvatarUpload;
