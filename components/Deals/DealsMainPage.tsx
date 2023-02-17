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
import { SearchEmptyError } from "../Error/SearchError";
import CreateIcon from "@mui/icons-material/Create";
import Deals from "./AllDeals/Deals";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { updateNewDeal } from "../../store/feature/deal/newDealSlice";
import CreateDealDefaultFormState from "../../constants/CreateDealDefaultFormState";

function DealsMainPage() {
  const router = useRouter();
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

  const createDeal = () => {
    router.push("/deals/create");
    dispatch(updateNewDeal(CreateDealDefaultFormState))
  }

  let content = null;

  if (isError) {
    content = <SearchEmptyError />;
  }

  if (rolesData) {
    const roles: any = rolesData;
    if (roles.roles.includes("BO_ADMIN") || roles.roles.includes("BO_USER")) {
      content = (
        <>
          <Grid
            item
            display="flex"
            justifyContent="space-between"
            lg={8}
            md={9}
            sm={9}
            mt={8}
            mb={4}
          >
            <Typography variant="h3" className={styles.heading}>
              Deals & Promotions
            </Typography>

            <Button
              onClick={() => createDeal()}
              variant="contained"
              className={styles.btn}
            >
              <CreateIcon sx={{ marginRight: "5px" }} />
              Create new
            </Button>
          </Grid>
          <Deals />
        </>
      );
    } else {
      content = <SearchEmptyError />;
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      direction="row"
      alignItems="center"
      className={styles.container}
      data-testid="dealMain-page"
    >
      {content}
    </Grid>
  );
}

export default DealsMainPage;
