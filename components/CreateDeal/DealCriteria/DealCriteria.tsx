import React from "react";
import { Grid, Typography } from "@mui/material";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import RadioGroupField from "../../FormComponents/RadioGroupField";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import commonStyles from "../Steps.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextInputField from "../../FormComponents/TextInputField";
import { useFormContext, useWatch } from "react-hook-form";
import SelectField from "../../FormComponents/SelectField";
import FormCardMultiple from "../../FormCardMultiple";
import CloseIcon from "@mui/icons-material/Close";
import StepperCard from '../StepperCard'

export const percentageOptions = [
    { value: "$_OFF_MULTI", label: "Dollar ($) off" },
    { value: "%_OFF_MULTI", label: "Percentage ($) off" },
    { value: "$_FIXED_MULTI", label: "Fixed price" },
];

export const buyValue: { [index: string]: string } = {
    "1": "1 item",
    "2": "2 items",
    "3": "3 items",
    "4": "4 items",
    "5": "5 items",
    "6": "6 items",
    "7": "7 items",
    "8": "8 items",
    "9": "9 items",
    "10": "10 items",
};

function DealCriteria() {
    const { control, setValue, clearErrors } = useFormContext();

    const dealCriteriaType = useWatch({
        control,
        name: 'dealCriteriaType'
    })

    const dealCriteria = useWatch({
        control,
        name: "dealCriteria",
    });

    const handleChange = (e: any) => {
        const level = e.target.value;
        setValue('dealCriteriaType', level)
        let value = [{
            buy: "",
            get: "",
        }]
        setValue("dealCriteria", value)
        clearErrors("dealCriteria")
    };

    const addTier = () => {
        dealCriteria.push({
            buy: "",
            get: "",
        });
        setValue("dealCriteria", dealCriteria);
    };

    const deleteTier = (index: number) => {
        dealCriteria.splice(index, 1)
        setValue("dealCriteria", dealCriteria)
    }

    let customerPreview: string[] = []

    dealCriteria.forEach((data: any,) => {
        if (data.buy && data.get && dealCriteriaType === "$_OFF_MULTI") {
            customerPreview.push(`Buy ${data.buy}, Get $${data.get} Off`)
        }
        if (data.buy && data.get && dealCriteriaType === "$_FIXED_MULTI") {
            customerPreview.push(`Buy ${data.buy} For $${data.get}`)
        }

        if (data.buy && data.get && dealCriteriaType === "%_OFF_MULTI") {
            customerPreview.push(`Buy ${data.buy}, Get ${data.get}% Off`)
        }

        else if (dealCriteria.length === 1) {
            if (data.buy && data.get) {
                return
            }
            else {
                customerPreview.push('Preview will generate after inputs are completed')
            }
        }
    });

    return (
        <StepperCard step={'MULTI_BUY_DEAL_VALUE'} inProgressIcon={MonetizationOnOutlinedIcon}>
            <StepLabel currentStep={3} totalSteps={7} />
            <StepTitle title={"Deal criteria"} />

            <RadioGroupField
                options={percentageOptions}
                label="Type"
                name="dealCriteriaType"
                required
                handleChange={handleChange}
            />

            <Typography className={commonStyles.required} mb={2}>Tiers</Typography>

            <Grid container mb={2}>
                {dealCriteria?.map((data: any, index: any) => {
                    return (
                        <Grid
                            key={dealCriteria[index]?.buy}
                            container
                            item
                            lg={12}
                            className={commonStyles["mch-card-container"]}
                        >
                            <Typography className={commonStyles.buyText}>Buy</Typography>

                            <Grid className={commonStyles.buyPlace}>
                                <SelectField
                                    options={buyValue}
                                    name={`dealCriteria.${index}.buy`}
                                    inputHeight={true}
                                    dealCriteria={true}
                                />
                            </Grid>

                            {dealCriteriaType === "$_FIXED_MULTI" ? <Typography className={commonStyles.getText}>For</Typography> :
                                <Typography className={commonStyles.getText}>Get</Typography>}

                            {dealCriteriaType === '$_OFF_MULTI' ? <TextInputField
                                placeholder="$ 0.00"
                                type="number"
                                name={`dealCriteria.${index}.get`}
                                required
                                displayDollarFormat
                                inputHeight={true}
                                dealCriteria={true}
                            /> : null}

                            {dealCriteriaType === '%_OFF_MULTI' ?
                                <TextInputField
                                    name={`dealCriteria.${index}.get`}
                                    placeholder={'0'}
                                    type='number'
                                    inline
                                    required
                                    displayPercentageFormat={true}
                                    endAdornment={dealCriteriaType === '%_OFF_MULTI' ? <div style={{ position: 'absolute', left: '45px' }}>%</div> : undefined}
                                    inputHeight={true}
                                    dealCriteria={true}
                                /> : null}

                            {dealCriteriaType === '$_FIXED_MULTI' ?
                                <TextInputField
                                    name={`dealCriteria.${index}.get`}
                                    placeholder="$ 0.00"
                                    type="number"
                                    required
                                    displayDollarFormat
                                    inputHeight={true}
                                    dealCriteria={true}
                                /> : null}

                            {dealCriteriaType === "$_FIXED_MULTI" ? null :
                                <Typography className={commonStyles.getText}>Off</Typography>}

                            {index > 0 ? <Grid className={commonStyles.deleteIcon} > <CloseIcon onClick={() => deleteTier(index)} /> </Grid> : null}

                        </Grid>
                    );
                })}
            </Grid>

            {dealCriteriaType === "$_FIXED_MULTI" ? null :
                <Grid container>
                    <Grid
                        onClick={() => addTier()}
                        item
                        lg={2}
                        className={commonStyles.addbtn}
                    >
                        <AddCircleOutlineIcon className={commonStyles.mchIcon} />
                        <Typography ml="3px" mt="1px">
                            Add tier
                        </Typography>
                    </Grid>
                </Grid>
            }

            <FormCardMultiple
                title="Customer preview"
                description={customerPreview}
            />
         </StepperCard>
    );
}

export default DealCriteria;
