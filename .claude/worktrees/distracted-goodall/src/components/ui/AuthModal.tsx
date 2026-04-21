import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { routes } from "@/lib/routes";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      overlayClassName="bg-black/70 backdrop-blur-md"
      className="max-w-md gap-0 overflow-hidden rounded-2xl border border-border/50 bg-background/70 p-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:rounded-2xl"
      closeClassName="text-muted-foreground hover:text-foreground"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-col items-center gap-5 px-8 py-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00] shadow-[0_0_40px_-10px_#CCFF00]"
        >
          <Lock className="h-6 w-6" />
        </motion.div>

        <DialogTitle className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Acceso Protegido
        </DialogTitle>

        <DialogDescription className="font-sans text-base leading-relaxed text-muted-foreground">
          Necesitas iniciar sesión para poder acceder a Recursos y Biblioteca.
        </DialogDescription>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
          className="mt-2 w-full"
        >
          <Link
            to={routes.login}
            onClick={() => onOpenChange(false)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] px-6 py-3 text-base font-bold text-[#0f1402] shadow-[0_0_0_0_rgba(204,255,0,0)] transition-all duration-300 hover:bg-[#d8ff4a] hover:shadow-[0_0_30px_-4px_rgba(204,255,0,0.55)]"
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </Link>
        </motion.div>
      </motion.div>
    </DialogContent>
  </Dialog>
);

export default AuthModal;
