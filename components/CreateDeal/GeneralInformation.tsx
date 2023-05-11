import React, { useEffect } from "react";
import moment from 'moment';
import { useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import TextInputField from "../FormComponents/TextInputField";
import StepLabel from "../StepLabel";
import Chip from "@mui/material/Chip";
import Tag from "../Tag";
import StepTitle from "../StepTitle";
import { stackTypeOptions, stackTypeFreeShipping, FREE_SHIPPING_DEAL_TYPE, MULTI_BUY_DEAL_TYPE, DISCOUNT_DEAL_TYPE } from "../../constants/FormOptions";
import styles from "./GeneralInformation.module.css";
import generateIdentifier from '../../util/generateIdentifier'
import SelectField from '../FormComponents/SelectField'
import { getIsEditing, updatedDealLevel, updatedDealStep } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";
import StepperCard from './StepperCard'
import FeedIcon from '@mui/icons-material/Feed';
import { getDraftDealData } from '../../store/feature/deal/draftDealSlice'
import { dealStatus } from "../../constants/DealStatus";
import { capitalizeWords } from "../../util/format";

interface IGeneralInformation {
  handleFormDraftSubmit: Function
  deal: any
}

const GeneralInformation = ({ handleFormDraftSubmit, deal }: IGeneralInformation) => {
  const { setValue } = useFormContext()
  const dealLevelName = useAppSelector(updatedDealLevel)
  const dealName = useAppSelector(updatedDealStep);
  const draftValues = useAppSelector(getDraftDealData)
  const id = deal ? deal?.generalDealInfo?.id : draftValues?.generalDealInfo?.id
  const draftButtonLabel = id ? 'Save' : 'Save as draft'
  const isDraftStatus = deal?.generalDealInfo?.status

  const handleGenerateIdentifier = () => {
    setValue('identifier', generateIdentifier(), { shouldValidate: true })
  }

  useEffect(() => {
    if (dealName === MULTI_BUY_DEAL_TYPE) {
      setValue('dealType', MULTI_BUY_DEAL_TYPE)
      setValue('isListValid', true)
    }

    if (dealName === FREE_SHIPPING_DEAL_TYPE) {
      setValue('dealType', FREE_SHIPPING_DEAL_TYPE)
    }

  }, [])

  let content = <>
    <Grid container justifyContent="space-between" className={styles["heading-container"]}>
      <Grid item lg={5} md={5} sm={5}>
        <Typography variant="h3" className={styles.heading} data-testid="form-title">
          Create New {dealName === DISCOUNT_DEAL_TYPE ? 'Discount' : dealName === MULTI_BUY_DEAL_TYPE ? 'Multi-buy' : 'Free Shipping'} Deal
        </Typography>
      </Grid>
      <Grid item lg={7} md={7} sm={7}>
        <Button
          data-testid="draft-btn"
          variant="contained"
          className={styles.draftBtn}
          onClick={() => handleFormDraftSubmit(id)}
        >
          {draftButtonLabel}
        </Button>
      </Grid>
    </Grid>
    <Typography className={styles.draftTime} >{`Draft created on ${moment().format('MMMM Do YYYY, h:mm:ss a')}`}</Typography>
    <Chip label={'Draft'} sx={{ margin: '0 25%', backgroundColor: '#666B73', fontWeight: '700', borderRadius: '5px', color: '#ffffff', height: '20px' }} />
  </>

  if (isDraftStatus) {
    content = <>
      <Grid container justifyContent="space-between" className={styles["heading-container"]}>
        <Grid item lg={5} md={5} sm={5}>
          <Typography variant="h3" className={styles.heading} data-testid="form-title">
            {deal?.generalDealInfo?.title}
          </Typography>
        </Grid>
        <Grid item lg={7} md={7} sm={7}>
          <Button
            data-testid="draft-btn"
            variant="contained"
            className={styles.draftBtn}
            onClick={() => handleFormDraftSubmit(id)}
          >
            {draftButtonLabel}
          </Button>
        </Grid>
      </Grid>
      <Typography className={styles.draftTime} >{`Draft created on ${moment().format('MMMM Do YYYY, h:mm:ss a')}`}</Typography>
      <Chip className={deal?.generalDealInfo?.status === "INACTIVE" ? styles.inactiveChip : styles.Chip}
        sx={{ margin: '0 25%', backgroundColor: dealStatus[deal?.generalDealInfo?.status], mb: 1, fontColor: "#000000" }}
        label={deal?.generalDealInfo?.status ? capitalizeWords(deal?.generalDealInfo?.status) : null} />
    </>
  }

  return (<>
    {content}
    <StepperCard inProgressIcon={FeedIcon} error step={'GENERAL_INFORMATION'}>
      <StepLabel currentStep={2} totalSteps={dealName === FREE_SHIPPING_DEAL_TYPE || dealLevelName === 'basket' ? 6 : 7} />
      <StepTitle title={"General Information"} />
      <Tag label="Internal facing" />
      <TextInputField
        title="Title"
        description="Max 80 characters"
        placeholder="eg. WK10 20% Off On All Sale Items"
        name="title"
        required
        inputHeight={true}
        tooltipKey={'TITLE'}
      />
      <TextInputField
        title="Description"
        placeholder="Enter description for deal"
        multiline
        name="description"
        tooltipKey={'DESCRIPTION'}
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
        tooltipKey={'PRIORITY'}
      />
      <SelectField options={dealName === FREE_SHIPPING_DEAL_TYPE ? stackTypeFreeShipping : stackTypeOptions} name='stackingType' title="Stacking Type" required inputHeight={true} tooltipKey={'STACKING_TYPE'} />
    </StepperCard>
  </>
  );
};

export default GeneralInformation;
