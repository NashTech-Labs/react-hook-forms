import {
    Card,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import RadioGroupField from "../../FormComponents/RadioGroupField";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import commonStyles from "../Steps.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormCardPreview from "../../FormCardPreview";
import TextInputField from "../../FormComponents/TextInputField";
import { useFormContext, useWatch } from "react-hook-form";
import SelectField from "../../FormComponents/SelectField";
import FormCardMultiple from "../../FormCardMultiple";

export const percentageOptions = [
    { value: "$_OFF", label: "Dollar ($) off" },
    { value: "%_OFF", label: "Percentage ($) off" },
    { value: "$_FIXED", label: "Fixed price" },
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
    const { control, setValue } = useFormContext();

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
    };

    const addTier = () => {
        dealCriteria.push({
            buy: "",
            get: "",
        });
        setValue("dealCriteria", dealCriteria);
    };

    console.log(dealCriteria, dealCriteriaType);

    let customerPreview: string[] = []

    dealCriteria.forEach((data: any,) => {
        if (data.buy && data.get && dealCriteriaType === "$_OFF") {
            customerPreview.push(`Buy ${data.buy}, Get $${data.get} Off`)
        }
        if (data.buy && data.get && dealCriteriaType === "$_FIXED") {
            customerPreview.push(`Buy ${data.buy}, Get $${data.get} Off`)
        }

        if (data.buy && data.get && dealCriteriaType === "%_OFF") {
            customerPreview.push(`Buy ${data.buy}, Get ${data.get}% Off`)
        }

        else if (dealCriteria.length === 1) {
            customerPreview.push('Preview will generate after inputs are completed')
        }
    });

    console.log(customerPreview)

    return (
        <Card className={commonStyles["step-card-container"]}>
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
                            key={index}
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
                                />
                            </Grid>

                            <Typography className={commonStyles.getText}>Get</Typography>

                            {dealCriteriaType === '$_OFF' ? <TextInputField
                                placeholder="$ 0.00"
                                type="number"
                                name={`dealCriteria.${index}.get`}
                                required
                                displayDollarFormat
                                inputHeight={true}
                            /> : null}

                            {dealCriteriaType === '%_OFF' ?
                                <TextInputField
                                    name={`dealCriteria.${index}.get`}
                                    placeholder={'0'}
                                    type='number'
                                    inline
                                    required
                                    displayPercentageFormat={true}
                                    endAdornment={dealCriteriaType === '%_OFF' ? <div style={{ position: 'absolute', left: '45px' }}>%</div> : undefined}
                                    inputHeight={true}
                                /> : null}

                            {dealCriteriaType === '$_FIXED' ?
                                <TextInputField
                                    name={`dealCriteria.${index}.get`}
                                    placeholder="$ 0.00"
                                    type="number"
                                    required
                                    displayDollarFormat
                                    inputHeight={true}
                                /> : null}

                        </Grid>
                    );
                })}
            </Grid>

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

            <FormCardMultiple
                title="Customer preview"
                description={customerPreview}
            />
        </Card>
    );
}

export default DealCriteria;
