# Arquitectura Técnica Polarist2 (MVP 72 Horas)

Este plan detalla cómo sacar el producto a la calle en 3 días usando un stack de alta velocidad.

---

## 1. Stack Tecnológico (MVP Frontend)
*   **Frontend / UI:** Vite + React + Tailwind + Componentes UI (shadcn/ui), manteniendo el diseño existente.
*   **Lógica y Desarrollo:** Adaptación iterativa usando la UI funcional en `localhost:8080`.
*   **Database/Backend:** La infraestructura ya integrada (actualmente mockeada o funcionando en Supabase, la cual no debe tocarse).

---

## 2. Lo que TODO debe tener (Features MVP)
1.  **Onboarding de 5 segundos:** Selección de rubro inmediata al entrar.
2.  **Feed de Victorias:** Galería de tarjetas visuales (antes/después) filtradas por rubro.
3.  **Biblioteca de Atajos:** Lista de herramientas con el botón de "Copiar Prompt" (copy-to-clipboard).
4.  **Capa de Comunidad:** Sección de chat por rubro.
5.  **Dashboard de Ahorro Lite:** Contador de "Horas de ego ahorradas" basadas en clics.

---

## 3. Paso a paso de Contenido (72h)

### Día 1: Estructura de Datos (Setup)
*   Adaptar las vistas y componentes a las categorías principales:
    *   `users`: ID, email, rubro.
    *   `items`: Titulo, descripción, link, tipo (herramienta/prompt), rubro_id.
    *   `media`: Imágenes/Videos de las victorias.

### Día 2: Lógica y Conexión
*   **Contenidos Iniciales:** Llenar el catálogo de herramientas y "Prompts del Día" para cada rubro desde el frontend.

### Día 3: Seed de Contenido y Test
*   **Carga Cruda:** Meter las primeras 10 herramientas y 10 prompts manualmente en la UI.
*   **Validación Chat:** Probar que el flujo básico de los chats funcione u ofrezca la experiencia prometida.

---

## 4. Pipelines y Curaduría

### Pipeline de Desarrollo
*   **Iteración rápida:** Basarnos en el diseño de `localhost:8080` y corregir bugs visuales.

### Automatización de Contenido (Content Pipeline)
*   **Monitoreo:** Curar newsletters y canales de IA manualmente para seleccionar los 5 mejores, luego subirlos a la app.
*   **Notificador:** Sistema simple que mande una notificación o muestre un highlight cuando se agregue una herramienta nueva al rubro del usuario.

### Pipeline de Verificación
*   **Vercel/Netlify Deployment:** Para que la app esté online segundo a segundo mientras se edita.

---

## 5. Cronograma de Energía (Total 72h)
*   **Día 1 (8hs):** Estética en Lovable + Esquema en Supabase.
*   **Día 2 (8hs):** Integración Backend y Lógica de "Copiar Atajo".
*   **Día 3 (8hs):** Curaduría de los primeros 10 contenidos + Publicación.
*   **Foco diario:** 4h de construcción técnica + 2h de curaduría de contenido.

---
**Veredicto:** Si respetas este stack, no hay razón para tardar más de 3 días. El 90% del trabajo lo hace Lovable y Supabase; tu trabajo es **vibrar con el contenido y la comunidad.**
