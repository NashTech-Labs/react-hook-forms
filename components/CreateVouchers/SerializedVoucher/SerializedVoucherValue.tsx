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
import { dealLevelOptions, spendApplyOptions, voucherTabs } from "../../../constants/FormOptions";
import { generatePreviewForValueStep } from "../../../util/generatePreview";
import styles from "./SerializedVoucherValue.module.css";
import SelectField from "../../FormComponents/SelectField";

interface ISerializedVoucherValueProps {
  currentStep: number;
  totalSteps: number;
}

const SerializedVoucherValue = ({
  currentStep,
  totalSteps,
}: ISerializedVoucherValueProps) => {
  const { voucherLevel, dollarOff, basketSpend, basketDiscount, voucherDiscountTab } = useWatch();
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
  }

  let content = null;
  if (voucherLevel === "product") {

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
            options={spendApplyOptions}
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
          })}
        />
      </Stack>
    </StepperCard>
  );
};

export default SerializedVoucherValue;
