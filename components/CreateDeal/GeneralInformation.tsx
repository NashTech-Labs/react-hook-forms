import React, { useState } from "react";
import { useFormContext, useController } from 'react-hook-form'
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import TextInputField from "../FormComponents/TextInputField";
import StepLabel from "../StepLabel";
import Tag from "../Tag";
import StepTitle from "../StepTitle";
import { stackTypeOptions } from "../../constants/FormOptions";
import styles from "./GeneralInformation.module.css";
import commonStyles from './Steps.module.css'

const GeneralInformation = () => {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name: 'stackingType'
  })
  const { onChange, onBlur, ref, value } = field

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item lg={8} md={8} sm={9}>
          <Grid display="flex" justifyContent="space-between" mt={8}>
            <Typography variant="h3" className={styles.heading}>
              Create New Discount Deal
            </Typography>
            <Typography></Typography>
          </Grid>
        </Grid>
      </Grid>

      <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={2} totalSteps={7} />
        <StepTitle title={"General Information"} />
        <Tag label="Internal facing" />
        <TextInputField
          title="Title"
          description="Max 80 characters"
          placeholder="eg. WK10 20% Off On All Sale Items"
          name="title"
        />
        <TextInputField
          title="Description"
          placeholder="Enter description for deal"
          multiline
          name="description"
        />
        <TextInputField
          title="Identifier"
          description="Max 15 characters alphanumeric values"
          placeholder="00000 00000 00000"
          name="identifier"
        />
        <TextInputField
          title="Priority"
          description="Numeric values between 1 to 100"
          placeholder="eg 100"
          name="priority"
        />
        <Typography variant="body1" gutterBottom>
          Stacking Type
        </Typography>
        <FormControl className={styles["stack-type-form-control"]}>
          <Select
            labelId="statcking-type-select"
            id="statcking-type-select"
            value={value}
            size="small"
            onChange={onChange}
            displayEmpty
            renderValue={(value) =>
              value ? stackTypeOptions[String(value)] : "Select Type"
            }
            className={styles["select"]}
            inputRef={ref}
            name={'stackingType'}
            onBlur={onBlur}
          >
            {Object.keys(stackTypeOptions).map((key) => (
              <MenuItem key={key} value={key}>
                {stackTypeOptions[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Card>
    </>
  );
};

export default GeneralInformation;
