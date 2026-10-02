# Bitácora técnica · preview-oficialia

## Versión Oficialía v28 · 2 de octubre de 2026

### Alcance
Actualización exclusiva del entorno:
`/comites/preview-oficialia/`

No modifica la portada raíz `/comites/`, Supabase, expedientes, usuarios, gestiones ni documentos.

### Componente incorporado
Gráfica de composición por sexo de integrantes de Comités de Contraloría Social (CCS), integrada a la sección **Valor público y transparencia**.

### Fuente administrativa
`CONTROL Y SEGUIMIENTO - COMITÉS DE CONTRALORÍA SOCIAL 2026 (3).xlsx`

Fecha de corte: **2 de octubre de 2026**.

- CCS: 35
- Integrantes: 250
- Mujeres: 227
- Hombres: 23
- Sin clasificación H/M: 0
- Doble marca H/M: 0
- Control aritmético: 227 + 23 = 250

### Integridad
`app-oficialia-v28.js` valida antes de graficar:
1. valores numéricos válidos;
2. mujeres + hombres = total;
3. 0 registros sin clasificación;
4. 0 registros con doble marca.

Si falla cualquiera de estos controles, la gráfica no se construye y se registra el error en consola.

### Versionamiento
- Se conserva `../app-v27.js` como versión anterior compartida.
- Se conserva `homologacion-final.css`.
- Se crea `app-oficialia-v28.js`.
- Se crea `homologacion-v28.css`.
- Se crea `data/ccs-demographics-2026.json`.
- `preview-oficialia/index.html` apunta únicamente a los activos v28 de este entorno.


## Revisión de homologación visual · 2 de octubre de 2026

Se eliminó el diseño especial de la gráfica demográfica para homologarla con las visualizaciones existentes del tablero público.

- Las cuatro visualizaciones usan la misma clase `chart-card`.
- Las cuatro usan `chart-viewport` y comparten altura, padding y encabezado.
- El tablero se presenta en retícula 2 × 2 en escritorio y una columna en pantallas menores.
- La composición por sexo se representa como gráfica de dona, consistente con Chart.js ya utilizado por la plataforma.
- La leyenda muestra cantidad y porcentaje: Mujeres 227 (90.8%) y Hombres 23 (9.2%).
- Se corrigió la inicialización para ejecutar `loadCcsDemographics()` antes de `loadPublicData()`; esto elimina los valores vacíos observados en la primera versión visual.
