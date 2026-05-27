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

  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  return (
    <>
      {/* ── Mobile: lista de cards ── */}
      <div className="flex flex-col gap-3 w-full max-w-lg mx-auto px-4 md:hidden">
        {items.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </div>

      {/* ── Desktop: layout 2 paneles ── */}
      <div className="hidden md:flex md:flex-row items-center gap-16 lg:gap-32 select-none w-full max-w-7xl mx-auto py-8 px-6">
        {/* Izquierda: lista de títulos */}
        <div className="flex flex-col gap-8 flex-1 w-full">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Derecha: grid de fotos */}
        <div className="flex gap-3 flex-shrink-0 overflow-visible p-6">
          {/* Columna 1 (izquierda): 3 filas */}
          <div className="flex flex-col gap-3">
            {col1.map((item) => (
              <PhotoCard
                key={item.id}
                item={item}
                className="w-[185px] h-[185px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>
          
          {/* Columna 2 (medio): 2 filas, centrada verticalmente */}
          <div className="flex flex-col gap-3 self-center">
            {col3.map((item) => (
              <PhotoCard
                key={item.id}
                item={item}
                className="w-[185px] h-[185px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>

          {/* Columna 3 (derecha): 3 filas */}
          <div className="flex flex-col gap-3">
            {col2.map((item) => (
              <PhotoCard
                key={item.id}
                item={item}
                className="w-[185px] h-[185px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Card de mobile ────────────────────────────────────────────────────────
function MobileCard({ item }: { item: ShowcaseItem }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-3 cursor-pointer active:bg-white/[0.06] transition-colors"
      onClick={() => item.onSelect?.()}
    >
      <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#CAFE5B]/70"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {item.eyebrow}
        </p>
        <p
          className="mt-1 text-[15px] font-semibold leading-tight tracking-tight text-white/90"
          style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
        >
          {item.title}
        </p>
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
            ? 'brightness(1.05) saturate(1.1)'
            : 'none',
          transform: isActive ? 'scale(1.06)' : 'scale(1)',
        }}
      />
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
      <div className="flex items-start gap-4">
        {/* Indicador lateral (el "punto") */}
        <span
          className={cn(
            'rounded-[5px] flex-shrink-0 transition-all duration-400 mt-1.5',
            isActive ? 'w-5 h-2.5 bg-[#CAFE5B]' : 'w-4 h-2.5 bg-white/20',
          )}
        />
        
        <div className="flex flex-col">
          {/* Título */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300 whitespace-nowrap',
                isActive ? 'text-white' : 'text-white/70',
              )}
              style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
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
            className="mt-2 text-[9px] md:text-[10px] font-medium uppercase tracking-[0.22em]"
            style={{
              fontFamily: 'var(--font-serif)',
              color: isActive ? 'rgba(202,254,91,0.7)' : 'rgba(246,246,246,0.35)',
              transition: 'color 0.3s ease',
            }}
          >
            {item.eyebrow}
          </p>
        </div>
      </div>
    </div>
  );
}
