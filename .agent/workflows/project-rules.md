---
description: Project-wide rules for Polarist
---
# Polarist - Project Rules

## ⛔ PROHIBIDO: localStorage
**NUNCA usar `localStorage`** en ningún archivo del proyecto. Todos los datos del usuario deben venir y guardarse exclusivamente en **Supabase**.

- No usar `localStorage.setItem()`
- No usar `localStorage.getItem()`
- No usar `sessionStorage`
- El estado de la aplicación debe inicializarse desde Supabase al montar
- Si el usuario no está autenticado, redirigir a `/login`

## Fuente de Verdad
- **Supabase** es la única fuente de verdad para datos de usuario
- El estado local (React state) es solo un caché temporal del dato de Supabase
- Al iniciar sesión, se hace `fetchProfile()` desde Supabase
- Al cambiar de sesión (`onAuthStateChange`), se re-fetcha automáticamente

## Elementos HTML Restringidos
- **NUNCA usar `<span />`** ni contenedores inline similares en la página. Usa etiquetas estructurales como `<div>` o `<p>` y estiliza como `display: inline` si es absolutamente necesario.

## ⛔ PROHIBIDO: Subir código a otras ramas (GitHub)
- **ESTÁ TOTALMENTE PROHIBIDO crear o hacer `push` a ramas que no sean `main`.**
- El desarrollo se realiza en equipo, por lo que para evitar desactualizaciones y mantener la sincronización con los socios, el comando `git push` SIEMPRE debe realizarse única y exclusivamente sobre la rama `main`.
- Si estás en otra rama, debes cambiar a `main`, hacer pull, fusionar tus cambios, y luego hacer push a `main`.
