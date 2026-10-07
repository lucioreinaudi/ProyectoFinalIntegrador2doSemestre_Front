// import axios from 'axios'

// // URL base del backend de auth. Ej: VITE_AUTH_API_URL=http://localhost:8080
// const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080'

// const api = axios.create({
//     baseURL: API_URL,
// })

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// })

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token')
//             if (window.location.pathname !== '/login') {
//                 window.location.href = '/login'
//             }
//         }
//         return Promise.reject(error)
//     },
// )

// export default api
