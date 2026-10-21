import api from '../../api/client'

// Sube una imagen elegida por el municipio para una alerta y devuelve su URL
// (POST /api/admin/alertas/imagen, campo multipart "imagen"). La URL se guarda
// despues en imagenUrl al crear, editar o publicar la alerta.
// No se fija el Content-Type a mano: el navegador agrega el boundary solo.
export async function subirImagenAlerta(archivo) {
    const formData = new FormData()
    formData.append('imagen', archivo)
    const response = await api.post('/api/admin/alertas/imagen', formData)
    return response.data.url
}
