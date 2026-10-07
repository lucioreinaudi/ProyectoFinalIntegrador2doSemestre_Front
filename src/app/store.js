import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from '../features/items/itemsSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        auth: authReducer,
    },
})
