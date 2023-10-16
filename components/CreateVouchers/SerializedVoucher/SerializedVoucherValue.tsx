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
import {
  basketVoucherTabs,
  dealLevelOptions,
  productVoucherTabs,
  voucherValueDollarOffCriteriaOptions,
  buyQuantityOptions,
} from "../../../constants/FormOptions";
import { generatePreviewForSerializedVoucherValueStep } from "../../../util/generatePreview";
import styles from "./SerializedVoucherValue.module.css";
import SelectField from "../../FormComponents/SelectField";
import { getPointsData, useGetPointsQuery } from "../../../api/getPoints";
import { useAppSelector } from "../../../store";
import { userProfileState } from "../../../store/feature/auth/authSlice";
import CheckboxField from "../../FormComponents/CheckboxField";
import { updateAndClearErrors } from "../../../util/updateFields";
import { convertCentsToDollar } from "../../../util/convertDealToFormData";

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
    voucherDiscountTab,
    pointsApplyType,
    dollarPointDiscount,
    basketpointsApplyType,
    basketdollarPointDiscount,
    voucherValueDollarOffCriteria,
    fulfillmentSpend,
    dollarOffSpend,
    dollarOffMultiBuyQuantity,
    dollarOffMultiBuyDiscount,
    waivefess,
    basketDollarOff,
  } = useWatch();
  const { data } = useGetPointsQuery({ voucherDiscountTab, user });

  const getspendApplyOptions = (data: getPointsData | undefined) => {
    let value: { [index: string]: string } = {};
    if (data?.rewardIncrementResponse?.reward_increments) {
      data?.rewardIncrementResponse?.reward_increments.forEach((pointsdata) => {
        // value[pointsdata] = pointsdata;
        value[pointsdata] = voucherDiscountTab === "dollar" ? String((Number(pointsdata) / 100).toFixed(2)) : pointsdata;
      });
    }
    return value;
  };

  const { setValue, clearErrors, setError, register, unregister, trigger } =
    useFormContext();

  const handleChange = (e: any) => {
    const level = e.target.value;
    if (level === "product") {
      setValue("voucherLevel", "product");
      setValue("pointsApplyType", "");
      setValue("basketDollarOff", "");
      setValue("basketpointsApplyType", "");
      setValue("basketdollarPointDiscount", "");
      setValue("fulfillmentSpend", "");
      setValue("waivefess", "");
      clearErrors([
        "basketDollarOff",
        "basketpointsApplyType",
        "basketdollarPointDiscount",
        "fulfillmentSpend",
      ]);
    }

    if (level === "basket") {
      setValue("dollarOff", "");
      setValue("voucherLevel", "basket");
      setValue("basketpointsApplyType", "");
      setValue("basketdollarPointDiscount", "");
      setValue("productExclusionsCollectionTab", "uploadProduct");
      setValue("exFileName", null);
      setValue("exFileMCH", []);
      setValue("exFileLIAM", []);
      setValue("exliam", []);
      setValue("exmch", []);
      setValue("dollarOffSpend", "");
      setValue("dollarOffMultiBuyQuantity", "");
      setValue("dollarOffMultiBuyDiscount", "");
      setValue("dollarPointDiscount", "");
      setValue("pointsApplyType", "");
      setValue("voucherValueDollarOffCriteria", "MINIMUM_SPEND");
      clearErrors([
        "dollarOff",
        "dollarOffSpend",
        "dollarOffMultiBuyQuantity",
        "dollarOffMultiBuyDiscount",
        "dollarPointDiscount",
        "pointsApplyType",
      ]);
    }
    setValue("voucherDiscountTab", "dollar");
  };

  useEffect(() => {
    if (voucherValueDollarOffCriteria === "MINIMUM_SPEND") {
      if (dollarOff && dollarOffSpend) return;
      updateAndClearErrors({
        fields: ["dollarOffMultiBuyQuantity", "dollarOffMultiBuyDiscount"],
        setValue,
        clearErrors,
      });
      unregister(["dollarOffMultiBuyQuantity", "dollarOffMultiBuyDiscount"]);
      register("dollarOff");
      register("dollarOffSpend");
      setValue("dollarOff", "");
      setValue("dollarOffSpend", "");
    } else {
      updateAndClearErrors({
        fields: ["dollarOff", "dollarOffSpend"],
        setValue,
        clearErrors,
      });
      unregister(["dollarOff", "dollarOffSpend"]);
      register("dollarOffMultiBuyQuantity");
      register("dollarOffMultiBuyDiscount");
      !dollarOffMultiBuyQuantity && setValue("dollarOffMultiBuyQuantity", "2");
    }
  }, [voucherValueDollarOffCriteria]);

  // useEffect(() => {
  //   if (voucherLevel === "product") {
  //     setValue("pointsApplyType", "");
  //     setValue("dollarPointDiscount", "");
  //     clearErrors(["dollarPointDiscount", "basketdollarPointDiscount"]);
  //   } else {
  //     setValue("basketpointsApplyType", "");
  //     setValue("basketdollarPointDiscount", "");
  //     clearErrors(["dollarPointDiscount", "basketdollarPointDiscount"]);
  //   }
  // }, [voucherLevel]);

  useEffect(() => {
    if (pointsApplyType && dollarPointDiscount) {
      if (Number(pointsApplyType) > Number(dollarPointDiscount)) {
        clearErrors("dollarPointDiscount");
      } else {
        setError("dollarPointDiscount", {
          message: `Error: Discount amount can't be greater than or equal to the spending points`,
        });
      }
    }
  }, [pointsApplyType]);

  useEffect(() => {
    if (basketpointsApplyType && basketdollarPointDiscount) {
      if (Number(basketpointsApplyType) > Number(basketdollarPointDiscount)) {
        clearErrors("basketdollarPointDiscount");
      } else {
        setError("basketdollarPointDiscount", {
          message: `Error: Discount amount can't be greater than or equal to the spending points`,
        });
      }
    }
  }, [basketpointsApplyType]);

  useEffect(() => {
    dollarOff && dollarOffSpend && trigger("dollarOff");
  }, [dollarOff, dollarOffSpend]);

  const handleTabUpdate = (newTab: string): void => {
    if (voucherLevel === "product") {
      if (newTab === "points") {
        updateAndClearErrors({
          fields: [
            "dollarOff",
            "dollarOffSpend",
            "dollarOffMultiBuyQuantity",
            "dollarOffMultiBuyDiscount",
          ],
          setValue,
          clearErrors,
        });
      } else {
        updateAndClearErrors({
          fields: ["pointsApplyType", "dollarPointDiscount"],
          setValue,
          clearErrors,
        });
      }
    }

    if (voucherLevel === "basket") {
      if (newTab === "dollar") {
        updateAndClearErrors({
          fields: [
            "basketpointsApplyType",
            "basketdollarPointDiscount",
            "fulfillmentSpend",
            "waivefess",
          ],
          setValue,
          clearErrors,
        });
      } else if (newTab === "points") {
        updateAndClearErrors({
          fields: ["basketDollarOff", "fulfillmentSpend", "waivefess"],
          setValue,
          clearErrors,
        });
      } else {
        updateAndClearErrors({
          fields: [
            "basketDollarOff",
            "basketpointsApplyType",
            "basketdollarPointDiscount",
          ],
          setValue,
          clearErrors,
        });
      }
    }

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
          />
          {voucherValueDollarOffCriteria === "MINIMUM_SPEND" ? (
            <Grid
              container
              className={styles["basket-fields"]}
              wrap="nowrap"
              alignItems={"baseline"}
            >
              <Grid item md={5}>
                <SelectField
                  options={getspendApplyOptions(data)}
                  name="dollarOffSpend"
                  inputHeight={true}
                  spendOption={true}
                  inline
                  title="Spend"
                  placeholder="$ 0.00"
                />
              </Grid>
              <Grid item md={6}>
                <TextInputField
                  inline
                  title="Get"
                  placeholder="$ 0.00"
                  type="number"
                  name="dollarOff"
                  required
                  displayDollarFormat
                  inputHeight={true}
                  tooltipKey={""}
                />
              </Grid>
              <Grid item md={1}>
                <Typography>Off</Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              className={styles["basket-fields"]}
              wrap="nowrap"
              alignItems={"baseline"}
            >
              <Grid item md={5}>
                <SelectField
                  inline
                  title="Buy"
                  options={buyQuantityOptions}
                  name="dollarOffMultiBuyQuantity"
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
            <TextInputField
              name="dollarPointDiscount"
              placeholder={`$ 0.00`}
              type="number"
              inline
              required
              displayDollarFormat
              inputHeight={true}
              title="Spend"
            />
          </Grid>
          <Grid item md={6}>
          <SelectField
              inline
              title="Get"
              options={getspendApplyOptions(data)}
              name="pointsApplyType"
              inputHeight={true}
              spendOption={true}
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
    if (voucherDiscountTab === "dollar") {
      content = (
        <TextInputField
          title="Enter dollar ($) off"
          description="Must be numeric values only"
          placeholder="$ 0.00"
          type="number"
          name="basketDollarOff"
          required
          displayDollarFormat
          inputHeight={true}
          tooltipKey={""}
        />
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
            <TextInputField
              name="basketdollarPointDiscount"
              placeholder={`$ 0.00`}
              type="number"
              inline
              required
              displayDollarFormat
              inputHeight={true}
              title="Spend"
            /> 
          </Grid>
          <Grid item md={6}>
            <SelectField
              inline
              title="Get"
              options={getspendApplyOptions(data)}
              name="basketpointsApplyType"
              inputHeight={true}
              spendOption={true}
            />
          </Grid>
          <Grid item md={1}>
            <Typography>Off</Typography>
          </Grid>
        </Grid>
      );
    }

    if (voucherDiscountTab === "fulfillment") {
      content = (
        <>
          <Grid
            container
            className={styles["basket-fields"]}
            wrap="nowrap"
            alignItems={"baseline"}
            display={"grid"}
          >
            <Grid display={"flex"} justifyContent={"space-between"} >
            <Grid item md={5}>
              <TextInputField
                name="fulfillmentSpend"
                placeholder="$ 0.00"
                type="number"
                title="Spend"
                inline
                required
                displayDollarFormat
                inputHeight={true}
              />
            </Grid>
            <Grid item md={6} mt={3}>
              Get free pickup or delivery
            </Grid>
            </Grid>
            <Grid mt="-5%" >
              <CheckboxField
                name="waivefess"
                label={"Waive additional service fees"}
            />
          </Grid>
          </Grid>
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

        <StyledTabs
          tabs={
            voucherLevel === "product" ? productVoucherTabs : basketVoucherTabs
          }
          handleTabUpdate={handleTabUpdate}
          defaultValue={voucherDiscountTab}
          value={voucherDiscountTab}
        />

        {content}
        <FormCardPreview
          title="Customer preview"
          description={generatePreviewForSerializedVoucherValueStep({
            voucherLevel,
            voucherDiscountTab,
            voucherValueDollarOffCriteria,
            dollarOffSpend,
            dollarOff,
            dollarOffMultiBuyQuantity,
            dollarOffMultiBuyDiscount,
            pointsApplyType,
            dollarPointDiscount,
            basketpointsApplyType,
            basketdollarPointDiscount,
            fulfillmentSpend,
            waivefess,
            basketDollarOff,
          })}
        />
      </Stack>
    </StepperCard>
  );
};

export default SerializedVoucherValue;
