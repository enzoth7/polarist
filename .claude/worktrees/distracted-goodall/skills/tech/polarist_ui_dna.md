# Polarist UI DNA

Canonical rules for Polarist's "Agente de Elite" front-end identity. Apply these to every new component and page.

## Navigation

- Header nav items are **always visible** regardless of auth state. Do not split lists by `status`.
- Items flagged `protected: true` (currently `Recursos`, `Biblioteca`) must trigger `AuthModal` via `e.preventDefault()` when `status !== "authenticated"`.
- A single `navItems` array powers both desktop (`DesktopNavItem`) and the mobile `Sheet` menu — never duplicate nav lists.
- Guest `Biblioteca` item uses `routes.login` as its `to` placeholder (click is intercepted anyway); authenticated users use `getAppUserProfileRoute(username)`.

## Animations

- Library: `framer-motion` (`^12.34.3`).
- Standard ease: `[0.23, 1, 0.32, 1]` for 0.35–0.45 s transitions (premium elastic ease-out).
- Entrance reveals: `{ opacity: 0, y: 16 } → { opacity: 1, y: 0 }`.
- Accent moments (icons, badges, focal elements): `spring` with `stiffness: 220, damping: 18`.
- Stagger child reveals by 50–150 ms for layered depth.
- Never use `duration > 0.5 s` on UI feedback — feels sluggish.

## Palette

- **Neon accent:** `#CCFF00` (primary CTA background, focal highlights).
- **Neon hover:** `#d8ff4a`.
- **Text on neon:** `#0f1402`.
- **Glass surface:** `bg-background/70 backdrop-blur-xl border border-border/50`.
- **Glass overlay:** `bg-black/70 backdrop-blur-md`.
- **Neon glow (hover):** `shadow-[0_0_30px_-4px_rgba(204,255,0,0.55)]`.
- **Neon halo (icon):** `shadow-[0_0_40px_-10px_#CCFF00]`.
- Rule: **one** `#CCFF00` focal point per screen maximum.

## Typography

- Titles / hero: `font-serif` (Playfair Display) — weights 500–700, tight tracking.
- Body / UI: `font-sans` (Inter).
- Both are configured in `tailwind.config.ts` — reference via the utilities, never import fonts ad-hoc.

## Protected modal template

Use `src/components/ui/AuthModal.tsx` as the canonical premium gate. Do **not** re-implement:

```tsx
import AuthModal from "@/components/ui/AuthModal";

const [authModalOpen, setAuthModalOpen] = useState(false);
// ...
<AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
```

The modal enforces glassmorphism, Playfair title ("Acceso Protegido"), Inter body, `#CCFF00` CTA to `/login`, and framer-motion spring reveals — all preset. Any future gate should reuse it, not fork it.
