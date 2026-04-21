import { toast } from "sonner";

import { cn } from "@/lib/utils";

export type BubbleToastTone = "neutral" | "success" | "danger";

export const showBubbleToast = ({
  title,
  description,
  tone = "neutral",
  durationMs = 2200,
}: {
  title: string;
  description?: string;
  tone?: BubbleToastTone;
  durationMs?: number;
}) => {
  const toneClasses: Record<BubbleToastTone, string> = {
    neutral:
      "border-black/12 bg-white/75 text-foreground dark:border-white/20 dark:bg-[#0d1219]/88 dark:text-white",
    success:
      "border-[#ccff00]/45 bg-[linear-gradient(145deg,rgba(224,255,145,0.78),rgba(202,255,64,0.56))] text-[#111a06] dark:border-[#ccff00]/45 dark:bg-[linear-gradient(145deg,rgba(36,58,18,0.92),rgba(74,116,22,0.84))] dark:text-[#e8ffb8]",
    danger:
      "border-red-500/35 bg-[linear-gradient(145deg,rgba(255,225,225,0.9),rgba(255,194,194,0.74))] text-[#401212] dark:border-red-400/40 dark:bg-[linear-gradient(145deg,rgba(55,20,20,0.95),rgba(90,24,24,0.9))] dark:text-red-100",
  };

  toast.custom(
    () => (
      <div
        className={cn(
          "pointer-events-auto mr-3 w-[min(92vw,360px)] rounded-[18px] border px-4 py-3 shadow-[0_18px_38px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:mr-5",
          toneClasses[tone],
        )}
      >
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        {description ? <p className="mt-1 text-xs leading-5 opacity-85">{description}</p> : null}
      </div>
    ),
    { duration: durationMs, position: "top-right" },
  );
};

