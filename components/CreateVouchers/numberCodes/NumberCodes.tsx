import React from "react";
import StepperCard from "../../CreateDeal/StepperCard";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import { Grid } from "@mui/material";
import TextInputField from "../../FormComponents/TextInputField";
import RadioGroupField from "../../FormComponents/RadioGroupField";
import { voucherCodeOptions } from "../../../constants/FormOptions";

function NumberCodes() {
  return (
    <StepperCard inProgressIcon={DataUsageIcon} error step={"NUMBER_CODES"}>
      <StepLabel currentStep={4} totalSteps={7} />
      <StepTitle title={"Number of Codes and Details"} />

      <Grid>
        <TextInputField
          title="Maximum number of vouchers to create"
          placeholder="eg. 1,000,000"
          name="voucherQuantity"
          type="number"
          required
          inputHeight={true}
          tooltipKey={"VOUCHER_QUANTITY"}
        />

        <RadioGroupField
          noBottomGutters
          options={voucherCodeOptions}
          label="How often can the customer use this voucher?"
          name="useVoucherOptions"
          required={true}
          tooltipKey={"VOUCHER_USAGE"}
        />
      </Grid>
    </StepperCard>
  );
}

export default NumberCodes;
