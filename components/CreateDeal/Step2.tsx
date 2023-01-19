import React, { useState } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Grid, SelectChangeEvent } from "@mui/material";
import TextInputField from "../FormComponents/TextInputField";
import StepLabel from "../StepLabel";
import Tag from "../Tag";
import StepTitle from "../StepTitle";
import { stackTypeOptions } from "../../constants/FormOptions";
import styles from "./Step2.module.css";

const Step2 = () => {
  const [stackingType, setStackingType] = useState<string>("");

  const handleChange = ({ target: { value } }: SelectChangeEvent) => {
    setStackingType(value);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item lg={8} md={8} sm={9}>
          <Grid display="flex" justifyContent="space-between" mt={8} mb={2}>
            <Typography variant="h3" className={styles.heading}>
              Create New Discount Deal
            </Typography>
            <Typography></Typography>
          </Grid>
        </Grid>
      </Grid>

      <Card className={styles["step-card-container"]}>
        <StepLabel currentStep={2} totalSteps={7} />
        <StepTitle title={"General Information"} />
        <Tag label="Internal facing" />
        <TextInputField
          title="Title"
          description="Max 80 characters"
          placeholder="eg. WK10 20% Off On All Sale Items"
        />
        <TextInputField
          title="Description"
          placeholder="Enter description for deal"
          multiline
        />
        <TextInputField
          title="Identifier"
          description="Max 15 characters alphanumeric values"
          placeholder="00000 00000 00000"
        />
        <TextInputField
          title="Priority"
          description="Numeric values between 1 to 100"
          placeholder="eg 100"
        />
        <Typography variant="body1" gutterBottom>
          Stacking Type
        </Typography>
        <FormControl className={styles["stack-type-form-control"]}>
          <Select
            labelId="statcking-type-select"
            id="statcking-type-select"
            value={stackingType}
            size="small"
            onChange={handleChange}
            displayEmpty
            renderValue={(value) =>
              value ? stackTypeOptions[String(value)] : "Select Type"
            }
            className={styles["select"]}
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

export default Step2;
