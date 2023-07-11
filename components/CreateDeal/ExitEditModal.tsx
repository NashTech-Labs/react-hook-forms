import React from "react";
import { useRouter } from "next/router";
import { Box, Typography, Button, Grid } from "@mui/material";
import commonStyles from "../CreateDeal/Steps.module.css";
import styles from "./DraftModal.module.css";
import classes from "./ExitEditModal.module.css";
import { useAppDispatch } from "../../store";
import {
  updateDealEditing,
  updateDealId,
  updateDealLevel,
  updateDealStep,
} from "../../store/feature/deal/dealSlice";

interface IExitEditModal {
  closeModal: Function;
}

const ExitEditModal = ({ closeModal }: IExitEditModal) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const resetState = () => {
    dispatch(updateDealStep(null));
    dispatch(updateDealId(null));
    dispatch(updateDealLevel(null));
    dispatch(updateDealEditing(false));
  };

  const handelClose = () => {
    router.push("/deals");
    resetState();
  };

  const handleSumamryNavigation = () => {
    closeModal();
    resetState();
  };

  return (
    <>
      <Box p={1} data-testid="editExitModal" sx={{ padding: 0 }}>
        <Typography className={styles["draft-modal-heading"]}>
          Are you sure your want to exit?
        </Typography>
        <Typography variant="body2" className={classes["description"]} mt={2}>
          All unsaved changes and errors will revert back prior to editing.
        </Typography>
        <Grid container mt={3} mb={1}>
          <Grid item lg={3}>
            <Button
              className={commonStyles["cancelBtn"]}
              onClick={handelClose}
              data-testid="exitBtn"
              variant="outlined"
            >
              Just exit
            </Button>
          </Grid>
          <Grid item lg={9}>
            <Button
              className={commonStyles.continueBtn}
              variant="contained"
              data-testid="submitBtn"
              onClick={handleSumamryNavigation}
            >
              Go back to summary
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ExitEditModal;
