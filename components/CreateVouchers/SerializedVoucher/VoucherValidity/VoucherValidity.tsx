import React, { useState } from 'react'
import StepperCard from '../../../CreateDeal/StepperCard'
import DataUsageIcon from '@mui/icons-material/DataUsage';
import StepLabel from '../../../StepLabel';
import StepTitle from '../../../StepTitle';
import { FormLabel, Grid, SelectChangeEvent } from '@mui/material';
import TextInputField from '../../../FormComponents/TextInputField';
import RadioGroupField from '../../../FormComponents/RadioGroupField'
import { dealLevelExclusionOptions } from '../../../../constants/FormOptions';
import SelectField from '../../../FormComponents/SelectField';
import { useFormContext } from 'react-hook-form';
import CheckboxField from '../../../FormComponents/CheckboxField';
import styles from "../../../FormComponents/FormComponents.module.css";

interface ISerializedVoucherValueProps {
    currentStep: number;
    totalSteps: number;
}

function VoucherValidity({currentStep,totalSteps}: ISerializedVoucherValueProps) {

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

                    <CheckboxField name="website" label={"Website"} defaultCheck={true} />
                    <CheckboxField name="mobileApplication" label={"Mobile Application"} defaultCheck={true} />
                </Grid>
            </Grid>

        </StepperCard>
    )
}

export default VoucherValidity