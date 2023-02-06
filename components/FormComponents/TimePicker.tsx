import React from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useController, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import styles from "./FormComponents.module.css";
import FieldErrorMessage from "./FieldErrorMessage";

interface ITimePickerProps {
  name: string;
  disabled?: boolean;
  required: boolean;
  dateValue:object;
}

function InputTimePicker({ disabled, name,dateValue }: ITimePickerProps) {
  const { control,setValue } = useFormContext();
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
      <TimePicker
        label={value ? "" : "Select time (in EST)"}
        value={value}
        className={styles["date-picker"]}
        disabled={disabled}
        onOpen={()=>{
          setValue(name,dateValue)
        }}
        onChange={onChange}
        onClose = {onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            inputProps={{...params.inputProps, readOnly: true}}
            onBlur={onBlur}
            error={error?true:false}
            InputLabelProps={{ shrink: false }}
          />
        )}
      />
      {error && <FieldErrorMessage message={error.message} />}
    </LocalizationProvider>
  );
}

export default InputTimePicker;
