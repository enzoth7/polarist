import React, { useRef } from "react";
import { Bookmark, Settings, LogOut, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { avatarUrl, setAvatarUrl } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);
      setAvatarUrl(newImageUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background p-5 pb-24">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-border/50 shadow-sm bg-muted flex items-center justify-center flex-shrink-0 cursor-pointer group"
        >
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold text-foreground leading-tight">Cristian Payret</h1>
          <p className="text-[14px] text-muted-foreground font-medium">CEO @ Polarist</p>
        </div>
      </div>

      {/* Saved Library Section */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-foreground flex items-center gap-2">
            <Bookmark className="w-5 h-5" /> Tu Biblioteca
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* Saved Item 1 */}
          <div className="bg-secondary/40 border border-border/40 rounded-[16px] p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-bold text-foreground">Prompt de Copywriting</h3>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">PROMPT</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-snug">
              Estructura persuasiva para correos en frío dirigidos a dueños de agencias.
            </p>
          </div>

          {/* Saved Item 2 */}
          <div className="bg-secondary/40 border border-border/40 rounded-[16px] p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-bold text-foreground">Guía: Automatización N8N</h3>
              <span className="text-[10px] font-bold bg-[#9c8fb6]/10 text-[#9c8fb6] px-2 py-1 rounded-full">GUÍA</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-snug">
              Los 5 workflows esenciales para automatizar la captación de leads en redes sociales.
            </p>
          </div>

          {/* Saved Item 3 */}
          <div className="bg-secondary/40 border border-border/40 rounded-[16px] p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-bold text-foreground">Make.com</h3>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">HERRAMIENTA</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-snug">
              Herramienta recomendada para automatización fácil y sin código.
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border/30">
        <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors w-full text-left">
          <Settings className="w-5 h-5 text-foreground/70" />
          <span className="text-[15px] font-medium text-foreground/90">Configuración</span>
        </button>
        <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors w-full text-left">
          <LogOut className="w-5 h-5" />
          <span className="text-[15px] font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
