import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface dealState {
  dealStep: Number;
  dealId: Number;
  dealLevelName: string;
}
const initialState: dealState = {
  dealStep: 0,
  dealId: 0,
  dealLevelName: 'product'
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
    updateDealLevel: (state, action) => {
      state.dealLevelName = action.payload;
    },
  },
});

export const { updateDealStep } = dealSlice.actions;
export const { updateDealId } = dealSlice.actions;
export const { updateDealLevel } = dealSlice.actions;
export const updatedDealStep = (state: RootState) => state.deal.dealStep;
export const updatedDealId = (state: RootState) => state.deal.dealId;
export const updatedDealLevel = (state: RootState) => state.deal.dealLevelName;
export default dealSlice.reducer;
