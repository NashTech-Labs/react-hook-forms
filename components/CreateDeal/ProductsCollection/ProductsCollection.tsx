import React, { useState } from "react";
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

const dealTabs = [
    { label: "Upload product(s)", value: "uploadProduct" },
    { label: "Manually add product(s)", value: "addProduct" },
];

function ProductsCollection() {
    const [activeTab, setActiveTab] = useState(dealTabs[0]?.value);

    const handleTabUpdate = (newTab: string): void => {
        setActiveTab(newTab)
    }

    let content = null;

    if (activeTab === "uploadProduct") {
        content = (
            <>
                <UploadExcel />
            </>
        );
    }

    if (activeTab === "addProduct") {
        content = (
            <>
                <ManuallyAdd />
            </>
        );
    }

    return (
        <>
            <Card className={commonStyles["step-card-container"]}>
                <StepLabel currentStep={5} totalSteps={7} />
                <StepTitle title={"Products and Collections"} />
                <Tag label="Internal facing" />

                <StyledTabs tabs={dealTabs} handleTabUpdate={handleTabUpdate} />
                <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>
                {content}
            </Card>
        </>
    );
}

export default ProductsCollection;
