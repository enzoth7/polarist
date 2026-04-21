---
name: Supabase Manager
description: Skill para administrar la infraestructura de base de datos de Supabase de manera determinista vía scripts Node/pg.
---

# Supabase Manager Skill

## Propósito
Esta skill contiene scripts y documentación determinista para interactuar con la base de datos PostgreSQL de Supabase. El objetivo es crear, modificar y eliminar tablas, políticas RLS y usuarios sin ensuciar el frontend de React.

## Flujo de Trabajo (Bucle de Mejora Infinita)
1. Escribir script `.js` usando `pg` o `@supabase/supabase-js`.
2. Leer credenciales desde `.env` en la raíz.
3. Ejecutar y verificar salida de consola.

## Memoria Viva (Memoria de Errores)
- **18 Mar 2026**: Creada la estructura base de `skills/tech/supabase_manager`.
- *[Nuevo error irá aquí]*
