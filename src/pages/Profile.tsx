import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";

const Profile = () => {
  const navigate = useNavigate();
  const { avatarUrl, profile, status } = useAuth();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const goToLibrary = () => {
    navigate(routes.appLibrary);
  };

  const userInitial = profile?.fullName?.charAt(0)?.toUpperCase() || "P";
  const userSubtitle =
    profile?.occupation || profile?.email || (status === "authenticated" ? "Miembro de Polarist" : "Visitante");

  return (
    <div className="flex min-h-full flex-col bg-background p-5 pb-24">
      <div className="mb-8 mt-2 flex w-full items-center gap-4">
        <button
          type="button"
          onClick={() => setShowImagePreview(true)}
          className="group relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border/50 bg-muted text-2xl font-semibold text-foreground shadow-sm transition-transform active:scale-95"
        >
          {avatarUrl && avatarUrl !== "/avatar.jpg" ? (
            <img src={avatarUrl} alt={profile?.fullName || "Perfil"} className="h-full w-full object-cover" />
          ) : (
            <span>{userInitial}</span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
            <Sparkles className="h-5 w-5 text-white/70" />
          </div>
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-bold leading-tight text-foreground">
            {profile?.fullName || "Tu perfil"}
          </h1>
          <p className="truncate text-[14px] font-medium text-muted-foreground">{userSubtitle}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/30 pt-4">
        <button
          type="button"
          onClick={goToLibrary}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary/50"
        >
          <Bookmark className="h-5 w-5 text-foreground/70" />
          <span className="text-[15px] font-medium text-foreground/90">Tu biblioteca</span>
        </button>
      </div>

      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowImagePreview(false);
              }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={avatarUrl && avatarUrl !== "/avatar.jpg" ? avatarUrl : "/avatar.jpg"}
                alt="Avatar grande"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
