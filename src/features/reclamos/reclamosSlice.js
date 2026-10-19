import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/client'

export const crearReclamo = createAsyncThunk(
    'reclamos/crear',
    async (datos, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/reclamos', datos)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.status)
        }
    },
)

const reclamosSlice = createSlice({
    name: 'reclamos',
    initialState: {
        crearStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        crearError: null,
    },
    reducers: {
        resetCrearReclamo: (state) => {
            state.crearStatus = 'idle'
            state.crearError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(crearReclamo.pending, (state) => {
                state.crearStatus = 'loading'
                state.crearError = null
            })
            .addCase(crearReclamo.fulfilled, (state) => {
                state.crearStatus = 'succeeded'
            })
            .addCase(crearReclamo.rejected, (state, action) => {
                state.crearStatus = 'failed'
                state.crearError = action.payload
            })
    },
})

export const { resetCrearReclamo } = reclamosSlice.actions
export default reclamosSlice.reducer
