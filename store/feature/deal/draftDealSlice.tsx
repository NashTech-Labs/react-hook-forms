import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: { values : any} = { values: {} }

const draftDealSlice = createSlice({
  name: "draftDeal",
  initialState,
  reducers: {
    updateDraftDeal: (state, action) => {
      state.values = action.payload;
    },
  },
});

export const { updateDraftDeal } = draftDealSlice.actions;
export const getDraftDealData = (state: RootState) => state.draftDeal.values;
export default draftDealSlice.reducer;
