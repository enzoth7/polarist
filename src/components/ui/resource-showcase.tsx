import { useState } from 'react';
import { cn } from '@/lib/utils';

// ── Tipos ─────────────────────────────────────────────────────────────────
export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  onSelect?: () => void;
}

interface ResourceShowcaseProps {
  items: ShowcaseItem[];
}

// ── Componente principal ───────────────────────────────────────────────────
export default function ResourceShowcase({ items }: ResourceShowcaseProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="group/grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item) => (
          <GridCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Card de grilla ────────────────────────────────────────────────────────
function GridCard({ item }: { item: ShowcaseItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex flex-col gap-5 cursor-pointer transition-opacity duration-500 group-hover/grid:opacity-30 hover:!opacity-100"
      onClick={() => item.onSelect?.()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-transparent">
        <img
          src={item.image}
          alt={item.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
        <div className={cn(
          "absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[24px] pointer-events-none transition-colors duration-500",
          isHovered && "ring-[#A78BFA]/50"
        )} />
      </div>
      
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-start gap-4">
          <h3
            className="text-[18px] md:text-[20px] font-semibold leading-tight tracking-tight text-white/90 group-hover:text-white transition-colors duration-300"
            style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
