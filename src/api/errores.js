// El back devuelve los errores como ProblemDetail, con el motivo en "detail"
// (ResponseStatusException y GlobalExceptionHandler). Esto saca ese texto para
// mostrarlo, o usa un mensaje generico si no vino (ej. el back esta caido).
export function mensajeDeError(error, porDefecto = 'Ocurrió un error, intentá de nuevo') {
    const detalle = error?.response?.data?.detail
    return typeof detalle === 'string' && detalle ? detalle : porDefecto
}
