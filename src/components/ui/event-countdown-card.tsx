"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SpotlightBorder } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

interface EventCountdownCardProps {
  title?: string;
  date?: Date;
  image?: string;
  attendees?: number;
  onJoin?: () => void;
  enableAnimations?: boolean;
  className?: string;
}

export function EventCountdownCard({
  title = "React & AI Workshop",
  date,
  image = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
  attendees = 42,
  onJoin,
  enableAnimations = true,
  className,
}: EventCountdownCardProps) {
  const [eventDate] = useState(
    () =>
      date ||
      new Date(
        Date.now() +
          2 * 24 * 3600 * 1000 +
          5 * 3600 * 1000 +
          30 * 60 * 1000,
      ),
  );

  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = date || eventDate;
    return Math.max(0, Math.floor((+targetDate - Date.now()) / 1000));
  });

  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  useEffect(() => {
    const targetDate = date || eventDate;

    const update = () => {
      const remaining = Math.max(
        0,
        Math.floor((+targetDate - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date, eventDate]);

  const getTimeUnits = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, seconds: secs };
  };

  const { days, hours, minutes, seconds } = getTimeUnits(timeLeft);

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.97,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 28,
        mass: 0.85,
        staggerChildren: 0.06,
        delayChildren: 0.06,
      },
    },
    hover: shouldAnimate
      ? {
          scale: 1.01,
          y: -2,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 28,
          },
        }
      : {},
  };

  const childVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 360,
        damping: 26,
      },
    },
  };

  const numberVariants = {
    initial: { scale: 1, opacity: 1 },
    pulse: shouldAnimate
      ? {
          scale: [1, 1.08, 1],
          opacity: [1, 0.78, 1],
          transition: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      : {},
  };

  return (
    <SpotlightBorder
      className={cn("w-[320px]", className)}
      glowColor="polarist"
      radius={16}
    >
    <motion.div
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      variants={containerVariants}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-[#010101] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
    >
      <motion.div className="relative overflow-hidden" variants={childVariants}>
        <motion.img
          src={image}
          alt={title}
          className="h-40 w-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {timeLeft > 0 && timeLeft < 86400 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
          >
            Empieza pronto
          </motion.div>
        ) : null}
      </motion.div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <motion.div className="space-y-2" variants={childVariants}>
          <motion.h3 className="text-2xl font-bold leading-[1.08] tracking-normal">
            {title}
          </motion.h3>

          <div className="flex flex-wrap items-center gap-4 text-base font-medium text-[#6b7280]">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{(date || eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{attendees} inscritos</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-auto space-y-4 pt-10">
          <motion.div className="grid grid-cols-4 gap-2" variants={childVariants}>
            {[
              { value: days, label: "Días" },
              { value: hours, label: "Horas" },
              { value: minutes, label: "Min" },
              { value: seconds, label: "Seg" },
            ].map((unit, index) => (
              <motion.div
                key={unit.label}
                variants={index === 3 ? numberVariants : {}}
                initial="initial"
                animate={index === 3 ? "pulse" : "initial"}
                className="px-1 py-1 text-center"
              >
                <div className="text-xl font-bold leading-none tabular-nums">
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div className="mt-2 text-xs font-semibold text-[#6b7280]">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            type="button"
            onClick={onJoin}
            variants={childVariants}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 w-full bg-gradient-to-r from-primary to-primary/90 font-medium shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-primary",
            )}
          >
            {timeLeft > 0 ? "Reservar lugar" : "Unirme"}
          </motion.button>
        </div>
      </div>
    </motion.div>
    </SpotlightBorder>
  );
}
