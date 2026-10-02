# Bitácora de cambios auditables · Plataforma de Comités

## 2 de octubre de 2026 · versión v28

### Objetivo
Alinear la sección pública **Resultados** con el código JavaScript activo e incorporar un indicador verificable de composición por sexo de integrantes de los Comités de Contraloría Social (CCS).

### Hallazgo técnico corregido
La versión `app-v27.js` buscaba `committeeGrowthChart`, `committeeSizeChart` y `membersByMonthChart`, elementos que ya no formaban parte del `index.html` vigente. Esto provocaba una salida anticipada de `charts()` e impedía renderizar las gráficas actuales.

También existía un desfase entre las claves calculadas por `renderImpactDashboard()` y los atributos `data-impact` visibles.

### Corrección estructural
- Se conservan `app-v27.js` y `styles-v27.css` como respaldo histórico.
- Se crea `app-v28.js` alineado con los IDs reales del HTML.
- Se crea `styles-v28.css`.
- `index.html` referencia los activos v28.
- Se agrega `ccsGenderChart`.
- Se restauran los KPI de Resultados para que cada cálculo corresponda a su atributo `data-impact`.

### Fuente demográfica CCS
Archivo: `data/ccs-demographics-2026.json`.

Fuente administrativa:
**CONTROL Y SEGUIMIENTO - COMITÉS DE CONTRALORÍA SOCIAL 2026 (3).xlsx**

Fecha de corte: **2 de octubre de 2026**.

Datos validados:
- CCS: **35**
- Integrantes: **250**
- Mujeres: **227**
- Hombres: **23**
- Sin clasificación H/M: **0**
- Doble marca H/M: **0**
- Control aritmético: **227 + 23 = 250**

### Regla de integridad
La aplicación valida antes de graficar que:
1. Mujeres + hombres = total.
2. No existan registros sin clasificación.
3. No existan registros con doble marca H/M.

Si una validación falla, la gráfica demográfica no se genera y se registra el error en consola.

### Alcance
Este cambio no modifica registros de comités, expedientes, documentos, gestiones, compromisos, capacitaciones ni usuarios en Supabase. La modificación corresponde a presentación, consistencia del tablero público y publicación de un consolidado demográfico no personal.
