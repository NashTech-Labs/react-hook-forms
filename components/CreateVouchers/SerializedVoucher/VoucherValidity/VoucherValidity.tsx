import React, { useEffect, useState } from 'react'
import StepperCard from '../../../CreateDeal/StepperCard'
import DataUsageIcon from '@mui/icons-material/DataUsage';
import StepLabel from '../../../StepLabel';
import StepTitle from '../../../StepTitle';
import { FormLabel, Grid, SelectChangeEvent } from '@mui/material';
import TextInputField from '../../../FormComponents/TextInputField';
import RadioGroupField from '../../../FormComponents/RadioGroupField'
import { dealLevelExclusionOptions } from '../../../../constants/FormOptions';
import SelectField from '../../../FormComponents/SelectField';
import { useController, useFormContext } from 'react-hook-form';
import CheckboxField from '../../../FormComponents/CheckboxField';
import styles from "../../../FormComponents/FormComponents.module.css";
import FieldErrorMessage from '../../../FormComponents/FieldErrorMessage';

interface ISerializedVoucherValueProps {
    currentStep: number;
    totalSteps: number;
}

function VoucherValidity({currentStep,totalSteps}: ISerializedVoucherValueProps) {

    const { control, setValue, clearErrors } = useFormContext();

    const {
        fieldState: { error: websiteError }, field: { value:  websiteState}
      } = useController({ control, name: "website" });
      const {
        fieldState: { error: mobileApplicationError },field: { value: mobileApplicationState }
      } = useController({ control, name: "mobileApplication" });

    console.log(websiteState, mobileApplicationState)

    useEffect(()=> {
        if (websiteState || mobileApplicationState) {
            clearErrors("website")
            clearErrors("mobileApplication")
        }
    }, [websiteState, mobileApplicationState])

    const titleClassNames = [styles["labelHeading"]];

    return (
        <StepperCard inProgressIcon={DataUsageIcon} error step={'VOUCHER_VALIDITY'}>
            <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
            <StepTitle title={"Voucher Validity"} />

            <Grid>
                <Grid> 
                    <RadioGroupField options={dealLevelExclusionOptions} name={"voucherValidity"} label="Is this voucher for new customers only?" required />
                </Grid>
                <Grid display="grid">

                    <FormLabel
                        sx={{
                            "&.Mui-focused": {
                            color: "black",
                            },
                        }}
                        id="checkbox-group-label"
                        className={titleClassNames.join(" ")}
                    >
                        Which platform(s) is this voucher eligible for redemption on?
                    </FormLabel>

                    <CheckboxField name="website" label={"Website"} />
                    <CheckboxField name="mobileApplication" label={"Mobile Application"} />
                    {(websiteError || mobileApplicationError) && (
                    <FieldErrorMessage
                        message={
                            websiteError?.message || mobileApplicationError?.message
                    }
                    testId={`fulfillment-field-error`}
                    />
                    )}
                </Grid>
            </Grid>

        </StepperCard>
    )
}

export default VoucherValidity