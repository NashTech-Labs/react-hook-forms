import React from "react";
import { Grid, Typography, Stack } from "@mui/material";
import { useWatch, useFormContext } from "react-hook-form";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StepperCard from "../../CreateDeal/StepperCard";
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import RadioGroupField from "../../FormComponents/RadioGroupField";
import TextInputField from "../../FormComponents/TextInputField";
import FormCardPreview from "../../FormCardPreview";
import StyledTabs from "../../StyledTabs";
import {
  dealLevelOptions,
  voucherTabs,
  voucherValueDollarOffCriteriaOptions,
} from "../../../constants/FormOptions";
import { generatePreviewForValueStep } from "../../../util/generatePreview";
import styles from "./SerializedVoucherValue.module.css";
import SelectField from "../../FormComponents/SelectField";
import { getPointsData, useGetPointsQuery } from "../../../api/getPoints";
import { useAppSelector } from "../../../store";
import { userProfileState } from "../../../store/feature/auth/authSlice";

interface ISerializedVoucherValueProps {
  currentStep: number;
  totalSteps: number;
}

const SerializedVoucherValue = ({
  currentStep,
  totalSteps,
}: ISerializedVoucherValueProps) => {
  const user = useAppSelector(userProfileState);

  const {
    voucherLevel,
    dollarOff,
    basketSpend,
    basketDiscount,
    voucherDiscountTab,
    pointsApplyType,
    dollarPointDiscount,
    voucherValueDollarOffCriteria,
  } = useWatch();

  const { data } = useGetPointsQuery({ voucherDiscountTab, user });

  const getspendApplyOptions = (data: getPointsData | undefined) => {
    let value: { [index: string]: string } = {};
    if (data?.rewardIncrementResponse?.reward_increments) {
      data?.rewardIncrementResponse?.reward_increments.forEach((pointsdata) => {
        value[pointsdata] = pointsdata;
      });
    }
    return value;
  };

  const { setValue, clearErrors } = useFormContext();
  const handleChange = (e: any) => {
    const level = e.target.value;
    if (level === "product") {
      setValue("basketSpend", "");
      setValue("basketDiscount", "");
      setValue("dealDiscountTab", "dollar");
      clearErrors(["basketSpend", "basketDiscount"]);
    } else {
      setValue("dollarOff", "");
      setValue("basketDiscount", "");
      setValue("fixedPriceOff", "");
      setValue("dealDiscountTab", "");
      setValue("productExclusionsCollectionTab", "uploadProduct");
      setValue("exFileName", null);
      setValue("exFileMCH", []);
      setValue("exFileLIAM", []);
      setValue("exliam", []);
      setValue("exmch", []);
      clearErrors(["dollarOff", "fixedPriceOff"]);
    }
  };

  const handleTabUpdate = (newTab: string): void => {
    setValue("voucherDiscountTab", newTab);
  };

  let content = null;
  if (voucherLevel === "product") {
    if (voucherDiscountTab === "dollar") {
      content = (
        <>
          <RadioGroupField
            options={voucherValueDollarOffCriteriaOptions}
            name="voucherValueDollarOffCriteria"
            label="Is this a minimum spend or multi-buy offer?"
            required
            tooltipKey={""}
            noBottomGutters
            handleChange={handleChange}
          />
          {voucherValueDollarOffCriteria === "MINIMUM_SPEND" ? (
            <TextInputField
              title="Enter dollar ($) off"
              description="Must be numeric values only"
              placeholder="$ 0.00"
              type="number"
              name="dollarOff"
              required
              displayDollarFormat
              inputHeight={true}
              tooltipKey={""}
            />
          ) : (
            <Grid
              container
              className={styles["basket-fields"]}
              wrap="nowrap"
              alignItems={"baseline"}
            >
              <Grid item md={5}>
                <TextInputField
                  name="dollarOffMultiBuyQuantity"
                  placeholder="0"
                  type="number"
                  title="Buy"
                  inline
                  required
                  inputHeight={true}
                />
              </Grid>
              <Grid item md={6}>
                <TextInputField
                  name="dollarOffMultiBuyDiscount"
                  placeholder={`$ 0.00`}
                  type="number"
                  inline
                  required
                  displayDollarFormat
                  inputHeight={true}
                  title="Get"
                />
              </Grid>
              <Grid item md={1}>
                <Typography>Off</Typography>
              </Grid>
            </Grid>
          )}
        </>
      );
    }
    if (voucherDiscountTab === "points") {
      content = (
        <Grid
          container
          className={styles["basket-fields"]}
          wrap="nowrap"
          alignItems={"baseline"}
        >
          <Grid item md={5}>
            <SelectField
              options={getspendApplyOptions(data)}
              name="pointsApplyType"
              inputHeight={true}
              spendOption={true}
            />
          </Grid>
          <Grid item md={6}>
            <TextInputField
              name="dollarPointDiscount"
              placeholder={`$ 0.00`}
              type="number"
              inline
              required
              displayDollarFormat
              inputHeight={true}
              title="Get"
            />
          </Grid>
          <Grid item md={1}>
            <Typography>Off</Typography>
          </Grid>
        </Grid>
      );
    }
  }
  if (voucherLevel === "basket") {
    content = (
      <Grid
        container
        className={styles["basket-fields"]}
        wrap="nowrap"
        alignItems={"baseline"}
      >
        <Grid item md={5}>
          <TextInputField
            name="basketSpend"
            placeholder="$ 0.00"
            type="number"
            title="Spend"
            inline
            required
            displayDollarFormat
            inputHeight={true}
          />
        </Grid>
        <Grid item md={6}>
          <TextInputField
            name="basketDiscount"
            placeholder={`$ 0.00`}
            type="number"
            inline
            required
            displayDollarFormat
            inputHeight={true}
            title="Get"
          />
        </Grid>
        <Grid item md={1}>
          <Typography>Off</Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <StepperCard
      inProgressIcon={MonetizationOnOutlinedIcon}
      error
      step={"DEAL_VALUE"}
    >
      <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
      <StepTitle title={"Voucher value"} />
      <Stack>
        <RadioGroupField
          options={dealLevelOptions}
          name="voucherLevel"
          label="Is this at a basket level or product level?"
          required
          tooltipKey={""}
          noBottomGutters
          handleChange={handleChange}
        />
        {voucherLevel === "product" && (
          <StyledTabs tabs={voucherTabs} handleTabUpdate={handleTabUpdate} />
        )}
        {content}
        <FormCardPreview
          title="Customer preview"
          description={generatePreviewForValueStep({
            level: voucherLevel,
            dollarOff,
            basketSpend,
            basketDiscount,
            pointsApplyType,
            dollarPointDiscount,
          })}
        />
      </Stack>
    </StepperCard>
  );
};

export default SerializedVoucherValue;
