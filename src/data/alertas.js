// Los nombres de zona coinciden con los que ya existen en la tabla Zona de la
// base real (Norte, Centro, Sur, Este, Oeste, sin el prefijo "Zona "), para que
// esto se pueda conectar a GET /api/alertas/estado/activa sin que los filtros
// dejen de matchear.
export const ZONAS = ["Norte", "Centro", "Sur", "Este", "Oeste"];

export const ALERTAS = [
    { id: 'a1', nivel: 'alto', zona: 'Norte', titulo: 'Tormenta y riesgo de anegamiento', hora: 'Hoy · 16:45 hs', foto: 'cloud-rain', desc: 'Se esperan lluvias intensas en las próximas horas, con acumulación de agua en calles bajas del barrio y alrededores de la Ruta 7.' },
    { id: 'a2', nivel: 'medio', zona: 'Sur', titulo: 'Viento fuerte', hora: 'Hoy · 12:30 hs', foto: 'wind', desc: 'Ráfagas de viento de hasta 70 km/h previstas para la tarde. Precaución con estructuras livianas y ramas sueltas.' },
    { id: 'a3', nivel: 'medio', zona: 'Centro', titulo: 'Corte de energía eléctrica programado', hora: 'Hoy · 10:15 hs', foto: 'zap', desc: 'Trabajos de mantenimiento en la red eléctrica del microcentro. El corte está previsto entre las 14:00 y las 18:00 hs.' },
    { id: 'a4', nivel: 'bajo', zona: 'Este', titulo: 'Árbol caído', hora: 'Ayer · 18:20 hs', foto: 'tree', desc: 'Cuadrillas municipales están trabajando en la zona retirando un árbol caído tras la tormenta del fin de semana.' },
];