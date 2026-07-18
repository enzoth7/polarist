import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Sparkles } from 'lucide-react';
import type { DiagnosisResult as ResultType } from '@/data/diagnosisQuestions';

interface DiagnosisResultProps {
  result: ResultType;
  onContinue: () => void;
}

const analysisSteps = [
  "Analizando tus respuestas...",
  "Identificando oportunidades de automatización...",
  "Evaluando madurez operativa y tecnológica...",
  "Cruzando datos con modelos de referencia...",
  "Diseñando tu hoja de ruta personalizada...",
  "Finalizando el reporte de diagnóstico..."
];

const labelMap: Record<string, string> = {
  formacion: "Formación",
  asesoria: "Asesoría Estratégica",
  implementacion: "Implementación",
  mix: "Approach Híbrido",
  inicial: "Nivel Inicial de IA",
  intermedio: "Nivel Intermedio de IA",
  avanzado: "Nivel Avanzado de IA"
};

export default function DiagnosisResult({ result, onContinue }: DiagnosisResultProps) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (phase === 1) {
      const stepInterval = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < analysisSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500); // 15 seconds / 6 steps = 2500ms per step

      const phaseTimeout = setTimeout(() => {
        setPhase(2);
      }, 15000); // 15 seconds total duration

      return () => {
        clearInterval(stepInterval);
        clearTimeout(phaseTimeout);
      };
    }
  }, [phase]);

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[400px] flex items-center justify-center p-6 text-[#F6F6F6]">
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center space-y-8 w-full"
          >
            {/* Animated Icon Container */}
            <div className="w-20 h-20 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {stepIndex === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <circle cx="12" cy="12" r="10" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '10s' }} />
                      <path d="M12 2v20M2 12h20" />
                      <circle cx="12" cy="12" r="3" fill="#CAFE5B" className="animate-pulse" />
                    </svg>
                  </motion.div>
                )}
                {stepIndex === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '14s' }} />
                      <circle cx="12" cy="12" r="3" fill="#CAFE5B" />
                    </svg>
                  </motion.div>
                )}
                {stepIndex === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                      <path d="M18 8h.7V8.7" />
                      <rect x="7" y="15" width="2" height="5" rx="0.5" fill="#CAFE5B" stroke="none" />
                      <rect x="12" y="11" width="2" height="9" rx="0.5" fill="#CAFE5B" stroke="none" />
                      <rect x="17" y="7" width="2" height="13" rx="0.5" fill="#CAFE5B" stroke="none" />
                    </svg>
                  </motion.div>
                )}
                {stepIndex === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <path d="M5 12h14M12 5v14M5 5l14 14M5 14L14 5" strokeDasharray="2 2" className="animate-pulse" />
                      <circle cx="12" cy="12" r="4" fill="#010101" />
                      <circle cx="5" cy="5" r="2" fill="#CAFE5B" />
                      <circle cx="19" cy="5" r="2" fill="#CAFE5B" />
                      <circle cx="5" cy="19" r="2" fill="#CAFE5B" />
                      <circle cx="19" cy="19" r="2" fill="#CAFE5B" />
                      <circle cx="12" cy="12" r="2" fill="#CAFE5B" />
                    </svg>
                  </motion.div>
                )}
                {stepIndex === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#CAFE5B" stroke="none" className="animate-pulse" style={{ transformOrigin: 'center' }} />
                    </svg>
                  </motion.div>
                )}
                {stepIndex === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CAFE5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="filter drop-shadow-[0_0_12px_rgba(202,254,91,0.6)]">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 15l2 2 4-4" stroke="#CAFE5B" strokeWidth="2.5" className="animate-pulse" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 15, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-[#CAFE5B]"
              />
            </div>
            <div className="h-16 relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg font-medium text-center text-white/80"
                >
                  {analysisSteps[stepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            {/* Simple CSS pulsing dots */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-[#CAFE5B]"
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full p-4 md:p-10 flex flex-col items-center justify-center text-center"
          >
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <h2 
                className="text-3xl md:text-5xl font-bold tracking-tight text-[#F6F6F6]" 
                style={{ fontFamily: "var(--font-sequel, 'Sequel Sans', 'Helvetica Neue', Arial, sans-serif)", letterSpacing: "-2px" }}
              >
                Tu diagnóstico es:
              </h2>
              
              <h3
                className="text-3xl md:text-4xl font-normal italic tracking-wide text-[#CAFE5B]"
                style={{ fontFamily: "var(--font-serif, 'Arno Pro', Georgia, serif)" }}
              >
                {['inicial', 'intermedio', 'avanzado'].includes(result.primary)
                  ? `nivel ${result.primary} de IA`
                  : labelMap[result.primary] || result.primary}
              </h3>

              <div className="flex flex-col items-center mt-2 mb-4">
                <span className="text-lg md:text-xl text-[#F6F6F6]/60 font-sans font-medium tracking-wide">
                  Te recomendamos
                </span>
                <span 
                  className={`text-2xl md:text-3xl font-bold tracking-tight mt-2 ${
                    ['inicial', 'intermedio', 'avanzado'].includes(result.primary) 
                      ? 'text-[#CAFE5B]' 
                      : 'text-[#8B5BF5]'
                  }`}
                  style={{ fontFamily: "var(--font-sequel, 'Sequel Sans', 'Helvetica Neue', Arial, sans-serif)", letterSpacing: "-1px" }}
                >
                  {(() => {
                    const isLevel = ['inicial', 'intermedio', 'avanzado'].includes(result.primary);
                    if (isLevel) {
                      if (result.primary === 'avanzado') {
                        return "Esperar nuestro contacto";
                      }
                      return labelMap[result.secondary || 'asesoria'];
                    } else {
                      const primaryLabel = labelMap[result.primary] || result.primary;
                      const secondaryLabel = result.secondary ? ` + ${labelMap[result.secondary]}` : '';
                      return `${primaryLabel}${secondaryLabel}`;
                    }
                  })()}
                </span>
              </div>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl font-light">
                {result.explanation}
              </p>

              <div className="pt-4 md:pt-8 w-full flex flex-col items-center">
                <button
                  onClick={onContinue}
                  className="w-full md:w-auto px-10 py-4 bg-[#F6F6F6] text-[#010101] hover:bg-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
