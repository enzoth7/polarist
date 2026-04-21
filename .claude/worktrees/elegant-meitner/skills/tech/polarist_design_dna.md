# Polarist — Design DNA

**Versión**: 1.0  
**Stack**: React 18 + Vite + TailwindCSS + Framer Motion + shadcn/ui  
**Última actualización**: 2026-04-11

---

## Paleta cromática

| Token          | Valor       | Uso                                        |
|----------------|-------------|--------------------------------------------|
| Negro profundo | `#050505`   | Background principal de secciones hero     |
| Negro app      | `#0a0a0a`   | Background general de la app               |
| Gris silenciado| `#71717a`   | Texto secundario, subtítulos               |
| Borde sutil    | `border/50` | Bordes de cards, inputs, dividers          |
| Neon accent    | `#CCFF00`   | CTAs primarios, highlights, glow effects   |
| Neon hover     | `#d4ff26`   | Estado hover del accent                    |
| Texto CTA      | `#0f1402`   | Texto sobre fondo neon (contraste máximo)  |

**Regla**: El neon (#CCFF00) se usa UNA sola vez por pantalla como punto focal. Nunca saturar.

---

## Tipografía

| Rol            | Familia                              | Pesos    | Uso                               |
|----------------|--------------------------------------|----------|-----------------------------------|
| Display / Hero | Playfair Display, Georgia, serif     | 600, 700 | Títulos de sección, modales, H1   |
| UI / Body      | Inter, system-ui, sans-serif         | 400–700  | Todo lo demás                     |
| Código         | JetBrains Mono, monospace            | 400, 500 | Snippets, valores técnicos        |

**Tracking**: Headings grandes → `tracking-tight` o `letter-spacing: -0.02em`  
**Line-height body**: 1.5–1.6  
**Escala**: 7 / 9 / 11 / 13 / 15 / 20 / 24 / 32 / 48 / 64px

---

## Glassmorphism

El sistema de capas de Polarist:

```
Layer 1 — Background sólido oscuro   bg-[#0a0a0a]
Layer 2 — Surface card               bg-white  (en dashboard)
Layer 3 — Overlay / Modal            bg-background/60 + backdrop-blur-xl
Layer 4 — Tooltip / Popover          bg-black/90 + backdrop-blur-md
```

**Fórmula glass**: `bg-background/60 backdrop-blur-xl border border-border/50`  
**Overlay dark**: `bg-black/60 backdrop-blur-sm`

---

## Animaciones — Framer Motion

**Duración máxima**: 0.4s  
**Easing premium**: `[0.23, 1, 0.32, 1]` (ease-out elástico suave)  
**Easing salida**: `"easeIn"` a 0.2s

### Patrones estándar

```ts
// Reveal de panel / modal
{ opacity: 0, scale: 0.95, y: 8 } → { opacity: 1, scale: 1, y: 0 }
// duration: 0.4, ease: [0.23, 1, 0.32, 1]

// Entrada de sección
{ opacity: 0, y: 24 } → { opacity: 1, y: 0 }
// duration: 0.5, ease: [0.23, 1, 0.32, 1]

// Micro-interacción hover
scale: 1 → 1.03, duration: 0.15

// Fade simple
opacity: 0 → 1, duration: 0.25
```

**Regla**: `isAnimationActive={false}` en Recharts — las animaciones de charts las maneja Framer.  
**Regla**: `prefers-reduced-motion` siempre respetado con `useReducedMotion()`.

---

## Espaciado — Grid de 8px

| Escala | px  | Tailwind  |
|--------|-----|-----------|
| 0.5    | 4   | `p-1`     |
| 1      | 8   | `p-2`     |
| 1.5    | 12  | `p-3`     |
| 2      | 16  | `p-4`     |
| 3      | 24  | `p-6`     |
| 4      | 32  | `p-8`     |
| 5      | 40  | `p-10`    |
| 6      | 48  | `p-12`    |
| 10     | 80  | `py-20`   |

Secciones hero: `py-20` desktop / `py-12` mobile

---

## Componentes — Reglas

### Botones
- **Primario CTA**: `rounded-full bg-[#CCFF00] text-[#0f1402] font-bold` + glow hover
- **Secundario**: `rounded-full border-border/80 bg-background/75`
- **PROHIBIDO**: botones cuadrados (`rounded-none`, `rounded-md` mínimo = `rounded-xl`)

### Cards
- **Dashboard**: `bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.18)]` o `rounded-[24px]`
- **Dark surface**: `bg-[#0A0A0A] border border-white/5 rounded-3xl`
- **Proporción**: `aspect-[5/4]` para metric cards
- **PROHIBIDO**: `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` — sombra genérica

### Inputs / Borders
- `border-border/50` a `border-border/80` — nunca `border-gray-300`

---

## Principios de diseño

1. **Aura > Información** — El espacio en blanco transmite más que llenar el viewport
2. **Luxury through white space** — Padding generoso es señal de premium
3. **Micro-interactions with Framer Motion** — Cada elemento interactivo tiene al menos un micro-feedback
4. **Tipografía como jerarquía** — Serif para títulos, sans para cuerpo, nunca al revés

---

## Anti-patrones (NUNCA hacer)

```
❌ Botones con border-radius < rounded-xl
❌ box-shadow genérica (rgba(0,0,0,0.1))
❌ Más de un elemento #CCFF00 por pantalla
❌ Animaciones > 400ms
❌ user-scalable=no en viewport
❌ Imágenes JPEG en UI elements (usar WebP/AVIF)
❌ Texto blanco puro #FFFFFF sobre negro (usar text-foreground)
❌ Gradientes en barras de charts (colores sólidos)
❌ Tres o más fuentes distintas en el mismo componente
```

---

## Auth & Access control

- **Modal de restricción**: `AuthModal` → glassmorphism + Playfair title + CTA neon
- **Patrón**: nav items con `restricted: true` interceptan el click y abren `AuthModal`
- **No redirigir silenciosamente** — siempre feedback visual antes de redirigir

---

*Este archivo es el contrato visual de Polarist. Toda nueva UI debe respetarlo.*
