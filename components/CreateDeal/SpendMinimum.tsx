import React, { ChangeEvent } from 'react'
import { useFormContext, useWatch } from "react-hook-form";
import Card from "@mui/material/Card";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import RadioGroupField from '../FormComponents/RadioGroupField'
import TextInputField from '../FormComponents/TextInputField'
import styles from "./DealValue.module.css";
import FormCardPreview from '../FormCardPreview'
import commonStyles from './Steps.module.css'
import { minimumSpendOptions } from '../../constants/FormOptions'

const SpendMinimum = () => {
    const { control, setValue } = useFormContext()

    const spendMinimum = useWatch({
        control,
        name: 'spendMinimum'
    })

    const customMinimumSpend = useWatch({
        control,
        name: 'customMinimumSpend'
    })

    const handleCustomSpendChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== 'CUSTOM') {
            setValue('customMinimumSpend', '', { shouldValidate: true })
        }
    }

    console.log(customMinimumSpend)

    let customerPreview = 'No Spend Minimum'

    if (spendMinimum !== 'NO_MINIMUM' && spendMinimum !== 'CUSTOM') {
        customerPreview = `Spend minimum of $${spendMinimum}`
    } else if (spendMinimum === 'CUSTOM' && customMinimumSpend) {
        customerPreview = `Spend minimum of $${customMinimumSpend}`
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={4} totalSteps={6} />
        <StepTitle title={"Spend minimum"} />
        <RadioGroupField options={minimumSpendOptions} label="Select minimum value" name="spendMinimum" required handleChange={handleCustomSpendChange} />
        <div className={styles['cutom-percentage']}>
            <TextInputField
                placeholder="$0.00"
                noTopGutters
                disabled={spendMinimum !== 'CUSTOM'}
                name="customMinimumSpend"
                inputHeight={true}
                displayDollarFormat
            />
        </div>
        <FormCardPreview title="Customer preview" description={customerPreview} />
    </Card>
}

export default SpendMinimum