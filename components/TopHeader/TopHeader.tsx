import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import styles from "./TopHeader.module.css";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../store/index";
import jwt from "jwt-decode";
import {
  tokenState,
  userToken,
  roleState,
} from "../../store/feature/auth/authSlice";
import { googleLogout } from "@react-oauth/google";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Divider, FormControl, Menu, Select, SelectChangeEvent } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { updateDealEditing, updateDealStep } from "../../store/feature/deal/dealSlice";
import { updatePromotionType, updatedPromotionType, updateVoucherType } from "../../store/feature/voucher/voucherSlice";

function TopHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector(tokenState);

  const promotionType = useAppSelector(updatedPromotionType);

  const userRole: any = useAppSelector(roleState);
  const [signoutVisible, setSignoutVisibile] = useState(false);

  const [user, setUser] = useState<any>({});

  const [selectedType, setSelectedType] = useState('deals')

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const isTitleVisible = router.pathname === "/" ? false : true;

  useEffect(() => {
    if (router.pathname === '/deals') {
      dispatch(updatePromotionType('deals'))
    }
  }, [router])

  useEffect(() => {
    if (token !== "") {
      let value: any = jwt(token);
      setUser(value);
    }
  }, [token]);

  const logout = () => {
    handleClose();
    googleLogout();
    dispatch(userToken(""));
    dispatch(updateDealStep(""));
    dispatch(updatePromotionType(''))
    dispatch(updateDealEditing(false))
    dispatch(updateVoucherType(''))
    router.push("/");
  };

  useEffect(() => {
    if (token) {
      setSignoutVisibile(true);
    } else {
      setSignoutVisibile(false);
    }
  }, [token]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const homefn = () => {
    handleClose();
    dispatch(updateDealStep(""));
    dispatch(updateDealEditing(false))
    dispatch(updateVoucherType(''))
    if (selectedType === "deals") {
      dispatch(updatePromotionType('deals'))
      router.push("/deals");
    }
    else {
      dispatch(updatePromotionType('vouchers'))
      router.push('/vouchers')
    }
  };

  const manageUsersfn = () => {
    handleClose();
    router.push("/userManagement");
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch(updatePromotionType(event.target.value))
    setSelectedType(event.target.value)
    dispatch(updateVoucherType(''))
    if (event.target.value === 'vouchers') {
      router.push('/vouchers')
    }
    else {
      router.push('/deals')
    }
  }

  useEffect(() => {
    if (promotionType) {
      setSelectedType(promotionType)
    }
    else {
      setSelectedType("deals")
    }
  }, [promotionType])

  return (
    <Box className={styles["navbar-box"]} data-testid="topHeader">
      <AppBar position="sticky" sx={{ background: "#333333" }}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid display="flex" item lg={3} md={3} sm={3}>
              {isTitleVisible === true ? (
                <>
                  <Typography
                    mt="2px"
                    variant="h5"
                    component="div"
                    className={styles.dropdownText}
                  >
                    Joe Fresh
                  </Typography>
                  <Grid ml={4} className={styles.dropdownMain} >
                    <FormControl >
                      <Select
                        value={selectedType}
                        onChange={handleChange}
                        displayEmpty
                        className={styles.dropdownSection}
                        sx={{
                          '.MuiSvgIcon-root ': {
                            fill: "white !important"
                          },
                        }}
                      >
                        <MenuItem value={'deals'}>Deals</MenuItem>
                        <MenuItem value={'vouchers'}>Vouchers</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Typography
                  variant="h5"
                  component="div"
                  className={styles["logo-text"]}
                >
                  Back Office
                </Typography>
              )}
            </Grid>

            <Grid item lg={9} md={9} sm={9}>
              {isTitleVisible && signoutVisible && (
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    cursor: "pointer",
                  }}
                >
                  <AccountCircleOutlinedIcon onClick={handleClick} />
                  <Typography
                    data-testid="enableSignOut"
                    onClick={handleClick}
                    ml={2}
                  >
                    {user?.given_name}
                  </Typography>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={homefn}>
                      <HomeOutlinedIcon
                        data-testid="homeBtn"
                        className={styles.homeIcon}
                      />{" "}
                      Home
                    </MenuItem>
                    {userRole?.data?.roles?.includes("BO_ADMIN") ? (
                      <MenuItem onClick={manageUsersfn}>
                        <AppRegistrationIcon className={styles.homeIcon} />
                        Manage Users
                      </MenuItem>
                    ) : null}
                    <Divider />
                    <MenuItem data-testid="signOut" onClick={() => logout()}>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopHeader;
