import React, { useState } from 'react'
import Card from "@mui/material/Card";
import { Divider, Grid, SelectChangeEvent } from '@mui/material'
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import RadioGroupField from '../../FormComponents/RadioGroupField'
import Tag from "../../Tag";
import { dealApplyOptions } from '../../../constants/FormOptions'
import commonStyles from '../Steps.module.css'
import UploadExcel from '../ProductsCollection/UploadExcel/UploadExcel';
import ManuallyAdd from '../ProductsCollection/ManuallyAdd/ManuallyAdd';
import StyledTabs from '../../StyledTabs';
import { useFormContext, useWatch } from 'react-hook-form';
import SelectField from '../../FormComponents/SelectField';
import { productCollectionTabs, dealLevelExclusionOptions } from '../../../constants/FormOptions'

const Exclusions = ({ dealLevelName }: any) => {

    const { control, setValue } = useFormContext()

    const dealOptions = useWatch({
        control,
        name: 'dealLevelOptions'
    })

    const productExclusionsCollectionTab = useWatch({
        control,
        name: 'productExclusionsCollectionTab'
    })

    const handleChange = ({ target: { value } }: SelectChangeEvent) => {
        if (value === 'no') {
            setValue('exmch', [])
            setValue('exliam', [])
            setValue('exfile', null)
            setValue("productExclusionsCollectionTab", 'uploadProduct')
        }
    };

    const handleTabUpdate = (newTab: string): void => {
        setValue('productExclusionsCollectionTab', newTab, { shouldValidate: true })
    }

    let content = null

    if (productExclusionsCollectionTab === "uploadProduct") {
        content = (
            <>
                <UploadExcel uploadStep="exfile" />
            </>
        );
    }

    if (productExclusionsCollectionTab === "addProduct") {
        content = (
            <>
                <ManuallyAdd mchValue="exmch" liamValue="exliam" />
            </>
        );
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={dealLevelName === 'product' ? 6 : 5} totalSteps={dealLevelName === 'product' ? 7 : 6} />
        <StepTitle title={dealLevelName === 'product' ? "Exclusions" : "Product Applicability"} />
        <Tag label="Internal facing" />
        <Grid display="grid">
            <SelectField options={dealApplyOptions} name="dealApplyType" title="What items does this deal apply to?" required />
            {dealLevelName === 'product' ?
                <>
                    <RadioGroupField options={dealLevelExclusionOptions} label="Will there be additional products excluded from this deal?" name="dealLevelOptions" required={true} handleChange={handleChange} />
                    {dealOptions === 'yes' ? <><StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} defaultValue={productExclusionsCollectionTab} />
                        <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>
                        {content}</>
                        : null}
                </> : null}
        </Grid>
    </Card>
}

export default Exclusions