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
import {Typography,Box,Stack} from "@mui/material";

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
                {isEditing && <Box sx={{
                    backgroundColor: '#E6ECF6',
                    padding: '16px',
                    marginBottom: '24px'
                }}>
                     <Stack>
                        <Typography sx={{ fontWeight: 600 }}>Please note:</Typography>
                        <Typography sx={{ fontWeight: 400 }}>Newly added LIAMs will be appended to the existing list. If no new products are added the old list of LIAMs will be applicable after you save your changes</Typography>
                     </Stack>
                    </Box>}
                <StyledTabs tabs={productCollectionTabs} handleTabUpdate={handleTabUpdate} defaultValue={productsCollectionTab} />
                {content}
            </StepperCard>
        </>
    );
}

export default ProductsCollection;
