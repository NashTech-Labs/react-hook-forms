import React from "react";
import { Card, Divider, Grid, Typography } from "@mui/material";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import commonStyles from "../Steps.module.css";
import FormCardPreview from "../../FormCardPreview";
import styles from "./DateInEffect.module.css";
import { Moment } from "moment";
import moment from "moment";
import { useWatch } from "react-hook-form";
import DatePicker from "../../FormComponents/DatePicker";
import InputTimePicker from "../../FormComponents/TimePicker";

function DateInEffect() {
  
  const startDateValue = useWatch({
    name: "startDatePicker",
  });

  const endDateValue = useWatch({
    name: "endDatePicker",
  });

  const startTimeValue = useWatch({
    name: "startTimePicker",
  });

  const convertToUTC = (date: Moment | null, time: Moment | null) => {
    let utcTimestamp = moment
      .utc(
        moment(
          `${moment(date).format("YYYY-MM-DD")}` +
            " " +
            `${moment(time).format("HH:mm:ss")}`
        ).format()
      )
      .valueOf();

    return utcTimestamp;
  };

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
              <InputTimePicker name="startTimePicker" dateValue={startDateValue} required />
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
                disabled={(startDateValue && startTimeValue)=== null}
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
                dateValue={endDateValue}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <FormCardPreview
        title="Customer preview"
        description="Preview will generate after inputs are completed"
      />
    </Card>
  );
}

export default DateInEffect;
