import { useState } from 'react';
import { motion } from 'framer-motion';

export interface ContactData {
  fullName: string;
  email: string;
  companyName?: string;
  whatsapp?: string;
}

interface DiagnosisContactFormProps {
  userType: 'persona' | 'empresa';
  onSubmit: (data: ContactData) => void;
  loading: boolean;
  direction: number;
}

export default function DiagnosisContactForm({
  userType,
  onSubmit,
  loading,
  direction,
}: DiagnosisContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    fullName: '',
    email: '',
    companyName: '',
    whatsapp: '',
  });

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-10 text-center">
        <h2 
          className="text-4xl md:text-5xl font-bold text-[#F6F6F6] mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-sequel, 'Sequel Sans', 'Helvetica Neue', Arial, sans-serif)" }}
        >
          Último paso
        </h2>
        <p className="text-white/60 text-lg">Dejá tus datos para que nos pongamos en contacto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            required
            placeholder="Nombre completo"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full bg-[#111111]/30 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#CAFE5B]/70 focus:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#CAFE5B]/70 h-16 px-5 transition-all duration-300 hover:border-white/20"
          />
        </div>

        <div>
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#111111]/30 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#CAFE5B]/70 focus:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#CAFE5B]/70 h-16 px-5 transition-all duration-300 hover:border-white/20"
          />
        </div>

        {userType === 'empresa' && (
          <div>
            <input
              type="text"
              required
              placeholder="Nombre de la empresa"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-[#111111]/30 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#CAFE5B]/70 focus:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#CAFE5B]/70 h-16 px-5 transition-all duration-300 hover:border-white/20"
            />
          </div>
        )}

        <div>
          <input
            type="tel"
            placeholder="WhatsApp (opcional)"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full bg-[#111111]/30 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-[#CAFE5B]/70 focus:bg-white/5 focus-visible:ring-1 focus-visible:ring-[#CAFE5B]/70 h-16 px-5 transition-all duration-300 hover:border-white/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[#F6F6F6] text-[#010101] rounded-full font-semibold mt-4 hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-[#010101]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enviando...</span>
            </span>
          ) : (
            "Enviar diagnóstico"
          )}
        </button>

        <p className="text-center text-xs text-white/40 mt-4">
          Te contactaremos en menos de 48 horas con un plan personalizado.
        </p>
      </form>
    </motion.div>
  );
}
