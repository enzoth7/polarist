LOGOS DE PROVEEDORES DE IA — Polarist
======================================

Carpeta: public/logos/ai/

Colocá acá los logos de cada proveedor con exactamente estos nombres de archivo.
El sistema los carga automáticamente según el modelo que muestra la gráfica.

ARCHIVOS ESPERADOS
------------------
openai.png      → Logo de OpenAI       (GPT-4o, GPT-4.1, o1, o3, o4, gpt-oss…)
anthropic.png   → Logo de Anthropic    (Claude 3.5, 3.7, Sonnet 4, Opus 4…)
google.png      → Logo de Google       (Gemini 1.5, 2.0, 2.5, Gemma…)
deepseek.png    → Logo de DeepSeek     (DeepSeek-*)
xai.png         → Logo de xAI          (Grok-*)
meta.png        → Logo de Meta         (Llama-*)
nvidia.png      → Logo de NVIDIA       (Nemotron-*, nvidia-*)
mistral.png     → Logo de Mistral      (Mistral-*, Mixtral-*)
alibaba.png     → Logo de Alibaba      (Qwen-*)
cohere.png      → Logo de Cohere       (Command-*, Aya-*)
kimi.png        → Logo de Kimi         (Kimi-*, Moonshot AI)
muse.png        → Logo de Muse         (Muse-*)

zhipu.png       → Logo de Zhipu AI    (GLM-*)

NOTAS
-----
- Formato recomendado: PNG con fondo transparente, mínimo 64×64 px.
- El sistema muestra la imagen dentro de un rect de 14×14 px en el SVG del gráfico.
  Para máxima nitidez usá imágenes cuadradas @2x o @3x (ej: 128×128).
- Si un archivo no existe, la gráfica muestra las 2 primeras letras del proveedor
  como texto de fallback — no hay error en pantalla.
- Para agregar un proveedor nuevo: añadí la entrada en src/lib/modelIcons.ts
  y colocá el archivo PNG acá con el mismo slug.
