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
  "Identificando oportunidades...",
  "Preparando tu diagnóstico personalizado..."
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
      }, 1300);

      const phaseTimeout = setTimeout(() => {
        setPhase(2);
      }, 4000);

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
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {stepIndex === 0 && (
                  <motion.div
                    key="brain"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Brain className="w-10 h-10 text-[#8B5BF5]" />
                  </motion.div>
                )}
                {stepIndex === 1 && (
                  <motion.div
                    key="sparkles"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Sparkles className="w-10 h-10 text-[#CAFE5B]" />
                  </motion.div>
                )}
                {stepIndex === 2 && (
                  <motion.div
                    key="cpu"
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Cpu className="w-10 h-10 text-[#8B5BF5]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8B5BF5] to-[#CAFE5B]"
              />
            </div>
            <div className="h-8 relative overflow-hidden flex items-center justify-center">
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
            className="w-full p-6 md:p-10 flex flex-col items-center justify-center text-center"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 
                className="text-4xl md:text-5xl font-bold tracking-tight text-[#F6F6F6]" 
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
                        return "Nos pondremos en contacto";
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

              <div className="pt-8 w-full flex flex-col items-center">
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
