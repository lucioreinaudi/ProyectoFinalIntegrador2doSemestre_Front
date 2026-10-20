// Valores que aceptan los CHECK de la tabla Alerta en la BD (y AlertaService en el back).
export const NIVELES = [
    { valor: 'alto', label: 'Alto' },
    { valor: 'medio', label: 'Medio' },
    { valor: 'bajo', label: 'Bajo' },
]

export const TIPOS = [
    { valor: 'tormenta', label: 'Tormenta' },
    { valor: 'viento', label: 'Viento' },
    { valor: 'electricidad', label: 'Electricidad' },
    { valor: 'arbol', label: 'Árbol' },
    { valor: 'otro', label: 'Otro' },
]

export function labelTipo(tipo) {
    return TIPOS.find((t) => t.valor === tipo)?.label || tipo
}

// Como se muestra el nivel en lo publico (Home, /alertas, detalle).
export const NIVEL_LABEL = { alto: 'Nivel alto', medio: 'Precaución', bajo: 'Informativo' }

// Icono de cada tipo. AlertsList lo usa tambien para elegir la foto de
// referencia cuando la alerta no tiene imagen propia.
const ICONO_POR_TIPO = {
    tormenta: 'cloud-rain',
    viento: 'wind',
    electricidad: 'zap',
    arbol: 'tree',
    otro: 'alert-triangle',
}

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
        foto: ICONO_POR_TIPO[a.tipo] || 'alert-triangle',
        imagenUrl: a.imagenUrl,
        estado: a.estado,
        cantidadReclamos: a.cantidadReclamos,
    }
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
