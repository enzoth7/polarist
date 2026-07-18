import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { diagnosisQuestions, calculateRecommendation } from '@/data/diagnosisQuestions';
import type { DiagnosisResult as ResultType } from '@/data/diagnosisQuestions';

import DiagnosisTypeSelector from '@/components/diagnosis/DiagnosisTypeSelector';
import DiagnosisQuestion from '@/components/diagnosis/DiagnosisQuestion';
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult';
import DiagnosisContactForm from '@/components/diagnosis/DiagnosisContactForm';

const Asesorias = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter questions based on current answers
  const visibleQuestions = useMemo(() => {
    return diagnosisQuestions.filter((q) => {
      if (q.id === 'user_type') return false; // Handled in step 0
      if (!q.showIf) return true;
      return q.showIf(answers);
    });
  }, [answers]);

  const totalSteps = 4 + visibleQuestions.length;
  /* 
    Steps mapping:
    0: Type selector (Persona/Empresa)
    1: Disclaimer
    2 to 2+visibleQuestions.length-1: Questions
    N (visibleQuestions.length + 2): Result
    N+1 (visibleQuestions.length + 3): Contact Form
  */

  const currentQuestionIndex = step - 2;
  const isQuestionStep = step >= 2 && currentQuestionIndex < visibleQuestions.length;
  const currentQuestion = isQuestionStep ? visibleQuestions[currentQuestionIndex] : null;

  const isResultStep = step === visibleQuestions.length + 2;
  const isContactStep = step === visibleQuestions.length + 3;

  const handleNext = () => {
    if (step === visibleQuestions.length + 1) {
      // Transitioning to result step
      const computedResult = calculateRecommendation(answers);
      setResult(computedResult);
    }
    
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleTypeSelect = (type: 'persona' | 'empresa') => {
    setAnswers((prev) => ({ ...prev, user_type: type }));
    handleNext();
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const isNextDisabled = () => {
    if (step === 0) return !answers.user_type;
    if (isQuestionStep && currentQuestion) {
      const ans = answers[currentQuestion.id];
      if (currentQuestion.type === 'multi_select') {
        return !ans || ans.length === 0;
      }
      return ans === undefined || ans === null || ans === '';
    }
    return false;
  };

  const handleSubmit = async (contactData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('diagnosis').insert([{
        full_name: contactData.fullName,
        email: contactData.email,
        whatsapp: contactData.whatsapp || '',
        user_type: answers.user_type || '',
        company_name: contactData.companyName || '',
        company_industry: answers.company_industry || '',
        company_size: answers.company_size || '',
        business_type: answers.business_type || '',
        infrastructure: JSON.stringify(answers.infra || []),
        biggest_pain: answers.biggest_pain || '',
        ai_maturity: answers.ai_maturity || '',
        urgency: answers.urgency || '',
        budget: answers.budget || '',
        persona_profession: answers.persona_profession || '',
        persona_industry: answers.persona_industry || '',
        persona_education: answers.persona_education || '',
        persona_tools: JSON.stringify(answers.persona_tools || []),
        persona_ai_level: answers.persona_ai_level || '',
        persona_ai_tools: JSON.stringify(answers.persona_ai_tools || []),
        persona_goal: answers.persona_goal || '',
        persona_obstacle: answers.persona_obstacle || '',
        recommendation: result?.primary || '',
        recommendation_secondary: result?.secondary || '',
      }]);

      if (error) throw error;

      try {
        await supabase.functions.invoke('diagnosis', {
          body: { name: contactData.fullName, email: contactData.email }
        });
      } catch (funcError) {
        console.error('Error invoking function:', funcError);
        // Continue even if email fails
      }

      toast.success('¡Solicitud enviada con éxito!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocurrió un error. Por favor intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#010101] text-white pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Todo listo!</h2>
          <p className="text-gray-400 mb-8">
            Recibimos tu información. Nos vamos a contactar con vos a la brevedad para agendar la asesoría.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white pt-24 pb-12 px-4">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: "var(--font-sequel, 'Sequel Sans', sans-serif)", letterSpacing: "-1.5px" }}>Diagnóstico</h1>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto">
            Descubrí en 5 minutos qué necesita tu negocio para crecer con IA.
          </p>
        </div>

        {/* Progress Bar */}
        {!isResultStep && !isContactStep && (
          <div className="mb-10 flex justify-center gap-2">
            {Array.from({ length: totalSteps - 2 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-[#8B5BF5]' : i < step ? 'w-4 bg-[#8B5BF5]/60' : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative overflow-hidden border border-white/20 rounded-3xl p-6 md:p-10 h-[960px] md:h-[820px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="flex-1 flex flex-col"
            >
              {step === 0 && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-4xl md:text-5xl font-normal italic mb-8 text-center text-[#F6F6F6]" style={{ fontFamily: "var(--font-serif, 'Arno Pro', Georgia, serif)" }}>¿Quién sos?</h2>
                  <DiagnosisTypeSelector
                    value={answers.user_type}
                    onChange={handleTypeSelect}
                  />
                </div>
              )}

              {step === 1 && (
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <Clock className="w-8 h-8 text-[#CAFE5B] mb-2" />
                  <span className="text-sm font-medium text-gray-400 mb-6">2 minutos</span>
                  <h2 className="text-2xl font-bold mb-4">Qué te encontrarás</h2>
                  <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    Las siguientes preguntas nos ayudarán a entender tu situación actual y recomendarte la mejor opción.
                  </p>
                  <button
                    onClick={handleNext}
                    className="py-3 px-8 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Empezar
                  </button>
                </div>
              )}

              {isQuestionStep && currentQuestion && (
                <div className="flex-1 flex flex-col min-h-0">
                  <DiagnosisQuestion question={currentQuestion} value={answers[currentQuestion.id]} onChange={(val) => handleAnswer(currentQuestion.id, val)} direction={direction} userType={answers.user_type} />
                </div>
              )}

              {isResultStep && result && (
                <div className="flex-1">
                  <DiagnosisResult 
                    result={result} 
                    onContinue={handleNext} 
                  />
                </div>
              )}

              {isContactStep && (
                <div className="flex-1">
                  <DiagnosisContactForm
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    userType={answers.user_type}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          {!isResultStep && !isContactStep && step !== 1 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Volver
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="bg-white text-black py-2 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asesorias;
