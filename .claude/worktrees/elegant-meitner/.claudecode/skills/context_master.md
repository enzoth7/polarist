---
name: context_master
description: mapeo eficiente del repo sin lectura masiva
---

- REGLA DE ORO: Nunca leas un archivo completo si puedes usar Grep para encontrar la función o selector CSS que necesitas.
- Antes de sugerir cambios, usa Glob/Bash ls para entender la jerarquía.
- Si detectas archivos redundantes o assets pesados, repórtalo inmediatamente.
- Para explorar dependencias: leer package.json primero, no node_modules.
- Para entender rutas: leer App.tsx o el router principal, no cada página.
- Para CSS: grep por clase específica antes de abrir el stylesheet completo.
- Prioridad de lectura: index.html > vite.config > tailwind.config > App.tsx > página target.
