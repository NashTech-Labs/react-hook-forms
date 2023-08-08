import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Grid, Button, Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import classes from "../DeleteDeal/DeleteDeal.module.css";
import { notifyError, notifySuccess } from "../../util/Notification/Notification";
import { editPayload } from "./editPayload"
import { useAppSelector } from "../../store";
import { userProfileState } from "../../store/feature/auth/authSlice";
import { useEditDealsMutation } from "../../api/editDeal";
import convertVoucherDataToFormData from "../../util/convertVoucherToFormData";
import { editVoucherPayload } from "../VoucherSummary/editVoucherPayload";
import { useEditVoucherMutation } from "../../api/editVoucher";

function EditDealModal({ closeModal, isDealActive, disableDeal, data, dealId, refetch }: any) {

    const user = useAppSelector(userProfileState)

    const [editDeal] = useEditDealsMutation();

    const [consent, setConsent] = useState(false);

    const [editVoucher] = useEditVoucherMutation();

    const closeModalfn = () => {
        closeModal();
    };

    const handleChange = ({
        target: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        setConsent(checked);
    };

    const handleSubmit = async () => {

        if (data?.voucherGeneralInfo?.type === "PROMOTIONAL") {
            const editPayloadData = editVoucherPayload(data, user?.name, isDealActive, dealId)

            await editVoucher(editPayloadData)
                .unwrap()
                .then((data) => {
                    if (data) {
                        notifySuccess(isDealActive ? "Voucher successfully disabled" : "Voucher successfully enabled")
                        disableDeal();
                        closeModal();
                        refetch();
                    }
                })
                .catch((error: any) => {
                    notifyError(
                        error.data?.details ? error.data?.details : "Something went wrong",
                        "deal-failed"
                    )
                })
        }

        else {

        const editPayloadData = editPayload(data, user?.name, isDealActive)
        const formattedPayloadWithUser = {
            ...editPayloadData,
            dealId: dealId
        }
        await editDeal(formattedPayloadWithUser)
            .unwrap()
            .then((data) => {
                if (data) {
                    notifySuccess(isDealActive ? "Deal successfully disabled" : "Deal successfully enabled")
                    disableDeal();
                    closeModal();
                    refetch();
                }
            })
            .catch((error: any) => {
                notifyError(
                    error.data?.details ? error.data?.details : "Something went wrong",
                    "deal-failed"
                )
            })

        }
    }

    return (
        <>
            <Box p={1} data-testid="deleteDealModal" sx={{ padding: 0 }}>
                <Grid container alignItems="center" my={2}>
                    <Grid item lg={11}>
                        <Typography variant="h5" className={classes["modal-heading"]}>
                            {isDealActive === true ? "Disable deal?" : "Enable deal?"}
                        </Typography>
                    </Grid>
                    <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }}>
                        <CloseIcon onClick={closeModalfn} data-testid="closeIcon" />
                    </Grid>
                </Grid>
                <Typography data-testid="heading" variant="body2" className={classes["info-text"]} mt={4}>
                    {isDealActive ? `Disabling the ${data?.voucherGeneralInfo?.type === "PROMOTIONAL" ? "voucher" : "deal"} will result it from customer view and access until it is enabled (made Active) again. Proceed?` :
                        `Enabling will result in customers viewing and accessing the ${data?.voucherGeneralInfo?.type === "PROMOTIONAL" ? "voucher" : "deal"} again. Would you like to proceed?`}
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
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default EditDealModal;
