"use client";

import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'polarist';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
  style?: React.CSSProperties;
}

interface SpotlightBorderProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'polarist';
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  polarist: { base: 74, spread: 10 } // Neon green for Polarist
};

const spotlightBorderStyles = `
  [data-spotlight-border]::before,
  [data-spotlight-border]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: 0;
    z-index: 30;
    border: 1px solid transparent;
    border-radius: inherit;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: calc(100% + 2px) calc(100% + 2px);
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }

  [data-spotlight-border]::before {
    background-image: radial-gradient(
      var(--spotlight-size, 220px) var(--spotlight-size, 220px) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 74) 100% 58% / 0.95), transparent 72%
    );
    filter: brightness(1.35);
  }

  [data-spotlight-border]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size, 220px) * 0.48)
      calc(var(--spotlight-size, 220px) * 0.48) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 0% 100% / 0.78), transparent 76%
    );
  }
`;

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'polarist',
  size = 'md',
  width,
  height,
  customSize = false,
  style
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: React.CSSProperties & Record<string, any> = {
      '--base': base,
      '--spread': spread,
      '--radius': '32', // Rounded 2rem matches Bento
      '--border': '1',
      '--backdrop': 'rgba(255,255,255,0.02)',
      '--backup-border': 'transparent',
      '--size': '300', // Spotlight size
      '--outer': '1',
      '--border-size': 'calc(var(--border, 1) * 1px)',
      '--spotlight-size': 'calc(var(--size, 200) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: 'fixed',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative' as const,
      touchAction: 'none' as const,
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 0.1)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={{ ...getInlineStyles(), ...style }}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-[32px] 
          relative 
          overflow-hidden
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

const SpotlightBorder: React.FC<SpotlightBorderProps> = ({
  children,
  className = "",
  radius = 24,
  glowColor = "polarist",
}) => {
  const borderRef = useRef<HTMLDivElement>(null);
  const { base, spread } = glowColorMap[glowColor];

  useEffect(() => {
    const syncPointer = (event: PointerEvent) => {
      if (!borderRef.current) {
        return;
      }

      borderRef.current.style.setProperty("--x", event.clientX.toFixed(2));
      borderRef.current.style.setProperty("--y", event.clientY.toFixed(2));
      borderRef.current.style.setProperty(
        "--xp",
        (event.clientX / window.innerWidth).toFixed(2),
      );
    };

    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: spotlightBorderStyles }} />
      <div
        ref={borderRef}
        data-spotlight-border
        className={`relative ${className}`}
        style={
          {
            "--base": base,
            "--spread": spread,
            "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
            "--spotlight-size": "220px",
            borderRadius: radius,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
};

export { GlowCard, SpotlightBorder };
