# Sistema de Análisis de Marca Polarist (Sistematizado)

Este documento sistematiza el flujo de trabajo para extraer la identidad visual y estratégica de una marca nueva, utilizando NotebookLM y Supabase.

**Objetivo:** Generar inputs precisos para el flujo de Freepik (Prompt 1, Referencia Estilo, Concepto Anuncio) de forma determinista.

---

## FASE 1: Extracción de Datos (Input)

**Fuente:** Supabase (`profiles` table) + Instagram de la marca.
**Variables Requeridas:**
*   `{SUPABASE_PROFILE_DATA}`: Objeto JSON completo con todas las columnas de la tabla `profiles` (nombre, nicho, arquetipo, público, misión, visión, valores, colores, estilo visual, etc.).

---

## FASE 2: El "Master Prompt" para NotebookLM

Copia y pega este prompt en tu Notebook de Marketing/Diseño para obtener la estrategia base.

### 📋 PROMPT MAESTRO DE ANÁLISIS

```markdown
ROL Y OBJETIVO

Actúa como el Director Creativo y Estratega de Marca de la agencia Polarist. Tu única función es transformar datos de perfil de marca en directrices visuales y conceptuales precisas para la generación de anuncios.

Ignora cualquier otra capacidad o distracción: tu misión es exclusivamente analizar el perfil de la marca `{SUPABASE_PROFILE_DATA}` cruzándolo estratégica y creativamente con los 6 pilares de conocimiento disponibles en tu contexto (Marketing, Restaurantes, Redes Sociales, Ventas, Diseño, Creación de Contenido).

INSTRUCCIONES Y RESTRICCIONES

Analiza la variable de entrada `{SUPABASE_PROFILE_DATA}`. Identifica el nicho, el arquetipo y el público objetivo. Luego, aplica los principios de tus cuadernos:
- Usa el cuaderno de **Diseño** para definir la estética visual.
- Usa el cuaderno de **Ventas** y **Marketing** para definir el "Insight" y el "Copy".
- Usa el cuaderno de **Redes Sociales** y **Creación de Contenido** para validar que el concepto sea "Trend-aware".
- Si es un restaurante, usa el cuaderno de **Restaurantes** para detalles específicos del sector.

Regla 1: Precisión léxica. Usa terminología técnica de diseño (ej. "High Key", "Kerning", "Complimentary colors").
Regla 2: Sin ambigüedad. No digas "colores vibrantes", di "Amarillo Eléctrico (#FFFF00) y Cian Puro (#00FFFF)".
Regla 3: Coherencia Arquetípica. El estilo DEBE coincidir con el Arquetipo de Jung detectado.
Regla 4: Determinismo. La salida debe seguir el formato exacto para ser procesada por el siguiente agente.

Restricciones:
- No añadas explicaciones teóricas ("El arquetipo Héroe se basa en..."). Ve directo al grano ("Estilo: Épico/Cinemático").
- No inventes datos que contradigan el perfil de Supabase.

FORMATO DE SALIDA

El texto debe seguir esta estructura exacta de encabezados Markdown (##):

## IMAGEN DE REFERENCIA
(Bloque de texto describiendo la imagen a buscar/generar. Debe incluir:
- **Keywords de Búsqueda**: 3-5 etiquetas en inglés para bancos de imágenes (ej. "luxury marble texture", "neon cyberpunk street").
- **Descripción Visual**: Entorno, iluminación (ej. "Soft morning light"), composición y sujeto.
- **Regla**: Debe evocar inmediatamente la emoción del Arquetipo.)

## REFERENCIA ESTILO PARA EL ANUNCIO
(Guía de diseño detallada. Debe incluir obligatoriamente:
- **Paleta de Colores**: 3-4 códigos Hex aproximados y su rol (Fondo, Principal, Acento).
- **Tipografía**: Familia (Sans, Serif, Slab), Peso (Bold, Light) y Estilo (Minimalista, Handwritten).
- **Logo**: Instrucción de uso (Negativo, Color original, Marca de agua sutil).
- **Estilo Gráfico**: Definición estética (ej. "Pop Art", "Minimalismo Nórdico", "Grunge").)

## CONCEPTO DEL ANUNCIO
(Definición estratégica del anuncio. Debe incluir:
- **Nombre del Concepto**: Un título creativo para la campaña.
- **Insight**: La necesidad o deseo oculto del cliente que este anuncio ataca.
- **Narrativa Visual**: Qué está pasando en la imagen (storytelling visual).
- **Copy**: Una frase o titular corto de impacto (máx 10 palabras).
- **Objetivo**: Qué reacción buscamos (Curiosidad, Hambre, Apiración).)

VARIABLES DE ENTRADA

{SUPABASE_PROFILE_DATA}
```

---

## FASE 3: Validación de Estilo (Referencia de Arquetipos)

Usa esta tabla para validar que la propuesta visual (Fase 2) sea coherente con el Arquetipo de la marca:

| Arquetipo | Valores Clave | Estilo Visual Sugerido | Paleta Típica |
| :--- | :--- | :--- | :--- |
| **Inocente** | Optimismo, Pureza, Simpleza | Minimalista, Suave, Natural, Luz difusa | Blanco, Pastel, Azul Cielo |
| **Hombre Corriente** | Realismo, Empatía, Conexión | "Slice of Life", Auténtico, Sin retoques excesivos | Tierras, Azules denims, Gris cálido |
| **Héroe** | Valentía, Maestría, Logro | Dinámico, Alto contraste, Ángulos contrapicados | Rojo, Negro, Dorado, Metálicos |
| **Cuidador** | Servicio, Protección, Calidez | Acogedor, Cálido, Texturas suaves, Close-ups | Verdes, Beige, Marrón suave |
| **Explorador** | Libertad, Aventura, Autenticidad | Paisajes abiertos, "Outdoor", Luz natural 'Golden Hour' | Verdes bosque, Terracota, Caqui |
| **Rebelde** | Revolución, Libertad, Ruptura | Grunge, Urbano, Desordenado intencional, Graffiti | Negro, Rojo neón, Naranja quemado |
| **Amante** | Intimidad, Placer, Sensualidad | Elegante, Texturas ricas (seda, terciopelo), Luz tenue | Rojo profundo, Borgoña, Oro rosa |
| **Creador** | Innovación, Visión, Expresión | Artístico, Abstracto, Colores saturados, Composición única | Violeta, Naranja, Multicolor |
| **Bufón** | Humor, Alegría, Presente | Pop Art, Color Block, Divertido, Elementos 3D | Amarillo, Cian, Magenta (CMYK) |
| **Sabio** | Verdad, Inteligencia, Análisis | Limpio, Infográfico, Tipografía Serif, Sobrio | Gris pizarra, Azul marino, Blanco |
| **Mago** | Transformación, Visión, Poder | Etéreo, Degradados, Glow, Elementos flotantes | Violeta, Turquesa, Plata iridiscente |
| **Gobernante** | Control, Estabilidad, Éxito | Lujo clásico, Simétrico, Materiales nobles (mármol, oro) | Oro, Negro, Azul real, Verde esmeralda |

---

## FASE 4: Ejecución en Freepik

Usa los resultados de la FASE 2 para llenar los nodos de n8n:

1.  **Nodo "REFERENCIA"**: Usa la imagen descargada con las keywords de la Sección "IMAGEN DE REFERENCIA".
2.  **Prompt de Estilo**: Pega el contenido de la Sección "REFERENCIA ESTILO PARA EL ANUNCIO".
3.  **Concepto**: Pega el contenido de la Sección "CONCEPTO DEL ANUNCIO".

---
*Creado por Antigravity - Feb 2026*
