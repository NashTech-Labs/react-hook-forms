import React, { useState } from "react";
import { useRouter } from "next/router";
import { Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import StepLabel from "../StepLabel";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import StepTitle from "../StepTitle";
import Button from "@mui/material/Button";
import commonStyles from "../CreateDeal/Steps.module.css";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { updateVoucherType } from "../../store/feature/voucher/voucherSlice";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { updateNewVoucher } from "../../store/feature/voucher/newVoucherSlice";
import createVoucherDefaultFormState from "../../constants/CreateVoucherDefaultFormState";
import createSerializedVoucherDefaultFormState from "../../constants/SerializedVoucherDefaultFormState";
import { lobState } from "../../store/feature/selectlob/lobSlice";
import { JOE_FRESH_LOB, ONLINE_GROCERIES_LOB } from "../../constants/lob";

function CreateVoucher() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [voucherType, setVoucherType] = useState("");
  const lobType = useAppSelector(lobState);
  const handleVoucherValue = (type: string) => {
    setVoucherType(type);
  };

  const ContinueDeal = () => {
    dispatch(updateVoucherType(voucherType));
    dispatch(
      updateNewVoucher(
        voucherType === "promotional"
          ? createVoucherDefaultFormState
          : createSerializedVoucherDefaultFormState
      )
    );
  };

  return (
    <Grid mt={5}>
      <Grid container justifyContent="center">
        <Grid item lg={6} md={8} sm={9}>
          <Grid display="flex" justifyContent="space-between" mt={8}>
            <Typography
              data-testid="createDealTitle"
              variant="h3"
              className={commonStyles.heading}
            >
              Create New Voucher
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Card className={commonStyles["card-container"]}>
        <StepLabel
          currentStep={1}
          totalSteps={lobType?.lob === JOE_FRESH_LOB ? 6 : 9}
        />
        <StepTitle title={"Select voucher type"} />

        {lobType?.lob === JOE_FRESH_LOB && (
          <Grid
            data-testid="promotional-voucher-btn"
            onClick={() => {
              handleVoucherValue("promotional");
            }}
            className={commonStyles["deal-card-container"]}
            bgcolor={voucherType === "promotional" ? "#E6ECF6" : "#fff"}
          >
            <DiscountOutlinedIcon className={commonStyles.Discount} />
            <Grid className={commonStyles.dealTitle}>
              <Typography variant="h6" className={commonStyles.dealType}>
                Promotional
              </Typography>
              <Typography>Create new promotional voucher</Typography>
            </Grid>
          </Grid>
        )}
        {lobType?.lob === ONLINE_GROCERIES_LOB && (
          
          <>
          <Grid
            data-testid="multidealBtn"
            onClick={() => {
              handleVoucherValue("promotional");
            }}
            className={commonStyles["deal-card-container"]}
            bgcolor={voucherType === "promotional" ? "#E6ECF6" : "#fff"}
          >
            <DiscountOutlinedIcon className={commonStyles.Discount} />
            <Grid className={commonStyles.dealTitle}>
              <Typography variant="h6" className={commonStyles.dealType}>
                Promotional
              </Typography>
              <Typography>Create new promotional voucher</Typography>
            </Grid>
          </Grid>

          <Grid
            data-testid="multidealBtn"
            onClick={() => {
              handleVoucherValue("serialized");
            }}
            className={commonStyles["deal-card-container"]}
            bgcolor={voucherType === "serialized" ? "#E6ECF6" : "#fff"}
          >
            <ReceiptLongOutlinedIcon className={commonStyles.Discount} />
            <Grid className={commonStyles.dealTitle}>
              <Typography variant="h6" className={commonStyles.dealType}>
                Serialized
              </Typography>
              <Typography>Create new serialized voucher</Typography>
            </Grid>
          </Grid>
          </>
        )}
      </Card>
      <Grid container justifyContent="center">
        <Grid item lg={6} md={8} sm={9} mt={5}>
          <Grid className={commonStyles.btnSection}>
            <Button
              data-testid="CancelBtn"
              variant="contained"
              className={commonStyles.cancelBtn}
              onClick={() => router.push("/vouchers")}
            >
              Cancel
            </Button>
            <Button
              data-testid="ContinueBtn"
              onClick={() => ContinueDeal()}
              variant="contained"
              disabled={
                !(voucherType === "promotional" || voucherType === "serialized")
              }
              className={commonStyles.continueBtn}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CreateVoucher;
