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
  label: string; // Display name for the switcher
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string; // Tailwind gradient classes
    glow: string;     // Tailwind color class for accents
    ring: string;     // Tailwind border color for rings
  };
  stats: {
    connectionStatus: string;
    batteryLevel: number;
    statusText: string;
  };
  features: FeatureMetric[];
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: 'left',
    label: 'Sin Polarist',
    title: 'Caos Operativo',
    description: 'Horas perdidas en tareas repetitivas, decisiones tomadas a ciegas sin métricas, y herramientas totalmente desconectadas entre sí.',
    image: '/images/landing/logo_3d.png', // Usamos el mismo logo pero con filtro en CSS
    colors: {
      gradient: 'from-red-600 to-orange-900',
      glow: 'bg-red-500',
      ring: 'border-l-red-500/50',
    },
    stats: { connectionStatus: 'Desconectado', batteryLevel: 12, statusText: 'Riesgo Crítico' },
    features: [
      { label: 'Carga Manual', value: 85, icon: Clock },
      { label: 'Riesgo de Error', value: 90, icon: AlertTriangle },
    ],
  },
  right: {
    id: 'right',
    label: 'Con Polarist',
    title: 'Control Total',
    description: 'Automatizás procesos, tomás decisiones informadas y accedés a un ecosistema integrado donde la IA trabaja para vos 24/7.',
    image: '/images/landing/logo_3d.png', // The AI core image we generated
    colors: {
      gradient: 'from-[#CAFE5B] to-emerald-900',
      glow: 'bg-[#CAFE5B]',
      ring: 'border-r-[#CAFE5B]/50',
    },
    stats: { connectionStatus: 'Sincronizado', batteryLevel: 100, statusText: 'Eficiencia Máxima' },
    features: [
      { label: 'Automatización', value: 98, icon: ZapIcon },
      { label: 'Integración', value: 100, icon: LayoutGrid },
    ],
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

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <motion.div
      animate={{
        background: isLeft
          ? 'radial-gradient(circle at 0% 50%, rgba(220, 38, 38, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 100% 50%, rgba(202, 254, 91, 0.1), transparent 50%)',
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Animated Rings */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${data.colors.ring}`}
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-20`}
    />

    {/* Image Container */}
    <div className="relative h-72 w-72 md:h-[380px] md:w-[380px] rounded-full flex items-center justify-center overflow-hidden bg-transparent">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
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

    {/* Status Label */}
    <motion.div
      layout="position"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/90 px-4 py-2 rounded-full border border-white/10 backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full ${data.colors.glow} animate-pulse`} />
        {data.stats.connectionStatus}
      </div>
    </motion.div>
  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  // If isLeft (Sin Polarist), the text should be on the left visually, meaning text-left alignment.
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
  const flexDirClass = isLeft ? 'flex-row' : 'flex-row-reverse';
  const barColorClass = isLeft ? 'left-0 bg-red-500' : 'right-0 bg-[#CAFE5B]';

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.h2 variants={ANIMATIONS.item} className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
        {data.label}
      </motion.h2>
      <motion.h1 variants={ANIMATIONS.item} className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
        {data.title}
      </motion.h1>
      <motion.p variants={ANIMATIONS.item} className={`text-zinc-400 mb-8 max-w-sm leading-relaxed ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
        {data.description}
      </motion.p>

      {/* Feature Grid */}
      <motion.div variants={ANIMATIONS.item} className="w-full space-y-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}>
              <div className={`flex items-center gap-2 ${feature.value > 50 ? 'text-zinc-200' : 'text-zinc-400'}`}>
                <feature.icon size={16} /> <span>{feature.label}</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">{feature.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barColorClass} opacity-80`}
              />
            </div>
          </div>
        ))}

        <div className={`pt-4 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
             {data.stats.statusText}
          </div>
        </div>
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
    <div className="absolute bottom-20 md:bottom-24 inset-x-0 flex justify-center z-50 pointer-events-none">
      <motion.div layout className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative px-6 py-3 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="island-surface"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner"
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-300 ${activeId === opt.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {opt.label}
            </span>
            {activeId === opt.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
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
    <div className="relative min-h-screen w-full bg-[#010101] text-zinc-100 overflow-hidden selection:bg-zinc-800 flex flex-col items-center justify-center py-24">
      
      <BackgroundGradient isLeft={isLeft} />

      {/* Header */}
      <div className="absolute top-28 md:top-32 w-full text-center z-20 px-4">
         <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}>
            ¿Por qué usar Polarist?
         </h2>
      </div>

      <main className="relative z-10 w-full px-8 md:px-20 lg:px-32 flex flex-col justify-center max-w-[1600px] mx-auto mt-8 pb-10">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 lg:gap-40 w-full ${
            isLeft ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          {/* Visual Column */}
          <ProductVisual data={currentData} isLeft={isLeft} />

          {/* Content Column */}
          <motion.div layout="position" className="w-full max-w-md">
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
