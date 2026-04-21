---
name: web_premium
description: web artisan - estándares de diseño premium para landings. Minimum Visible Precision.
---

## FILOSOFÍA CORE

> "Si tu criterio técnico es cero, la IA multiplicará por cero."
> — Kuba Mikita, Minimum Visible Precision (MVP)

No producir lo genérico. Cada decisión de diseño debe ser deliberada.

---

## CHECKLIST LANDING PREMIUM

### TIPOGRAFÍA
- [ ] Máximo 2 familias (display + body)
- [ ] Escala tipográfica definida: 12/14/16/20/24/32/48/64px
- [ ] Line-height body: 1.5-1.6 | Headings: 1.1-1.2
- [ ] Tracking: headings grandes → `letter-spacing: -0.02em`

### ESPACIADO
- [ ] Grid de 8px sin excepciones (4px solo para micro-ajustes)
- [ ] Secciones: padding vertical mínimo 80px desktop / 48px mobile
- [ ] Consistent gap en flex/grid: múltiplos de 8

### COLOR
- [ ] Paleta: 1 primario + 1 acento + grises neutros
- [ ] Contraste mínimo 4.5:1 texto normal, 3:1 texto grande (WCAG AA)
- [ ] Background no puro blanco (#FAFAFA o #F8F8F8 para suavizar)
- [ ] Dark mode: no invertir colores, rediseñar

### ANIMACIONES
- [ ] Duración: 150-300ms para micro (hover/click), 400-600ms para entradas
- [ ] Easing: `cubic-bezier(0.4, 0, 0.2, 1)` para movimiento natural
- [ ] No animar más de 2 propiedades simultáneas en el mismo elemento
- [ ] `prefers-reduced-motion`: siempre respetar

### IMÁGENES / ASSETS
- [ ] Formato WebP o AVIF (nunca JPEG para UI elements)
- [ ] `loading="lazy"` en todas las imágenes below the fold
- [ ] Dimensiones explícitas (evita CLS)
- [ ] `alt` descriptivo en todas las imágenes

### MOBILE-FIRST
- [ ] Breakpoints: 375 / 768 / 1024 / 1280 / 1536
- [ ] Touch targets mínimo 44x44px
- [ ] Sin `user-scalable=no` en viewport
- [ ] Test real en 375px antes de entregar

### PERFORMANCE QUICK WINS
- [ ] Fonts: `display=swap` + preconnect + subset si posible
- [ ] Critical CSS inline (above the fold)
- [ ] Lazy load de secciones fuera de viewport con Intersection Observer
- [ ] Imágenes hero: `fetchpriority="high"` + no lazy

### SEO MÍNIMO VIABLE
- [ ] `<title>` único por página (50-60 chars)
- [ ] `meta description` único (150-160 chars) con acento correcto
- [ ] `og:title` + `og:description` + `og:image` (1200x630px) + `og:url`
- [ ] `canonical` en cada página
- [ ] `lang` correcto en `<html>`

---

## QUICK WINS DE ALTO IMPACTO VISUAL

```
1. Añadir backdrop-blur + transparencia en navbars → premium al instante
2. Gradientes sutiles en backgrounds (5-10% opacidad) > fondos planos
3. Box-shadow con color (no negro puro): rgba(var(--color), 0.15)
4. Border-radius consistente: definir una variable y usarla siempre
5. Hover states en TODOS los elementos interactivos (no solo links)
```

---
*Stack base en este repo: React 18 + TailwindCSS 3 + Framer Motion + shadcn/ui*
