import api from '../../api/client'

// Mismas reglas que el back (SCRUM-88). Quien decide de verdad es el back:
// esto solo evita mandar un pedido que ya se sabe que va a rechazar.
export const MAX_FOTOS = 5
export const MAX_MB = 5
export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']

// Devuelve el motivo por el que la foto no sirve, o null si esta bien.
export function validarFoto(archivo) {
    if (!TIPOS_FOTO.includes(archivo.type)) {
        return `"${archivo.name}" no es una imagen válida (usá JPG, PNG o WEBP).`
    }
    if (archivo.size > MAX_MB * 1024 * 1024) {
        return `"${archivo.name}" pesa más de ${MAX_MB} MB.`
    }
    return null
}

// Sube las fotos a un reclamo ya creado. El campo multipart se llama "fotos".
// No se fija el Content-Type a mano: el navegador agrega el boundary solo.
export async function subirFotosReclamo(reclamoId, archivos) {
    const formData = new FormData()
    archivos.forEach((archivo) => formData.append('fotos', archivo))
    const response = await api.post(`/api/reclamos/${reclamoId}/fotos`, formData)
    return response.data
}
