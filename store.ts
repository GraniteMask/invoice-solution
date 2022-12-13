import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from './slices/invoiceSlice'

const store = configureStore({
    reducer: {
        invoice: invoiceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch