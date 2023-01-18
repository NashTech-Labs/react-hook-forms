import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAppSelector } from "../../store/index";
import styles from "./SearchError.module.css";

export const SearchError = () => {
  return (
    <Grid container justifyContent="center" data-testid="searchError">
      <Grid item lg={8}>
        <Typography variant="body2" className={styles["error-text"]}>
          This page is temporarily unavailable
        </Typography>
        <Typography variant="body2" mt={4} sx={{ fontSize: "16px" }}>
          Sorry, we are currently experiencing a systems issue. Please try to
          refresh this page or return at a later time.
        </Typography>
        <Button
          className={styles["back-btn"]}
          onClick={() => window.location.reload()}
        >
          Refresh this page
        </Button>
      </Grid>
    </Grid>
  );
};

export const SearchEmptyError = () => {
  return (
    <Grid container justifyContent="center" data-testid="searchError">
      <Grid item lg={8}>
        <Typography variant="body2" className={styles["error-text"]}>
          This page is temporarily unavailable
        </Typography>
        <Typography variant="body2" mt={4} sx={{ fontSize: "16px" }}>
          Sorry, You don&apos;t have permission to access this page please
          contact to admin
        </Typography>
        <Button
          className={styles["back-btn"]}
          onClick={() => window.location.reload()}
        >
          Refresh this page
        </Button>
      </Grid>
    </Grid>
  );
};
