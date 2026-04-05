import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";

const carouselCards = [
  { img: "/images/tendencias.png", text: "Tendencias", route: routes.appRadar, id: "tendencias" },
  { img: "/images/herramientas.png", text: "Herramientas", route: routes.appTools, id: "herramientas" },
  { img: "/images/recursos.png", text: "Recursos", route: routes.appLibrary, id: "recursos" },
];

const Landing = () => {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselCards.length);
    }, 8500); 
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleCardClick = (index: number, route: string) => {
    if (index === activeIndex) {
      navigate(route);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-80px)] bg-background transition-colors duration-500 overflow-hidden">
      {/* pt-24 asegura que no haya superposición con el header, y márgenes simétricos reducidos */}
      <section className="relative flex flex-col items-center w-full max-w-7xl px-4 pt-24 pb-8">
        
        {/* Titular Principal */}
        <div className="mb-14 text-center z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl text-foreground leading-[1.1] font-bold tracking-tight transition-colors duration-500"
            style={{ letterSpacing: "-0.03em" }}
          >
            Tu mapa de IA <br />
            para crear y crecer
          </motion.h1>
        </div>

        {/* Carrusel 3D */}
        <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[380px] flex items-center justify-center pt-2" style={{ perspective: "1500px" }}>
          {carouselCards.map((card, index) => {
            const total = carouselCards.length;
            const diff = (index - activeIndex + total) % total;
            
            let x = 0;
            let z = 0;
            let opacity = 0;
            let scale = 0.5;
            let rotateY = 0;
            let isCenter = false;

            if (diff === 0) {
              x = 0;
              z = 240;
              opacity = 1;
              scale = 1;
              rotateY = 0;
              isCenter = true;
            } else if (diff === 1 || diff === -(total - 1)) {
              x = 340;
              z = -120;
              opacity = 1;
              scale = 0.85;
              rotateY = -55;
            } else if (diff === total - 1 || diff === -1) {
              x = -340;
              z = -120;
              opacity = 1;
              scale = 0.85;
              rotateY = 55;
            }

            return (
              <motion.div
                key={index}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute w-[180px] h-[280px] sm:w-[220px] sm:h-[340px] md:w-[240px] md:h-[370px] rounded-[32px] overflow-hidden shadow-[0_45px_100px_-35px_rgba(0,0,0,0.6)] border border-white/10 cursor-pointer bg-background"
                initial={false}
                animate={{
                  x: x,
                  z: z,
                  scale: scale,
                  rotateY: rotateY,
                  opacity: opacity,
                  zIndex: isCenter ? 50 : 20,
                }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 20,
                  mass: 0.8
                }}
                onClick={() => handleCardClick(index, card.route)}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              >
                {/* Restauramos la imagen estática sin recortes */}
                <img src={card.img} alt={card.text} className="absolute inset-0 w-full h-full object-cover z-10" />
                
                {/* Degradado para Legibilidad Inferior */}
                <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
                {!isCenter && (
                  <div className="absolute inset-0 z-40 bg-black/60 transition-opacity duration-500 backdrop-blur-[1px]"></div>
                )}

                {/* Etiqueta de Texto */}
                <div className="absolute bottom-10 left-8 z-50">
                  <motion.div 
                    animate={{ scale: isCenter ? 1 : 0.9, opacity: isCenter ? 1 : 0.7 }}
                    className="flex flex-col"
                  >
                    <p className="font-bold text-white text-[10px] sm:text-[11px] uppercase tracking-[0.3em] drop-shadow-md mb-2 opacity-60">Categoría</p>
                    <p className="font-bold text-white text-base sm:text-lg tracking-tight drop-shadow-md">{card.text}</p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón de Acción */}
        {status !== "authenticated" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 z-40"
          >
            <Button
              asChild
              className="rounded-full border-0 bg-[#CCFF00] px-10 py-6 text-lg font-bold text-[#0f1402] shadow-[0_15px_35px_rgba(204,255,0,0.25)] transition-all hover:bg-[#d8ff4a] hover:scale-105 active:scale-95"
            >
              <Link to={routes.login}>
                Comenzar
              </Link>
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Landing;
