import { createSlice } from '@reduxjs/toolkit'

// Preferencias visuales del usuario (tema + accesibilidad).
// Se guardan en localStorage para que se mantengan entre visitas,
// y no dependen de tener sesion iniciada.

// Escala de tamaño de texto: se aplica como font-size del <html>,
// y como casi todo el sitio usa rem, agranda todo en proporcion.
export const TAMANOS_TEXTO = [100, 112.5, 125, 137.5]

const temaDelSistema = () =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'

const movimientoDelSistema = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const valoresPorDefecto = () => ({
    tema: temaDelSistema(),
    tamanoTexto: 0,
    altoContraste: false,
    reducirMovimiento: movimientoDelSistema() ?? false,
    subrayarEnlaces: false,
})

export const STORAGE_KEY = 'preferencias'

// Lee el JSON guardado y descarta cualquier valor invalido
export const leerPreferencias = (texto) => {
    const base = valoresPorDefecto()
    try {
        const guardado = JSON.parse(texto)
        if (!guardado) return base
        return {
            tema: guardado.tema === 'oscuro' || guardado.tema === 'claro' ? guardado.tema : base.tema,
            tamanoTexto: Number.isInteger(guardado.tamanoTexto)
                ? Math.min(Math.max(guardado.tamanoTexto, 0), TAMANOS_TEXTO.length - 1)
                : base.tamanoTexto,
            altoContraste: Boolean(guardado.altoContraste),
            reducirMovimiento: typeof guardado.reducirMovimiento === 'boolean'
                ? guardado.reducirMovimiento
                : base.reducirMovimiento,
            subrayarEnlaces: Boolean(guardado.subrayarEnlaces),
        }
    } catch {
        return base
    }
}

const cargarPreferencias = () => {
    try {
        return leerPreferencias(localStorage.getItem(STORAGE_KEY))
    } catch {
        return valoresPorDefecto()
    }
}

export const guardarPreferencias = (preferencias) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias))
    } catch {
        // Modo incognito o storage bloqueado: la preferencia dura solo esta visita
    }
}

const preferenciasSlice = createSlice({
    name: 'preferencias',
    initialState: cargarPreferencias(),
    reducers: {
        // Otra pestaña cambio las preferencias: se toman tal cual
        sincronizarPreferencias(state, action) {
            return action.payload
        },
        alternarTema(state) {
            state.tema = state.tema === 'oscuro' ? 'claro' : 'oscuro'
        },
        agrandarTexto(state) {
            state.tamanoTexto = Math.min(state.tamanoTexto + 1, TAMANOS_TEXTO.length - 1)
        },
        achicarTexto(state) {
            state.tamanoTexto = Math.max(state.tamanoTexto - 1, 0)
        },
        alternarAltoContraste(state) {
            state.altoContraste = !state.altoContraste
        },
        alternarReducirMovimiento(state) {
            state.reducirMovimiento = !state.reducirMovimiento
        },
        alternarSubrayarEnlaces(state) {
            state.subrayarEnlaces = !state.subrayarEnlaces
        },
        restablecerAccesibilidad(state) {
            const base = valoresPorDefecto()
            state.tamanoTexto = base.tamanoTexto
            state.altoContraste = base.altoContraste
            state.reducirMovimiento = base.reducirMovimiento
            state.subrayarEnlaces = base.subrayarEnlaces
        },
    },
})

export const {
    sincronizarPreferencias,
    alternarTema,
    agrandarTexto,
    achicarTexto,
    alternarAltoContraste,
    alternarReducirMovimiento,
    alternarSubrayarEnlaces,
    restablecerAccesibilidad,
} = preferenciasSlice.actions

export const selectPreferencias = (state) => state.preferencias
export const selectTema = (state) => state.preferencias.tema

export default preferenciasSlice.reducer
