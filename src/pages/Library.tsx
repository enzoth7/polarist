import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

import { ToolDetailsModal } from "@/components/tools/ToolDetailsModal";
import { ToolInteractionButtons } from "@/components/tools/ToolInteractionButtons";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { toolNicheMap } from "@/data/aiToolsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useToolInteractions } from "@/hooks/useToolInteractions";
import { useToolsQuery, type ToolItem } from "@/hooks/useTools";
import { routes } from "@/lib/routes";
import { withSpanishAccents } from "@/lib/withSpanishAccents";

const Library = () => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [logoPreview, setLogoPreview] = useState<{ name: string; domain: string } | null>(null);
  const { status } = useAuth();
  const { toast } = useToast();
  const { data: allTools = [], error: toolsError, isLoading: toolsLoading } = useToolsQuery();

  const allToolIds = useMemo(() => allTools.map((tool) => tool.name), [allTools]);
  const {
    getFavoriteCount,
    isFavoritePending,
    isFavorited,
    isSavePending,
    isSaved,
    loading: interactionsLoading,
    savedToolIdSet,
    toggleFavorite,
    toggleSave,
  } = useToolInteractions(allToolIds);

  const savedTools = useMemo(
    () => allTools.filter((tool) => savedToolIdSet.has(tool.name)),
    [allTools, savedToolIdSet],
  );

  const showAuthToast = () =>
    toast({
      title: "Iniciá sesión para usar tu biblioteca",
      description: "Guardá herramientas desde el ranking y las vas a ver acá.",
    });

  const handleFavoriteClick = async (toolId: string) => {
    if (status !== "authenticated") { showAuthToast(); return; }
    try {
      await toggleFavorite(toolId);
    } catch {
      toast({ title: "No pudimos actualizar el favorito", description: "Intentá de nuevo en unos segundos." });
    }
  };

  const handleSaveClick = async (toolId: string) => {
    if (status !== "authenticated") { showAuthToast(); return; }
    try {
      await toggleSave(toolId);
    } catch {
      toast({ title: "No pudimos actualizar tu biblioteca", description: "Intentá de nuevo en unos segundos." });
    }
  };

  // ─── Estado vacío / loading reutilizable ───────────────────────────
  const EmptyState = ({ title, description, cta }: { title: string; description: string; cta?: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        <Bookmark className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-black tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-2 max-w-xs text-sm font-medium text-zinc-400 leading-relaxed">{description}</p>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );

  return (
    <div className="min-h-full bg-[#F0F2F6] px-4 pb-24 pt-8 md:px-8 md:pt-10">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-5">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Personal</span>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight leading-none text-zinc-900 mt-0.5">
              Mi biblioteca
            </h1>
          </div>
          <Link
            to={routes.appTools}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95"
          >
            Ver herramientas
          </Link>
        </div>

        {/* ─── Contenido principal ─────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[28px] bg-white border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-6">
          {status !== "authenticated" ? (
            <EmptyState
              title="Iniciá sesión para ver tu biblioteca"
              description="Guardá herramientas desde el ranking y las vas a encontrar acá."
              cta={
                <Link
                  to={routes.login}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-[13px] font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95"
                >
                  Ir al login
                </Link>
              }
            />
          ) : toolsLoading || interactionsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-zinc-50 border border-zinc-100 p-4 animate-pulse">
                  <div className="h-12 w-12 rounded-xl bg-zinc-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-zinc-200 rounded-full" />
                    <div className="h-3 w-20 bg-zinc-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : toolsError ? (
            <EmptyState
              title="No pudimos cargar la biblioteca"
              description="Revisá tu conexión y volvé a intentar."
            />
          ) : savedTools.length === 0 ? (
            <EmptyState
              title="Todavía no guardaste herramientas"
              description="Marcá herramientas con el ícono de guardado para armar tu propia selección."
              cta={
                <Link
                  to={routes.appTools}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-[13px] font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95"
                >
                  Ir a Herramientas
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {/* Contador */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                  {savedTools.length} herramienta{savedTools.length !== 1 ? "s" : ""} guardada{savedTools.length !== 1 ? "s" : ""}
                </span>
              </div>

              {savedTools.map((tool) => (
                <article
                  key={tool.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTool(tool)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTool(tool); }
                  }}
                  className="group flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 cursor-pointer md:px-5"
                >
                  {/* Logo — clickeable para preview */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setLogoPreview({ name: tool.name, domain: tool.domain }); }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden cursor-zoom-in hover:scale-110 transition-transform duration-200"
                  >
                    <ToolLogo
                      name={tool.name}
                      domain={tool.domain}
                      className="h-8 w-8 border-none bg-transparent"
                      imageClassName="p-0"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-black tracking-tight text-zinc-900">
                      {tool.name}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                        {withSpanishAccents(tool.category)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                        {withSpanishAccents(tool.kind)}
                      </span>
                      {tool.niches.slice(0, 1).map((niche) => (
                        <span
                          key={`${tool.name}-${niche}`}
                          className="inline-flex items-center rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400"
                        >
                          {withSpanishAccents(toolNicheMap[niche].label)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                    <ToolInteractionButtons
                      className="justify-end"
                      favoriteActive={isFavorited(tool.name)}
                      favoriteCount={getFavoriteCount(tool.name)}
                      favoritePending={isFavoritePending(tool.name)}
                      saveActive={isSaved(tool.name)}
                      savePending={isSavePending(tool.name)}
                      onFavoriteClick={() => void handleFavoriteClick(tool.name)}
                      onSaveClick={() => void handleSaveClick(tool.name)}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      <ToolDetailsModal
        selectedTool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />

      {/* ─── Lightbox logo ───────────────────────────────────────── */}
      {logoPreview && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLogoPreview(null)}
        >
          <div
            className="relative flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={() => setLogoPreview(null)}
              className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo ampliado */}
            <div className="flex h-40 w-40 items-center justify-center rounded-[36px] border border-white/20 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden">
              <ToolLogo
                name={logoPreview.name}
                domain={logoPreview.domain}
                className="h-28 w-28 border-none bg-transparent"
                imageClassName="p-0"
              />
            </div>

            {/* Nombre */}
            <p className="text-[15px] font-black tracking-tight text-white">
              {logoPreview.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
