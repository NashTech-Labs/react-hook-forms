import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../index";

export interface ILobState {
  lob: string;
  lobData: {
    [key: string]: string[],
  }
}
const initialState: ILobState = {
  lob: "",
  lobData: {
    "JOE_FRESH": [],
    "SHOPPERS_DRUG_MART": [],
    "ONLINE_GROCERIES": []
  }
};

const lobSlice = createSlice({
  name: "lob",
  initialState,
  reducers: {
    selectedLob: (state, action) => {
      state.lob = action.payload;
    },
    setLobData: (state, action) => {
      state.lobData = action.payload
    }
  },
});

export const {selectedLob, setLobData} = lobSlice.actions;
export const lobState = (state: RootState) => state.lob;
export default lobSlice.reducer;
