# Workflow: Crear Componente Premium

Sigue estos pasos para asegurar que cada nuevo componente en Polarist cumpla con los estándares de diseño del Agente de Diseño.

## Paso 1: Definición de Estructura (Semantic HTML)
Usa elementos semánticos de HTML5. Todo componente interactivo debe tener un ID único y descriptivo.

## Paso 2: Aplicación de Tokens
No uses valores "hardcoded". Referencia siempre los tokens de `DESIGN.md`.
- **Colores**: Siempre usar variables CSS definidas en el sistema.
- **Bordes**: Usar `var(--r-lg)` para contenedores Bento.

## Paso 3: El Efecto "Glass"
Para fondos de tarjetas o menús:
```css
background: rgba(255, 255, 255, 0.02);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

## Paso 4: Micro-interacciones
Añade transiciones suaves (0.4s cubic-bezier(0.16, 1, 0.3, 1)).
- Hover: Escala sutil (1.02) y aumento de brillo en el borde.

## Paso 5: Validación
- Revisa el contraste del texto sobre el fondo.
- Asegúrate de que el componente sea responsivo y se adapte a diferentes tamaños de pantalla.
