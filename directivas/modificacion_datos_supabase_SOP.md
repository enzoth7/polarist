# SOP: Modificación de Datos en Supabase via Python Bridge

## Objetivo
Garantizar que cualquier inserción, actualización o borrado en la base de datos Supabase sea seguro, reversible y esté documentado.

## Protocolo de Ejecución

1.  **Fase de Validación (SELECT)**:
    - Antes de ejecutar cualquier `UPDATE` o `DELETE`, el script debe realizar un `SELECT` del registro objetivo y mostrarlo.
    - Esto confirma que el `WHERE` clause es correcto.

2.  **Integridad Transaccional**:
    - Todo script de modificación debe usar un bloque `try-except-finally`.
    - Solo se debe hacer `conn.commit()` si la operación fue exitosa.
    - En caso de error, `conn.rollback()` es obligatorio.

3.  **Registro de Cambios**:
    - Las modificaciones realizadas deben registrarse en el archivo `Estado_del_Proyecto.md` si afectan a la estructura o a datos críticos de configuración.

4.  **Uso de Scripts Deterministas**:
    - No se permiten modificaciones directas vía terminal si no hay un script que las respalde y pueda ser auditado.

## Casos de Uso Comunes
- **Limpieza de Onboarding**: Borrado de perfiles con `business_name` de prueba.
- **Correcciones Manuales**: Ajuste de `personality` o `visual_style` si el usuario lo solicita.
- **Mantenimiento**: Actualización de timestamps o estados de misión.
