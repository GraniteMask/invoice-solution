import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = Array<any>

const initialState: InitialState = []

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        invoiceAdd(state, action: PayloadAction<Array<any>>){
            return action.payload
        },
    }
})

export const { invoiceAdd } = invoiceSlice.actions
export default invoiceSlice.reducer
