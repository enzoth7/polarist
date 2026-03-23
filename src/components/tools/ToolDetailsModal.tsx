import { ArrowUpRight } from "lucide-react";

import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toolNicheMap } from "@/data/aiToolsCatalog";
import { getToolHref, type ToolItem } from "@/hooks/useTools";

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
        <DialogContent className="overflow-hidden rounded-[1.6rem] border-border/60 bg-background/95 p-0 shadow-soft backdrop-blur-xl sm:max-w-[640px]">
          <div className="space-y-6 p-5 sm:p-6">
            <DialogHeader className="space-y-4 text-left">
              <div className="flex items-start gap-4">
                <ToolLogo
                  name={selectedTool.name}
                  domain={selectedTool.domain}
                  className="h-14 w-14 border-none bg-transparent"
                  imageClassName="p-0.5"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="text-2xl font-black tracking-[-0.03em] text-foreground">
                      {selectedTool.name}
                    </DialogTitle>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                    >
                      {selectedTool.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                    >
                      {selectedTool.kind}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {selectedTool.isBeta
                  ? "Exploracion temprana, acceso cambiante y propuesta todavia en formacion."
                  : "Ficha resumida de la herramienta dentro del catalogo oficial."}
              </DialogDescription>
            </DialogHeader>

            <section className="space-y-2 border-t border-border/50 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                Que es?
              </h3>
              <p
                className={
                  description ?
                    "text-sm leading-7 text-muted-foreground"
                  : "text-sm leading-7 text-muted-foreground/60"
                }
              >
                {description ?? "Descripcion en redaccion..."}
              </p>
            </section>

            <section className="space-y-2 border-t border-border/50 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                Para quienes sirve?
              </h3>
              <p
                className={
                  whoIsItFor ?
                    "text-sm leading-7 text-muted-foreground"
                  : "text-sm leading-7 text-muted-foreground/60"
                }
              >
                {whoIsItFor ?? "Perfil ideal en redaccion..."}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedTool.niches.map((niche) => (
                  <Badge
                    key={`${selectedTool.name}-${niche}`}
                    variant="outline"
                    className="rounded-full border-border/40 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {toolNicheMap[niche].label}
                  </Badge>
                ))}
              </div>
            </section>

            <DialogFooter className="border-t border-border/50 pt-4">
              <Button asChild className="w-full rounded-full px-6 sm:w-auto">
                <a href={getToolHref(selectedTool)} target="_blank" rel="noreferrer">
                  Visitar web
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
