import React, { useState } from "react";
import { Card, Divider, Grid, TextField, Typography } from "@mui/material";
import StepLabel from "../StepLabel";
import StepTitle from "../StepTitle";
import commonStyles from "./Steps.module.css";
import FormCardPreview from "../FormCardPreview";
import styles from "./DateInEffect.module.css";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import moment from "moment";

function DateInEffect() {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [minDate, setMinDate] = useState<any>(null);

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

  const handleStartDateChange = (newStartDate: Moment | null) => {
    setStartDate(newStartDate);
    setMinDate(moment(newStartDate).add(1, "days"));
  };

  const handleStartTimeChange = (newStartTime: Moment | null) => {
    setStartTime(newStartTime);
  };

  const handleEndDateChange = (newEndDate: Moment | null) => {
    setEndDate(newEndDate);
  };

  const handleEndTimeChange = (newEndTime: Moment | null) => {
    setEndTime(newEndTime);
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
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  label={startDate ? "" : "MM/DD/YYYY"}
                  inputFormat="MM/DD/YYYY"
                  className={styles["date-picker"]}
                  disablePast
                  value={startDate}
                  onChange={handleStartDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                  label={startTime ? "" : "Select time (in EST)"}
                  value={startTime}
                  className={styles["date-picker"]}
                  onChange={handleStartTimeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  label={endDate ? "" : "MM/DD/YYYY"}
                  inputFormat="MM/DD/YYYY"
                  className={styles["date-picker"]}
                  disabled={startDate === null}
                  minDate={minDate}
                  onOpen={() => {
                    setEndDate(minDate);
                  }}
                  value={endDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item lg={6}>
              <Typography
                variant="body2"
                className={styles["field-title"]}
                mb={1}
              >
                Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                  label={endTime ? "" : "Select time (in EST)"}
                  value={endTime}
                  className={styles["date-picker"]}
                  disabled={startDate === null}
                  onChange={handleEndTimeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: false }}
                    />
                  )}
                />
              </LocalizationProvider>
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
