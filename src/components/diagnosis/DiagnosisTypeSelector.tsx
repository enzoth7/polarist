import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';

interface DiagnosisTypeSelectorProps {
  value?: 'persona' | 'empresa';
  onChange: (type: 'persona' | 'empresa') => void;
}

export default function DiagnosisTypeSelector({ value, onChange }: DiagnosisTypeSelectorProps) {
  const [selected, setSelected] = useState<'persona' | 'empresa' | null>(null);

  const handleSelect = (type: 'persona' | 'empresa') => {
    setSelected(type);
    // highlight verde momentáneo antes de avanzar
    setTimeout(() => {
      onChange(type);
    }, 400); // 400ms delay for animation
  };

  const activeType = value || selected;

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full max-w-2xl mx-auto p-4 text-[#F6F6F6]">
      {/* Card Persona: Verde */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSelect('persona')}
        className={`flex-1 flex flex-col items-center justify-center p-10 rounded-3xl border transition-all duration-300 cursor-pointer ${
          activeType === 'persona' 
            ? 'border-[#CAFE5B] bg-[#CAFE5B]/10 shadow-[0_0_40px_rgba(202,254,91,0.2)]' 
            : 'border-white/5 bg-[#111111]/30 hover:border-[#CAFE5B]/50 hover:bg-[#CAFE5B]/5 hover:shadow-[0_0_30px_rgba(202,254,91,0.1)]'
        }`}
      >
        <div className="p-5 rounded-2xl mb-6 bg-[#CAFE5B] text-[#010101] shadow-[0_4px_20px_rgba(202,254,91,0.15)]">
          <User size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight text-center leading-tight">
          Soy una<br />persona
        </h3>
        <p className="text-white/50 text-center text-sm md:text-base leading-relaxed">
          Busco potenciar mis<br />habilidades con IA
        </p>
      </motion.div>

      {/* Card Empresa: Violeta */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSelect('empresa')}
        className={`flex-1 flex flex-col items-center justify-center p-10 rounded-3xl border transition-all duration-300 cursor-pointer ${
          activeType === 'empresa' 
            ? 'border-[#8B5BF5] bg-[#8B5BF5]/10 shadow-[0_0_40px_rgba(139,91,245,0.2)]' 
            : 'border-white/5 bg-[#111111]/30 hover:border-[#8B5BF5]/50 hover:bg-[#8B5BF5]/5 hover:shadow-[0_0_30px_rgba(139,91,245,0.1)]'
        }`}
      >
        <div className="p-5 rounded-2xl mb-6 bg-[#8B5BF5] text-[#F6F6F6] shadow-[0_4px_20px_rgba(139,91,245,0.15)]">
          <Building2 size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight text-center leading-tight">
          Soy una<br />empresa
        </h3>
        <p className="text-white/50 text-center text-sm md:text-base leading-relaxed">
          Busco soluciones para<br />mi equipo o negocio
        </p>
      </motion.div>
    </div>
  );
}
