import React, { useState } from 'react'
import Card from "@mui/material/Card";
import { Divider, Grid, SelectChangeEvent } from '@mui/material'
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import RadioGroupField from '../../FormComponents/RadioGroupField'
import Tag from "../../Tag";
import { dealApplyOptions } from '../../../constants/FormOptions'
import commonStyles from '../Steps.module.css'
import styles from './Exclusions.module.css'
import UploadExcel from '../ProductsCollection/UploadExcel/UploadExcel';
import ManuallyAdd from '../ProductsCollection/ManuallyAdd/ManuallyAdd';
import StyledTabs from '../../StyledTabs';
import { useFormContext, useWatch } from 'react-hook-form';

const dealLevelOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
]

const dealTabs = [
    { label: "Upload product(s)", value: "uploadProduct" },
    { label: "Manually add product(s)", value: "addProduct" },
];

const Exclusions = () => {
    const [dealItems, setDealItems] = useState<string>('')
    const [activeTab, setActiveTab] = useState(dealTabs[0]?.value);

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
        setValue('productExclusionsCollectionTab', newTab, {shouldValidate: true})
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
        <Typography variant="body1" gutterBottom>
            What items does this deal apply to?
        </Typography>
        <Grid display="grid">
            <FormControl sx={{ width: '350px' }}>
                <Select
                    labelId="statcking-type-select"
                    id="statcking-type-select"
                    value={dealItems}
                    size="small"
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(value) =>
                        value ? dealApplyOptions[String(value)] : "Select Type"
                    }
                    className={styles["select"]}
                >
                    {Object.keys(dealApplyOptions).map((key) => (
                        <MenuItem key={key} value={key}>
                            {dealApplyOptions[key]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <RadioGroupField options={dealLevelOptions} label="Will there be additional products excluded from this deal?" name="dealLevelOptions" />
            {dealOptions === 'yes' ? <><StyledTabs tabs={dealTabs} handleTabUpdate={handleTabUpdate} />
                <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>
                {content}</>
                : null}

        </Grid>
    </Card>
}

export default Exclusions