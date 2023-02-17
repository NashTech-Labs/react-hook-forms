import React, { useEffect } from "react";
import { Card, Divider, Grid, Typography } from "@mui/material";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import commonStyles from "../Steps.module.css";
import FormCardPreview from "../../FormCardPreview";
import styles from "./DateInEffect.module.css";
import { useFormContext, useWatch } from "react-hook-form";
import DatePicker from "../../FormComponents/DatePicker";
import InputTimePicker from "../../FormComponents/TimePicker";
import { dateTimePreviewGenerator } from "../../../util/ConvertDateTime";

function DateInEffect() {
  const { setValue, trigger } = useFormContext();

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

  let desc = "Preview will generate after inputs are completed";

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

  return (
    <Card className={commonStyles["step-card-container"]}>
      <StepLabel currentStep={4} totalSteps={7} />
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
              <DatePicker name="startDatePicker" required />
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
    </Card>
  );
}

export default DateInEffect;
