import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Grid, Skeleton } from "@mui/material";
import classes from "./Homepage.module.css";
import { useAppSelector, useAppDispatch } from "../../store/index";
import { tokenState, userProfilefn } from "../../store/feature/auth/authSlice";
import jwt from "jwt-decode";
import { useRouter } from "next/router";
import { selectedLob, setLobData } from "../../store/feature/selectlob/lobSlice";
import { useGetUserLobsQuery } from "../../api/getuserLobs";
import { skipToken } from "@reduxjs/toolkit/query";
import Image from "next/image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SearchEmptyError, SearchError } from "../Error/SearchError";
import { updatePromotionType } from "../../store/feature/voucher/voucherSlice";
import { JOE_FRESH_LOB, ONLINE_GROCERIES_LOB } from  '../../constants/lob'

function Homepage() {
  const [user, setUser] = useState<any>({});

  const {
    data,
    isLoading,
    isError,
    error: errorMsg,
  } = useGetUserLobsQuery(user.email ? user.email : skipToken);
  const userToken = useAppSelector(tokenState);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userToken !== "") {
      let value: any = jwt(userToken);
      dispatch(userProfilefn(value));
      setUser(value);
    }
  }, [userToken]);

  useEffect(() => {
    if (user?.email) {
      if (data) {
        dispatch(setLobData(data));
      }
    }
  });

  const handleJoeFreshClick = () => {
    dispatch(selectedLob(JOE_FRESH_LOB));
    dispatch(updatePromotionType('deals'))
    router.push("/deals");
  };

  const handlePCXClick = () => {
    dispatch(selectedLob(ONLINE_GROCERIES_LOB));
    dispatch(updatePromotionType('vouchers'))
    router.push("/vouchers");
  };

  let content = null;

  if (isLoading) {
    content = (
      <Grid
        container
        justifyContent="center"
        direction="row"
        alignItems="center"
        sx={{ height: "60vh" }}
      >
        <Grid item lg={8} md={10} sm={10}>
          <Skeleton
            variant="rectangular"
            width={200}
            height={30}
            sx={{ borderRadius: "30px", mb: 3 }}
          />
          <Skeleton
            variant="rectangular"
            width={500}
            height={50}
            sx={{ borderRadius: "20px", mt: 4, mb: 5 }}
          />

          <Skeleton
            variant="rectangular"
            width={200}
            height={20}
            sx={{ borderRadius: "30px", mt: 4 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton
              variant="rectangular"
              width={380}
              height={280}
              sx={{ borderRadius: "10px", mt: 4 }}
            />
            <Skeleton
              variant="rectangular"
              width={380}
              height={280}
              sx={{ borderRadius: "10px", mt: 4 }}
            />
            <Skeleton
              variant="rectangular"
              width={380}
              height={280}
              sx={{ borderRadius: "10px", mt: 4 }}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }

  if (isError) {
    let errorCode: any = errorMsg;
    if (
      errorCode.status === 403 ||
      errorCode.status === 401 ||
      (errorCode?.data?.error_code === 404 &&
        errorCode?.data?.status === "USER_RECORD_NOT_FOUND")
    ) {
      content = <SearchEmptyError />;
    } else {
      content = <SearchError />;
    }
  }

  if (data) {
    if (
      !(
        data.JOE_FRESH?.includes("BO_ADMIN") ||
        data.JOE_FRESH?.includes("BO_USER")
      ) &&
      !(
        data.SHOPPERS_DRUG_MART?.includes("BO_ADMIN") ||
        data.SHOPPERS_DRUG_MART?.includes("BO_USER")
      ) &&
      !(
        data.ONLINE_GROCERIES?.includes("BO_ADMIN") ||
        data.ONLINE_GROCERIES?.includes("BO_USER")
      )
    ) {
      content = <SearchEmptyError />;
    } else {
      content = (
        <>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item lg={8} md={8} sm={12} mt={5} >
              <Typography className={classes["hello-text"]}>
                Hello {user.given_name},
              </Typography>
              <Typography
                sx={{ mt: 1, mb: 5 }}
                className={classes["welcome-text"]}
                data-testid="welcome"
              >
                Welcome to Back Office
              </Typography>
              <Typography mb={2} className={classes["select-text"]}>
                Select LOB to begin
              </Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item lg={8} md={8} sm={12}>
              <Grid container spacing={4}>
                {(data.JOE_FRESH?.includes("BO_ADMIN") ||
                  data.JOE_FRESH?.includes("BO_USER")) && (
                  <Grid item lg={4} md={4} sm={6}>
                    <Card
                      className={classes["lob-card"]}
                      sx={{ background: "#DA3C12" }}
                      onClick={handleJoeFreshClick}
                      data-testid="joeFresh"
                    >
                      <CardActionArea>
                        <CardContent sx={{ padding: "0px" }}>
                          <Box my={8} sx={{ textAlign: "center" }}>
                            <Image
                              src="/JF.png"
                              alt="JOE_FRESH"
                              width={200}
                              height={100}
                            ></Image>
                          </Box>
                          <Box className={classes["button-box"]}>
                            <Typography className={classes["button-text"]}>
                              Enter Joe Fresh
                            </Typography>
                            <ChevronRightIcon />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )}
                {(data.ONLINE_GROCERIES?.includes("BO_ADMIN") ||
                  data.ONLINE_GROCERIES?.includes("BO_USER")) && (
                  <Grid item lg={4} md={4} sm={6}>
                    <Card
                      className={classes["lob-card"]}
                      sx={{ background: "#00817F" }}
                      onClick={handlePCXClick}
                      data-testid="sdmcard"
                    >
                      <CardActionArea>
                        <CardContent sx={{ padding: "0px" }}>
                          <Box my={8} sx={{ textAlign: "center" }}>
                            <Image
                              src="/PCX.png"
                              alt="SHOPPERS_DRUG_MART"
                              width={200}
                              height={100}
                            ></Image>
                          </Box>
                          <Box className={classes["button-box"]}>
                            <Typography className={classes["button-text"]}>
                              Enter PC Express
                            </Typography>
                            <ChevronRightIcon />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      );
    }
  }

  return <Box data-testid="LobHomepage">{content}</Box>;
}

export default Homepage;
