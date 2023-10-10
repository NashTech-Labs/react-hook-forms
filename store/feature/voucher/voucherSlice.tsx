import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface DealState {
    promotionType: string;
    voucherType: string;
    voucherId: string;
    isVoucherEditing: boolean
    batchSize: number
}
const initialState: DealState = {
    promotionType: 'deals',
    voucherType: '',
    voucherId: '',
    isVoucherEditing: false,
    batchSize: 0,
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
        updateVoucherEditing: (state, action) => {
            state.isVoucherEditing = action.payload;
        },
        updatebatchSize: (state, action) => {
            state.batchSize = action.payload;
        },
    },
});

export const { updatePromotionType, updateVoucherType, updateVoucherId, updateVoucherEditing, updatebatchSize } = voucherSlice.actions;
export const updatedPromotionType = (state: RootState) => state.voucher.promotionType;
export const updatedVoucherType = (state: RootState) => state.voucher.voucherType;
export const updatedVoucherId = (state: RootState) => state.voucher.voucherId;
export const updatedVoucherEditing = (state: RootState) => state.voucher.isVoucherEditing;
export const updatedBatchSize = (state: RootState) => state.voucher.batchSize;
export default voucherSlice.reducer;
