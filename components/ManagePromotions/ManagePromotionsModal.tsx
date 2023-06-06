import React, { useState, ChangeEvent, MouseEventHandler, useEffect } from "react";
import Modal from 'react-modal'
import { Box, Typography, Grid, Button, Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import classes from "../DeleteDeal/DeleteDeal.module.css";
import { notifyError, notifySuccess } from "../../util/Notification/Notification";
import { useAppSelector } from "../../store";
import { userProfileState } from "../../store/feature/auth/authSlice";
import { useDisablePromotionMutation } from '../../api/disablePromotion'
import { IManagePromotionsFormState } from './ManagePromotions'

interface IManagePromotionsModal {
 closeModal: Function
 open: boolean
 formValues : IManagePromotionsFormState
}

const modalStyles = {
    content: {
      width: "27%",
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "2px",
      background: "#fff",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      padding: "16px",
      gap: "10px",
    },
    overlay: {
      zIndex: "999",
      background: "rgba(0,0,0,0.4",
    },
  };

const ManagePromotionsModal = ({ closeModal, open, formValues }: IManagePromotionsModal) => {
    const [consent, setConsent] = useState(false);
    const [disablePromotion] = useDisablePromotionMutation()

    const handleChange = ({
        target: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        setConsent(checked);
    };

    const handleSubmit = async () => {
       const { promotionType, promotionId, levelOfBusiness } = formValues
       await disablePromotion({
            promoType : promotionType,
            identifier: promotionId,
            manageLob: levelOfBusiness
        })
        .unwrap()
        .then(() => {
          closeModal(true)
          notifySuccess('Deal successfully disabled');
        })
        .catch(() => {
          closeModal(false)
          notifyError("Oops! Something went wrong", "disable-deal-error");
        })
        .finally(() => {
            setConsent(false)
        })
    }

    const handleClose = () => {
        setConsent(false)
        closeModal()
    }

    return <Modal
        style={modalStyles}
        isOpen={open}
        onRequestClose={handleClose}
    >
    <Box p={1} data-testid="disablePromotionModal" sx={{ padding: 0 }}>
                <Grid container alignItems="center" my={2}>
                    <Grid item lg={11}>
                        <Typography variant="h5" className={classes["modal-heading"]}>
                            Are you sure?
                        </Typography>
                    </Grid>
                    <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }}>
                        <CloseIcon onClick={handleClose} data-testid="closeIcon" />
                    </Grid>
                </Grid>
                <Typography data-testid="heading" variant="body2" className={classes["info-text"]} mt={4}>
                  Disabled promotions will no longer be visible to customers if they are active.
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
                            onClick={handleClose}
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
                            Disable
                        </Button>
                    </Grid>
                </Grid>
            </Box>
 </Modal>           
}

export default ManagePromotionsModal;
