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

function CreateDeal() {
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
            <Typography data-testid="createDealTitle" variant="h3" className={commonStyles.heading}>
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
          data-testid="dealBtn"
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
          className={commonStyles["disable-deal-card-container"]}
          bgcolor={"#F0F0F0"}
          sx={{ cursor: "not-allowed !important" }}
        >
          <LocalShippingOutlinedIcon className={commonStyles.disableDeals} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.disableDealType}>
              Free Shipping
            </Typography>
            <Typography color="#CCCCCC" >Create a free shipping deal.</Typography>
          </Grid>
        </Grid>

        <Grid
          className={commonStyles["disable-deal-card-container"]}
          bgcolor={"#F0F0F0"}
          sx={{ cursor: "not-allowed !important" }}
        >
          <PaidOutlinedIcon className={commonStyles.disableDeals} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.disableDealType}>
              Multi-Buy
            </Typography>
            <Typography color="#CCCCCC" >
              Create either a single-tier deal or multi-tier deal.
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Grid container justifyContent="center">
        <Grid item lg={6} md={8} sm={9} mt={5}>
          <Grid className={commonStyles.btnSection}>
            <Button
              data-testid="CancelBtn"
              variant="contained"
              className={commonStyles.cancelBtn}
              onClick={() => router.push("/deals")}
            >
              Cancel
            </Button>
            <Button
              data-testid="ContinueBtn"
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

export default CreateDeal;
