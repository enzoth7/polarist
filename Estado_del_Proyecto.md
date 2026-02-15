# Estado del Proyecto: Visual Growth System (Marketing App)
**Fecha:** 15/02/2026

## 1. Visión Técnica
App de Marketing para crear contenido visual.
*   **Frontend:** React + Vite + Typescript + Shadcn UI.
*   **Backend:** Supabase (Auth, DB, Storage).
*   **Deployment:** Vercel.

## 2. Estado Actual (Lo que funciona)
### Autenticación & DB
*   **Auth:** Login/Signup con Supabase Auth.
*   **Tablas:**
    *   `profiles` (Datos del usuario y del negocio).
    *   `campaigns` (Carpetas organizadoras). -> **NUEVO**
    *   `user_images` (Fotos subidas y resultados finales). -> **MODIFICADO**
    *   **ELIMINADO:** `reference_images` (ya no se usa).
*   **Storage:** Bucket `product-images` (Público).

### Funcionalidades
*   **Onboarding:** Formulario de perfil de negocio (guarda en `profiles`).
*   **Galería (Nueva):**
    *   Sistema de **Campañas** (Carpetas).
    *   Vista Lista: Muestra campañas con **Notificación de "Punto Verde"** si hay contenido nuevo (`type='enhanced'`).
    *   Vista Detalle: Muestra imágenes subidas ("PROD") y resultados ("NUEVA").
    *   **Lógica de Subida:** Las imágenes subidas se guardan con `type='upload'` y `status='ready'`.

## 3. Lógica Clave (Para n8n / Backend)
**Objetivo Fase 5 (Siguiente Paso):** Automatizar la mejora de imágenes.

**Flujo:**
1.  **Trigger:** Nueva imagen en bucket `product-images` (o fila nueva en `user_images` con `type='upload'`).
2.  **Proceso:** Enviar a API de IA (Freepik/Midjourney) para mejorar.
3.  **Output (CRÍTICO):** Guardar el resultado en `user_images`.
    *   `user_id`: El mismo del usuario.
    *   `image_url`: La URL del resultado.
    *   `type`: **'enhanced'** (Esto activa el punto verde y la sección "Nuevas").
    *   `status`: **'ready'**.
    *   **`campaign_id`**: **DEBE COPIARSE DE LA IMAGEN ORIGINAL**. (La IA debe leer el ID de campaña de la fila original y ponérselo a la nueva).

## 4. Próximos Pasos (Pendientes)
*   [ ] **Configurar n8n:** Crear el workflow que escuche Supabase y procese las imágenes.
*   [ ] **Integrar API Freepik:** Usar para "Reimagine" o "Upscale".
*   [ ] **Testing Automático:** Verificar que el flujo completo (Subida -> n8n -> Galería) funcione sin intervención manual.

## 5. Referencias
*   `task.md`: Lista detallada de tareas.
*   `src/pages/Gallery.tsx`: Lógica del frontend.
*   `supabase/migrations`: Scripts SQL ejecutados (ver `fix_schema_safe.sql`, `migrate_legacy.sql`).
