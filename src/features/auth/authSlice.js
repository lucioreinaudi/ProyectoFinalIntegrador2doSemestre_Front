import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/client'

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            return response.data.token
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null
            state.status = 'idle'
            state.error = null
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
                state.token = action.payload
                localStorage.setItem('token', action.payload)
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { logout } = authSlice.actions
export const selectEstaLogueado = (state) => !!state.auth.token
export default authSlice.reducer
