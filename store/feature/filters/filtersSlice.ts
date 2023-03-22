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

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.values = action.payload;
    },
  },
});

export const { updateFilters } = filtersSlice.actions;
export const getFilters = (state: RootState) => state.filters.values;
export default filtersSlice.reducer;
