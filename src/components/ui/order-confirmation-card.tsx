import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderConfirmationCardProps {
  name: string;
  email: string;
  dateTime: string;
  onGoToAccount: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
}

function AnimatedSuccessIcon() {
  return (
    <motion.svg
      className="h-14 w-14 text-[#CAFE5B]"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="28"
        cy="28"
        r="24"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.55, ease: "easeOut" },
          },
        }}
      />
      <motion.path
        d="M18.5 28.5L25 35L38 22"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0, scale: 0.9 },
          visible: {
            pathLength: 1,
            opacity: 1,
            scale: 1,
            transition: { delay: 0.42, duration: 0.32, ease: "easeOut" },
          },
        }}
      />
    </motion.svg>
  );
}

export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  name,
  email,
  dateTime,
  onGoToAccount,
  title = "Tu registro fue exitoso",
  buttonText = "Volver a encuentros",
  icon = <AnimatedSuccessIcon />,
  className,
}) => {
  const details = [
    { label: "Fecha", value: dateTime },
    { label: "Nombre", value: name },
    { label: "Mail", value: email, allowWrap: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.34,
        ease: "easeInOut",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "flex flex-col w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 text-[#010101] shadow-[0_20px_50px_rgba(0,0,0,0.12)]",
          className,
        )}
      >
        <div className="flex flex-1 flex-col items-center space-y-6 text-center">
          <motion.div variants={itemVariants}>{icon}</motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold leading-tight"
          >
            {title}
          </motion.h2>

          <motion.div variants={itemVariants} className="w-full space-y-4 pt-2">
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between border-b border-black/10 pb-4 text-sm font-medium text-[#6b7280]",
                  index === details.length - 1 && "border-none pb-0",
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "text-right text-[#010101]",
                    item.allowWrap
                      ? "max-w-[75%] break-all leading-snug"
                      : "max-w-[60%] truncate",
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="!mt-auto w-full pt-4">
            <Button
              type="button"
              onClick={onGoToAccount}
              className="h-12 w-full rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90"
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
