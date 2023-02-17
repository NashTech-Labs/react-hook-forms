import React, { useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useController, useFormContext } from "react-hook-form";
import { IconButton,InputAdornment, TextField } from "@mui/material";
import styles from "./FormComponents.module.css";
import FieldErrorMessage from "./FieldErrorMessage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface IDatePickerProps {
  name: string;
  disabled?: boolean;
  minDate?: object;
  required: boolean;
}

function DatePicker({ disabled, name, minDate }: IDatePickerProps) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });
  const { onChange, onBlur, value } = field;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        label={value ? "" : "MM/DD/YYYY"}
        inputFormat="MM/DD/YYYY"
        className={styles["date-picker"]}
        disablePast
        disabled={disabled}
        open={open}
        onClose={() => {
          setOpen(false);
          onBlur();
        }}
        value={value}
        minDate={minDate}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            error={error ? true : false}
            onBlur={onBlur}
            InputLabelProps={{ shrink: false }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {error && <ErrorOutlineIcon sx={{ color: "red" }} />}
                  <IconButton
                    sx={{
                      marginRight: "-12px",
                    }}
                    onClick={()=>setOpen(true)}
                    disabled={disabled}
                  >
                    <CalendarMonthIcon
                      sx={
                        !disabled
                          ? { color: "#333333" }
                          : { color: "rgba(0,0,0,0.38)" }
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {error && <FieldErrorMessage message={error.message} />}
    </LocalizationProvider>
  );
}

export default DatePicker;
