'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  LucideIcon,
  Plus,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { isVideoAsset } from "@/lib/assetPaths";
import { cn } from "@/lib/utils";

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'left' | 'right';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

interface ProductPoint {
  id: string;
  title: string;
  content: string;
}

export interface ProductData {
  id: ProductId;
  label: string; 
  title: string;
  points: ProductPoint[];
  media: string;
  colors: {
    gradient: string; 
    glow: string;     
    ring: string;     
  };
  stats: {
    connectionStatus: string;
    batteryLevel: number;
    statusText: string;
  };
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: 'left',
    label: 'Es para vos',
    title: 'Polarist es para vos:',
    points: [
      {
        id: "left-1",
        title: "Sí querés arrancar sin marearte",
        content:
          "Sabés que la IA te puede ayudar, pero estás mareado con tanta información. Querés usarla, pero no tenés idea por dónde arrancar ni qué herramienta elegir.",
      },
      {
        id: "left-2",
        title: "Sí buscás atajos prácticos",
        content:
          "Querés soluciones rápidas para tu estudio, trabajo o emprendimiento, sin tener que aprender conceptos técnicos que no vas a usar hoy.",
      },
      {
        id: "left-3",
        title: "Sí querés optimizar tu empresa",
        content:
          "Tenés una empresa y querés optimizar procesos, pero no tenés el tiempo ni el equipo para hacerlo. Querés que alguien analice tu negocio, te diga qué usar y te lo deje instalado y funcionando.",
      },
      {
        id: "left-4",
        title: "Sí valorás tu tiempo",
        content:
          "Preferís que alguien te muestre el camino directo, qué usar y para qué, en lugar de pasarte semanas investigando por tu cuenta.",
      },
    ],
    media: '/videos/p-verde-lista.webm',
    colors: {
      gradient: 'from-[#CAFE5B] to-emerald-900',
      glow: 'bg-[#CAFE5B]',
      ring: 'border-l-[#CAFE5B]/50',
    },
    stats: { connectionStatus: 'Sincronizado', batteryLevel: 100, statusText: 'Eficiencia Máxima' },
  },
  right: {
    id: 'right',
    label: 'No es para vos',
    title: 'Polarist no es para vos:',
    points: [
      {
        id: "right-1",
        title: "Sí buscás un curso técnico profundo",
        content:
          "No te vamos a enseñar a programar ni te vamos a explicar la matemática detrás de la inteligencia artificial. El enfoque está en aplicar, no en teorizar.",
      },
      {
        id: "right-2",
        title: "Sí ya sos experto en IA",
        content:
          "Si te pasás todo el día probando herramientas nuevas, armando automatizaciones complejas y estás al tanto de todas las novedades del mercado, probablemente no nos necesites.",
      },
      {
        id: "right-3",
        title: "Sí querés seguir igual",
        content:
          "Si no tenés interés en cambiar tus procesos, ahorrar tiempo o delegarle tareas a la tecnología, lo que ofrecemos no te va a servir.",
      },
      {
        id: "right-4",
        title: "Sí esperás magia sin involucrarte",
        content:
          "Nosotros te damos el atajo y te mostramos el camino más fácil, pero el clic final y las ganas de aplicarlo en tu día a día dependen de vos.",
      },
    ],
    media: '/videos/p-roja-lista.webm',
    colors: {
      gradient: 'from-red-600 to-orange-900',
      glow: 'bg-red-500',
      ring: 'border-r-red-500/50',
    },
    stats: { connectionStatus: 'Desconectado', batteryLevel: 12, statusText: 'Riesgo Crítico' },
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  },
  image: (isLeft: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(15px)',
      rotate: isLeft ? -30 : 30,
      x: isLeft ? -80 : 80,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotate: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: 'blur(20px)',
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Image Container */}
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-transparent ${
        isVideoAsset(data.media)
          ? "h-48 w-48 md:h-[390px] md:w-[390px]"
          : "h-40 w-40 md:h-[320px] md:w-[320px]"
      }`}
    >
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isVideoAsset(data.media) ? (
            <motion.video
              key={data.id}
              src={data.media}
              initial={false}
              animate={{ opacity: 1, scale: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`h-full w-full object-cover p-0 mix-blend-screen transition-all duration-700 ${isLeft ? 'grayscale opacity-40' : ''}`}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <motion.img
              key={data.id}
              src={data.media}
              alt={`${data.title}`}
              variants={ANIMATIONS.image(isLeft)}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`w-full h-full object-cover p-0 mix-blend-screen transition-all duration-700 ${isLeft ? 'grayscale opacity-40' : ''}`}
              draggable={false}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>

  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  // If isLeft (Sin Polarist), the text should be on the left visually, meaning text-left alignment.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const alignClass = isMobile ? 'items-center text-center' : (isLeft ? 'items-start text-left' : 'items-end text-right');
  const triggerAlignClass = isMobile ? 'text-center' : (isLeft ? 'text-left' : 'text-right');
  const rowAlignClass = isMobile ? 'flex-row' : (isLeft ? 'flex-row' : 'flex-row-reverse');
  const contentAlignClass = isMobile ? 'text-center' : (isLeft ? 'text-left' : 'text-right');

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass} w-full`}
      style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <motion.h1 
        variants={ANIMATIONS.item} 
        className={cn(
          "mb-5 text-2xl font-bold tracking-tight md:mb-6 md:text-[2.6rem]",
          isLeft ? "text-[#CAFE5B]" : "text-[#FF4D4D]"
        )}
      >
        {data.title}
      </motion.h1>
      
      <motion.div variants={ANIMATIONS.item} className="w-full max-w-[820px]">
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {data.points.map((point) => (
            <AccordionItem
              value={point.id}
              key={point.id}
              className="border-white/10 py-2"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={`flex flex-1 items-center justify-between gap-4 py-4 text-[18px] font-semibold leading-7 transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180 md:text-[24px] ${triggerAlignClass}`}
                >
                  <span className={`flex items-center ${rowAlignClass}`}>
                    <span className={`flex flex-col ${contentAlignClass}`}>
                      <span className="text-white">{point.title}</span>
                    </span>
                  </span>
                  <Plus
                    size={20}
                    strokeWidth={2}
                    className="shrink-0 opacity-60 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent
                className={`max-w-[74ch] pb-4 text-[13.5px] leading-6 text-white/88 md:text-[14px] md:leading-6 ${isLeft ? 'text-left' : 'ml-auto text-right'}`}
                style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
              >
                {point.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle 
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void 
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <div className="flex justify-center">
      <motion.div layout className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-[#010101] p-1.5">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none transition-all duration-300"
            style={{
              fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif",
              background: activeId === opt.id ? '#CAFE5B' : 'transparent',
              color: activeId === opt.id ? '#010101' : 'rgba(246,246,246,0.4)',
            }}
          >
            {opt.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function SpatialProductShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>('left');
  
  const currentData = PRODUCT_DATA[activeSide];
  const isLeft = activeSide === 'left';

  return (
    <div className="relative w-full bg-[#010101] text-zinc-100" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
      <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-8 px-8 py-16 md:gap-10 md:px-20 md:py-20 lg:px-28">
        
        {/* Header */}
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight md:text-6xl" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
            ¿Para quién es Polarist?
          </h2>
        </div>

        {/* Content */}
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-10 lg:gap-14 ${
            isLeft ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          <ProductVisual data={currentData} isLeft={isLeft} />
          <motion.div layout="position" className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <ProductDetails 
                key={activeSide}
                data={currentData} 
                isLeft={isLeft} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Switcher */}
        <Switcher activeId={activeSide} onToggle={setActiveSide} />
      </div>
    </div>
  );
}
