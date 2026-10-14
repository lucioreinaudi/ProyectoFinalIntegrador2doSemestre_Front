import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/client'

function leerUsuarioGuardado() {
    try {
        const texto = localStorage.getItem('usuario')
        return texto ? JSON.parse(texto) : null
    } catch {
        return null
    }
}

// El back ahora devuelve { usuario, token } (ver AuthController / LoginResponse).
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', { email, password })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

// Crea la cuenta (POST /api/usuarios). A proposito NO loguea automaticamente:
// el flujo actual manda al usuario a la pantalla de login despues de registrarse.
export const register = createAsyncThunk(
    'auth/register',
    async (datos, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/usuarios', datos)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

// Edita el propio perfil (PUT /api/usuarios/me). El back devuelve el usuario
// actualizado completo, que reemplaza al que ya estaba en el estado.
export const actualizarPerfil = createAsyncThunk(
    'auth/actualizarPerfil',
    async (datos, { rejectWithValue }) => {
        try {
            const response = await api.put('/api/usuarios/me', datos)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

// Cambia la propia contraseña (PUT /api/usuarios/me/password). No devuelve
// datos de usuario (el back responde 204), asi que no hay nada que guardar
// en el estado mas alla de si funciono o no.
export const cambiarPassword = createAsyncThunk(
    'auth/cambiarPassword',
    async (datos, { rejectWithValue }) => {
        try {
            await api.put('/api/usuarios/me/password', datos)
            return true
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // Se leen de localStorage al cargar la app, asi la sesion sobrevive a un refresh.
        usuario: leerUsuarioGuardado(),
        token: localStorage.getItem('token'),
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (login)
        error: null,
        registerStatus: 'idle', // idem, pero para el registro
        registerError: null,
        perfilStatus: 'idle', // idem, pero para editar el perfil
        perfilError: null,
        passwordStatus: 'idle', // idem, pero para cambiar la contraseña
        passwordError: null,
    },
    reducers: {
        logout: (state) => {
            state.usuario = null
            state.token = null
            state.status = 'idle'
            state.error = null
            localStorage.removeItem('usuario')
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.usuario = action.payload.usuario
                state.token = action.payload.token
                localStorage.setItem('usuario', JSON.stringify(action.payload.usuario))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(register.pending, (state) => {
                state.registerStatus = 'loading'
                state.registerError = null
            })
            .addCase(register.fulfilled, (state) => {
                state.registerStatus = 'succeeded'
            })
            .addCase(register.rejected, (state, action) => {
                state.registerStatus = 'failed'
                state.registerError = action.payload
            })
            .addCase(actualizarPerfil.pending, (state) => {
                state.perfilStatus = 'loading'
                state.perfilError = null
            })
            .addCase(actualizarPerfil.fulfilled, (state, action) => {
                state.perfilStatus = 'succeeded'
                state.usuario = action.payload
                localStorage.setItem('usuario', JSON.stringify(action.payload))
            })
            .addCase(actualizarPerfil.rejected, (state, action) => {
                state.perfilStatus = 'failed'
                state.perfilError = action.payload
            })
            .addCase(cambiarPassword.pending, (state) => {
                state.passwordStatus = 'loading'
                state.passwordError = null
            })
            .addCase(cambiarPassword.fulfilled, (state) => {
                state.passwordStatus = 'succeeded'
            })
            .addCase(cambiarPassword.rejected, (state, action) => {
                state.passwordStatus = 'failed'
                state.passwordError = action.payload
            })
    },
})

export const { logout } = authSlice.actions
export const selectEstaLogueado = (state) => !!state.auth.usuario
export const selectUsuario = (state) => state.auth.usuario
export default authSlice.reducer