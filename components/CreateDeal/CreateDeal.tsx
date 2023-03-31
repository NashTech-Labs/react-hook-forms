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
import { updateDealLevel, updateDealStep } from "../../store/feature/deal/dealSlice";
import { useAppDispatch } from "../../store/index";
import commonStyles from "./Steps.module.css";
import CreateDealDefaultFormState from "../../constants/CreateDealDefaultFormState";
import { getNewDealData, updateNewDeal } from "../../store/feature/deal/newDealSlice";

function CreateDeal() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [dealType, setDealType] = useState("")

  const handleDealValue = (type: string) => {
    setDealType(type)
  };

  const ContinueDeal = () => {
    dispatch(updateDealStep(dealType));
    dispatch(updateNewDeal(CreateDealDefaultFormState))
    dispatch(updateDealLevel('product'))
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
            handleDealValue("discount");
          }}
          className={commonStyles["deal-card-container"]}
          bgcolor={dealType === "discount" ? "#E6ECF6" : "#fff"}
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
          data-testid="dealBtn"
          onClick={() => {
            handleDealValue("multi-buy");
          }}
          className={commonStyles["deal-card-container"]}
          bgcolor={dealType === "multi-buy" ? "#E6ECF6" : "#fff"}
        >
          <DiscountOutlinedIcon className={commonStyles.Discount} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.dealType}>
              Multi-Buy
            </Typography>
            <Typography>
              Create either a single-tier deal or multi-tier deal.
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid
          data-testid="dealBtn"
          onClick={() => {
            handleDealValue("free-shipping");
          }}
          className={commonStyles["deal-card-container"]}
          bgcolor={dealType === "free-shipping" ? "#E6ECF6" : "#fff"}      >
          <LocalShippingOutlinedIcon className={commonStyles.Discount} />
          <Grid className={commonStyles.dealTitle}>
            <Typography variant="h6" className={commonStyles.dealType}>
              Free Shipping
            </Typography>
            <Typography >Create a free shipping deal.</Typography>
          </Grid>
        </Grid> */}

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
              disabled={dealType === "discount" || dealType === "multi-buy" || dealType === "free-shipping" ? false : true}
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
