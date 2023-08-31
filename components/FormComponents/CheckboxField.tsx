import React from "react";
import { useFormContext, useController } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface ICheckboxFieldProps {
  label?: string;
  name: string;
}

const CheckboxField = ({ label, name }: ICheckboxFieldProps) => {
  const { control } = useFormContext();
  const { field } = useController({
    control,
    name,
  });
  const { onChange, onBlur, value } = field;
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={onChange}
          onBlur={onBlur}
          sx={{
            paddingRight: "8px",
          }}
        />
      }
      label={label}
    />
  );
};

export default CheckboxField;
