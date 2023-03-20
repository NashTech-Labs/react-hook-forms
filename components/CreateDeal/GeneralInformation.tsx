import React from "react";
import { useFormContext } from 'react-hook-form'
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import TextInputField from "../FormComponents/TextInputField";
import StepLabel from "../StepLabel";
import Tag from "../Tag";
import StepTitle from "../StepTitle";
import { stackTypeOptions } from "../../constants/FormOptions";
import styles from "./GeneralInformation.module.css";
import commonStyles from './Steps.module.css'
import generateIdentifier from '../../util/generateIdentifier'
import SelectField from '../FormComponents/SelectField'
import { updatedDealStep } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";

const GeneralInformation = () => {
  const { setValue } = useFormContext()

  const dealName = useAppSelector(updatedDealStep);

  const handleGenerateIdentifier = () => {
    setValue('identifier', generateIdentifier(), { shouldValidate: true })
  }

  return (<>
    {dealName === "discount" ?
      <Typography variant="h3" className={styles.heading} data-testid="form-title">
        Create New Discount Deal
      </Typography> :
      <Typography variant="h3" className={styles.heading} data-testid="form-title">
        Create New Multi-buy Deal
      </Typography>}
    <Card className={commonStyles["step-card-container"]}>
      <StepLabel currentStep={2} totalSteps={7} />
      <StepTitle title={"General Information"} />
      <Tag label="Internal facing" />
      <TextInputField
        title="Title"
        description="Max 80 characters"
        placeholder="eg. WK10 20% Off On All Sale Items"
        name="title"
        required
        inputHeight={true}
      />
      <TextInputField
        title="Description"
        placeholder="Enter description for deal"
        multiline
        name="description"
      />
      {/* <TextInputField
          title="Identifier"
          description="Max 15 characters alphanumeric values"
          placeholder="eg. 00000-00000-00000"
          name="identifier"
          endAdornment={<div className={styles['generate-link']} onClick={handleGenerateIdentifier}>Generate</div>}
          required
        /> */}
      <TextInputField
        title="Priority"
        description="Numeric value must be 1 to 100"
        placeholder="eg 100"
        name="priority"
        required
        type="number"
        inputHeight={true}
      />
      <SelectField options={stackTypeOptions} name='stackingType' title="Stacking Type" required inputHeight={true} />
    </Card>
  </>
  );
};

export default GeneralInformation;
