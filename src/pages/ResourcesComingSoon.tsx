import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { ShinyButton } from "@/components/ui/shiny-button";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase";

const getTimeRemaining = (target: number) => {
  const diff = Math.max(target - Date.now(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const countdownItems = [
  { key: "days", label: "DÍAS" },
  { key: "hours", label: "HORAS" },
  { key: "minutes", label: "MINUTOS" },
  { key: "seconds", label: "SEGUNDOS" },
] as const;

const CountdownValue = ({ value }: { value: string }) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        minWidth: "clamp(54px, 16vw, 220px)",
        height: "clamp(42px, 10vw, 126px)",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -22, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 18, filter: "blur(5px)" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "var(--font-sequel, sans-serif)",
            fontSize: "clamp(34px, 10vw, 126px)",
            fontWeight: 400,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            color: "#F6F6F6",
            textShadow: "0 0 18px rgba(255,255,255,0.08)",
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-8"
        style={{ background: "linear-gradient(to bottom, rgba(1,1,1,0.42), transparent)" }}
      />
    </div>
  );
};

const ResourcesComingSoon = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "countdown_target")
      .single()
      .then(({ data }) => {
        const ts = data ? new Date(data.value).getTime() : new Date("2026-05-18T20:00:00-03:00").getTime();
        setTarget(ts);
        setTimeRemaining(getTimeRemaining(ts));
      });
  }, []);

  useEffect(() => {
    if (target === null) return;
    const interval = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining(target));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 pb-12 pt-12"
      style={{ backgroundColor: "#010101" }}
    >
      <div className="absolute inset-0 z-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl text-center"
        >
          <div className="mb-6 flex justify-center md:mb-8">
            <ShinyButton
              onClick={() => navigate(routes.landing + "?skipLoader=true")}
              className="px-5 py-2.5 text-[0.8rem] md:px-8 md:py-4 md:text-sm font-medium"
            >
              Volver al inicio
            </ShinyButton>
          </div>

          <div className="flex items-start justify-center gap-1 sm:gap-3 md:gap-5">
            {countdownItems.map((item, index) => {
              const value = String(timeRemaining[item.key]).padStart(2, "0");

              return (
                <div key={item.label} className="flex items-start gap-1 sm:gap-3 md:gap-5">
                  <div className="flex min-w-0 flex-col items-center">
                    <CountdownValue value={value} />
                    <span
                      className="mt-2"
                      style={{
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontSize: "clamp(8px, 1.4vw, 18px)",
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        color: "rgba(246,246,246,0.7)",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < countdownItems.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="translate-y-[0.08em]"
                      style={{
                        fontFamily: "var(--font-sequel, sans-serif)",
                        fontSize: "clamp(32px, 8vw, 110px)",
                        fontWeight: 300,
                        lineHeight: 0.9,
                        color: "#F6F6F6",
                      }}
                    >
                      :
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ backgroundColor: "rgba(202,254,91,0.05)" }}
      />
    </div>
  );
};

export default ResourcesComingSoon;
