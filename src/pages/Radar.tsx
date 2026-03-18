import React from "react";
import { BrainCircuit, Bot, Zap, Play, Image as ImageIcon, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgImage from "../../assets/ai_dominio_total_bg.png"; // We'll just define the image inline for now or point to the url of the artifact

const Radar = () => {
  return (
    <div className="flex flex-col min-h-full bg-background p-5 pb-24">
      
      {/* Main Title (Estética: Satisfy Your Cravings) */}
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground mb-5 mt-1">
        Tendencias de contenido
      </h1>

      {/* Featured Banner Card (Estética: Free Delivery card) */}
      <div className="bg-[#1c1d21] text-white rounded-[24px] p-6 shadow-xl flex flex-col justify-between pt-7 pb-6 px-6 relative overflow-hidden mb-8 min-h-[170px]" style={{ backgroundImage: "url('/ciudad_futurista_1773797327977.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        {/* Decoración simulando el fondo fotográfico oscuro de la olla */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[rgba(154,143,179,0.2)] via-transparent to-transparent z-0 pointer-events-none -translate-y-8 translate-x-8"></div>
        {/* Un círculo sutil de luz que simula el foco sobre la comida en la foto original */}
        <div className="absolute top-[10%] right-[-10%] w-[150px] h-[150px] bg-white opacity-[0.03] blur-2xl rounded-full z-0 pointer-events-none"></div>

        <div className="z-10 flex flex-col items-start w-[70%]">
           <h2 className="text-[20px] font-bold mb-1.5 tracking-tight text-white">Dominio Total</h2>
           <p className="text-[12px] font-medium opacity-80 mb-5 leading-[1.3] text-zinc-300">
             Consigue acceso absoluto, 0 distracciones y 100% de enfoque táctico.
           </p>
           <Button className="bg-[#9c8fb6] text-white hover:bg-[#8b7fa1] rounded-[20px] px-5 py-0 h-8 text-[12px] font-bold shadow-sm border-none transition-colors">
              Empezar Ahora
           </Button>
        </div>
      </div>

      {/* Horizontal Scroll categories title (Estética: Food Category) */}
      <h3 className="text-[17px] font-bold text-foreground mb-4">
        Comunidades
      </h3>

      {/* Horizontal Scroll Categories (Estética: Pizza, Sushi, etc) */}
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-5 px-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
         {[
           { icon: BrainCircuit, label: "Gastronomía" },
           { icon: Play, label: "Creadores" },
           { icon: Bot, label: "Agencias" },
           { icon: Zap, label: "Startups" },
         ].map((cat, i) => (
           <div key={i} className="flex flex-col items-center gap-2.5 min-w-[70px]">
              <div className="w-[70px] h-[70px] bg-secondary/80 rounded-full flex items-center justify-center shadow-sm border border-border/40 transition-transform active:scale-95 cursor-pointer">
                <cat.icon className="w-[30px] h-[30px] text-foreground/80 stroke-[1.5px]" />
              </div>
              <span className="text-[12px] font-semibold text-foreground/90">{cat.label}</span>
           </div>
         ))}
      </div>

      {/* Herramientas Recomendadas List (Estética: Top Trending Podcast) */}
      <div className="mt-6 flex flex-col gap-5">
         <div className="flex justify-between items-center mb-1">
            <h3 className="text-[19px] font-bold text-foreground">Herramientas IA</h3>
         </div>

         {/* List Item 1 */}
         <div className="flex items-center gap-4">
            <div className="w-[75px] h-[75px] rounded-[16px] bg-secondary/80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <Bot className="w-8 h-8 text-foreground/50" />
            </div>
            <div className="flex flex-col justify-center flex-1">
               <h4 className="text-[17px] font-bold text-foreground leading-tight mb-1">Make.com</h4>
               <p className="text-[13px] font-medium text-muted-foreground">Automatización . Fácil</p>
            </div>
         </div>

         {/* List Item 2 */}
         <div className="flex items-center gap-4">
            <div className="w-[75px] h-[75px] rounded-[16px] bg-secondary/80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <BrainCircuit className="w-8 h-8 text-foreground/50" />
            </div>
            <div className="flex flex-col justify-center flex-1">
               <h4 className="text-[17px] font-bold text-foreground leading-tight mb-1">ChatGPT Plus</h4>
               <p className="text-[13px] font-medium text-muted-foreground">Modelos . Análisis</p>
            </div>
         </div>

         {/* List Item 3 */}
         <div className="flex items-center gap-4">
            <div className="w-[75px] h-[75px] rounded-[16px] bg-secondary/80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <ImageIcon className="w-8 h-8 text-foreground/50" />
            </div>
            <div className="flex flex-col justify-center flex-1">
               <h4 className="text-[17px] font-bold text-foreground leading-tight mb-1">Midjourney</h4>
               <p className="text-[13px] font-medium text-muted-foreground">Diseño . Imágenes</p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Radar;
