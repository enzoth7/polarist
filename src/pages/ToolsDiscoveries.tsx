import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowUpRight } from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toolNicheMap } from "@/data/aiToolsCatalog";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DiscoveryToolWithPosition = ToolItem & {
  position: number;
};

const ToolsDiscoveries = () => {
  const [selectedTool, setSelectedTool] = useState<DiscoveryToolWithPosition | null>(null);
  const {
    data: betaTools = [],
    error,
    isLoading,
  } = useToolsQuery({ isBeta: true });

  const discoveries = useMemo<DiscoveryToolWithPosition[]>(
    () => betaTools.map((tool, index) => ({ ...tool, position: index + 1 })),
    [betaTools],
  );

  return (
    <>
      <div className="min-h-full bg-background px-4 pb-24 pt-5 md:px-8 md:pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Herramientas nuevas
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
                  Descubrimientos
                </h1>
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300"
                >
                  Beta
                </Badge>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Herramientas en fase experimental, inestables o muy nuevas. No garantizamos
                que funcionen manana, pero valen la pena explorarlas.
              </p>
            </div>

            <Button asChild variant="ghost" className="w-fit rounded-full">
              <Link to={routes.appTools}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {isLoading ? "Cargando descubrimientos..." : `${discoveries.length} descubrimientos visibles`}
              </p>
            </div>

            {isLoading ? (
              <>
                <div className="space-y-3 md:hidden">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full rounded-[28px] border border-border/40 bg-background p-4"
                    >
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-3">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-12 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-[28px] border border-border/40 bg-background md:block">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow className="border-border/40 hover:bg-transparent">
                          <TableHead className="px-5 py-4">Posicion</TableHead>
                          <TableHead className="px-5 py-4">Nombre</TableHead>
                          <TableHead className="px-5 py-4">Categoria</TableHead>
                          <TableHead className="px-5 py-4">Nicho</TableHead>
                          <TableHead className="px-5 py-4 text-right">Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 4 }).map((_, index) => (
                          <TableRow key={index} className="border-border/40">
                            <TableCell className="px-5 py-4">
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-28" />
                                  <Skeleton className="h-3 w-36" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-right">
                              <div className="ml-auto w-fit">
                                <Skeleton className="h-6 w-20 rounded-full" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            ) : error ? (
              <div className="rounded-3xl border border-border/40 bg-muted/10 px-5 py-10 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No pudimos cargar los descubrimientos beta.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {discoveries.map((tool) => (
                    <button
                      key={tool.name}
                      type="button"
                      onClick={() => setSelectedTool(tool)}
                      className="w-full rounded-[28px] border border-border/40 bg-background p-4 text-left transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.03]"
                    >
                      <div className="flex items-start gap-4">
                        <span className="pt-1 text-sm font-semibold text-muted-foreground">
                          {String(tool.position).padStart(2, "0")}
                        </span>

                        <ToolLogo
                          name={tool.name}
                          domain={tool.domain}
                          className="h-12 w-12 border-none bg-transparent"
                          imageClassName="p-0.5"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                              {tool.name}
                            </h2>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {tool.description ?? "Sin descripcion disponible por ahora."}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                            >
                              {tool.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                            >
                              {tool.kind}
                            </Badge>
                            {tool.niches.slice(0, 2).map((niche) => (
                              <Badge
                                key={`${tool.name}-${niche}`}
                                variant="outline"
                                className="rounded-full border-border/40 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                              >
                                {toolNicheMap[niche].label}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                            Ver detalle
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-[28px] border border-border/40 bg-background md:block">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow className="border-border/40 hover:bg-transparent">
                          <TableHead className="w-[92px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Posicion
                          </TableHead>
                          <TableHead className="min-w-[280px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Nombre
                          </TableHead>
                          <TableHead className="w-[180px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Categoria
                          </TableHead>
                          <TableHead className="w-[220px] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Nicho
                          </TableHead>
                          <TableHead className="w-[160px] px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Tipo
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {discoveries.map((tool) => (
                          <TableRow
                            key={tool.name}
                            onClick={() => setSelectedTool(tool)}
                            className="cursor-pointer border-border/40 hover:bg-amber-500/[0.04]"
                          >
                            <TableCell className="px-5 py-4 align-middle">
                              <span className="text-sm font-semibold text-muted-foreground">
                                {String(tool.position).padStart(2, "0")}
                              </span>
                            </TableCell>
                            <TableCell className="px-5 py-4 align-middle">
                              <div className="flex min-w-0 items-center gap-4">
                                <ToolLogo
                                  name={tool.name}
                                  domain={tool.domain}
                                  className="h-12 w-12 border-none bg-transparent"
                                  imageClassName="p-0.5"
                                />
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate text-base font-semibold tracking-tight text-foreground">
                                      {tool.name}
                                    </p>
                                  </div>
                                  <p className="mt-1 truncate text-sm text-muted-foreground">
                                    {tool.nicheTags[tool.niches[0]] ?? tool.description ?? tool.category}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 align-middle">
                              <Badge
                                variant="outline"
                                className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                              >
                                {tool.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-5 py-4 align-middle">
                              <div className="flex flex-wrap gap-2">
                                {tool.niches.slice(0, 2).map((niche) => (
                                  <Badge
                                    key={`${tool.name}-${niche}`}
                                    variant="outline"
                                    className="rounded-full border-border/40 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                                  >
                                    {toolNicheMap[niche].label}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-right align-middle">
                              <div className="flex items-center justify-end gap-3">
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground"
                                >
                                  {tool.kind}
                                </Badge>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />
    </>
  );
};

export default ToolsDiscoveries;
