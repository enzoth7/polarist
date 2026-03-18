# DIRECTIVA CODEX: PÁGINAS LEGALES Y FOOTER (POLARIST MVP)

## CONTEXTO
Necesitamos generar las páginas estáticas básicas para cumplir con los requisitos de Google (política de privacidad accesible) y completar la información básica del proyecto.

## TAREA 1: CREAR LAS PÁGINAS ESTÁTICAS
Crea 4 componentes nuevos en una carpeta `src/pages/legals/` (o donde consideres estructurado):

1. **`PrivacyPolicy.tsx` (Ruta: `/privacy`)**
   - Debe contener una política de privacidad estándar y genérica (Uso de cookies, recopilación básica para login con Google, y seguridad de datos). 
   - Estructura limpia de lectura (Mucha tipografía legible, márgenes anchos).

2. **`TermsConditions.tsx` (Ruta: `/terms`)**
   - Términos y condiciones genéricos para el uso de la app.

3. **`AboutUs.tsx` (Ruta: `/about`)**
   - Título: "¿Quiénes somos?"
   - Copy de la misión: "Somos un equipo obsesionado con eliminar la fricción entre la IA y los negocios tradicionales. Nuestra misión es ahorrarte horas de aprendizaje mediante atajos directos, probados y listos para usar en tu rubro, sin que tengas que volverte un experto técnico."

4. **`Contact.tsx` (Ruta: `/contact`)**
   - Título: "Contacto"
   - Texto: "¿Tienes dudas o quieres sugerir un atajo para la comunidad?"
   - Un formulario visual súper simple (con componentes de shadcn Input/Textarea) para Nombre, Email y Mensaje, acompañado del correo oficial estático de contacto debajo.

## TAREA 2: ACTUALIZAR EL FOOTER (`Footer.tsx`)
Debes modificar el componente Footer que ya creaste e inyectarle lo siguiente:
1. Conecta visualmente (con React Router `Link`) todas las rutas recién creadas: `/terms`, `/privacy`, `/about`, y `/contact`.
2. **Redes Sociales:** Al lado del logo o en el área lateral de la configuración del Footer, agrega el logo oficial de Instagram (usando `lucide-react` o svg).
3. Vincula el logo de Instagram hacia `https://instagram.com/polarist.uy/` utilizando un target `_blank` seguro para que se abra en otra pestaña.

## REGLAS VISUALES
Todas estas páginas deben respetar la paleta de colores de `directivas_codex/0_MANIFIESTO_VISUAL.md`. Las páginas pueden presentarse dentro de un "Contenedor tipo Documento" (Cards blancas amplias flotando sobre el fondo crema principal).
Añádelas al enrutador de `App.tsx` para que sean accesibles de forma pública (fuera del ecosistema privado de `/app/*` o compartiendo el mismo layout principal, según diseño).
