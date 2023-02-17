import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
    Card,
    Divider
} from "@mui/material";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import Tag from "../../Tag";
import commonStyles from "../Steps.module.css";
import StyledTabs from "../../StyledTabs";
import UploadExcel from "./UploadExcel/UploadExcel"
import ManuallyAdd from "./ManuallyAdd/ManuallyAdd";
import { productCollectionTabs } from '../../../constants/FormOptions'

function ProductsCollection() {
    const { setValue, control } = useFormContext()

    const productsCollectionTab = useWatch({
        control,
        name: 'productsCollectionTab'
    })

    const handleTabUpdate = (newTab: string): void => {
        if(newTab === 'uploadProduct') {
            setValue('mch', [])
            setValue('liam', [])
        } else {
            setValue('fileMCH', [])
            setValue('fileLIAM', [])
            setValue('file', null)
            setValue('fileName', '')
        }
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
            <Card className={commonStyles["step-card-container"]}>
                <StepLabel currentStep={5} totalSteps={7} />
                <StepTitle title={"Products and Collections"} />
                <Tag label="Internal facing" />
                <StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} defaultValue={productsCollectionTab} />
                <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>
                {content}
            </Card>
        </>
    );
}

export default ProductsCollection;
