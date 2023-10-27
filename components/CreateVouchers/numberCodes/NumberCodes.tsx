import React, { useState } from 'react'
import StepperCard from '../../CreateDeal/StepperCard'
import DataUsageIcon from '@mui/icons-material/DataUsage';
import StepLabel from '../../StepLabel';
import StepTitle from '../../StepTitle';
import { Grid, SelectChangeEvent } from '@mui/material';
import TextInputField from '../../FormComponents/TextInputField';
import RadioGroupField from '../../FormComponents/RadioGroupField'
import { useNumberOfVoucherOptions, voucherCodeOptions } from '../../../constants/FormOptions';
import SelectField from '../../FormComponents/SelectField';
import { useFormContext } from 'react-hook-form';

interface ISerializedVoucherValueProps {
    currentStep: number;
    totalSteps: number;
    isVoucherEditing: Boolean
}

function NumberCodes({currentStep,totalSteps, isVoucherEditing}: ISerializedVoucherValueProps) {

    const { setValue, clearErrors } = useFormContext();

    const [inputVisible, setInputVisible] = useState(false)

    const handleChange = ({ target: { value } }: SelectChangeEvent) => {

        if (value === 'moreThanOnce') {
            setInputVisible(true)
            setValue('usageOfVoucher', '2')
        }
        else {
            clearErrors("usageOfVoucher")
            setInputVisible(false)
        }
    }

    return (
        <StepperCard inProgressIcon={DataUsageIcon} error step={'NUMBER_CODES'}>
            <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
            <StepTitle title={"Number of Codes and Details"} />

            <Grid>
                <TextInputField
                    title="Number of vouchers to create"
                    placeholder="eg. 1,000,000"
                    name="voucherQuantity"
                    type="number"
                    required
                    inputHeight={true}
                    tooltipKey={'VOUCHER_QUANTITY'}
                    disabled={isVoucherEditing ? true : false}
                />

                {/* <RadioGroupField noBottomGutters options={voucherCodeOptions} label="How often can the customer use this voucher?" name="useVoucherOptions" required={true} tooltipKey={'VOUCHER_USAGE'} handleChange={handleChange} /> */}

            </Grid>

            {/* {inputVisible && <Grid ml={5} mt={2}>
                <SelectField options={useNumberOfVoucherOptions} name="usageOfVoucher" title="Enter number of times" required inputHeight={true} />
            </Grid>} */}

        </StepperCard>
    )
}

export default NumberCodes