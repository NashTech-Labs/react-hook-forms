import type { NextPage } from "next";
import React from "react";
import Login from "../components/Login/Login";
import { Box } from "@mui/material";

const Home: NextPage = () => {
  return <Box data-testid="loginPage">< Login /></Box>;
};

export default Home;
