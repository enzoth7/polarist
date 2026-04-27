---
name: polarist-design-guardian
description: Use for Polarist website UI/design work: visual polish, layouts, premium components, typography, spacing, borders, glassmorphism, Bento/Apple style, brand consistency, and design reviews. Always use before changing frontend aesthetics in Polarist.
---

# Polarist Design Guardian

Use this skill for any visual/design-facing change in Polarist.

## Required Context

Before editing UI, read:

- `agente_diseno/instrucciones.md`
- `agente_diseno/DESIGN.md`
- `agente_diseno/identidad.md`

For new or redesigned premium components, also read:

- `agente_diseno/workflows/componente_premium.md`

## Operating Rules

- Treat `agente_diseno/DESIGN.md` as the source of truth for tokens.
- Keep the Polarist "Opcion B: Sutil" direction: Apple/Bento, restrained, high contrast, minimal, premium.
- Use `#CAFE5B` only as an accent or decisive CTA, not as general decoration.
- Prefer `#010101`, `#111111`, `#F6F6F6`, and subtle white alpha borders.
- Use Arno Pro for editorial hierarchy and Sequel Sans for UI, labels, body, and technical surfaces.
- Remove visual noise before adding decoration.
- When adjusting borders around images, cards, or avatars, prefer a fine `1px` alpha border close to the object instead of padded outer frames.
- Validate with `npm run build` after code changes.

## Design Pass Checklist

- Hierarchy is obvious at a glance.
- Spacing follows a clean 8px rhythm.
- Corners feel intentional: small controls tighter, cards around 24px.
- Text remains readable on black surfaces.
- Motion is subtle: `0.4s cubic-bezier(0.16, 1, 0.3, 1)` when needed.
- The final result feels quieter, sharper, and more premium than the previous version.
