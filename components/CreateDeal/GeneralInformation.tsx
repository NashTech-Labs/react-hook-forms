import React, { useEffect } from "react";
import moment from 'moment';
import { useFormContext } from 'react-hook-form'
import Card from "@mui/material/Card";
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import TextInputField from "../FormComponents/TextInputField";
import StepLabel from "../StepLabel";
import Chip from "@mui/material/Chip";
import Tag from "../Tag";
import StepTitle from "../StepTitle";
import { stackTypeOptions } from "../../constants/FormOptions";
import styles from "./GeneralInformation.module.css";
import generateIdentifier from '../../util/generateIdentifier'
import SelectField from '../FormComponents/SelectField'
import { updatedDealLevel, updatedDealStep } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";
import StepperCard from './StepperCard'
import FeedIcon from '@mui/icons-material/Feed';

interface IGeneralInformation {
  handleFormDraftSubmit: Function
}

const GeneralInformation = ({ handleFormDraftSubmit }: IGeneralInformation) => {
  const { setValue } = useFormContext()
  const dealLevelName = useAppSelector(updatedDealLevel)

  const dealName = useAppSelector(updatedDealStep);

  const handleGenerateIdentifier = () => {
    setValue('identifier', generateIdentifier(), { shouldValidate: true })
  }

  useEffect(() => {
    if (dealName === "multi-buy") {
      setValue('dealType', "Multi-buy")
      setValue('isListValid', true)
    }

    if (dealName === "free-shipping") {
      setValue('dealType', "Free-shipping")
    }

  }, [])

  return (<>
    <Grid container justifyContent="space-between" className={styles["heading-container"]}>
     <Grid item lg={5} md={5} sm={5}>
      <Typography variant="h3" className={styles.heading} data-testid="form-title">
        Create New {dealName === "discount" ? 'Discount' : dealName === "multi-buy" ? 'Multi-buy' : 'Free Shipping'} Deal
      </Typography>
      </Grid> 
      <Grid item lg={7} md={7} sm={7}>
        <Button
          data-testid="draft-btn"
          variant="contained"
          className={styles.draftBtn}
          onClick={() => handleFormDraftSubmit()}
          //disabled={disableDraft}
        >
           Save as draft
        </Button>
      </Grid>
    </Grid>
    <Typography className={styles.draftTime} >{`Draft created on ${moment().format('MMMM Do YYYY, h:mm:ss a')}`}</Typography>
    <Chip label={'Draft'} sx={{margin: '0 25%', backgroundColor: '#666B73', fontWeight: '700', borderRadius: '5px', color: '#ffffff', height: '20px' }} />
    <StepperCard inProgressIcon={FeedIcon} error step={'GENERAL_INFORMATION'}>
      <StepLabel currentStep={2} totalSteps={dealName === "free-shipping" || dealLevelName === 'basket' ? 6 : 7} />
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
    </StepperCard>
  </>
  );
};

export default GeneralInformation;
