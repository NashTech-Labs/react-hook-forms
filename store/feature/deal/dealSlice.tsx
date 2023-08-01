import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface DealState {
  dealName: string;
  dealId: number;
  dealLevelName: string;
  isEditing: boolean;
}
const initialState: DealState = {
  dealName: "",
  dealId: 0,
  dealLevelName: 'product',
  isEditing: false,
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
    updateDealEditing: (state, action) => {
      state.isEditing = action.payload;
    },
  },
});

export const { updateDealStep, updateDealEditing, updateDealId, updateDealLevel } = dealSlice.actions;
export const updatedDealStep = (state: RootState) => state.deal.dealName;
export const updatedDealId = (state: RootState) => state.deal.dealId;
export const updatedDealLevel = (state: RootState) => state.deal.dealLevelName;
export const getIsEditing = (state: RootState) => state.deal.isEditing;
export default dealSlice.reducer;
