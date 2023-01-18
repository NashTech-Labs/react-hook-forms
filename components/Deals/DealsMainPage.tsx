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
import styles from "./DealsMainPage.module.css";
import { SearchError, SearchEmptyError } from "../Error/SearchError";
import TableLoader from "../TableLoader/TableLoader";
import Deals from "./Deals";

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

  const [RolesOfUser, { data: rolesData, isLoading, isError }] =
    useGetRolesOfUserMutation();

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

  let content = null;

  if (isLoading) {
    content = <TableLoader />;
  }

  if (isError) {
    content = <SearchEmptyError />;
  }

  if (rolesData) {
    content = <Deals />;
  }

  return (
    <Grid
      container
      justifyContent="center"
      direction="row"
      alignItems="center"
      className={styles.container}
    >
      {content}
    </Grid>
  );
}

export default DealsMainPage;
