# Prompt para Codex — Rediseño UX del Onboarding + Ajustes Globales

## Contexto del proyecto
- **Stack:** Vite + React 18 + TypeScript + TailwindCSS 3 + react-i18next + lucide-react
- **Archivos clave:**
  - `src/pages/Onboarding.tsx` — Página completa del onboarding (intro → contacto → cuestionario → procesamiento)
  - `src/components/LanguageSwitcher.tsx` — Toggle de idioma con iconos SVG de banderas
  - `src/components/Footer.tsx` — Footer global de la PWA
  - `src/locales/es/translation.json` — Textos en español (sección `onboarding.questions` = array de objetos con `id`, `category`, `type`, `text`, `options`)
  - `src/locales/en/translation.json` — Textos en inglés (misma estructura)
  - `package.json` — Dependencias del proyecto

## Instrucción general
Antes de implementar, instalar las dependencias necesarias:
```bash
npm install framer-motion
```
`framer-motion` se usará para las animaciones de transición entre preguntas, la animación de "cargando", la animación de entrada al cuestionario, y el tick final.

---

## Cambios a implementar

### 1. Language Switcher — Texto en vez de banderas
**Archivo:** `src/components/LanguageSwitcher.tsx`

- **Eliminar** los componentes `SpainFlagIcon`, `UsaFlagIcon` y `FlagIcon` (SVGs de banderas).
- **Reemplazar** el contenido del `<Button>` de cada idioma: en vez de `<FlagIcon language={language.code} />`, mostrar el texto `"ES"` o `"EN"` (usar `language.code.toUpperCase()`).
- Mantener la misma lógica de toggle y aria labels.
- El texto debe ser `font-semibold text-xs tracking-wide`.

### 2. Language Switcher — Alinear a la izquierda en el Footer
**Archivo:** `src/components/Footer.tsx`

- El `<div>` que contiene el `<LanguageSwitcher />` (línea ~26-29) actualmente usa `justify-center`.
- Cambiar a `justify-start` para que el switcher quede alineado a la izquierda.
- Asegurar que el icono de Instagram siga a la derecha (`absolute right-4` ya lo hace).

### 3. Footer PWA — Reducir gap entre links
**Archivo:** `src/components/Footer.tsx`

- El contenedor de links (línea ~12) tiene `gap-x-1 sm:gap-x-2`. Cambiar a `gap-x-0 sm:gap-x-0.5`.
- Reducir el padding horizontal de cada `<Button>` de los links: en mobile, usar `px-1.5` en vez del default del `size="sm"`.
- Reducir `py-5` del footer a `py-3` para que sea más compacto.

### 4. Footer — Misma tonalidad que el resto de la página
**Archivo:** `src/components/Footer.tsx`

- El footer usa `bg-[#F0F0F0]/95`. La página usa `bg-[#FAFAFA]`.
- Cambiar el `bg` del footer a `bg-[#FAFAFA]/95` para que sea consistente visualmente con el resto de la app.
- Cambiar `border-t border-border` a `border-t border-border/40` para que sea más sutil.

### 5. Agrupar preguntas en 3 categorías con transiciones animadas
**Archivos:** `src/locales/es/translation.json` y `src/locales/en/translation.json`

> ⚠️ **REGLA CRÍTICA: NO MODIFICAR EL TEXTO de las preguntas, opciones ni descripciones. Solo reorganizar.**

Agrupar las preguntas existentes del array `onboarding.questions` en 3 secciones lógicas agregando un campo `"section"` a cada pregunta:

- **Sección 1 — "Tu marca"** (identidad): preguntas con ids `1, 2, 4, 5, 6` (categoría, historia, diferencial, cliente ideal, cliente ideal extra)
- **Sección 2 — "Tu operación"** (logística y canales): preguntas con ids `7, 8, 9, 10, 11, 13, 14, 15, 16` (promociones, productos, operación, envíos, recursos, cámara, canales, canal a potenciar)
- **Sección 3 — "Tu contenido"** (estilo visual y comunicación): preguntas con ids `12, 17, 18, 19, 20, 22, 23, 24, 25` (contenido, tipografía, prioridad social, humanización, look producto, frecuencia, sentimiento, colores, percepción)

Agregar a cada pregunta del JSON:
```json
"section": 1  // o 2 o 3
```

Agregar al JSON de `onboarding` nuevas keys para los nombres de las secciones y las animaciones de transición:

```json
"sections": {
  "1": { "name": "Tu marca" },
  "2": { "name": "Tu operación" },
  "3": { "name": "Tu contenido" }
},
"sectionTransition": {
  "messages": [
    "✨ Cargando tu estilo de marca...",
    "📊 Analizando tu operación...",
    "🎨 Preparando tu estrategia de contenido..."
  ]
}
```

(Hacer lo mismo en `en/translation.json` con textos en inglés.)

**En `Onboarding.tsx`:**
- Detectar cuándo el usuario termina la última pregunta de una sección y va a pasar a la siguiente.
- Mostrar una pantalla de transición animada (similar al `isSubmitting` existente pero más breve, ~2 segundos) con:
  - Un spinner o animación con `framer-motion` (fade in/out + scale).
  - El mensaje correspondiente de `sectionTransition.messages[sectionIndex]`.
- Después de la animación, continuar con la primera pregunta de la siguiente sección.

### 6. Tipografía uniforme en el cuestionario
**Archivo:** `src/pages/Onboarding.tsx`

- Actualmente la pregunta usa `font-heading` y las opciones usan un estilo diferente.
- Unificar: que **todo** el cuestionario (preguntas, opciones, descripciones, labels) use la misma familia tipográfica: `font-body` (la sans-serif del proyecto).
- Eliminar el uso de `font-heading` dentro del flujo de preguntas del onboarding (NO en la pantalla de intro que dice "Conozcamos tu marca", esa puede quedarse con `font-heading`).

### 7. Animación al presionar "Empezar cuestionario"
**Archivo:** `src/pages/Onboarding.tsx`

- Cuando el usuario presiona el botón "Empezar cuestionario" (CTA de la intro screen, `setHasStarted(true)`):
  - NO navegar inmediatamente al contact step.
  - Mostrar una micro-animación de ~1.2 segundos: el card actual hace un `scale(0.95) → opacity(0)` mientras el nuevo contenido entra con `opacity(0) → opacity(1) + translateY(10px → 0)`.
  - Usar `framer-motion` `AnimatePresence` + `motion.div` con `exit` y `initial`/`animate` props.

### 8. Barra de progreso más visible + flecha "atrás" en vez de botón
**Archivo:** `src/pages/Onboarding.tsx`

- **Barra de progreso** (línea ~423-428): 
  - Cambiar la altura de `h-2.5` a `h-3`.
  - Agregar un label debajo de la barra: `"Sección X de 3"` (usando las secciones del punto 5).
  - Mantener el color `bg-[#D0F000]` y el glow.
  
- **Botón "Anterior"**:
  - Eliminar el botón `<Button>` de "Anterior" del footer del cuestionario (líneas ~511-520).
  - En su lugar, agregar una **flechita** (`<ArrowLeft />` de lucide-react) al lado izquierdo de la barra de progreso ( justo antes o encima).
  - Estilo: `text-muted-foreground hover:text-foreground cursor-pointer p-1`, sin texto, solo el icono.
  - La flecha solo debe ser visible si `step > 0` (igual que el botón anterior).
  - Layout: la flecha a la izquierda y la barra de progreso ocupando el resto del ancho.

### 9. Avance automático al seleccionar opción (sin botón "Siguiente")
**Archivo:** `src/pages/Onboarding.tsx`

- **Para preguntas tipo `"single"`**: cuando el usuario hace click en una opción (`handleSelect`), esperar 400ms y luego avanzar automáticamente a la siguiente pregunta (llamar a `handleNext`).
- **Eliminar** el botón "Siguiente" del footer para preguntas tipo `single`.
- **Para preguntas tipo `"text"`**: mantener un botón "Continuar" en el footer ya que el usuario necesita terminar de escribir.
- **Para la última pregunta**: mostrar el botón "Finalizar ✨" como está ahora.
- Agregar un breve efecto visual al seleccionar (la opción seleccionada hace un pulso con `framer-motion`: `scale(1.02)` rápido).

### 10. Layout: preguntas arriba, opciones abajo
**Archivo:** `src/pages/Onboarding.tsx`

- El layout actual ya tiene la pregunta arriba y opciones abajo, pero verificar que en mobile se mantenga así.
- Asegurar que el bloque de la pregunta (`h1` + `description`) esté en la parte superior con `shrink-0`.
- Las opciones deben estar debajo y si hay overflow, debe scrollear solo la zona de opciones (`overflow-y-auto` en el contenedor de opciones).
- NO centrar verticalmente el contenido. Mantener pregunta en top, opciones debajo con espacio natural.

### 11. Tamaño menor para las preguntas
**Archivo:** `src/pages/Onboarding.tsx`

- Actualmente las preguntas tienen un sistema dinámico de tamaño (`questionTitleClass`) que va de `text-2xl` a `text-4xl`.
- Reducir una escala:
  - Texto corto (≤48 chars): `text-2xl md:text-3xl` (antes era `text-4xl md:text-5xl`)
  - Texto medio (≤88 chars): `text-xl md:text-2xl` (antes era `text-3xl md:text-4xl`)
  - Texto largo (>88 chars): `text-lg md:text-xl` (antes era `text-2xl md:text-3xl`)

### 12. Animación final — Tick verde grande
**Archivo:** `src/pages/Onboarding.tsx`

- Después de que termina la secuencia de `processingMessages` (pantalla de "Procesando estilo"):
  - En vez de redirigir inmediatamente al dashboard, mostrar una pantalla final de ~2 segundos.
  - La pantalla muestra un **tick verde grande** animado (círculo verde con check blanco):
    - Usar `framer-motion`: el círculo crece de `scale(0)` a `scale(1)` con un bounce (`type: "spring"`).
    - Dentro, el check se dibuja con un efecto de trazo SVG animado (stroke-dasharray animation).
    - Color: `bg-green-500` para el círculo, check blanco.
    - Tamaño: `w-24 h-24` en mobile, `w-32 h-32` en desktop.
  - Debajo, texto: `t("onboarding.processing.complete")` → agregar al JSON: `"complete": "¡Todo listo!"` (ES) / `"All set!"` (EN).
  - Después de los 2 segundos, redirigir al dashboard.

---

## Resumen de archivos a modificar
| Archivo | Cambios |
|---|---|
| `src/components/LanguageSwitcher.tsx` | Texto EN/ES en vez de banderas SVG |
| `src/components/Footer.tsx` | Alinear switch a izquierda, reducir gap, unificar color bg |
| `src/pages/Onboarding.tsx` | Animaciones, auto-advance, layout, tamaños, transiciones entre secciones, tick final |
| `src/locales/es/translation.json` | Campo `section` en preguntas, nuevas keys de secciones/transiciones/complete |
| `src/locales/en/translation.json` | Lo mismo en inglés |
| `package.json` | Se agrega `framer-motion` como dependencia |

## Restricciones
1. **NO modificar el texto de las preguntas, opciones ni descripciones.** Solo agregar campos nuevos (`section`) y reorganizar el orden si es necesario.
2. **NO romper la lógica de `showIf`** (preguntas condicionales). Al agrupar en secciones, mantener que las preguntas condicionales se muestren/oculten correctamente.
3. **NO modificar la lógica de `handleSubmit`** ni el mapeo de respuestas a `profileData`. Solo cambiar la UX de navegación entre preguntas.
4. Mantener la compatibilidad con la PWA (safe areas, `100dvh`, etc.).
5. Todas las animaciones deben ser suaves y premium, no exageradas. Duración máxima 500ms para micro-interacciones, 1.5-2s para transiciones de sección.
