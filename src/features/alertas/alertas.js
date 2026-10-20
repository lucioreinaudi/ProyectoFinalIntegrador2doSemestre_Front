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
