import React, { useEffect } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Divider, Grid, Typography } from "@mui/material";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import FormCardPreview from "../../FormCardPreview";
import styles from "./DateInEffect.module.css";
import { useFormContext, useWatch } from "react-hook-form";
import DatePicker from "../../FormComponents/DatePicker";
import InputTimePicker from "../../FormComponents/TimePicker";
import { dateTimePreviewGenerator } from "../../../util/ConvertDateTime";
import moment from "moment";
import { useAppSelector } from "../../../store";
import { updatedDealLevel, updatedDealStep } from "../../../store/feature/deal/dealSlice";
import StepperCard from '../StepperCard'
import { FREE_SHIPPING_DEAL_TYPE } from '../../../constants/FormOptions'

function DateInEffect({ deal: deal }: any) {
  const { setValue, trigger } = useFormContext();
  const dealName = useAppSelector(updatedDealStep);
  const dealLevelName = useAppSelector(updatedDealLevel)

  const startDateValue = useWatch({
    name: "startDatePicker",
  });

  const endDateValue = useWatch({
    name: "endDatePicker",
  });

  const endTimeValue = useWatch({
    name: "endTimePicker",
  });

  const startTimeValue = useWatch({
    name: "startTimePicker",
  });

  let desc: string | null = "Preview will generate after inputs are completed";

  if (startDateValue && startTimeValue && endDateValue && endTimeValue) {
    desc = dateTimePreviewGenerator(
      startDateValue,
      startTimeValue,
      endDateValue,
      endTimeValue
    );
  }

  useEffect(() => {
    if (startDateValue && startTimeValue && endDateValue && endTimeValue) {
      setValue("startTimePicker", startDateValue, { shouldValidate: true });
      trigger("endDatePicker");
      trigger("endTimePicker");
    }
    if (startDateValue) {
      setValue("startTimePicker", startDateValue, { shouldValidate: true });
    }
  }, [startDateValue]);

  useEffect(() => {
    if (endDateValue) {
      setValue("endTimePicker", endDateValue, { shouldValidate: true });
    }
  }, [endDateValue]);

  useEffect(() => {
    if (startDateValue && startTimeValue && endDateValue && endTimeValue) {
      trigger("endTimePicker");
    }
  }, [startTimeValue]);

  useEffect(() => {
    if (deal?.generalDealInfo?.status === "ENDED") {
      setValue("startTimePicker", null);
      setValue("endTimePicker", null);
      setValue("startDatePicker", null);
      setValue("endDatePicker", null);
    }
  }, [])

  return (
    <StepperCard step={'DATE_IN_EFFECT'} inProgressIcon={CalendarMonthOutlinedIcon}>
      <StepLabel currentStep={dealName === FREE_SHIPPING_DEAL_TYPE ? 5 : 4} totalSteps={dealName === FREE_SHIPPING_DEAL_TYPE || dealLevelName === 'basket' ? 6 : 7} />
      <StepTitle title={"Date in effect"} />
      <Grid container>
        <Grid item lg={12}>
          <Typography variant="body2" className={styles["subtitle"]} my={3}>
            Starts:
          </Typography>
          <Grid container justifyContent="space-between" spacing={4} mb={6}>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Date
              </Typography>
              <DatePicker name="startDatePicker" required minDate={moment().subtract(1, "days")} />
            </Grid>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Time
              </Typography>
              <InputTimePicker name="startTimePicker" required />
            </Grid>
          </Grid>
        </Grid>
        <Divider
          sx={{ border: "1px solid rgba(0, 0, 0, 0.25)", width: "100%" }}
        ></Divider>
        <Grid item lg={12}>
          <Typography
            variant="body2"
            className={styles["subtitle"]}
            mt={4}
            mb={3}
          >
            Ends:
          </Typography>
          <Grid container justifyContent="space-between" spacing={4} mb={6}>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Date
              </Typography>
              <DatePicker
                name="endDatePicker"
                disabled={(startDateValue && startTimeValue) === null}
                minDate={startDateValue}
                required
              />
            </Grid>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Time
              </Typography>
              <InputTimePicker
                name="endTimePicker"
                disabled={(startDateValue && startTimeValue) === null}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <FormCardPreview title="Customer preview" description={desc} />
    </StepperCard>
  );
}

export default DateInEffect;
