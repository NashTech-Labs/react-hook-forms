import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { ICreateVoucherFormState } from '../../../constants/CreateVoucherFormStateType'
import createVoucherDefaultFormState from '../../../constants/CreateVoucherDefaultFormState'

const initialState: { values: ICreateVoucherFormState } = { values: createVoucherDefaultFormState }

const newVoucherSlice = createSlice({
    name: "newVoucher",
    initialState,
    reducers: {
        updateNewVoucher: (state, action) => {
            state.values = action.payload;
        },
    },
});

export const { updateNewVoucher } = newVoucherSlice.actions;
export const getNewVoucherData = (state: RootState) => state.newVoucher.values;
export default newVoucherSlice.reducer;
