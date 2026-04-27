'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Battery,
  Sliders,
  ChevronRight,
  Zap,
  Bluetooth,
  Wifi,
  Music,
  LucideIcon,
  AlertTriangle,
  Clock,
  LayoutGrid,
  TrendingUp,
  ShieldCheck,
  Zap as ZapIcon,
} from 'lucide-react';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'left' | 'right';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string; 
  title: string;
  points: string[];
  image: string;
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
    title: 'Polarist ES para vos si:',
    points: [
      "Sabés que la IA te puede ayudar, pero estás mareado con tanta información. Querés usarla, pero no tenés idea por dónde arrancar ni qué herramienta elegir.",
      "Buscás atajos prácticos, no teoría aburrida. Querés soluciones rápidas para tu estudio, trabajo o emprendimiento, sin tener que fumarte cursos de 40 horas ni aprender conceptos técnicos.",
      "Tenés una empresa y querés optimizar procesos, pero no tenés el tiempo ni el equipo para hacerlo. Querés que alguien analice tu negocio, te diga qué usar y te lo deje instalado y funcionando.",
      "Valorás tu tiempo. Preferís que alguien te muestre el camino directo (\"usá esto para aquello\") en lugar de pasarte semanas investigando por tu cuenta."
    ],
    image: '/images/landing/central_ai_core.png',
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
    title: 'Polarist NO es para vos si:',
    points: [
      "Buscás un curso técnico profundo. No te vamos a enseñar a programar ni te vamos a explicar la matemática detrás de la inteligencia artificial. Vamos 100% a la práctica.",
      "Ya sos un experto en IA. Si te pasás todo el día probando herramientas nuevas, armando automatizaciones complejas y estás al tanto de todas las novedades del mercado, probablemente no nos necesites.",
      "Querés seguir haciendo las cosas a la vieja escuela. Si no tenés interés en cambiar tus procesos, ahorrar tiempo o delegarle tareas a la tecnología, lo que ofrecemos no te va a servir.",
      "Esperás que la herramienta haga literalmente todo por arte de magia. Nosotros te damos el atajo y te mostramos el camino más fácil, pero el clic final y las ganas de aplicarlo en tu día a día dependen de vos."
    ],
    image: '/images/landing/central_ai_core.png',
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
    <div className="relative h-48 w-48 md:h-[280px] md:w-[280px] rounded-full flex items-center justify-center overflow-hidden bg-transparent">
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={ANIMATIONS.image(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`w-full h-full object-cover p-0 mix-blend-screen transition-all duration-700 ${isLeft ? 'grayscale opacity-40' : ''}`}
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  // If isLeft (Sin Polarist), the text should be on the left visually, meaning text-left alignment.
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass} w-full`}
      style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <motion.h1 variants={ANIMATIONS.item} className="mb-8 text-3xl font-bold tracking-tight text-[#F6F6F6] md:text-4xl">
        {data.title}
      </motion.h1>
      
      <div className="space-y-6">
        {data.points.map((point, index) => (
          <motion.div 
            key={index}
            variants={ANIMATIONS.item}
            className={`flex items-start gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse text-right'}`}
          >
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/36" />
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 md:text-base" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
              {point}
            </p>
          </motion.div>
        ))}
      </div>
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
    <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center md:bottom-32">
      <motion.div layout className="pointer-events-auto flex items-center gap-7">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center justify-center px-1 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none"
            style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
          >
            <span className={`relative z-10 transition-colors duration-300 ${activeId === opt.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {opt.label}
            </span>
            {activeId === opt.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-white/45"
              />
            )}
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#010101] pb-24 pt-16 text-zinc-100 selection:bg-zinc-800" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <div className="absolute top-16 z-20 w-full px-4 text-center md:top-20">
         <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
            ¿Para quién es Polarist?
         </h2>
      </div>

      <main className="relative z-10 w-full px-8 md:px-20 lg:px-32 flex flex-col justify-center max-w-[1600px] mx-auto mt-8 pb-10">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-24 w-full ${
            isLeft ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          {/* Visual Column */}
          <ProductVisual data={currentData} isLeft={isLeft} />

          {/* Content Column */}
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
      </main>

      <Switcher activeId={activeSide} onToggle={setActiveSide} />
    </div>
  );
}
