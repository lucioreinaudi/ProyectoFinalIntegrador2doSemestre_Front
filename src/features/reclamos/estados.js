// Estados de un reclamo: mismos valores que el CHECK de EstadoReclamo en la BD.
// label = como se muestra; clase = estilo de la .estado-pill (main.scss).
export const ESTADO_INFO = {
    recibido: { label: 'Recibido', clase: 'recibido' },
    'en revision': { label: 'En revisión', clase: 'revision' },
    'en proceso': { label: 'En proceso', clase: 'proceso' },
    resuelto: { label: 'Resuelto', clase: 'resuelto' },
    rechazado: { label: 'Rechazado', clase: 'rechazado' },
}

export const ESTADOS = Object.keys(ESTADO_INFO)

export function infoEstado(estado) {
    return ESTADO_INFO[estado] || { label: estado || 'Sin estado', clase: 'recibido' }
}

// Copia de la tabla de transiciones del back (ReclamoEstadoService), solo para
// ofrecer en el panel las opciones validas. Quien decide de verdad es el back:
// si esto quedara desactualizado, el back rechaza el cambio y se muestra su mensaje.
const TRANSICIONES = {
    recibido: ['en revision', 'en proceso', 'resuelto', 'rechazado'],
    'en revision': ['en proceso', 'resuelto', 'rechazado'],
    'en proceso': ['resuelto', 'rechazado'],
    resuelto: ['en revision'],
    rechazado: ['en revision'],
}

const FINALES = ['resuelto', 'rechazado']

// Opciones del selector "cambiar estado" para un reclamo en el estado indicado.
// Comentario obligatorio: al rechazar (es el motivo que ve el vecino), al reabrir
// y al dejar una novedad sin cambiar de estado.
export function opcionesDeCambio(estadoActual) {
    const actual = TRANSICIONES[estadoActual] ? estadoActual : 'recibido'
    const esFinal = FINALES.includes(actual)

    const opciones = TRANSICIONES[actual].map((destino) => ({
        valor: destino,
        label: esFinal ? `Reabrir (pasa a ${infoEstado(destino).label})` : `Pasar a ${infoEstado(destino).label}`,
        comentarioObligatorio: destino === 'rechazado' || esFinal,
    }))

    if (!esFinal) {
        opciones.push({
            valor: actual,
            label: `Dejar una novedad (sigue ${infoEstado(actual).label})`,
            comentarioObligatorio: true,
        })
    }
    return opciones
}
