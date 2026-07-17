import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DiagnosisQuestion as QuestionType } from '@/data/diagnosisQuestions';

interface DiagnosisQuestionProps {
  question: QuestionType;
  value: any; // string para single/select, string[] para multi
  onChange: (value: any) => void;
  direction: number; // para animación de entrada
  userType: 'persona' | 'empresa';
}

export default function DiagnosisQuestion({ question, value, onChange, direction, userType }: DiagnosisQuestionProps) {
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const handleSelectOption = (optionValue: string) => {
    if (question.type === 'single' || question.type === 'select') {
      onChange(optionValue);
    } else if (question.type === 'multi') {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v: string) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    }
  };

  const isSelected = (optionValue: string) => {
    if (question.type === 'multi') {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Safe fallback options if they are not provided on the type yet
  const options = question.options || [];

  // Dynamic styling based on user type (Persona: green, Empresa: violet)
  const borderActive = userType === 'persona' 
    ? 'bg-[#CAFE5B]/10 border-[#CAFE5B] shadow-[0_0_20px_rgba(202,254,91,0.15)]' 
    : 'bg-[#8B5BF5]/10 border-[#8B5BF5] shadow-[0_0_20px_rgba(139,91,245,0.15)]';
  const borderHover = userType === 'persona' 
    ? 'hover:border-[#CAFE5B]/50' 
    : 'hover:border-[#8B5BF5]/50';
  
  const checkActive = userType === 'persona' 
    ? 'border-[#CAFE5B] bg-[#CAFE5B] text-[#010101]' 
    : 'border-[#8B5BF5] bg-[#8B5BF5] text-white';
  const checkHover = userType === 'persona' 
    ? 'group-hover:border-[#CAFE5B]/50' 
    : 'group-hover:border-[#8B5BF5]/50';

  const selectClasses = userType === 'persona'
    ? 'focus:border-[#CAFE5B] focus:ring-[#CAFE5B] hover:border-[#CAFE5B]/50'
    : 'focus:border-[#8B5BF5] focus:ring-[#8B5BF5] hover:border-[#8B5BF5]/50';

  // Helper to parse [keyword] and render it colored
  const renderQuestionText = (text: string) => {
    const regex = /\[(.*?)\]/;
    const match = text.match(regex);
    if (!match) return text;

    const parts = text.split(regex);
    const highlightColor = userType === 'persona' ? 'text-[#CAFE5B]' : 'text-[#8B5BF5]';

    return (
      <>
        {parts[0]}
        <span className={highlightColor}>{match[1]}</span>
        {parts[2]}
      </>
    );
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="w-full max-w-2xl mx-auto text-[#F6F6F6] font-sans"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight text-[#F6F6F6]" style={{ fontFamily: "var(--font-sequel, 'Sequel Sans', 'Helvetica Neue', Arial, sans-serif)" }}>
        {renderQuestionText(question.question || 'Pregunta...')}
      </h2>
      
      {(question as any).description && (
        <p className="text-white/60 text-center mb-8 text-lg">
          {(question as any).description}
        </p>
      )}

      {question.type === 'select' ? (
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-5 rounded-2xl border border-white/10 bg-[#010101] text-white focus:ring-1 outline-none appearance-none transition-all cursor-pointer hover:bg-white/5 ${selectClasses}`}
          >
            <option value="" disabled className="bg-[#010101] text-white/50">Selecciona una opción...</option>
            {options.map((opt: any) => (
              <option key={opt.value} value={opt.value} className="bg-[#010101] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {options.map((opt: any) => {
            const selected = isSelected(opt.value);
            return (
              <motion.div
                key={opt.value}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(opt.value)}
                className={`p-5 rounded-2xl border cursor-pointer transition-colors duration-300 flex items-center gap-4 group ${
                  selected 
                    ? borderActive 
                    : `bg-transparent border-white/5 ${borderHover}`
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-300 ${
                  question.type === 'multi' ? 'rounded-md' : 'rounded-full'
                } ${
                  selected 
                    ? checkActive 
                    : `border-2 border-white/20 ${checkHover}`
                }`}>
                  {selected && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-lg font-medium transition-colors ${selected ? 'text-white' : 'text-white/90'}`}>
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-white/50 text-sm mt-1">
                      {opt.description}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
