// Roles tal como los devuelve el back (en minuscula, igual que en la BD).
export const ROL_MUNICIPIO = 'municipio'
export const ROL_VECINO = 'vecino'

// Pantalla "de inicio" de cada rol: a donde se manda a alguien cuando entra
// a una ruta que no le corresponde. El municipio vive en el panel; el vecino
// en el Home publico.
export function rutaInicio(usuario) {
    return usuario?.rol === ROL_MUNICIPIO ? '/admin' : '/'
}
