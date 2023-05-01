import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import Tag from "../../Tag";
import StyledTabs from "../../StyledTabs";
import UploadExcel from "./UploadExcel/UploadExcel"
import ManuallyAdd from "./ManuallyAdd/ManuallyAdd";
import { productCollectionTabs } from '../../../constants/FormOptions'
import StepperCard from '../StepperCard'
import {useAppSelector} from "../../../store";
import {getIsEditing} from "../../../store/feature/deal/dealSlice";
import {Typography} from "@mui/material";

function ProductsCollection() {
    const { setValue, control } = useFormContext()
    const isEditing = useAppSelector(getIsEditing)
    const productsCollectionTab = useWatch({
        control,
        name: 'productsCollectionTab'
    })

    const handleTabUpdate = (newTab: string): void => {
        setValue('productsCollectionTab', newTab, { shouldValidate: true })
    }

    let content = null;

    if (productsCollectionTab === "uploadProduct") {
        content = (
            <>
                <UploadExcel uploadStep="file" />
            </>
        );
    }

    if (productsCollectionTab === "addProduct") {
        content = (
            <>
                <ManuallyAdd mchValue="mch" liamValue="liam" />
            </>
        );
    }

    return (
        <>
            <StepperCard step={'PRODUCTS_AND_COLLECTIONS'} inProgressIcon={CheckroomOutlinedIcon}>
                <StepLabel currentStep={5} totalSteps={7} />
                <StepTitle title={"Products and Collections"} />
                <Tag label="Internal facing" />
                {isEditing && <Typography>The Products and Collections added in this step will be appended to existing Products and Collections on the deal</Typography>}
                <StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} defaultValue={productsCollectionTab} />
                {content}
            </StepperCard>
        </>
    );
}

export default ProductsCollection;
