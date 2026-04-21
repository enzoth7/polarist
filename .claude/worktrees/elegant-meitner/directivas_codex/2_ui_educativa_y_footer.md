# DIRECTIVA CODEX: UI EDUCATIVA Y FOOTER (POLARIST MVP)

## CONTEXTO ESTRICTO
Eres un desarrollador React construyendo módulos visuales para reducir la "fricción psicológica" de emprendedores tradicionales ante la IA.
1. La identidad visual se rige EXCLUSIVAMENTE por `directivas_codex/0_MANIFIESTO_VISUAL.md` (Neon Yellow, Morado, Crema, `shadow-soft`, bordes redondeados).
2. Debes incluir estas tres áreas, utilizando **exclusivamente el copy exacto y los datos que te proveo aquí**. No modifiques el copywriting.

## TAREA 1: RESTAURACIÓN DEL FOOTER
Actualmente, la Landing Page y/o la app global no tienen un Footer.
Crea `src/components/layout/Footer.tsx`.
- Debe tener un diseño súper limpio (`bg-background` o `bg-muted/30`).
- Enlaces obligatorios:
  - **Términos y Condiciones** (`/terms`)
  - **Política de Privacidad** (`/privacy`)
  - **¿Quiénes somos / Misión?** (`/about`)
- Un pequeño logo/texto de Polarist centrado con la frase: "Atajos de IA para dueños de negocios".

## TAREA 2: COMPONENTE "CONCEPTOS BÁSICOS DE IA" (`ConceptosBasicos.tsx`)
Crea este componente en `src/components/education/`. Su misión es ser un diccionario "anti-jerga". Usa Cards pequeñas o un sistema tipo Acordeón (`Accordion` de shadcn).
**Copia y datos exactos a usar:**
- **Título principal:** Conceptos básicos de IA
- **Subtítulo:** Entendé las palabras más usadas
- **Descripción:** Para usar inteligencia artificial, primero necesitás conocer algunos conceptos simples. Así vas a entender qué significa cada cosa y para qué sirve.
- **Botón (Call to Action principal):** "Ver conceptos" (Abrir modal o revelar acordeón).
- **Diccionario (12 ítems):**
  1. **Inteligencia Artificial (IA):** Tecnología que puede resolver tareas como una persona (Ej: escribir, crear imágenes, responder preguntas)
  2. **Prompt (Instrucción):** Lo que le pedís a la IA. Cuanto más claro, mejor resultado.
  3. **Modelo de IA:** El “cerebro” que responde (Ej: ChatGPT).
  4. **Chatbot:** IA con la que podés conversar. Responde preguntas en tiempo real.
  5. **Agente de IA:** IA que no solo responde, también actúa e interactúa. Puede trabajar de forma automática.
  6. **Automatización:** Usar IA para hacer tareas sin intervención constante (Ej: responder mensajes solo).
  7. **Flujo de trabajo (Workflow):** Pasos que sigue la IA para completar una tarea (Ej: recibir → analizar → responder).
  8. **Generación de contenido:** Crear textos, imágenes o videos con IA. Uso clave para redes y negocios.
  9. **Datos (Información):** Lo que la IA usa para responder. Mejor información = mejores resultados.
  10. **Contexto:** Información extra que le das a la IA. Hace que las respuestas sean más precisas.
  11. **Iteración (Mejora):** Ajustar lo que pedís hasta que quede bien. Nunca es perfecto a la primera.
  12. **Errores (Alucinaciones):** A veces la IA puede inventar información. Siempre verificar.

## TAREA 3: COMPONENTE "LA HISTORIA DE LA IA" (`HistoriaIA.tsx`)
Crea una Timeline interactiva y minimalista en `src/components/education/`. Misión: que el usuario vea que esto no es un invento del 2024.
- Usa una línea vertical limpia con nodos cilíndricos. Los nodos pueden expandirse al tocarlos.
**Copia exacto:**
- **Título principal:** La IA no es nueva
- **Subtítulo:** Viene evolucionando desde hace más de 70 años
- **Nodos:**
  - **1950 – El inicio:** Alan Turing propone que las máquinas puedan "pensar" y resolver lógicas.
  - **1956 – Nace la IA:** Se crea el término “Inteligencia Artificial”. Primeros intentos matemáticos.
  - **1980 – Primeros avances:** Sistemas empresariales para tomar decisiones limitadas.
  - **2000 – Internet + datos:** La nube facilita datos masivos. La IA aprende de más información.
  - **2010 – Machine Learning:** La IA aprende sola con datos sin intervención manual (Visión, Voz).
  - **2020 – Explosión de la IA:** Se multiplican los modelos potentes en laboratorios privados.
  - **2022-Hoy – IA para todos:** ChatGPT, Gemini, Claude. Cualquier persona puede usarla sin programar.
- **Cierre Visual (Caja destacada abajo):**
  - **Título:** Qué significa esto
  - **Explicación:** La IA no apareció ahora de la nada. Evolucionó durante años hasta llegar a herramientas extremadamente simples que hoy podés usar.
