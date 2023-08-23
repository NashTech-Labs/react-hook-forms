import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface AuthState {
  token: string;
  userProfile: any;
}
const initialState: AuthState = {
  token: "",
  userProfile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userToken: (state, action) => {
      state.token = action.payload;
    },
    userProfilefn: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { userToken } = authSlice.actions;
export const { userProfilefn } = authSlice.actions;
export const getUser = (state: RootState) => state.user;
export const tokenState = (state: RootState) => state.user.token;
export const userProfileState = (state: RootState) => state.user.userProfile;
export default authSlice.reducer;
