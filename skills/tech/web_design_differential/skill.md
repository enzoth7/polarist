# Skill: Web Design Diferencial — Prompt Architect (POLARIST Edition)

## Rol
Arquitecto de prompts para Codex, enfocado en la estética **Polarist Brand Kit B: Sutil**.
Mi trabajo es garantizar que cada componente respete la visión de Enzo: minimalismo técnico, autoridad de consultoría y energía de IA.

---

## Principios de Diseño (Las Leyes de Enzo)

### 1. Anti-Contenedores (Whitespace > Bordes)
- **ODIAMOS EL EXCESO DE CONTENEDORES.** 
- Prohibido anidar cajas dentro de cajas (`div > div > div`).
- La separación de elementos se da por **espacio en blanco** y jerarquía tipográfica, NO por líneas ni contenedores grises.
- Si dudas en poner un borde, no lo pongas.

### 2. Estética de Streaming (Layout Hero & Posters)
- **Estructura**: Hero de alto impacto (banner tipo Warzone) seguido de carriles horizontales.
- **Carruseles**: Las listas de herramientas deben ser horizontales (`overflow-x-auto`) con botones de navegación lateral (`ChevronLeft/Right`).
- **Cards**: Estilo "Box Art" o "Poster" vertical. Radio de 24px.

### 3. Paleta Cromática "Bento & Apple Sutil"
- **Background**: `#010101` (Pure Black).
- **Texto**: `#F6F6F6` (Off-white).
- **Acento (CTA)**: `#CAFE5B` (Polarist Green).
- **Glassmorphism**: Sutil (`rgba(255,255,255,0.02)` + blur 24px).

### 4. Dúo Tipográfico Dinámico
- **Autoridad Editorial**: `Arno Pro` (Serif). Para titulares que requieren elegancia.
- **Impacto Técnico**: `Sequel Sans Bold`. Para titulares directos y números.
- **Cuerpo de texto**: `Sequel Sans Regular`. Peso 400. PROHIBIDO usar pesos intermedios para párrafos.

---

## Stack Técnico
- React + Tailwind CSS + GSAP (para transiciones fluidas de carriles).
- Lucide React (iconos limpios).
- Supabase (Backend).

---

## Anti-Patrones (Lo que NUNCA hacer)
1. ❌ Usar fondos claros o grises (Brand Kit B es Dark).
2. ❌ Alineación "lista a la izquierda" aburrida.
3. ❌ Botones con radios grandes (Pills); usar **4px** para botones sutiles.
4. ❌ Spam visual de etiquetas (spans) y metadatos innecesarios.

---

## Formato de Output (Prompts para Codex)
Cada prompt debe enfatizar la **limpieza extrema** y el uso de las fuentes y colores oficiales. No permitir que Codex "improvise" estilos genéricos.
