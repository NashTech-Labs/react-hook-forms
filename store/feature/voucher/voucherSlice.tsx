import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface DealState {
    promotionType: string;
    voucherType: string;
    voucherId: string
}
const initialState: DealState = {
    promotionType: 'deals',
    voucherType: '',
    voucherId: ''
};

const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        updatePromotionType: (state, action) => {
            state.promotionType = action.payload;
        },
        updateVoucherType: (state, action) => {
            state.voucherType = action.payload;
        },
        updateVoucherId: (state, action) => {
            state.voucherId = action.payload;
        },
    },
});

export const { updatePromotionType, updateVoucherType, updateVoucherId } = voucherSlice.actions;
export const updatedPromotionType = (state: RootState) => state.voucher.promotionType;
export const updatedVoucherType = (state: RootState) => state.voucher.voucherType;
export const updatedVoucherId = (state: RootState) => state.voucher.voucherId;
export default voucherSlice.reducer;
