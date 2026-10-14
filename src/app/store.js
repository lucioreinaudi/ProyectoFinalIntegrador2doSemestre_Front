import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import reclamosReducer from '../features/reclamos/reclamosSlice'
import preferenciasReducer, {
    guardarPreferencias,
    leerPreferencias,
    sincronizarPreferencias,
    STORAGE_KEY,
} from '../features/preferencias/preferenciasSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        preferencias: preferenciasReducer,
        reclamos: reclamosReducer,
    },
})

// Cada vez que cambian las preferencias, se guardan en localStorage
let preferenciasAnteriores = store.getState().preferencias
store.subscribe(() => {
    const actuales = store.getState().preferencias
    if (actuales !== preferenciasAnteriores) {
        preferenciasAnteriores = actuales
        guardarPreferencias(actuales)
    }
})

// Si el usuario las cambia en otra pestaña, esta se actualiza sola
// (sin esto, cada pestaña pisaria lo que guardo la otra)
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        store.dispatch(sincronizarPreferencias(leerPreferencias(e.newValue)))
    }
})
