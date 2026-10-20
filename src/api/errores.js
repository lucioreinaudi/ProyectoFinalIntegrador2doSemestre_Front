// El back devuelve los errores como ProblemDetail, con el motivo en "detail"
// (ResponseStatusException y GlobalExceptionHandler). Esto saca ese texto para
// mostrarlo, o usa un mensaje generico si no vino. Al generico se le agrega el
// codigo HTTP (ej. "error 404"), que ayuda a saber que paso: 404 = el back no
// tiene ese endpoint (rama vieja o sin reiniciar), 500 = fallo interno, y sin
// codigo = el back no respondio (caido o apagado).
export function mensajeDeError(error, porDefecto = 'Ocurrió un error, intentá de nuevo') {
    const detalle = error?.response?.data?.detail
    if (typeof detalle === 'string' && detalle) return detalle
    const codigo = error?.response?.status
    return codigo ? `${porDefecto} (error ${codigo})` : `${porDefecto} (el servidor no respondió)`
}
