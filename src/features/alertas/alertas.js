// Niveles: mismos valores que el CHECK de nivel_gravedad en la BD (y AlertaService en el back).
export const NIVELES = [
    { valor: 'alto', label: 'Alto' },
    { valor: 'medio', label: 'Medio' },
    { valor: 'bajo', label: 'Bajo' },
]

// Los tipos de alerta ya no son una lista fija: vienen del back (ver tiposAlerta.js).

// Como se muestra el nivel en lo publico (Home, /alertas, detalle).
export const NIVEL_LABEL = { alto: 'Nivel alto', medio: 'Precaución', bajo: 'Informativo' }

// "Hoy · 16:45 hs", "Ayer · 09:10 hs" o "12/10 · 18:20 hs".
export function formatearHoraAlerta(fechaIso) {
    const fecha = new Date(fechaIso)
    const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    const hoy = new Date()
    const ayer = new Date()
    ayer.setDate(hoy.getDate() - 1)
    const mismoDia = (a, b) => a.toDateString() === b.toDateString()

    let dia
    if (mismoDia(fecha, hoy)) dia = 'Hoy'
    else if (mismoDia(fecha, ayer)) dia = 'Ayer'
    else dia = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    return `${dia} · ${hora} hs`
}

// De una alerta del back (AlertaResponse) a la forma que usan AlertsList y el
// detalle publico. Nunca trae datos de vecinos: solo el contador (Q10, Q27).
export function alertaParaVista(a) {
    return {
        id: a.id,
        titulo: a.titulo,
        desc: a.descripcion,
        recomendaciones: a.recomendaciones,
        nivel: a.nivelGravedad,
        zona: a.zonaNombre,
        hora: formatearHoraAlerta(a.fechaEmision),
        fechaEmision: a.fechaEmision,
        tipo: a.tipo,
        imagenUrl: a.imagenUrl,
        estado: a.estado,
        cantidadReclamos: a.cantidadReclamos,
    }
}

// Orden de las alertas publicas: primero las mas graves (alto, medio, bajo) y,
// dentro de cada nivel, las mas nuevas. Asi lo urgente siempre queda arriba,
// aunque se muestren pocas (ver "Mostrar mas" en AlertsList).
const PESO_NIVEL = { alto: 0, medio: 1, bajo: 2 }

export function ordenarPorPrioridad(alertas) {
    return [...alertas].sort((a, b) =>
        (PESO_NIVEL[a.nivel] ?? 3) - (PESO_NIVEL[b.nivel] ?? 3) ||
        new Date(b.fechaEmision) - new Date(a.fechaEmision))
}

// Ordenes que se pueden elegir en el Home.
export const ORDENES = [
    { valor: 'recientes', label: 'Más recientes' },
    { valor: 'antiguas', label: 'Más antiguas' },
    { valor: 'prioridad', label: 'Más graves primero' },
]

export function ordenarAlertas(alertas, orden) {
    if (orden === 'prioridad') return ordenarPorPrioridad(alertas)
    const signo = orden === 'antiguas' ? 1 : -1
    return [...alertas].sort((a, b) => signo * (new Date(a.fechaEmision) - new Date(b.fechaEmision)))
}

// Datos vacios del formulario de alerta.
export const ALERTA_VACIA = {
    titulo: '', descripcion: '', nivelGravedad: 'medio', tipo: 'otro', recomendaciones: '', zonaId: '', imagenUrl: null,
}

// De una alerta del back (AlertaResponse) a los datos del formulario, para editarla.
export function alertaAFormulario(a) {
    return {
        titulo: a.titulo || '',
        descripcion: a.descripcion || '',
        nivelGravedad: a.nivelGravedad,
        tipo: a.tipo || 'otro',
        recomendaciones: a.recomendaciones || '',
        zonaId: String(a.zonaId),
        imagenUrl: a.imagenUrl || null,
    }
}

// Del formulario al body que espera el back (AlertaCrearRequest).
export function formularioABody(datos) {
    return {
        titulo: datos.titulo.trim(),
        descripcion: datos.descripcion.trim(),
        nivelGravedad: datos.nivelGravedad,
        tipo: datos.tipo,
        recomendaciones: datos.recomendaciones.trim() || null,
        zonaId: Number(datos.zonaId),
        imagenUrl: datos.imagenUrl || null,
    }
}
