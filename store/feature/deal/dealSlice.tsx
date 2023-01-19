import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface dealState {
  dealStep: Number;
}
const initialState: dealState = {
  dealStep: 0,
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    updateDealStep: (state, action) => {
      state.dealStep = action.payload;
    },
  },
});

export const { updateDealStep } = dealSlice.actions;
export const updatedDealStep = (state: RootState) => state.deal.dealStep;
export default dealSlice.reducer;
