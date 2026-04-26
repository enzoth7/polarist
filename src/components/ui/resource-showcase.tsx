import { useState } from 'react';
import { cn } from '@/lib/utils';

// ── Tipos ─────────────────────────────────────────────────────────────────
export interface ShowcaseItem {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  onSelect?: () => void;
}

interface ResourceShowcaseProps {
  items: ShowcaseItem[];
}

// ── Componente principal ───────────────────────────────────────────────────
export default function ResourceShowcase({ items }: ResourceShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Distribuir en 3 columnas con offsets distintos (igual que el original)
  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-16 select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6">

      {/* ── Izquierda: grid de fotos ── */}
      <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">

        {/* Columna 1 */}
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((item) => (
            <PhotoCard
              key={item.id}
              item={item}
              className="w-[110px] h-[120px] sm:w-[130px] sm:h-[140px] md:w-[155px] md:h-[165px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Columna 2 — con offset vertical */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[48px] sm:mt-[56px] md:mt-[68px]">
          {col2.map((item) => (
            <PhotoCard
              key={item.id}
              item={item}
              className="w-[122px] h-[132px] sm:w-[145px] sm:h-[155px] md:w-[172px] md:h-[182px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Columna 3 — con offset medio */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[22px] sm:mt-[26px] md:mt-[32px]">
          {col3.map((item) => (
            <PhotoCard
              key={item.id}
              item={item}
              className="w-[115px] h-[125px] sm:w-[136px] sm:h-[146px] md:w-[162px] md:h-[172px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Derecha: lista de títulos ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

// ── Foto con efecto hover ──────────────────────────────────────────────────
function PhotoCard({
  item,
  className,
  hoveredId,
  onHover,
}: {
  item: ShowcaseItem;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === item.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 transition-all duration-500',
        className,
        isDimmed ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100',
        isActive ? 'ring-2 ring-[#CAFE5B] ring-offset-2 ring-offset-[#010101]' : '',
      )}
      onClick={() => item.onSelect?.()}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-all duration-700"
        style={{
          filter: isActive
            ? 'grayscale(0) brightness(1.05) saturate(1.1)'
            : 'grayscale(0.85) brightness(0.65)',
          transform: isActive ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Overlay de título en la imagen */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)',
        }}
      >
        <span
          className="text-[#CAFE5B] text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1"
          style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
        >
          {item.eyebrow}
        </span>
      </div>
    </div>
  );
}

// ── Fila de texto a la derecha ─────────────────────────────────────────────
function ItemRow({
  item,
  hoveredId,
  onHover,
}: {
  item: ShowcaseItem;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === item.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'cursor-pointer transition-all duration-300 group',
        isDimmed ? 'opacity-30' : 'opacity-100',
      )}
      onClick={() => item.onSelect?.()}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Título + indicador */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'rounded-[5px] flex-shrink-0 transition-all duration-400',
            isActive ? 'w-5 h-3 bg-[#CAFE5B]' : 'w-4 h-3 bg-white/20',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-white' : 'text-white/70',
          )}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {item.title}
        </span>

        {/* Flecha al hacer hover */}
        <span
          className={cn(
            'ml-auto text-[#CAFE5B] text-xs font-bold uppercase tracking-wider transition-all duration-200',
            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none',
          )}
          style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
        >
          →
        </span>
      </div>

      {/* Eyebrow / categoría */}
      <p
        className="mt-1.5 pl-[28px] text-[9px] md:text-[10px] font-medium uppercase tracking-[0.22em]"
        style={{
          fontFamily: 'var(--font-sequel, sans-serif)',
          color: isActive ? 'rgba(202,254,91,0.7)' : 'rgba(246,246,246,0.35)',
          transition: 'color 0.3s ease',
        }}
      >
        {item.eyebrow}
      </p>
    </div>
  );
}
