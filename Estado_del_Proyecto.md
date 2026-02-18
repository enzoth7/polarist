# Visual Growth System - Project Log & Technical Status

> **Documento Vivo**: Registro de avance, lógica técnica y herramientas.
> **Última Actualización**: 15/02/2026

---

## 1. Stack Tecnológico
*   **Frontend**: React + Vite + TypeScript + Tailwind CSS + Shadcn UI.
*   **Backend/DB**: Supabase (Auth, Postgres DB, Storage, Edge Functions).
*   **Automatización**: n8n (Self-hosted/Cloud).
*   **IA de Imagen**: Freepik API (Modelos: Mystic, Flux).
*   **IA de Texto (Brain)**: Freepik API  (via n8n).

---

## 2. Estado Actual (MVP - 16/02/2026)

### ✅ Completado
*   **Infraestructura**:
    *   Repositorio configurado.
    *   Supabase conectado (Auth + DB + Storage).
*   **Frontend UI**:
    *   **Onboarding**: Formulario funcional que guarda en `profiles`.
    *   **Dashboard**: Vista calendario y "Misión del día".
    *   **Galería**: Sistema de **Campañas** (Carpetas) implementado.
    *   **Upload**: Carga de imágenes a Supabase Storage (`product-images`). -> `mission-uploads` ELIMINADO.
*   **Base de Datos**:
    *   Tablas críticas: `profiles`, `campaigns`, `user_images` (con FK a campañas).

### 🚧 En Proceso / Pendiente (Crítico para MVP)
1.  **Conexión n8n <> Supabase**:
    *   Configurar n8n para escuchar nuevos uploads en Supabase.
    *   Procesar imagen con Freepik API (Upscale/Reimagine).
    *   **Importante**: El resultado debe guardarse como una *nueva fila* en `user_images` con:
        *   `type`: `'enhanced'`
        *   `status`: `'ready'`
        *   `campaign_id`: (Heredado de la imagen original).
2.  **UI Feedback**:
    *   Mostrar indicador de carga mientras la IA procesa.
    *   Notificación visual (Punto Verde) en la campaña cuando llega la imagen mejorada.
3.  **Deploy Final**:
    *   Verificar PWA en móviles reales.

### ❌ Descartado / Pospuesto
*   **Integración Google Drive** (Originalmente planeado, ahora se prioriza flujo directo a Supabase para UX fluida).
*   **Reference Images Table**: Se eliminó la tabla `reference_images`. El estilo por ahora será implícito o seleccionado por prompt simple.

---

## 3. Lógica del Sistema (The "Brain")

### Flujo de Mejora de Imagen (Core Loop)
1.  **Usuario**: Sube foto cruda a la App -> Guarda en Storage + DB (`type='upload'`).
2.  **n8n (Trigger)**: Detecta el insert en `user_images` (o webhook de storage).
3.  **n8n (Action)**:
    *   Descarga la imagen.
    *   Envía a **Freepik API** (Upscale/Reimagine) con prompt base del perfil de marca.
4.  **n8n (Save)**:
    *   Sube la imagen resultante a Supabase Storage (carpeta `/enhanced`).
    *   Inserta fila en `user_images`:
        *   `image_url`: [Nueva URL]
        *   `original_id`: [ID de la foto subida] (Opcional, para trazar linaje)
        *   `campaign_id`: [Mismo que la original]
        *   `type`: `'enhanced'`
5.  **App**: Detecta el cambio (Subscription/Polling) y actualiza la UI.

---

## 4. Herramientas y Recursos
*   **Antigravity**: IDE Principal + AI Agent.
*   **Supabase Dashboard**: Gestión de DB y visualización de datos.
*   **n8n Interface**: Diseño de flujos de automatización.

### 🔌 Conexión a Supabase (Para el Agente)
Para que el Agente ejecute scripts SQL o mantenimientos, debe usar estas credenciales:

**Opción 1: Conexión Directa a Postgres (Recomendada para SQL)**
*   **Connection String**: `postgresql://postgres:Kaiserland1998*@db.epoolgyzovefaofyvocz.supabase.co:5432/postgres`
*   **Uso**: Permite ejecutar comandos `psql` desde la terminal del Agente.

**Opción 2: Supabase API (JS/TS)**
*   **URL**: `https://epoolgyzovefaofyvocz.supabase.co`
*   **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb29sZ3l6b3ZlZmFvZnl2b2N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg1MDk1NywiZXhwIjoyMDg2NDI2OTU3fQ.4ZyVlXkUg0Kx_hTqDKDbaRV7zG0rYmUjLeUpAvomd44`

---

## 5. Reglas de Mantenimiento (OBLIGATORIO) ⚠️
1.  **Sincronización Supabase**: Cada vez que se modifique la estructura de la base de datos (tablas, buckets, políticas), se debe actualizar este archivo reflejando los cambios.
2.  **Registro de Progreso**: Al finalizar una sesión, marcar los pasos completados en la sección "Estado Actual" y mover los pendientes a la siguiente fase si es necesario.
3.  **Limpieza Vertical**: Si una funcionalidad se descarta (ej. `mission-uploads`), eliminar todas sus referencias en código y documentación inmediatamente.
4.  **Despliegue Continuo**: Cada vez que se realicen modificaciones en el código, **SIEMPRE hacer push a GitHub** inmediatamente para que el usuario pueda probar la última versión.

---

## 6. Procedimientos Técnicos (SOPs)

### 🔐 Autenticación Manual NotebookLM (MCP)
Si el comando automático `notebooklm-mcp-auth` falla por conflictos de perfil de Chrome:

1.  **Navegador**: Abre Chrome con el perfil correcto (donde reside el Notebook).
2.  **DevTools**: Ve a `https://notebooklm.google.com/`, presiona `F12` -> Pestaña `Network`.
3.  **Captura**: Recarga la página, busca una petición (ej. `notebooks`), ve a `Headers` -> `Request Headers`.
4.  **Cookie**: Copia todo el string de `cookie: ...`.
5.  **Agente**: Pásale ese string al Agente para que lo guarde manualmente.

---
**Nota**: Mantener este archivo actualizado después de cada sesión de trabajo significativa.
