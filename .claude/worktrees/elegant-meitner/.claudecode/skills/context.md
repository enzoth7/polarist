---
name: context
description: context master - escaneo eficiente del repo. Nunca leer >200 líneas sin grep previo.
---

## REGLA DE ORO

> Nunca leer un archivo completo si Grep puede encontrar lo que necesitas.

Leer archivos enteros = quemar tokens de entrada = acelerar límite de contexto.

---

## PROTOCOLO DE EXPLORACIÓN

### ANTES de cualquier tarea

```
PASO 1: Glob → entender estructura de carpetas
PASO 2: Grep → encontrar el símbolo/selector/función exacto
PASO 3: Read con offset+limit → leer SOLO las líneas relevantes
PASO 4: Edit → cambio quirúrgico
```

### ORDEN DE LECTURA (de menor a mayor costo)

```
1. package.json          → stack, scripts, deps (siempre leer primero)
2. index.html            → SEO, meta, fonts, entrypoint
3. vite.config.ts        → build config, aliases, plugins
4. tailwind.config.ts    → tokens de diseño, colores, tipografía
5. App.tsx / router      → rutas, layouts, guards
6. [página target]       → solo si es necesario, con offset
```

### REGLAS POR TIPO DE ARCHIVO

**Archivos >200 líneas → PROHIBIDO leer completo sin Grep previo**
```
✅ Grep "NombreComponente" src/ → encontrar línea exacta
✅ Read archivo:línea con limit=50 → leer contexto mínimo
❌ Read archivo completo → solo si realmente necesitas todo
```

**CSS / Tailwind → nunca leer stylesheet completo**
```
✅ Grep "\.clase-objetivo" src/
✅ Grep "background\|color\|font" tailwind.config.ts
```

**Componentes → buscar por export/function name**
```
✅ Grep "export.*NombreComponento" src/components/
✅ Grep "const NombreComponento" src/
```

---

## DETECCIÓN DE PROBLEMAS DE CONTEXTO

Reportar inmediatamente si detectas:

```
[ASSET PESADO]  Imagen >500KB sin optimizar
[REDUNDANCIA]   Dos archivos con >70% código similar
[DEAD CODE]     Export nunca importado (Grep de sus usos)
[BUNDLE RISK]   Import de librería completa cuando solo se usa 1 función
```

---

## COMANDOS RÁPIDOS PARA ESTE REPO

```bash
# Ver estructura sin node_modules
ls src/ && ls src/components/ && ls src/pages/

# Buscar componente
grep -r "export.*NombreComponente" src/components/

# Buscar uso de hook
grep -r "useNombreHook" src/ --include="*.tsx"

# Buscar variable CSS o clase Tailwind
grep -r "clase-objetivo" src/ --include="*.tsx"

# Ver solo imports de un archivo (sin leerlo completo)
grep "^import" src/pages/Landing.tsx
```

---
*Basado en: Claude Code Cheat Sheet (Marzo 2026) + Context Engineering principles*
