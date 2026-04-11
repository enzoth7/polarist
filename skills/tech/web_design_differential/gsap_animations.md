# Skill: GSAP Animations — Master Catalog

## Regla Principal
**GSAP es el framework de animación por defecto del proyecto.** No usar animaciones CSS vanilla ni framer-motion para nada que involucre scroll, transiciones entre secciones o animaciones coordinadas.

**framer-motion** solo se usa para:
- Animaciones de entrada simples (opacity + translateY al montar)
- Hover states de componentes individuales
- Layout animations de componentes internos (no de página)

---

## Stack de Animación Instalado

```
gsap                → Core + todos los plugins (ScrollTrigger, Flip, Draggable, etc.)
@gsap/react         → Hook useGSAP() para React (cleanup automático)
lenis               → Smooth scroll de alta performance (Studio Freight)
split-type          → Split text en chars/words/lines para animaciones (alternativa gratis a SplitText)
```

---

## Setup Base (copiar en TODO componente que use GSAP)

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

### Setup global de Lenis (una sola vez, en App.tsx o layout)

```tsx
import Lenis from "lenis";
import "lenis/dist/lenis.css";

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.destroy();
    gsap.ticker.remove(lenis.raf);
  };
}, []);
```

---

## Catálogo de Animaciones

Cada animación incluye: nombre, complejidad, código GSAP listo para copiar, y referencia de dónde se vio.

---

### TIER 1 — Alto Impacto, Baja Complejidad 🟢

---

#### 1. Section Pinning + Overlay (Stacking Cards)
**Ref:** Apple MacBook Pro, Artlist  
**Uso:** Hero → Videos transition  
```tsx
useGSAP(() => {
  ScrollTrigger.create({
    trigger: heroRef.current,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,  // La siguiente sección sube y cubre
  });
}, { scope: containerRef });
```
> La sección de videos tiene `position: relative` con `z-index` superior. Al scrollear, sube y cubre el hero pinneado.

---

#### 2. Staggered Fade-In + Slide-Up
**Ref:** Artlist cards, Apple iPhone features  
**Uso:** Cards, features, listas  
```tsx
useGSAP(() => {
  gsap.from(".feature-card", {
    scrollTrigger: {
      trigger: ".features-section",
      start: "top 80%",
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
  });
}, { scope: containerRef });
```

---

#### 3. Glow Button (CTA Premium)
**Ref:** Artlist "Start Free", ya existente en Polarist  
**Uso:** CTA "Comenzar"  
```css
.glow-btn {
  box-shadow:
    0 0 15px rgba(204, 255, 0, 0.3),
    0 0 45px rgba(204, 255, 0, 0.1);
  transition: all 0.3s ease;
}
.glow-btn:hover {
  box-shadow:
    0 0 20px rgba(204, 255, 0, 0.5),
    0 0 60px rgba(204, 255, 0, 0.2),
    0 0 100px rgba(204, 255, 0, 0.1);
  transform: scale(1.05);
}
```

---

#### 4. Infinite Logo Marquee
**Ref:** Artlist partners section  
**Uso:** Logos de clientes/partners  
```tsx
useGSAP(() => {
  const track = marqueeRef.current;
  // Duplicar contenido para loop infinito
  track.innerHTML += track.innerHTML;
  
  gsap.to(track, {
    xPercent: -50,
    repeat: -1,
    duration: 20,
    ease: "none",
  });
}, { scope: containerRef });
```

---

#### 5. Counter Animation (Números que suben)
**Ref:** Apple specs  
**Uso:** Stats de la plataforma (usuarios, herramientas, etc.)  
```tsx
useGSAP(() => {
  const counter = { val: 0 };
  gsap.to(counter, {
    val: 1500,
    duration: 2,
    ease: "power2.out",
    snap: { val: 1 },
    scrollTrigger: {
      trigger: statsRef.current,
      start: "top 75%",
    },
    onUpdate: () => {
      statsRef.current.textContent = Math.floor(counter.val).toLocaleString();
    },
  });
}, { scope: containerRef });
```

---

#### 6. Parallax Text/Elements
**Ref:** Artlist large typography, Apple depth  
**Uso:** Texto decorativo de fondo, elementos flotantes  
```tsx
useGSAP(() => {
  gsap.to(elementRef.current, {
    scrollTrigger: {
      trigger: elementRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -120,
    ease: "none",
  });
}, { scope: containerRef });
```

---

#### 7. Snap Scroll entre Secciones
**Ref:** Apple MacBook Pro secciones  
**Uso:** Navegación entre secciones principales  
```tsx
useGSAP(() => {
  const sections = gsap.utils.toArray<HTMLElement>(".snap-section");
  
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      snap: {
        snapTo: 1,
        duration: { min: 0.3, max: 0.6 },
        ease: "power2.inOut",
      },
    });
  });
}, { scope: containerRef });
```

---

#### 8. Smooth Background Color Transition
**Ref:** Apple secciones con cambio de fondo  
**Uso:** Transiciones entre secciones oscuras/claras  
```tsx
useGSAP(() => {
  gsap.to(sectionRef.current, {
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top center",
      end: "top 20%",
      scrub: true,
    },
    backgroundColor: "#0a0a0a",
    color: "#ffffff",
    ease: "none",
  });
}, { scope: containerRef });
```

---

#### 9. Bar Chart Animation
**Ref:** Apple MacBook Pro performance charts  
**Uso:** Métricas de rendimiento, comparaciones  
```tsx
useGSAP(() => {
  gsap.from(".bar", {
    scrollTrigger: {
      trigger: ".chart-container",
      start: "top 75%",
    },
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
  });
}, { scope: containerRef });
```

---

#### 10. Image Zoom on Hover
**Ref:** Artlist catalog cards  
**Uso:** Cards de cualquier tipo  
```css
.zoom-card img {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.zoom-card:hover img {
  transform: scale(1.08);
}
.zoom-card {
  overflow: hidden;
  border-radius: 1rem;
}
```

---

### TIER 2 — Alto Impacto, Complejidad Media 🟡

---

#### 11. Text Reveal Palabra por Palabra
**Ref:** Apple descriptions, MacBook Pro copy  
**Usa:** `split-type` (instalado)  
```tsx
import SplitType from "split-type";

useGSAP(() => {
  const split = new SplitType(textRef.current!, { types: "words" });
  
  gsap.from(split.words!, {
    scrollTrigger: {
      trigger: textRef.current,
      start: "top 80%",
      end: "top 30%",
      scrub: true,
    },
    opacity: 0.1,
    y: 10,
    stagger: 0.02,
  });

  return () => split.revert();
}, { scope: containerRef });
```

---

#### 12. Pinned Gallery con Crossfade
**Ref:** Apple MacBook Pro highlights (chip → IA → battery tabs)  
**Uso:** Showcase de features con imágenes que cambian  
```tsx
useGSAP(() => {
  const slides = gsap.utils.toArray<HTMLElement>(".gallery-slide");
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: galleryRef.current,
      start: "top top",
      end: `+=${slides.length * 100}%`,
      scrub: 1,
      pin: true,
    },
  });

  slides.forEach((slide, i) => {
    if (i > 0) {
      tl.from(slide, { opacity: 0, duration: 0.5 })
        .to(slides[i - 1]!, { opacity: 0, duration: 0.5 }, "<");
    }
  });
}, { scope: containerRef });
```

---

#### 13. Horizontal Scroll Section
**Ref:** Apple specs, showcase sections  
**Uso:** Demostración de herramientas horizontalmente  
```tsx
useGSAP(() => {
  const track = trackRef.current!;
  const totalWidth = track.scrollWidth - track.offsetWidth;
  
  gsap.to(track, {
    x: -totalWidth,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${totalWidth}`,
      scrub: 1,
      pin: true,
    },
  });
}, { scope: containerRef });
```

---

#### 14. Card Expand / Flip Animation
**Ref:** Apple iPhone feature card modals  
**Usa:** `Flip` plugin (incluido en GSAP)  
```tsx
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const handleExpand = () => {
  const state = Flip.getState(cardRef.current);
  cardRef.current.classList.toggle("expanded");
  Flip.from(state, {
    duration: 0.6,
    ease: "power2.inOut",
    absolute: true,
  });
};
```

---

#### 15. Floating UI Depth Layers
**Ref:** Artlist studio showcase  
**Uso:** UI elements flotando con diferentes velocidades de parallax  
```tsx
useGSAP(() => {
  const layers = gsap.utils.toArray<HTMLElement>(".depth-layer");
  
  layers.forEach((layer, i) => {
    gsap.to(layer, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: (i + 1) * -40,
      scale: 1 + i * 0.02,
      ease: "none",
    });
  });
}, { scope: containerRef });
```

---

#### 16. Frosted Glass Navbar
**Ref:** Artlist, Apple sticky nav  
**Uso:** Header de Polarist  
```css
.glass-nav {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

### TIER 3 — WOW Factor, Alta Complejidad 🔴

---

#### 17. Scroll-Controlled Video Playback
**Ref:** Apple MacBook Pro (laptop que se abre)  
**Nota:** Requiere secuencia de 60-200 frames como imágenes `.webp`  
```tsx
useGSAP(() => {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d")!;
  const frameCount = 120;
  const images: HTMLImageElement[] = [];
  
  // Preload frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = `/frames/frame_${String(i).padStart(4, "0")}.webp`;
    images.push(img);
  }

  const render = (index: number) => {
    if (images[index]?.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    }
  };

  const obj = { frame: 0 };
  gsap.to(obj, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "+=3000",
      scrub: 0.5,
      pin: true,
    },
    onUpdate: () => render(Math.round(obj.frame)),
  });
}, { scope: containerRef });
```

---

## Reglas de useGSAP en React

1. **Siempre usar `useGSAP` en lugar de `useEffect`** para animaciones GSAP — limpia automáticamente
2. **Usar `scope`** para limitar al DOM del componente:
   ```tsx
   const containerRef = useRef(null);
   useGSAP(() => { ... }, { scope: containerRef });
   ```
3. **Refs para elementos individuales:**
   ```tsx
   const titleRef = useRef(null);
   gsap.from(titleRef.current, { opacity: 0 });
   ```
4. **Dependencias:** Si depende de state:
   ```tsx
   useGSAP(() => { ... }, { scope: containerRef, dependencies: [someState] });
   ```

---

## Plugins Disponibles (todos incluidos en `gsap`)

| Plugin | Import | Uso |
|--------|--------|-----|
| **ScrollTrigger** | `gsap/ScrollTrigger` | Scroll-based animations |
| **Flip** | `gsap/Flip` | Layout transitions (card expand) |
| **Draggable** | `gsap/Draggable` | Drag & drop, sliders |
| **MotionPath** | `gsap/MotionPathPlugin` | Animar a lo largo de un SVG path |
| **TextPlugin** | `gsap/TextPlugin` | Typewriter effect |
| **Observer** | `gsap/Observer` | Eventos de scroll/touch/pointer custom |

Librerías externas:

| Librería | Uso |
|----------|-----|
| **lenis** | Smooth scroll premium |
| **split-type** | Split text en chars/words/lines (gratis, alternativa a SplitText de GSAP) |

---

## Anti-Patrones GSAP

1. ❌ `useEffect` en lugar de `useGSAP` → memory leaks
2. ❌ No hacer cleanup de ScrollTriggers → `useGSAP` lo hace automáticamente
3. ❌ Animar `width/height/top/left` → usar `transform` y `opacity` (GPU accelerated)
4. ❌ `scrub: true` con `duration` → son mutuamente excluyentes
5. ❌ Crear ScrollTriggers sin `scope` en React → pueden persistir entre re-renders
6. ❌ Olvidar `gsap.registerPlugin(ScrollTrigger)` → las animaciones no se activan

---

## Referencia de Sitios Analizados

| Sitio | Técnicas principales | Dificultad |
|-------|---------------------|------------|
| **artlist.io** | Video bg, stagger, marquee, glow, frosted glass | 🟢 90% fácil |
| **apple.com/iphone** | Reveal, pin+crossfade, counter, card modals | 🟢🟡 80% fácil |
| **apple.com/macbook-pro** | Pin gallery, horizontal scroll, bar charts, scroll-video | 🟡🔴 60% fácil |

---

## Memoria de Errores
- [2026-04-10] Primer intento de stacking cards fue con CSS `position: sticky` — funcional pero limitado en control. Se migra a GSAP ScrollTrigger para pinning real + scrub.
- [2026-04-10] `split-type` instalado como alternativa gratis a `SplitText` (plugin premium de GSAP). Funciona igual para word/char/line splitting.
- [2026-04-10] `lenis` instalado para smooth scroll. Requiere sync con GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
