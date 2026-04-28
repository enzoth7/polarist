import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const words = ["Hola", "Hello", "Bonjour", "Ciao", "Olá", "やあ", "Hallå", "Guten tag", "হ্যালো"];

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.82,
    transition: { duration: 0.9, delay: 0.2 },
  },
};

const slideUp = {
  initial: {
    y: 0,
  },
  exit: {
    y: "-118vh",
    transition: { duration: 1.05, ease: [0.83, 0, 0.17, 1], delay: 0.12 },
  },
};

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const updateDimension = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);

    return () => window.removeEventListener("resize", updateDimension);
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const exitTimer = window.setTimeout(() => {
        setIsExiting(true);
      }, 850);
      const completeTimer = window.setTimeout(() => {
        onComplete?.();
      }, 2100);

      return () => {
        window.clearTimeout(exitTimer);
        window.clearTimeout(completeTimer);
      };
    }

    const wordTimer = window.setTimeout(
      () => {
        setIndex((currentIndex) => currentIndex + 1);
      },
      index === 0 ? 900 : 145,
    );

    return () => window.clearTimeout(wordTimer);
  }, [index, onComplete]);

  const curve = useMemo(() => {
    const initial = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 180} 0 ${dimension.height} L0 0`;
    const exit = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width * 0.58} ${dimension.height + 360} 0 ${dimension.height} L0 0`;

    return {
      initial: {
        d: initial,
        transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] },
      },
      exit: {
        d: exit,
        transition: { duration: 1, ease: [0.83, 0, 0.17, 1], delay: 0.08 },
      },
    };
  }, [dimension.height, dimension.width]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 z-[999999] flex h-screen w-screen items-center justify-center overflow-visible"
      aria-label="Cargando Polarist"
    >
      {dimension.width > 0 ? (
        <>
          <svg className="absolute left-0 top-0 z-0 h-[calc(100%+380px)] w-full" aria-hidden="true">
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill="var(--polarist-black, #010101)"
            />
          </svg>

          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="absolute z-10 flex items-center text-[clamp(2.5rem,7vw,5.5rem)] text-[#F6F6F6]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "-2.5px",
              lineHeight: 0.88,
            }}
          >
            {words[index]}
          </motion.p>

          <span className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.62rem] uppercase tracking-[0.42em] text-[#F6F6F6]/34">
            Polarist
          </span>
        </>
      ) : null}
    </motion.div>
  );
}
