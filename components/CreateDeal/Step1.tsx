import React, { useState } from "react";
import { useRouter } from "next/router";
import { Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import StepLabel from "../StepLabel";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import StepTitle from "../StepTitle";
import Button from "@mui/material/Button";
import { updateDealStep } from "../../store/feature/deal/dealSlice";
import { useAppDispatch } from "../../store/index";
import commonStyles from "./Steps.module.css";

function Step1() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [dealCount, setDealCount] = useState(0);

  const [discountDealSelected, setDiscountDealSelected] = useState(false);

  const handleDealValue = (value: any) => {
    setDealCount(value);
    setDiscountDealSelected(!discountDealSelected);
  };

  const ContinueDeal = () => {
    dispatch(updateDealStep(dealCount));
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item lg={6} md={8} sm={9}>
          <Grid display="flex" justifyContent="space-between" mt={8}>
            <Typography variant="h3" className={commonStyles.heading}>
              Create New Deal
            </Typography>
            <Typography></Typography>
          </Grid>
        </Grid>
      </Grid>

      <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={1} totalSteps={7} />
        <StepTitle title={"Select deal type"} />

        <Grid
          onClick={() => {
            handleDealValue(1);
          }}
          className={commonStyles["deal-card-container"]}
          bgcolor={discountDealSelected ? "#E6ECF6" : "#fff"}
        >
          <DiscountOutlinedIcon className={commonStyles.Discount} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.dealType}>
              Discount
            </Typography>
            <Typography>
              Create a deal with a dollar off, percentage off, or fixed price.
            </Typography>
          </Grid>
        </Grid>

        <Grid
          className={commonStyles["deal-card-container"]}
          bgcolor={"#EBEBE4"}
        >
          <LocalShippingOutlinedIcon className={commonStyles.Discount} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.dealType}>
              Free Shipping
            </Typography>
            <Typography>Create a free shipping deal.</Typography>
          </Grid>
        </Grid>

        <Grid
          className={commonStyles["deal-card-container"]}
          bgcolor={"#EBEBE4"}
        >
          <PaidOutlinedIcon className={commonStyles.Discount} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.dealType}>
              Multi-Buy
            </Typography>
            <Typography>
              Create either a single-tier deal or multi-tier deal.
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Grid container justifyContent="center">
        <Grid item lg={6} md={8} sm={9}>
          <Grid className={commonStyles.btnSection}>
            <Button
              variant="contained"
              className={commonStyles.cancelBtn}
              onClick={() => router.push("/deals")}
            >
              Cancel
            </Button>
            <Button
              onClick={() => ContinueDeal()}
              variant="contained"
              disabled={!discountDealSelected}
              className={commonStyles.continueBtn}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Step1;
