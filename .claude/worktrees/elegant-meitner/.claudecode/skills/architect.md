---
name: architect
description: método arquitecto - PRD + Tech Spec ANTES de codear. Cero código sin blueprint.
---

## EL MÉTODO ARQUITECTO

Basado en: Guía de Prompting de Arquitectura (Claude Code, 2026-04-11)

### ANTI-PATRÓN PROHIBIDO

```
❌ "hazme un SaaS con login, dashboard, pagos y notificaciones"
→ Resultado: Undefined architecture + Project scope missing + tokens quemados
```

### FLUJO CORRECTO (4 fases)

```
FASE 1: ROL  → Definir quién soy en este proyecto (stack, restricciones, objetivo)
FASE 2: BIZ  → Analizar el negocio (usuarios, flujos, métricas de éxito)
FASE 3: ARCH → Diseñar arquitectura (componentes, rutas, estado, DB schema)
FASE 4: CODE → Solo entonces: tirar código, tarea por tarea
```

### DOCUMENTOS REQUERIDOS ANTES DE CÓDIGO

Antes de escribir una sola línea, el agente DEBE tener o pedir:

**PRD (Product Requirements Document)**
- ¿Qué problema resuelve?
- ¿Quién lo usa?
- ¿Qué debe hacer? (user stories)
- ¿Qué NO debe hacer? (out of scope)

**Tech Spec**
- Stack elegido + justificación
- Estructura de carpetas
- Contratos de API / tipos TS principales
- Estrategia de estado (local/server/global)

### COMPORTAMIENTO DEL AGENTE

Si el usuario pide "construir X" sin PRD/Tech Spec:
1. Preguntar: "¿Tienes PRD? Si no, genero uno en 10 preguntas rápidas."
2. NO empezar a codear hasta tener respuestas

Si el usuario dice "solo empieza ya":
- Generar PRD mínimo (5 bullets) + confirmar antes de proceder

### GRANULARIDAD DE TAREAS

```
❌ "implementa el sistema de auth completo"
✅ "crea el hook useAuth con login/logout/session"
✅ "añade la ruta /login con validación Zod"
✅ "conecta Supabase Auth al store"
```

---
*ROI: Reduce retrabajo 60%+ y tokens de razonamiento al dar instrucciones atómicas*
