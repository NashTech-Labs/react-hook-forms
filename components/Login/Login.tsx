import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";

function Login() {
  const router = useRouter();

  const responseGoogleSuccess = (response: any) => {
    if (response != null) {
      router.push("/deals");
    }
  };

  const responseGoogleFailure = (response: any) => {
    if (response != null) {
      router.push("/");
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "60vh" }}
    >
      <div>
        <h1>Welcome to BO Deals</h1>
        <Grid sx={{ marginLeft: "10%" }}>
          <GoogleLogin
            onSuccess={responseGoogleSuccess}
            onError={() => responseGoogleFailure}
            width="280px"
            theme="filled_blue"
          />
        </Grid>
      </div>
    </Grid>
  );
}

export default Login;
