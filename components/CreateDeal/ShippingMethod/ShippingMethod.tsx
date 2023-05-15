import React from 'react'
import StepLabel from '../../StepLabel'
import StepTitle from '../../StepTitle'
import RadioGroupField from '../../FormComponents/RadioGroupField';
import { useFormContext } from 'react-hook-form';
import StepperCard from '../StepperCard';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

export const shippingMethodOptions = [
    { value: "standard", label: "Standard" },
];

function ShippingMethod() {
    const { setValue } = useFormContext();

    const handleChange = (e: any) => {
        const level = e.target.value;
        setValue("shippingMethodType", level)
    };

    return (
        <StepperCard step={'FREE_SHIPPING_SHIPPING_METHOD'} inProgressIcon={MonetizationOnOutlinedIcon}>
            <StepLabel currentStep={3} totalSteps={6} />
            <StepTitle title={"Shipping method"} />

            <RadioGroupField
                options={shippingMethodOptions}
                label="Shipping method"
                name="shippingMethodType"
                required
                handleChange={handleChange}
            />

        </StepperCard>
    )
}

export default ShippingMethod