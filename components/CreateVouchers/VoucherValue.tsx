import React, { ChangeEvent } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import StepperCard from "../CreateDeal/StepperCard";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import RadioGroupField from "../FormComponents/RadioGroupField";
import TextInputField from "../FormComponents/TextInputField";
import {
  dealLevelOptions,
  dealTabs,
  percentageOptions,
} from "../../constants/FormOptions";
import FormCardPreview from "../FormCardPreview";
import { generatePreviewForValueStep } from "../../util/generatePreview";
import StyledTabs from "../StyledTabs";
import { updateAndClearErrors } from "../../util/updateFields";

const VoucherValue = () => {
  const {
    dealDiscountTab,
    voucherLevel,
    percentageOff,
    customPercentageOff,
    dollarOff,
    fixedPriceOff,
    basketSpend,
    basketDiscount,
    basketDealType,
  } = useWatch();
  const { setValue, clearErrors, setFocus } = useFormContext();
  const customerPreview = generatePreviewForValueStep({
    tab: dealDiscountTab,
    level: voucherLevel,
    percentageOff,
    customPercentageOff,
    dollarOff,
    fixedPriceOff,
    basketSpend,
    basketDiscount,
    basketDealType,
  });
  const displayDollarFormat = basketDealType === "dollar";
  const displayPercentageFormat = basketDealType === "percentage";

  const getButtonVariant = (type: string) => {
    return type === basketDealType ? "contained" : "outlined";
  };

  const handleBasketDealTypeChange = (type: string): void => {
    setValue("basketDealType", type, { shouldValidate: true });
    clearErrors("basketDiscount");
  };

  const handleTabUpdate = (newTab: string): void => {
    if (newTab === "percentage") {
      if (percentageOff === "custom") {
        updateAndClearErrors({
          fields: ["dollarOff", "fixedPriceOff"],
          setValue,
          clearErrors,
        });
      } else {
        updateAndClearErrors({
          fields: [
            "dollarOff",
            "fixedPriceOff",
            "percentageOff",
            "customPercentageOff",
          ],
          setValue,
          clearErrors,
        });
        setValue("percentageOff", "10");
      }
    } else {
      updateAndClearErrors({
        fields: [
          "dollarOff",
          "fixedPriceOff",
          "percentageOff",
          "customPercentageOff",
        ],
        setValue,
        clearErrors,
      });
    }
    setValue("dealDiscountTab", newTab);
  };

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value === "product") {
      updateAndClearErrors({
        fields: ["basketSpend", "basketDiscount"],
        setValue,
        clearErrors,
      });
      setValue("dealDiscountTab", "dollar");
    } else {
      updateAndClearErrors({
        fields: [
          "dollarOff",
          "fixedPriceOff",
          "percentageOff",
          "customPercentageOff",
        ],
        setValue,
        clearErrors,
      });
      setValue("dealDiscountTab", "");
    }
  };

  const handleCustomPercentageChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value !== "custom") {
      setValue("customPercentageOff", "", { shouldValidate: true });
    }
  };

  let content = null;

  if (voucherLevel === "product") {
    if (dealDiscountTab === "dollar") {
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

    if (dealDiscountTab === "percentage") {
      content = (
        <>
          <RadioGroupField
            options={percentageOptions}
            label="Select percentage"
            name="percentageOff"
            required
            handleChange={handleCustomPercentageChange}
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ height: "fit-content" }}
          >
            <TextInputField
              placeholder="Enter numeric value between 1-99"
              noTopGutters
              disabled={percentageOff !== "custom"}
              name="customPercentageOff"
              inputHeight={true}
            />
            <Box paddingBottom={3}>%</Box>
          </Stack>
        </>
      );
    }

    if (dealDiscountTab === "fixed") {
      content = (
        <TextInputField
          title="Enter fixed price value"
          description="Must be numeric values only"
          placeholder="$ 0.00"
          type="number"
          name="fixedPriceOff"
          required
          displayDollarFormat
          inputHeight={true}
          tooltipKey={""}
        />
      );
    }
  }

  if (voucherLevel === "basket") {
    const endAdornmentForDollarFormat = displayDollarFormat ? undefined : (
      <div style={{ position: "absolute", left: "20%" }}>%</div>
    );
    const endAdornment = basketDiscount
      ? endAdornmentForDollarFormat
      : undefined;
    content = (
      <Stack
        direction="row"
        alignItems="baseline"
        spacing={3}
        minHeight="110px"
      >
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box>Get</Box>
          <ButtonGroup>
            <Button
              variant={getButtonVariant("percentage")}
              onClick={() => handleBasketDealTypeChange("percentage")}
            >
              %
            </Button>
            <Button
              variant={getButtonVariant("dollar")}
              onClick={() => handleBasketDealTypeChange("dollar")}
            >
              $
            </Button>
          </ButtonGroup>
        </Stack>
        <Stack>
          <TextInputField
            name="basketDiscount"
            placeholder={`${displayDollarFormat ? "$" : "%"} 0.00`}
            type="number"
            inline
            required
            displayDollarFormat={displayDollarFormat}
            displayPercentageFormat={displayPercentageFormat}
            endAdornment={endAdornment}
            inputHeight={true}
          />
        </Stack>
        <Box>Off</Box>
      </Stack>
    );
  }

  return (
    <StepperCard
      inProgressIcon={MonetizationOnOutlinedIcon}
      error
      step={"DEAL_VALUE"}
    >
      <StepLabel currentStep={3} totalSteps={7} />
      <StepTitle title={"Voucher value"} />
      <Stack>
        <RadioGroupField
          options={dealLevelOptions}
          name="voucherLevel"
          label="Is this a basket level or product level?"
          required
          tooltipKey={""}
          noBottomGutters
          handleChange={handleChange}
        />
        {/* <RadioGroupField
          options={freeShippingOptions}
          name="includeFreeShipping"
          label="Include Free Shipping?"
          required
          tooltipKey={""}
          noBottomGutters
        /> */}
        {voucherLevel === "product" && (
          <StyledTabs
            tabs={dealTabs}
            handleTabUpdate={handleTabUpdate}
            defaultValue={dealDiscountTab}
          />
        )}
        {content}
        <FormCardPreview
          title="Customer preview"
          description={customerPreview}
        />
      </Stack>
    </StepperCard>
  );
};

export default VoucherValue;
