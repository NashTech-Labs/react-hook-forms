import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Grid, Button, Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./DeleteDeal.module.css";
import { useAppSelector } from "../../store";
import {
  notifyError,
  notifySuccess,
} from "../../util/Notification/Notification";
import { useDeleteDealMutation } from "../../api/deleteDeal";
import { userProfileState } from "../../store/feature/auth/authSlice";

interface ReceivedProp {
  closeModal(): any;
  refetch(): any;
  selectedDeals: any;
}

interface DealDetails {
  dealTitle: string;
  dealValue: [];
  identifier: string;
  mediaUrl: string;
  status: string;
  type: string;
  valid_from: string;
  valid_to: string;
  id: number
}

function DeleteDeal({ closeModal, selectedDeals, refetch }: ReceivedProp) {

  const user = useAppSelector(userProfileState);

  const [consent, setConsent] = useState(false);
  const [deleteDeal] = useDeleteDealMutation();

  const closeModalfn = () => {
    closeModal();
  };

  const handleChange = ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setConsent(checked);
  };

  const handleSubmit = async () => {
    let successMsg =
      selectedDeals.length > 1
        ? `${selectedDeals.length} Deals deleted successfully`
        : `${selectedDeals.length} Deal deleted successfully`;

    let deal_Ids: number[] = [];
    selectedDeals.forEach((element: DealDetails) => {
      deal_Ids.push(element.id);
    });
    await deleteDeal({ deal_Ids, user })
      .unwrap()
      .then(() => {
        closeModalfn();
        refetch();
        notifySuccess(successMsg);
      })
      .catch(() => {
        closeModalfn();
        notifyError("Oops! Something went wrong", "delete-deal-error");
      });
  };

  if (selectedDeals.length > 10) {
    return <>
      <Box p={1} data-testid="deleteDealModal" sx={{ padding: 0 }}>
        <Grid container alignItems="center" my={2}>
          <Grid item lg={11}>
            <Typography variant="h5" className={classes["modal-heading"]}>
              {`Delete ${selectedDeals.length}  deal(s)?`}
            </Typography>
          </Grid>
          <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }}>
            <CloseIcon onClick={closeModalfn} data-testid="closeIcon" />
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ color: "#666B73" }} mt={4}>
          You can delete only 10 deals in one transaction.
        </Typography>
        <Grid container mt={10} mb={1}>
          <Grid item lg={6}>
            <Button
              className={classes["exit-btn"]}
              onClick={closeModalfn}
              data-testid="exitBtn"
            >
              Exit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  }

  return (
    <>
      <Box p={1} data-testid="deleteDealModal" sx={{ padding: 0 }}>
        <Grid container alignItems="center" my={2}>
          <Grid item lg={11}>
            <Typography variant="h5" className={classes["modal-heading"]}>
              {`Delete ${selectedDeals.length}  deal(s)?`}
            </Typography>
          </Grid>
          <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }}>
            <CloseIcon onClick={closeModalfn} data-testid="closeIcon" />
          </Grid>
        </Grid>
        <Typography variant="body2" className={classes["info-text"]} mt={4}>
          This will remove them from the system and no longer be visible to
          customers if they are active.
        </Typography>

        <Box my={3}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consent}
                  onChange={handleChange}
                  data-testid="consentCheck"
                />
              }
              label="Yes, I understand and would like to proceed."
              sx={{ color: "#666B73" }}
            />
          </FormGroup>
        </Box>

        <Grid container mt={10} mb={1}>
          <Grid item lg={6}>
            <Button
              className={classes["exit-btn"]}
              onClick={closeModalfn}
              data-testid="exitBtn"
            >
              Exit
            </Button>
          </Grid>
          <Grid item lg={6} sx={{ textAlign: "right" }}>
            <Button
              className={classes["submit-btn"]}
              variant="contained"
              data-testid="submitBtn"
              disabled={!consent}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default DeleteDeal;
