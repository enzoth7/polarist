# MANIFIESTO VISUAL Y ESTÉTICO DE POLARIST
> ⚠️ **REGLA ESTRICTA PARA CODEX / AGENTES AI** ⚠️
> Este archivo es la "Constitución Visual" del proyecto.
> **BAJO NINGUNA CIRCUNSTANCIA** debes modificar, sobrescribir ni alterar los colores base definidos en `src/index.css`. Tu obligación es reciclar estos tokens exactos.

## 1. La Paleta de Colores Oficial ("Neon & Cream")
La app debe transmitir velocidad y modernidad. Usa estos tokens de la variable `--*`:
- **Background (Crema):** `bg-background` (hsl: `39 27% 94%`)
- **Foreground (Texto):** `text-foreground` (hsl: `34 3% 12%`)
- **PRIMARIO (Amarillo Neón):** `bg-primary` (hsl: `69 100% 50%`). *Para botones principales (CTA).*
- **SECUNDARIO (Morado Eléctrico):** `bg-secondary` (hsl: `247 50% 57%`). *Para destacar etiquetas y adornos.*
- **ACENTO (Naranja Intenso):** `bg-accent` (hsl: `13 100% 58%`). *Para las "Victorias".*
- **Bordes suaves y Radio:** `.rounded-2xl` o `rounded-xl`. Todo orgánico.

## 2. Sombras Suaves (Efecto Flotante)
No utilices el `shadow-md` tradicional. Usa las clases personalizadas:
- **`shadow-soft`**: Elementos flotantes sutiles.
- **`shadow-card`**: Tarjetas principales del feed (efecto de profundidad premium).

## 3. Micro-Interacciones
- **Fade In:** `animate-fade-in` (Contenedores que cargan).
- **Slide Up:** `animate-slide-up` (Tarjetas de feed).
- **Check Bounce:** `animate-check-bounce` (Efectos de copiado/éxito).

## 4. Estilos de Tipografía
- **Fuente Principal:** `font-sans` (Inter).
- Títulos: Llevan la clase `@apply font-semibold tracking-tight;`.

## 5. REGLA SUPREMA: ANTI-CONTENEDORES (Minimalismo Plano)
- **ODIAMOS EL EXCESO DE CONTENEDORES.** 
- **Prohibido anidar cajas dentro de cajas dentro de cajas.** 
- No uses bordes grises duros ni encierres todo en cuadrados delimitados innecesarios.
- Permite que el contenido "respire" directamente sobre el color de fondo (`bg-background`). Las separaciones deben darse por el **espacio en blanco (whitespace)** y agrupaciones de tipografía, NO por líneas, filetes ni contenedores excesivos. Un diseño chato, espacioso y limpio como Apple es mandatorio. Si tienes la duda de ponerle un borde a una caja, bórralo.
