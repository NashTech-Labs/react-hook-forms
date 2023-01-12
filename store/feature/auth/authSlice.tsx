import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface AuthState {
  token: string;
}
const initialState: AuthState = {
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { userToken } = authSlice.actions;
export const tokenState = (state: RootState) => state.user.token;
export default authSlice.reducer;
