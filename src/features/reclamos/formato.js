// Formatos de fecha del panel (hora de Argentina, formato local).
export function formatearFecha(fechaIso) {
    if (!fechaIso) return '-'
    return new Date(fechaIso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatearFechaHora(fechaIso) {
    if (!fechaIso) return '-'
    return new Date(fechaIso).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}
