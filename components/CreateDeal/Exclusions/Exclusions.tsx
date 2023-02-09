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

const Exclusions = () => {
    const [dealItems, setDealItems] = useState<string>('')
    const [activeTab, setActiveTab] = useState(dealLevelExclusionOptions[0]?.value);

    const { control, setValue } = useFormContext()

    const dealOptions = useWatch({
        control,
        name: 'dealLevelOptions'
    })

    const handleChange = ({ target: { value } }: SelectChangeEvent) => {
        setDealItems(value);
    };

    const handleTabUpdate = (newTab: string): void => {
        setActiveTab(newTab)
        setValue('productExclusionsCollectionTab', newTab, { shouldValidate: true })
    }

    let content = null

    if (activeTab === "uploadProduct") {
        content = (
            <>
                <UploadExcel uploadStep="exfile" />
            </>
        );
    }

    if (activeTab === "addProduct") {
        content = (
            <>
                <ManuallyAdd mchValue="exmch" liamValue="exliam" />
            </>
        );
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={6} totalSteps={7} />
        <StepTitle title={"Exclusions"} />
        <Tag label="Internal facing" />
        <Grid display="grid">
            <SelectField options={dealApplyOptions} name="dealApplyType" title="What items does this deal apply to?" required />
            <RadioGroupField options={dealLevelExclusionOptions} label="Will there be additional products excluded from this deal?" name="dealLevelOptions" required={true} />
            {dealOptions === 'yes' ? <><StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} />
                <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>
                {content}</>
                : null}
        </Grid>
    </Card>
}

export default Exclusions