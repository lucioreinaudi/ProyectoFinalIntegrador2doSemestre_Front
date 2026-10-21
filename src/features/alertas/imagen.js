import api from '../../api/client'

// Sube una imagen elegida por el municipio y devuelve su URL (campo multipart
// "imagen"). Cada uso tiene su endpoint y su carpeta en Storage. La URL se manda
// despues en imagenUrl al guardar el formulario.
// No se fija el Content-Type a mano: el navegador agrega el boundary solo.
async function subir(url, archivo) {
    const formData = new FormData()
    formData.append('imagen', archivo)
    const response = await api.post(url, formData)
    return response.data.url
}

// Imagen propia de una alerta (carpeta alertas/).
export function subirImagenAlerta(archivo) {
    return subir('/api/admin/alertas/imagen', archivo)
}

// Imagen de referencia de un tipo de alerta (carpeta tipos-alerta/).
export function subirImagenTipoAlerta(archivo) {
    return subir('/api/admin/tipos-alerta/imagen', archivo)
}
