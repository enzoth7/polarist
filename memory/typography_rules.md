---
name: Reglas tipográficas Polarist
description: Jerarquía tipográfica oficial del Brand Kit — qué fuente usar según el rol del texto
type: project
---

# Jerarquía tipográfica (Brand Kit Polarist)

Definida por Enzo el 2026-04-24 a partir del cuaderno "Combinación Tipográfica" del Brand Kit visual (`polarist/Brand Kit/BrandKit.jpeg`).

| Rol | Fuente | Archivo |
|-----|--------|---------|
| **TITULAR** | Arno Pro | `ARNO PRO/ArnoPro-LightDisplay.otf` (y variantes) |
| **SUBTITULAR / ÉNFASIS** | Sequel Sans Bold | `SEQUEL SANS/Sequel Sans Bold Body.ttf` |
| **CUERPO DE TEXTO (base)** | **Sequel Sans Regular** | `SEQUEL SANS/Sequel Sans Roman Body.ttf` (Roman = Regular) |

## Regla de oro
Todo lo que NO sea título (Arno Pro) o énfasis puntual (Sequel Sans Bold) va en **Sequel Sans Regular**. No mezclar Book, Light, Medium, Semi Bold en el cuerpo base.

**Why:** Enzo lo definió explícitamente — quiere coherencia absoluta en el cuerpo del texto, evitando la dispersión de pesos intermedios que había en el HTML anterior (`Polarist_BrandKit_B_Sutil.html`).

**How to apply:** Al generar HTML/CSS o cualquier plantilla del brand kit, al sitio Polarist, materiales impresos, o contenido digital: el `body` y cualquier elemento genérico (párrafos, labels, captions, descripciones, notas al pie) debe usar Sequel Sans Regular/Roman (weight 400). Solo desviarse cuando sea explícitamente un título (→ Arno Pro) o un énfasis estructural (→ Sequel Sans Bold).

## Nota sobre archivos
- "Sequel Sans Regular" = **`SEQUEL SANS/Sequel Sans Roman Body.ttf`** (confirmado por Enzo 2026-04-24). Mapear a `font-weight: 400` en CSS.
