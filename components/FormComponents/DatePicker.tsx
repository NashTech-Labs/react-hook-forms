import React from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useController, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import styles from "./FormComponents.module.css";
import FieldErrorMessage from "./FieldErrorMessage";

interface IDatePickerProps {
  name: string;
  disabled?: boolean;
  minDate?: object;
  required: boolean;
}

function DatePicker({ disabled, name, minDate }: IDatePickerProps) {
  const { control, setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });
  const { onChange, onBlur, ref, value } = field;
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        label={value ? "" : "MM/DD/YYYY"}
        inputFormat="MM/DD/YYYY"
        className={styles["date-picker"]}
        disablePast
        disabled={disabled}
        onOpen={() => {
          {
            minDate ? setValue("endDatePicker", minDate) : null;
          }
        }}
        value={value}
        minDate={minDate}
        onChange={onChange}
        onClose={onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            error={error?true:false}
            onBlur={onBlur}
            InputLabelProps={{ shrink: false }}
          />
        )}
      />
      {error && <FieldErrorMessage message={error.message} />}
    </LocalizationProvider>
  );
}

export default DatePicker;
