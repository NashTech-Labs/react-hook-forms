import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "../../store/index";
import {
  tokenState,
  userProfilefn,
  userRolefn,
} from "../../store/feature/auth/authSlice";
import jwt from "jwt-decode";
import { useGetRolesOfUserMutation } from "../../api/getRoles";

function DealsMainPage() {
  const userToken = useAppSelector(tokenState);
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (userToken !== "") {
      let value: any = jwt(userToken);
      dispatch(userProfilefn(value));
      setUser(value);
    }
  }, [userToken, dispatch]);

  const [
    RolesOfUser,
    { data: rolesData, isLoading, isError, error: errorMsg },
  ] = useGetRolesOfUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      await RolesOfUser(user.email).then((data: any) => {
        dispatch(userRolefn(data));
      });
    };

    if (user?.email) {
      fetchData();
    }
  }, [user, dispatch, RolesOfUser]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "60vh" }}
    >
      <h1>Homepage for Deals</h1>
    </Grid>
  );
}

export default DealsMainPage;
