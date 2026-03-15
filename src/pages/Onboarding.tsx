import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = () => {
    setLoading(true);
    // Simular el armado del "Radar Táctico" (Calibración)
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-zinc-950 px-6 justify-center items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {step === 1 && (
          <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-center mb-2">
              Bienvenido a <span className="text-primary">Polarist</span>
            </h1>
            <p className="text-center text-muted-foreground mb-10 text-lg leading-tight">
              Cortamos el ruido ambiental de la IA. <br/>Te daremos exacto lo que funciona.
            </p>
            <div className="flex flex-col w-full gap-3">
              <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground text-center">
                ¿En qué sector compites?
              </span>
              <Button variant="outline" className="justify-start px-5 h-14 text-base font-bold" onClick={() => { setIndustry("retail"); setStep(2); }}>🛍️ E-commerce & Retail</Button>
              <Button variant="outline" className="justify-start px-5 h-14 text-base font-bold" onClick={() => { setIndustry("food"); setStep(2); }}>🍳 Gastronomía</Button>
              <Button variant="outline" className="justify-start px-5 h-14 text-base font-bold" onClick={() => { setIndustry("service"); setStep(2); }}>🤝 Servicios B2B</Button>
              <Button variant="outline" className="justify-start px-5 h-14 text-base font-bold" onClick={() => { setIndustry("creator"); setStep(2); }}>📸 Creador de Contenido</Button>
            </div>
          </div>
        )}

        {step === 2 && !loading && (
          <div className="animate-in slide-in-from-right-10 fade-in duration-300 w-full flex flex-col items-center">
             <h2 className="text-2xl font-extrabold tracking-tight text-center mb-6">
              Nivel de Experiencia
            </h2>
             <div className="flex flex-col w-full gap-4">
              <Button 
                variant="outline" 
                className="flex-col items-start h-auto p-4 gap-1 text-left hover:bg-muted" 
                onClick={() => { setLevel("novato"); handleFinish(); }}
              >
                <div className="font-bold text-lg">Quiero aprender</div>
                <div className="text-xs text-muted-foreground font-normal">Recién empiezo o sigo probando herramientas básicas.</div>
              </Button>

              <Button 
                variant="outline" 
                className="flex-col items-start h-auto p-4 gap-1 text-left hover:bg-muted" 
                onClick={() => { setLevel("curioso"); handleFinish(); }}
              >
                <div className="font-bold text-lg">Ya lo uso en mi negocio</div>
                <div className="text-xs text-muted-foreground font-normal">Uso GPT o Midjourney para ayudarme en tareas repetitivas.</div>
              </Button>

               <Button 
                variant="outline" 
                className="flex-col items-start h-auto p-4 gap-1 text-left hover:bg-muted" 
                onClick={() => { setLevel("avanzado"); handleFinish(); }}
              >
                <div className="font-bold text-lg">Busco escalar agresivamente</div>
                <div className="text-xs text-muted-foreground font-normal">Automatizaciones, Zapier/Make y Bots avanzados.</div>
              </Button>
             </div>
          </div>
        )}

        {loading && (
           <div className="animate-in fade-in duration-500 w-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <h2 className="text-xl font-bold animate-pulse text-center">Preparando tu Radar Táctico...</h2>
              <p className="text-sm text-muted-foreground">Filtrando el ruido. Calibrando contenido.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
