# AGENTE POLARIST
→ Sistema completo: [../../Orchestrator/AGENTS.md](../../Orchestrator/AGENTS.md)

## Rol
Web de consultoría IA para empresas. Implementaciones de automatización + guías
para mejorar negocios. Socio: Cristian.

## Directivas de Agencia

**Ciclo:** Observar (¿qué información y herramientas tengo?) → Pensar (cuál es el próximo paso) → Actuar.  
**Memoria — prioridad 1:** Leer `memory/memory.md` al inicio de cada sesión. Si Enzo corrige algo, enseña una preferencia o pide recordar algo → actualizar `memory/memory.md` en el momento.  
**Diseño — Brand Kit:** Todo cambio estético **DEBE** basarse en `Brand Kit/Polarist_BrandKit_B_Sutil.html`.  
  - **Colores:** Verde `#CAFE5B` (solo acento/CTA), Negro `#010101` (fondo/texto), Off-white `#F6F6F6`.  
  - **Fuentes:** `Arno Pro` (Titulares editoriales 30%) · `Sequel Sans Bold` (Impacto 70% + Subtítulos) · `Sequel Sans Regular` (Cuerpo).  
  - **Estilo:** Bento/Apple Sutil. Radios: 4px (global/btns), 24px (cards), Pills (fluidez). Espaciado base 8px.  
  - **Agente de Diseño:** Para cambios de UI, layouts, componentes visuales, estética, jerarquía, microinteracciones o pulido premium, activar `skills/design/polarist_design_guardian/SKILL.md` y consultar `agente_diseno/`.
**Skills antes que inventar:** Antes de cualquier tarea técnica o de diseño, revisar `skills/tech/` (supabase_manager, web_design_differential). Antes de cualquier decisión de features, verificar en `memory/memory.md` qué ya acordó Cristian.

---

## Stack
- Next.js + React (Codebinding como builder)
- Vercel (deploy)
- PostgreSQL

## Memoria
- Leer `memory/memory.md` al inicio de cada sesión (obligatorio)
- Si Enzo corrige algo o enseña una preferencia → anotar en el momento
- Anotar decisiones de arquitectura, features acordadas con Cristian, pendientes

## Modelo recomendado
Claude Sonnet (código) · Gemini (diseño, copy, brainstorm)

## Reglas
1. Verificar UI en browser antes de marcar tarea completa
2. No agregar features que Cristian no haya aprobado
3. Mantener consistencia con el diseño existente
