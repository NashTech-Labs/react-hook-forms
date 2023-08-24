import React, { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/index";
import styles from "./DealsMainPage.module.css";
import { SearchEmptyError } from "../Error/SearchError";
import CreateIcon from "@mui/icons-material/Create";
import Deals from "./AllDeals/Deals";
import { Button, Typography, OutlinedInput } from "@mui/material";
import { useRouter } from "next/router";
import { updateNewDeal } from "../../store/feature/deal/newDealSlice";
import CreateDealDefaultFormState from "../../constants/CreateDealDefaultFormState";
import { lobState } from "../../store/feature/selectlob/lobSlice";

function DealsMainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const lobType = useAppSelector(lobState);

  const [search, setSearch] = useState<string>("");

  const handleSearchChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
  };

  const createDeal = () => {
    router.push("/deals/create");
    dispatch(updateNewDeal(CreateDealDefaultFormState));
  };

  const clearSearch = () => {
    setSearch("");
  };

  let content = null;

  if (lobType?.lob) {
    let lob = lobType?.lob.toUpperCase().replace(/ /g, "_");
    if (
      lobType.lobData[lob]?.includes("BO_ADMIN") ||
      lobType.lobData[lob]?.includes("BO_USER")
    ) {
      const searchEndAdorment = search ? (
        <CloseIcon
          onClick={clearSearch}
          sx={{
            cursor: "pointer",
          }}
        />
      ) : (
        <SearchOutlined />
      );
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
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => createDeal()}
                variant="contained"
                className={styles.btn}
              >
                <CreateIcon sx={{ marginRight: "5px" }} />
                Create new
              </Button>
              <Button
                onClick={() => router.push("/deals/managePromotions")}
                variant="outlined"
                className={styles.managePromotionsBtn}
              >
                <VisibilityOffIcon sx={{ marginRight: "5px" }} />
                Manage Promotions
              </Button>
            </Stack>
          </Grid>
          <Grid
            item
            lg={8}
            md={9}
            sm={9}
            mt={8}
            mb={4}
            sx={{
              margin: "0px 0px 30px 0px",
            }}
          >
            <OutlinedInput
              sx={{
                minWidth: "350px",
              }}
              endAdornment={searchEndAdorment}
              placeholder="Search by title"
              value={search}
              onChange={handleSearchChange}
              inputProps={{
                "data-testId": "search",
              }}
            />
          </Grid>
          <Deals search={search} />
        </>
      );
    } else {
      content = <SearchEmptyError />;
    }
  }

  return (
    <>
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
    </>
  );
}

export default DealsMainPage;
