import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

export interface AuthState {
  token: string;
  role: any;
  userProfile: any;
}
const initialState: AuthState = {
  token: "",
  role: null,
  userProfile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userToken: (state, action) => {
      state.token = action.payload;
    },
    userRolefn: (state, action) => {
      state.role = action.payload;
    },
    userProfilefn: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { userToken } = authSlice.actions;
export const { userRolefn } = authSlice.actions;
export const { userProfilefn } = authSlice.actions;
export const tokenState = (state: RootState) => state.user.token;
export const roleState = (state: RootState) => state.user.role;
export const userProfileState = (state: RootState) => state.user.userProfile;
export default authSlice.reducer;
