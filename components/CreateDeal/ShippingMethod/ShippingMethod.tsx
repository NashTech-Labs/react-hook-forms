import { Card } from '@mui/material'
import React from 'react'
import StepLabel from '../../StepLabel'
import StepTitle from '../../StepTitle'
import commonStyles from "../Steps.module.css";
import RadioGroupField from '../../FormComponents/RadioGroupField';
import { useFormContext, useWatch } from 'react-hook-form';

export const shippingMethodOptions = [
    { value: "standard", label: "Standard" },
];

function ShippingMethod() {

    const { control, setValue } = useFormContext();

    const shippingMethodType = useWatch({
        control,
        name: 'shippingMethodType'
    })

    const handleChange = (e: any) => {
        const level = e.target.value;
        setValue("shippingMethodType", level)
    };

    return (
        <Card className={commonStyles["step-card-container"]}>
            <StepLabel currentStep={3} totalSteps={6} />
            <StepTitle title={"Shipping method"} />

            <RadioGroupField
                options={shippingMethodOptions}
                label="Shipping method"
                name="shippingMethodType"
                required
                handleChange={handleChange}
            />

        </Card>
    )
}

export default ShippingMethod