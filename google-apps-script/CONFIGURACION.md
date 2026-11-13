# Configurar la escritura de calificaciones SCOUTPRO en Base Madre

## 1. Crear el endpoint en Google Sheets
1. Abrí la hoja Base Madre.
2. En Google Sheets: **Extensiones → Apps Script** (debe ser un proyecto vinculado a esta hoja).
3. Reemplazá el contenido del editor por `google-apps-script/Code.gs`.
4. En la primera línea de configuración, reemplazá `REEMPLAZAR_POR_UN_TOKEN_LARGO` por una clave privada larga. Usá la misma clave luego en SCOUTPRO.
5. Guardá el proyecto.
6. **Implementar → Nueva implementación → Aplicación web**.
7. Ejecutar como: **Yo**. Acceso: elegí la opción disponible que permita a SCOUTPRO invocar el endpoint. Google puede pedir autorización para editar la hoja.
8. Implementá y copiá la URL que termina en `/exec`.

## 2. Vincular SCOUTPRO
1. Abrí SCOUTPRO y entrá en la ficha de cualquier jugador.
2. Tocá el botón superior de sincronización con Google Sheets.
3. Pegá la URL `/exec` y luego el mismo token que configuraste en Apps Script.

## 3. Uso
En la ficha del jugador, el bloque **Cargar calificación por jornada** permite seleccionar competencia y jornada e ingresar una nota de 0 a 10, `NJ` o `SUP`. Guardar actualiza la evolución de SCOUTPRO y escribe la misma celda en Base Madre. Volver a guardar la misma combinación jugador + competencia + jornada reemplaza el valor anterior.

## Correspondencia esperada en Base Madre
- Pestañas: `Liga Profesional - 2 da parte`, `Primera Nacional`, `Primera B Metro`, `Torneo Proyeccion`.
- Jugador: columna A, desde fila 2.
- Encabezados de jornada: fila 1, desde columna E.
- Se conserva la posición original de cada jornada; no se compactan celdas vacías.

**Importante:** el endpoint devuelve un error visible si no encuentra pestaña, jugador o encabezado. La primera escritura debe probarse con una jornada no crítica y verificarse en la hoja. La sincronización con Google Sheets requiere completar una vez la implementación y autorización de Apps Script; las calificaciones se guardan igualmente en SCOUTPRO aunque todavía no se haya configurado ese enlace.
