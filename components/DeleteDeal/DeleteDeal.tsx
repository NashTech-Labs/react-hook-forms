import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Grid, Button, Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./DeleteDeal.module.css";
import {
  notifyError,
  notifySuccess,
} from "../../util/Notification/Notification";
import { useDeleteDealMutation } from "../../api/deleteDeal";

interface ReceivedProp {
  closeModal(): any;
  refetch(): any;
  selectedDeals: any;
}

function DeleteDeal({ closeModal, selectedDeals, refetch }: ReceivedProp) {
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
    await deleteDeal(selectedDeals[0].identifier)
      .then(() => {
        closeModalfn();
        refetch();
        notifySuccess(`${selectedDeals.length} Deals deleted successfully`);
      })
      .catch(() => {
        closeModalfn();
        notifyError("Oops! Something went wrong", "delete-deal-error");
      });
  };

  return (
    <>
      <Box p={1} data-testid="addUserModal" sx={{ padding: 0 }}>
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
              control={<Checkbox checked={consent} onChange={handleChange} />}
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
              data-testid="addBtn"
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
