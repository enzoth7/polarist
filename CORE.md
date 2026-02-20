# Visual Growth System - Core Documentation

> **Documento Maestro**: Define la visión, el MVP inmediato y el futuro del proyecto.
> **Última Actualización**: 15/02/2026

---

## 1. Visión del Proyecto
**Visual Growth System** (nombre aún no decidido) es un "Agente de Marketing Inteligente" diseñado para **PyMEs y emprendedores** que no pueden costear una agencia.

**Problema:** Los dueños de negocios saben que necesitan redes sociales, pero no tienen tiempo, conocimientos de diseño, ni presupuesto para una agencia.
**Solución:** Una Web App (PWA) que actúa como un asistente personal amigable. Guía al usuario día a día con "Misiones", automatiza la mejora de sus fotos (IA) y también les crea con esas fotos mejoradas anuncios listos para subir a sus RR.SS. democratizando el marketing de alto nivel.

**Filosofía de Diseño:**
*   **"Simplicidad Radical"**: La interfaz debe ser tan intuitiva que un niño podría usarla.

---

## 2. MVP: Lanzamiento (Fecha Límite: 16/02/2026)
El objetivo es validar la utilidad básica: **Subir una foto cruda -> Obtener una pieza de contenido lista para publicar.**

### Funcionalidades Core
1.  **Onboarding ("El ADN de la Marca")**
    *   Formulario simple para capturar: Nombre, Rubro, Redes Sociales, Público Objetivo y Estilo Visual.
    *   Genera un perfil base en Supabase (`profiles`).

2.  **Dashboard Operativo**
    *   **Calendario Semanal**: Vista visual de tareas pasadas y futuras.
    *   **"Misión del Día"**: Call-to-Action principal (ej. "Sube una foto de tu producto").

3.  **Flujo de Generación de Contenido (La "Magia")**
    *   **Input**: Usuario sube una foto desde su celular (cruda/amateur).
    *   **Procesamiento (Backend/n8n)**:
        *   La imagen se sube a Supabase Storage (`product-images`).
        *   Se gatilla un workflow de IA (Freepik Mystic/Flux) para mejorar la calidad.
        *   Generación de copy/texto de venta en la misma imagen en Freepik.
    *   **Output**: La imagen procesada aparece en la Galería del usuario lista para descargar.

4.  **Galería de Campañas**
    *   Organización por carpetas ("Campañas").
    *   Distinción clara entre fotos subidas con `type='upload'` ("Originales") y resultados con `type='enhanced'` ("Mejoradas").

5.  **Generación Alineada a la Marca ("Smart Context" via MCP)**
    *   **Principio Fundamental**: Las fotos NO son aleatorias. Se basan en el ADN visual de cada marca.
    *   **Integración NotebookLM**:
        *   Cada marca tiene un "Manual de Estilo" vivo (NotebookLM) con sus arquetipos, paleta de colores y tono de voz.
        *   **Flujo**:
            1.  Antigravity/n8n consulta a NotebookLM via MCP: *"¿Cuál es la estética visual de [Marca X] para un producto de [Categoría Y]?"*
            2.  NotebookLM devuelve los lineamientos (ej. "Minimalista, luz natural, fondo de mármol").
            3.  Se inyecta este contexto en el prompt de generación de imagen (Mystic/Flux).
    *   **Resultado**: Coherencia total entre lo que la marca ES y lo que la IA genera.

### Arquitectura de Datos (Supabase)
*   **`profiles`**: Datos del usuario y negocio.
*   **`campaigns`**: Carpetas para organizar fotos.
*   **`user_images`**: Almacena tanto los inputs como los outputs.
    *   `type`: 'upload' (input) o 'enhanced' (output).
    *   `status`: 'ready', 'processing', 'error'.
    *   `campaign_id`: ID de la campaña (heredado).

    *   **Resultado**: Coherencia total entre lo que la marca ES y lo que la IA genera.

---

## 6. Flujo Integrado: Antigravity + NotebookLM (La "Mente Maestra")

Olvida crear una libreta por cliente. Usaremos **UNA** sola "Libreta Maestra" de Marketing y yo (Antigravity) seré el puente.

### 6.1. Configuración de la "Libreta Maestra" (Solo una vez)
> [!IMPORTANT]
> **Requisito Técnico**: La cuenta de Google donde crees el Notebook debe ser la **misma** que uses para autenticar Antigravity. Esto evita errores de permisos al conectar via MCP.

1.  Creas un Notebook en NotebookLM llamado **"Polarist Brain"**.
2.  Subes ahí todos tus PDFs/Docs de valor:
    *   Teoría de Arquetipos de Marca.
    *   Psicología del Color.
    *   Técnicas de Venta / Copywriting.
    *   Manuales de Estética Fotográfica.

### 6.2. El Proceso Operativo (Por Cliente)
Cuando llegue un cliente nuevo, haremos esto tú y yo en el chat:

1.  **Input (Tú)**: Me das los datos crudos del cliente en el chat.
    *   *Ej: "Nuevo cliente: Vende zapatillas urbanas, quiere parecer rebelde, target adolescentes."*
    
2.  **Procesamiento (Yo + MCP)**:
    *   Yo usaré mi herramienta `notebooklm_query` para conectar con **"Polarist Brain"**.
    *   Le preguntaré: *"Basado en nuestros archivos de Arquetipos y Estética, ¿cómo debe verse una marca de zapatillas rebeldes? Dame el prompt para Flux y qué buscar en Pinterest."*

3.  **Output (Yo te entrego a ti)**:
    *   **Arquetipo Definido**: "El Forajido".
    *   **Prompt de Generación (Ready-to-use)**: *"Urban sneaker photography, low angle, concrete texture background, street lighting, high contrast, rebel mood..."*
    *   **Búsqueda Exacta de Pinterest**: *"Busca exactamente: 'Streetwear sneaker photography harsh shadows industrial background'"*. (Así no adivinas, vas a tiro hecho).
    *   **Estrategia de Copy**: "Usa un tono desafiante y directo".

4.  **Ejecución (Tú)**:
    *   Vas a Supabase/App -> Subes foto cliente.
    *   Prompt -> Pegas el que te di.
    *   Referencia -> Buscas lo que te dije en Pinterest y usas esa imagen.

---

## 7. Roadmap Futuro (Post-Validación)
Si el MVP funciona y retiene usuarios, avanzamos a la fase de expansión.

### Fase 2: Automatización Avanzada y Diseño
*   **Style Transfer**: Base de datos de referencias visuales. La IA elige el estilo según el rubro (ej. Sushi -> Estilo Dark Moody).
*   **Overlay de Texto (Ads)**: Generación automática de banners con texto promocional legible (usando APIs de diseño o scripts de n8n).
*   **Feedback Loop**: El usuario elige la mejor de 4 variaciones generadas.

### Fase 3: Gestión de Pauta ("Pauteo")
*   Interfaz simplificada para lanzar anuncios en Meta/Google Ads directamente desde la app.
*   Optimización automática de presupuesto.

### Fase 4: Modelo de Negocio (SaaS)
*   **Basic ($19/mes)**: 20 productos/mes, solo mejora de imagen.
*   **Pro ($49/mes)**: 50 productos/mes, generación de anuncios con texto, estilos premium.
*   **Agency ($99/mes)**: Whitelabel, API access.

---
**Nota**: Este archivo es la fuente de verdad para el *QUÉ* se está construyendo. Para el *CÓMO* y el estado actual, ver `Estado_del_Proyecto.md`.
