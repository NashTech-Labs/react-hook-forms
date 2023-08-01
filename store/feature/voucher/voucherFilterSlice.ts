import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface IFilters {
    status?: [string]
    dealType?: [string]
    startDate?: Object
    endDate?: Object
    count?: number
}

const initialState: { values : IFilters} = { values : { } }

const voucherfiltersSlice = createSlice({
  name: "voucherFilters",
  initialState,
  reducers: {
    updateVoucheFilters: (state, action) => {
      state.values = action.payload;
    },
  },
});

export const { updateVoucheFilters } = voucherfiltersSlice.actions;
export const getVoucherFilters = (state: RootState) => state.voucherFilters.values;
export default voucherfiltersSlice.reducer;
