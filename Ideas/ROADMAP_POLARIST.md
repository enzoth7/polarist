# ROADMAP DE POLARIST (Backlog)

Este documento centraliza las directivas de producto a corto y mediano plazo.

## PENDIENTES DE NAVEGACIÓN & GLOBAL (UX)
- [x] **Footer Global:** Estructura en 3 líneas (Logo/Slogan, Links, Copyright). Rediseñado y compacto.
- [ ] **Header Persistente:** Modificar `Header.tsx` para que el logo sea visible en móvil y esté presente en las rutas legales (`/terms`, `/privacy`, `/contact`).
- [ ] **Redirección de Logo:** El logo debe redirigir dinámicamente: si hay sesión -> `/app/radar`, si no -> `/`.
- [ ] **Limpieza de Menú:** Eliminar acceso a "Prompts" (Shortcuts) del Header y MobileNav. Renombrar acceso móvil a "Top".

## REDISEÑO DEL RADAR (Dashboard Principal)
- [ ] **Hero Carousel:** Usar componente `Carousel` de shadcn con imágenes grandes y texto a la izquierda (Noticias IA).
- [ ] **Comunidades de Nicho:** Carrusel horizontal de Avatares Circulares Grandes (Estilo Stories) con navegación por flechas (sin barras de scroll).
- [ ] **Herramientas de IA:** Añadir botón "Ver más" que conecte al ranking completo.
- [ ] **Conversión Final:** Sección centrada y minimalista "¿Por dónde empezar?" con botón único "Comenzar".

## PENDIENTES DE BACKEND (Supabase)
> [!IMPORTANT]
> **Estado Actual:** La lógica de usuarios y autenticación aún NO ha sido implementada físicamente en el flujo de navegación.

- [ ] **Autenticación Real:** Implementar el flujo de login/signup con Supabase Auth.
- [ ] **Simplificación de Perfil (`Profile.tsx`):** Reducir a:
  1. Identidad (Foto, Nombre, Ocupación).
  2. Tu biblioteca.
  3. Configuración (Actualización de datos).
  4. Cerrar sesión.
- [ ] **Scripts de Sincronización:** Conectar el formulario de configuración para escribir y sobreescribir datos en la tabla `polarist_usuarios` desde el frontend usando `@supabase/supabase-js`.

## EDUCACIÓN & CONTENIDO
- [ ] **Módulo `ConceptosBasicos`:** Diccionario interactivo y amigable (12 términos).
- [ ] **Módulo `HistoriaIA`:** Timeline visual (1950 - Hoy).

## ESCALABILIDAD (El Motor Autónomo)
- [ ] **Pipeline de Auto-Curaduría (n8n):** Scraping semanal -> Filtrado OpenAI -> Inyección Supabase.

