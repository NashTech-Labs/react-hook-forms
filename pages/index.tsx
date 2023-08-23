// import type { NextPage } from "next";
// import React from "react";
// import Login from "../components/Login/Login";
// import { Box } from "@mui/material";

// const Home: NextPage = () => {
//   return <Box data-testid="loginPage">< Login /></Box>;
// };

// export default Home;
import { Box } from "@mui/system";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import Homepage from "../components/Homepage/Homepage";
import Login from "../components/Login/Login";
import { useAppDispatch, useAppSelector } from "../store/index";
import { tokenState, userToken } from "../store/feature/auth/authSlice";
import jwt from "jwt-decode";
import { googleLogout } from "@react-oauth/google";

const Home: NextPage = () => {
  const savedUserToken = useAppSelector(tokenState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (savedUserToken) {
      const currentEpoch = Math.floor(new Date().getTime() / 1000);
      const tokenExpiryTime: any = jwt(savedUserToken);
      if (tokenExpiryTime.exp < currentEpoch) {
        googleLogout();
        dispatch(userToken(""));
      }
    }
  });
  return (
    <Box data-testid="homepage">
      {savedUserToken ? <Homepage /> : <Login />}
    </Box>
  );
};

export default Home;
