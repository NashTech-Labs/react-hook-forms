import React, { useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useController, useFormContext } from "react-hook-form";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import styles from "./FormComponents.module.css";
import FieldErrorMessage from "./FieldErrorMessage";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ITimePickerProps {
  name: string;
  disabled?: boolean;
  required: boolean;
}

function InputTimePicker({ disabled, name }: ITimePickerProps) {
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
      <TimePicker
        label={value ? "" : "Select time (in EST)"}
        value={value}
        className={styles["date-picker"]}
        disabled={disabled}
        open={open}
        onChange={onChange}
        onClose={() => {
          setOpen(false)
          onBlur()
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            onBlur={onBlur}
            error={error ? true : false}
            InputLabelProps={{ shrink: false }}
            inputProps={{...params.inputProps, "data-testid":name}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {error && <ErrorOutlineIcon sx={{ color: "red" }} />}
                  <IconButton
                    sx={{
                      marginRight: "-12px",
                    }}
                    onClick={() => setOpen(true)}
                    disabled={disabled}
                    data-testid = {`${name}-icon`}
                  >
                    <AccessTimeIcon
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
      {error && <FieldErrorMessage testId={`${name}-field-error`} message={error.message} />}
    </LocalizationProvider>
  );
}

export default InputTimePicker;
