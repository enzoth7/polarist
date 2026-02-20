# Prompt para Refactorización de Onboarding con Codex

Copia y pega el siguiente texto en Codex (o el chat del agente en VS Code) teniendo abiertos los archivos `src/pages/Onboarding.tsx` y `Cuestionario.md`:

---

**PROMPT PARA CODEX:**

"Actúa como un experto en React y TypeScript. Necesito refactorizar `src/pages/Onboarding.tsx` para reemplazar el cuestionario viejo por el nuevo definido en `Cuestionario.md`.

**Requerimientos:**
1.  **Carga de Preguntas**: Lee `Cuestionario.md` y actualiza la constante `QUESTIONS` en `Onboarding.tsx`. Asegúrate de formatear cada pregunta con su `id`, `category`, `text`, `description` y `options` siguiendo la interfaz existente.
2.  **Lógica de Ramificación (Branching)**: 
    *   En la pregunta "¿Con respecto al color, ¿Tienen una paleta de color definida?" (Línea 133 de `Cuestionario.md`):
        *   Si el usuario selecciona la Opción A ("Si, ya tengo una paleta..."), el flujo continúa normalmente a la siguiente pregunta general.
        *   Si selecciona Opción B o C, se debe mostrar una pregunta adicional intermedia: "¿Con cuáles colores identifica tu marca?" antes de seguir con el resto.
3.  **Persistencia de Datos**: 
    *   En lugar de guardar cada respuesta en una columna individual de la tabla `profiles` (como `goal`, `personality`, etc.), guarda el cuestionario completo como un array de objetos JSON en la columna `brand_questionnaire` (tipo JSONB en Supabase).
    *   Cada objeto en el array debe tener el formato `{ question_id: number, question_text: string, answer: string }`.
    *   **Mapeo de Compatibilidad**: Para mantener el Dashboard funcionando, identifica la respuesta a la pregunta "¿Cuál es su prioridad principal en redes sociales ahora?" (Línea 100) y asígnala también a la columna `goal`. Identifica la respuesta a "¿Cómo te gustaría que las personas perciban tu marca?" (Línea 144) y asígnala a la columna `personality`.
4.  **UI/UX**: Mantén los componentes de UI (`Button`, `Progress`, etc.) y las animaciones existentes, pero ajusta el cálculo de progreso para que sea dinámico basado en las preguntas respondidas (incluyendo la potencial pregunta extra).
5.  **Hooks**: Asegúrate de actualizar el llamado a `updateProfile` de `useBusinessProfile` para reflejar la nueva estructura de datos.

Revisa los archivos seleccionados y genera el código refactorizado completo."
