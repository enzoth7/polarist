import { ArrowUpRight } from "lucide-react";

import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getToolHref, type ToolItem } from "@/hooks/useTools";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

type ToolDetailsModalProps = {
  selectedTool: ToolItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ToolDetailsModal({
  selectedTool,
  isOpen,
  onClose,
}: ToolDetailsModalProps) {
  const description = selectedTool?.description?.trim();
  const whoIsItFor = selectedTool?.whoIsItFor?.trim();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open ? onClose() : null}>
      {selectedTool ? (
        <DialogContent
          overlayClassName="bg-black/45 backdrop-blur-[3px] data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          closeClassName="-right-2 -top-2 z-[60] h-10 w-10 rounded-full border border-primary/60 bg-primary p-0 text-primary-foreground opacity-100 shadow-[0_16px_32px_-20px_rgba(0,0,0,0.72)] backdrop-blur-xl hover:bg-primary/90 focus:ring-primary/75 dark:border-primary/60 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 sm:-right-4 sm:-top-4"
          className="overflow-visible rounded-[30px] border border-black/10 bg-white/60 p-0 text-foreground shadow-[0_28px_64px_-38px_rgba(7,12,9,0.85)] backdrop-blur-[22px] duration-500 ease-out data-[state=open]:zoom-in-[98%] data-[state=closed]:zoom-out-[98%] data-[state=open]:slide-in-from-top-[50.5%] data-[state=closed]:slide-out-to-top-[50.5%] dark:border-white/20 dark:bg-white/[0.06] dark:text-white sm:max-w-[650px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.34)_26%,rgba(255,255,255,0.08)_52%,rgba(9,15,12,0.1)_100%)] dark:bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.07)_25%,rgba(255,255,255,0.02)_48%,rgba(8,14,10,0.34)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.54),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(177,215,66,0.18),transparent_46%)] dark:bg-[radial-gradient(circle_at_24%_-14%,rgba(255,255,255,0.14),transparent_48%),radial-gradient(circle_at_80%_96%,rgba(204,255,0,0.08),transparent_46%)]" />
          <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-black/10 dark:bg-white/30" />

          <div className="relative space-y-6 p-5 sm:p-6">
            <DialogHeader className="space-y-4 rounded-2xl border border-black/10 bg-white/45 p-4 text-left backdrop-blur-md dark:border-white/15 dark:bg-white/[0.05]">
              <div className="flex items-start gap-4">
                <ToolLogo
                  name={selectedTool.name}
                  logoFilename={selectedTool.logoFilename}
                  className="h-14 w-14 border-none bg-transparent"
                  imageClassName="p-0.5"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle 
                      className="text-2xl font-bold tracking-[-0.03em] text-foreground"
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    >
                      {selectedTool.name}
                    </DialogTitle>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[11px] font-bold text-foreground dark:border-white/20 dark:bg-white/10 dark:text-white"
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    >
                      {withSpanishAccents(selectedTool.category)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full border-black/10 bg-white/75 px-3 py-1 text-[11px] font-bold text-foreground dark:border-white/20 dark:bg-white/10 dark:text-white"
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    >
                      {withSpanishAccents(selectedTool.kind)}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogDescription 
                className="text-sm leading-6 text-muted-foreground"
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                Ficha resumida de la herramienta dentro del catálogo oficial.
              </DialogDescription>
            </DialogHeader>

            <section className="space-y-2 rounded-2xl border border-black/10 bg-white/45 px-4 py-4 backdrop-blur-md dark:border-white/15 dark:bg-white/[0.05]">
              <h3 
                className="text-sm font-bold uppercase tracking-[0.18em] text-foreground"
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                ¿Qué es?
              </h3>
              <p
                className={
                  description ?
                    "text-sm leading-7 text-muted-foreground"
                  : "text-sm leading-7 text-muted-foreground/60"
                }
              >
                {description ?? "Descripción en redacción..."}
              </p>
            </section>

            <section className="space-y-2 rounded-2xl border border-black/10 bg-white/45 px-4 py-4 backdrop-blur-md dark:border-white/15 dark:bg-white/[0.05]">
              <h3 
                className="text-sm font-bold uppercase tracking-[0.18em] text-foreground"
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                ¿Para quiénes sirve?
              </h3>
              <p
                className={
                  whoIsItFor ?
                    "text-sm leading-7 text-muted-foreground"
                  : "text-sm leading-7 text-muted-foreground/60"
                }
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                {whoIsItFor ?? "Perfil ideal en redacción..."}
              </p>


            </section>

            <DialogFooter className="pt-1">
              <a
                href={getToolHref(selectedTool)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 dark:border-primary dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
              >
                Visitar web
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </DialogFooter>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
