import axios from 'axios'

// URL base del backend. Definida en .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
    baseURL: API_URL,
})

// Manda el token (si existe) en cada pedido.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Si el back devuelve 401, el token ya no sirve (vencio, o nunca hubo).
// Excepcion: el login en si mismo tambien devuelve 401 cuando la contraseña
// es incorrecta, y eso NO es una sesion vencida, es un error de credenciales
// que authSlice tiene que poder mostrar. Por eso se excluye esa ruta.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const esLogin = error.config?.url?.includes('/api/auth/login')
        if (error.response?.status === 401 && !esLogin) {
            localStorage.removeItem('usuario')
            localStorage.removeItem('token')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    },
)

export default api