import React, { useEffect } from "react";
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
import { basketVoucherTabs, dealLevelOptions, productVoucherTabs, voucherValueDollarOffCriteriaOptions, } from "../../../constants/FormOptions";
import { generatePreviewForValueStep } from "../../../util/generatePreview";
import styles from "./SerializedVoucherValue.module.css";
import SelectField from "../../FormComponents/SelectField";
import { getPointsData, useGetPointsQuery } from "../../../api/getPoints";
import { useAppSelector } from "../../../store";
import { userProfileState } from "../../../store/feature/auth/authSlice";
import CheckboxField from "../../FormComponents/CheckboxField";

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
    basketpointsApplyType,
    basketdollarPointDiscount,
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
      setValue("voucherDiscountTab", "dollar");
      setValue("voucherLevel", "product");
      setValue("pointsApplyType", "");
      clearErrors(["basketSpend", "basketDiscount"]);
    }

    if (level === "basket") {
      setValue("dollarOff", "");
      setValue("basketDiscount", "");
      setValue("fixedPriceOff", "");
      setValue("voucherLevel", "basket");
      setValue("basketpointsApplyType", "")
      setValue("productExclusionsCollectionTab", "uploadProduct");
      setValue("exFileName", null);
      setValue("exFileMCH", []);
      setValue("exFileLIAM", []);
      setValue("exliam", []);
      setValue("exmch", []);
      clearErrors(["dollarOff", "fixedPriceOff", "dollarPointDiscount"]);
    }
  };

  useEffect(() => {
    if (voucherDiscountTab === "dollar" || voucherDiscountTab === "points")
    {
      setValue('voucherDiscountTab', voucherDiscountTab)
    }
  }, [voucherDiscountTab, voucherLevel])

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
    if (voucherDiscountTab === 'dollar')
    {
      content = (
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
      );
    }

    if (voucherDiscountTab === 'points') {
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
            name="basketpointsApplyType"
            inputHeight={true}
            spendOption={true}
          />

        </Grid>
        <Grid item md={6}>
          <TextInputField
            name="basketdollarPointDiscount"
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

    if (voucherDiscountTab === 'fulfillment') {
      content = (
        <>
        <Grid
        container
        className={styles["basket-fields"]}
        wrap="nowrap"
        alignItems={"baseline"}
      >
        <Grid item md={5}>
            <TextInputField
              name="fulfillmentSpend"
              placeholder='$ 0.00'
              type='number'
              title="Spend"
              inline
              required
              displayDollarFormat
              inputHeight={true}
            />

        </Grid>
        <Grid item md={6}>
          Get free pickup or delivery
        </Grid>
      </Grid>

      <CheckboxField name="waivefess" label={"Waive additional service fees"} />
      </>
      );
    }

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
        
        <StyledTabs tabs={ voucherLevel === "product" ? productVoucherTabs : basketVoucherTabs} handleTabUpdate={handleTabUpdate} defaultValue={voucherDiscountTab} />

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
