import React, { useEffect } from "react";
import { useFormContext, useWatch, useController } from "react-hook-form";
import { Stack, FormLabel, Box } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import StepperCard from "../../CreateDeal/StepperCard";
import SelectField from "../../FormComponents/SelectField";
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import Tag from "../../Tag";
import {
  BANNER_RESTRICTIONS,
  dealLevelExclusionOptions,
  REGION_RESTRICTIONS,
} from "../../../constants/FormOptions";
import RadioGroupField from "../../FormComponents/RadioGroupField";
import CheckboxField from "../../FormComponents/CheckboxField";
import FieldErrorMessage from "../../FormComponents/FieldErrorMessage";
import CustomTooltip from "../../Tooltip";
import styles from "../../FormComponents/FormComponents.module.css";

const BannerRestrictions = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const { control, setValue, getValues, clearErrors } = useFormContext();
  const {
    fieldState: { error: pickUpOrdersError },
  } = useController({ control, name: "pickUpOrders" });
  const {
    fieldState: { error: deliveryOrdersError },
  } = useController({ control, name: "deliveryOrders" });
  const regionRestriction = useWatch({
    control,
    name: "regionRestriction",
  });
  const { pickUpOrders, deliveryOrders } = getValues();

  useEffect(() => {
    if (pickUpOrders || deliveryOrders) {
      (pickUpOrdersError || deliveryOrdersError) &&
        clearErrors(["pickUpOrders", "deliveryOrders"]);
    }
  }, [
    pickUpOrders,
    deliveryOrders,
    clearErrors,
    pickUpOrdersError,
    deliveryOrdersError,
  ]);

  useEffect(() => {
    if (regionRestriction === "no") {
      setValue("regionRestrictions", []);
    }
  }, [regionRestriction, setValue]);

  const titleClassNames = [styles["labelHeading"], styles["required"]];
  return (
    <StepperCard inProgressIcon={StoreIcon} error step={"BANNER_RESTRICTIONS"}>
      <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
      <StepTitle title={"Banner Restrictions"} />
      <Tag label="Internal facing" />
      <Stack>
        <SelectField
          options={BANNER_RESTRICTIONS}
          name="restrictions"
          title="Voucher is valid for:"
          inputHeight={true}
          tooltipKey={""}
          placeholder="Choose a Banner"
          multiple
          selectAllLabel="All banners"
          required
        />
        <Stack marginTop={4}>
          <div>
            <FormLabel
              sx={{
                "&.Mui-focused": {
                  color: "black",
                },
              }}
              id="checkbox-group-label"
              className={titleClassNames.join(" ")}
            >
              Voucher is valid for:
            </FormLabel>
            {/* <CustomTooltip descriptionKey={""} /> */}
          </div>
          <CheckboxField name="pickUpOrders" label={"Pick-up Orders"} />
          <CheckboxField name="deliveryOrders" label={"Delivery Orders"} />
          {(pickUpOrdersError || deliveryOrdersError) && (
            <FieldErrorMessage
              message={
                pickUpOrdersError?.message || deliveryOrdersError?.message
              }
              testId={`fulfillment-field-error`}
            />
          )}
        </Stack>
        {/* <RadioGroupField
          options={dealLevelExclusionOptions}
          name="regionRestriction"
          label="Is this voucher restricted to a specific region?"
          required
          tooltipKey={""}
          noBottomGutters
        />
        {regionRestriction === "yes" && (
          <Box marginLeft={2} marginTop={2}>
            <SelectField
              options={REGION_RESTRICTIONS}
              name="regionRestrictions"
              title="Select Region(s)"
              inputHeight={true}
              tooltipKey={""}
              placeholder="Choose a Region"
              multiple
              selectAllLabel="All regions"
            />
          </Box>
        )} */}
      </Stack>
    </StepperCard>
  );
};

export default BannerRestrictions;
