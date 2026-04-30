# MEMORIA
> Leer al inicio de cada sesión (obligatorio). Actualizar en el momento cuando Enzo corrige algo, enseña una preferencia o pide recordar algo. También al cerrar sesión. Fecha en cada entrada.

## Decisiones tomadas
- 2026-04-24 — Jerarquía tipográfica del Brand Kit definida: Arno Pro (titulares) · Sequel Sans Bold (subtítulos/énfasis) · **Sequel Sans Regular (base, todo el resto)**.
- 2026-04-24 — **Estilo de Layout**: Carruseles horizontales tipo "Streaming" (Netflix/Warzone) para herramientas. Cards tipo "posters" verticales de 24px de radio.
- 2026-04-24 — **Paleta Oficial**: `#010101` (Fondo), `#F6F6F6` (Texto), `#CAFE5B` (Acento).
- 2026-04-30 — Fusionados cambios de Cristian desde `feat/community-spotlight-effect` a `main`. Rama extra eliminada del repositorio remoto.
- 2026-04-30 — **Actualización de Metadata y Assets**: Limpieza de favicons antiguos en `/public`, actualización de `index.html` y `sitemap.xml` con el nuevo logo (`Polarist_logo.png`) y fechas actuales. Reconstrucción de la carpeta `dist`.
- 2026-04-30 — **Integración de Eventos**: Vinculación relacional establecida en Supabase entre `community_registrations` y `polarist_usuarios` vía `user_id`. Implementado soporte para visualización de eventos en la Library por Email y ID de usuario.
- 2026-04-30 — **Gestión de Timezones**: Forzado el uso de `America/Montevideo` en Edge Functions para asegurar que los correos automáticos reflejen la hora de Uruguay (UTC-3).

## Patrones encontrados
- Para consultas complejas de Supabase que involucran caracteres especiales (ej: emails en `.or()`), es obligatorio envolver los valores en comillas dobles (`"email.eq.\"${email}\""`) para evitar errores de PostgREST.
- El usuario prefiere el **espacio en blanco (whitespace)** sobre los contenedores físicos. Menos cajas, más aire.
- Estructura Hero: Un banner dominante tipo "Warzone" para el impacto inicial.

## Errores a no repetir
- **NO** usar fondos claros o grises (Brand Kit B es estrictamente Dark).
- **NO** anidar contenedores ni usar spans innecesarios ("spam visual").
- **NO** alinear todo a la izquierda en formato lista simple; usar carruseles horizontales con navegación.

## Contexto acumulado
- Polarist Brand Kit B: Sutil es la constitución visual del proyecto.
