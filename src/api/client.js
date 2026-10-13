import axios from 'axios'

// URL base del backend. Definida en .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
    baseURL: API_URL,
})

// NOTA: el back todavia no emite un token de sesion real (ver AuthController).
// Cuando lo haga, aca es donde se agregaria un interceptor para mandarlo
// en cada pedido (Authorization: Bearer ...).

export default api