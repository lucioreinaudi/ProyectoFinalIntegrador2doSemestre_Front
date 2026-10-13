import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/client'

// IMPORTANTE: el back todavia no devuelve un token de sesion (ver AuthController,
// que solo confirma email/password y devuelve los datos del usuario). Por eso esto
// guarda al usuario en memoria (Redux), no en localStorage: se pierde el login
// al refrescar la pagina. Cuando el back tenga un token real, esto se completa.
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        usuario: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.usuario = null
            state.status = 'idle'
            state.error = null
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
                state.usuario = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { logout } = authSlice.actions
export const selectEstaLogueado = (state) => !!state.auth.usuario
export const selectUsuario = (state) => state.auth.usuario
export default authSlice.reducer