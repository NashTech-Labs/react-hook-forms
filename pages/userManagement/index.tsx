import React from "react";
import { Box, Grid } from "@mui/material";
import UserList from "../../components/UserManagement/UserList";

export const UserManagement = () => {

  return (
    <Box data-testid="userManagement">
      <Grid container direction="row" justifyContent="center">
        <Grid item lg={8} md={12} sm={12} sx={{my:2}}>
          <UserList/>
        </Grid>
      </Grid>
    </Box>
  );
};
export default UserManagement;