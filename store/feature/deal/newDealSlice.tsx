import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import {ICreateDealFormState} from '../../../constants/CreateDealFormStateType'
import CreateDealDefaultFormState from '../../../constants/CreateDealDefaultFormState'

const initialState: { values : ICreateDealFormState} = { values: CreateDealDefaultFormState }

const newDealSlice = createSlice({
  name: "newDeal",
  initialState,
  reducers: {
    updateNewDeal: (state, action) => {
      state.values = action.payload;
    },
  },
});

export const { updateNewDeal } = newDealSlice.actions;
export const getNewDealData = (state: RootState) => state.newDeal.values;
export default newDealSlice.reducer;
