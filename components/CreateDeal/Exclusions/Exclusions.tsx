import React from 'react'
import { Grid, SelectChangeEvent, Typography } from '@mui/material'
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import RadioGroupField from '../../FormComponents/RadioGroupField'
import Tag from "../../Tag";
import { dealApplyOptions } from '../../../constants/FormOptions'
import UploadExcel from '../ProductsCollection/UploadExcel/UploadExcel';
import ManuallyAdd from '../ProductsCollection/ManuallyAdd/ManuallyAdd';
import StyledTabs from '../../StyledTabs';
import { useFormContext, useWatch } from 'react-hook-form';
import SelectField from '../../FormComponents/SelectField';
import { productCollectionTabs, dealLevelExclusionOptions } from '../../../constants/FormOptions'
import exclusionStyles from './Exclusions.module.css'
import StepperCard from '../StepperCard'
import {useAppSelector} from '../../../store';
import {getIsEditing} from '../../../store/feature/deal/dealSlice';

const Exclusions = ({ dealLevelName }: any) => {

    const { control, setValue } = useFormContext()
    const isEditing = useAppSelector(getIsEditing)
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

    return <StepperCard step={'EXCLUSIONS'} inProgressIcon={DoDisturbOutlinedIcon}>
        <StepLabel currentStep={dealLevelName === 'product' ? 6 : 5} totalSteps={dealLevelName === 'product' ? 7 : 6} />
        <StepTitle title={dealLevelName === 'product' ? "Exclusions" : "Product Applicability"} />
        <Tag label="Internal facing" extraSpacing />
        {isEditing && <Typography sx={{ marginBottom: '10px'}}>The Exclusions added in this step will be appended to existing Exclusions on the deal</Typography>}
        <Grid display="grid">
            <div className={exclusionStyles['deal-apply-container']}>
                <SelectField options={dealApplyOptions} name="dealApplyType" title="What items does this deal apply to?" required inputHeight={true} />
            </div>
            {dealLevelName === 'product' ?
                <>
                    <RadioGroupField noBottomGutters options={dealLevelExclusionOptions} label="Will there be additional products excluded from this deal?" name="dealLevelOptions" required={true} handleChange={handleChange} />
                    {dealOptions === 'yes' ? <>
                        <StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} defaultValue={productExclusionsCollectionTab} />
                        {content}
                    </>
                        : null}
                </> : null}
        </Grid>
    </StepperCard>
}

export default Exclusions