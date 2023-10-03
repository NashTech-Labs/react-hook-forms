import React from "react";
import { useFormContext, useController } from "react-hook-form";
import { SelectChangeEvent } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FieldErrorMessage from "../FormComponents/FieldErrorMessage";
import styles from "./FormComponents.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CustomTooltip from "../Tooltip";
import Stack from "@mui/material/Stack";
import { BooleanSchema } from "yup";

interface ISelectFieldProps {
  title?: string;
  options: { [index: string]: string };
  name: string;
  required?: boolean;
  inputHeight?: boolean;
  dealCriteria?: boolean;
  tooltipKey?: string;
  topGutters?: boolean;
  placeholder?: string;
  multiple?: boolean;
  selectAllLabel?: string;
  spendOption?: boolean;
  inline?: boolean;
}

const EmptyIconComponent = () => <div />;

const SelectField = ({
  options,
  name,
  required,
  title,
  inputHeight,
  dealCriteria,
  tooltipKey,
  topGutters,
  placeholder,
  multiple,
  selectAllLabel,
  spendOption,
  inline,
}: ISelectFieldProps) => {
  const { control, setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });
  const { onChange, onBlur, ref, value } = field;
  const titleClassNames = [];
  required && titleClassNames.push(styles["required"]);
  const displayPlaceHolder = placeholder || "Select Type";

  const handleChange = (e: SelectChangeEvent) => {
    if (!multiple) {
      onChange(e);
      return;
    }
    const {
      target: { value },
    } = e;
    if (value.length === 1 && value.includes("all")) {
      setValue(name, Object.keys(options), { shouldValidate: true });
    } else if (value[value.length - 1] === "all") {
      setValue(
        name,
        value.length === Object.keys(options).length + 1
          ? []
          : Object.keys(options),
        { shouldValidate: true }
      );
    } else {
      setValue(name, value, { shouldValidate: true });
    }
  };

  const RenderValue = () => {
    if (!value) return displayPlaceHolder;

    if (typeof value === "string") {
      return options[String(value)];
    }
    if (Array.isArray(value)) {
      return (
        <Box>
          {value.map((selected) => (
            <Chip
              key={selected}
              label={options[selected]}
              sx={{
                borderRadius: "0px",
                marginRight: "5px",
                height: "fit-content",
              }}
            />
          ))}
        </Box>
      );
    }

    return null;
  };

  const dropdownOptionsForMultiple = Object.keys(options).map((key) => (
    <MenuItem key={key} value={key}>
      <ListItemIcon>
        <Checkbox checked={value?.includes(key)} />
      </ListItemIcon>
      <ListItemText> {options[key]}</ListItemText>
    </MenuItem>
  ));

  const selectAll = (
    <MenuItem key={"select-all"} value="all">
      <ListItemIcon>
        <Checkbox checked={value?.length === Object.keys(options).length} />
      </ListItemIcon>
      <ListItemText>{selectAllLabel}</ListItemText>
    </MenuItem>
  );

  const dropdownOptions = Object.keys(options).map((key) => (
    <MenuItem key={key} value={key}>
      {options[key]}
    </MenuItem>
  ));

  return (
    <FormControl
      className={
        dealCriteria
          ? styles["stack-type-form-control-deal-criteria"]
          : styles["stack-type-form-control"]
      }
      sx={{ marginTop: topGutters ? "20px" : "0px" }}
    >
      <Stack
        direction={inline ? "row" : "column"}
        gap={1}
        alignItems={inline ? "baseline" : "none"}
      >
        {title && (
          <div className={styles["title-container"]}>
            <Typography
              variant="body1"
              gutterBottom
              className={titleClassNames.join(" ")}
            >
              {title}
            </Typography>
            {tooltipKey && <CustomTooltip descriptionKey={tooltipKey} />}
          </div>
        )}
        <Stack>
          <Select
            multiple={multiple}
            labelId="statcking-type-select"
            id={name}
            value={value}
            size="small"
            onChange={handleChange}
            displayEmpty
            renderValue={() => RenderValue()}
            className={
              spendOption
                ? styles["spend-points"]
                : dealCriteria
                ? styles["select-deal-criteria"]
                : styles["select"]
            }
            inputRef={ref}
            name={name}
            onBlur={onBlur}
            error={Boolean(error)}
            IconComponent={error ? EmptyIconComponent : ArrowDropDownIcon}
            endAdornment={
              <InputAdornment position="end" sx={{ marginRight: "5px" }}>
                {error && (
                  <>
                    <ErrorOutlineIcon className={styles["select-error-icon"]} />
                    <ArrowDropDownIcon />
                  </>
                )}
              </InputAdornment>
            }
            sx={{
              width: inline ? "250px " : "350px",
              "&.Mui-error": {
                background: "#FEFAF9",
              },
              ".MuiSelect-select": {
                color: value ? "#000000" : "#666B73",
              },
              height: inputHeight ? "40px" : "auto",
              "::placeholder": {
                color: "#666B73 !important",
                opacity: "1 !important",
                fontWeight: "400 !important ",
                fontSize: "16px !important",
                lineHeight: "120% !important",
              },
            }}
            data-testid={name}
            inputProps={{
              "data-testid": `${name}-input`,
            }}
          >
            {multiple && selectAll}
            {multiple && dropdownOptionsForMultiple}
            {!multiple && dropdownOptions}
          </Select>
          {error && (
            <FieldErrorMessage
              message={error.message}
              testId={`${name}-field-error`}
            />
          )}
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default SelectField;
