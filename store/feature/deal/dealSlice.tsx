import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface dealState {
  dealName: string;
  dealId: Number;
  dealLevelName: string;
}
const initialState: dealState = {
  dealName: "",
  dealId: 0,
  dealLevelName: 'product'
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    updateDealStep: (state, action) => {
      state.dealName = action.payload;
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
export const updatedDealStep = (state: RootState) => state.deal.dealName;
export const updatedDealId = (state: RootState) => state.deal.dealId;
export const updatedDealLevel = (state: RootState) => state.deal.dealLevelName;
export default dealSlice.reducer;
