import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface dealState {
  dealStep: Number;
  dealId: Number
}
const initialState: dealState = {
  dealStep: 0,
  dealId: 0,
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    updateDealStep: (state, action) => {
      state.dealStep = action.payload;
    },
    updateDealId: (state, action) => {
      state.dealId = action.payload;
    },
  },
});

export const { updateDealStep } = dealSlice.actions;
export const { updateDealId } = dealSlice.actions;
export const updatedDealStep = (state: RootState) => state.deal.dealStep;
export const updatedDealId = (state: RootState) => state.deal.dealId;
export default dealSlice.reducer;
