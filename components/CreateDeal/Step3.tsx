import React, {useState} from 'react'
import {useFormContext, useWatch} from "react-hook-form";
import Card from "@mui/material/Card";
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import RadioGroupField from '../FormComponents/RadioGroupField'
import StyledTabs from '../StyledTabs'
import TextInputField from '../FormComponents/TextInputField'
import styles from "./Step3.module.css";
import FormCardPreview from '../FormCardPreview'
import commonStyles from './Steps.module.css'


const dealLevelOptions = [
    {value: 'product', label: 'Product'},
    {value: 'basket', label: 'Basket'}
]

const dealTabs = [
    {label: 'Dollar ($) off', value: 'dollar'},
    {label: 'Percentage ($) off', value: 'percentage'},
    {label: 'Fixed price', value: 'fixed'}
]

const percentageOptions = [
    {value: '10', label: '10%'},
    {value: '20', label: '20%'},
    {value: '30', label: '30%'},
    {value: '40', label: '40%'},
    {value: 'custom', label: 'Add custom value'}
]

const Step3 = () => {
    const [activeTab, setActiveTab] = useState(dealTabs[0]?.value)
    const [basketDealType, setBasketDealType] = useState<string>('dollar')
    const {control, setValue} = useFormContext()
    const percentageOff = useWatch({
        control,
        name: 'percentageOff'
    })
    const dealLevel = useWatch({
        control,
        name: 'dealLevel'
    })

    const getButtonVariant = (type: string) => {
        return type === basketDealType ? 'contained' : 'outlined'
    }

    const handleBasketDealTypeChange = (type: string): void => {
        setBasketDealType(type)
    }

    const handleTabUpdate = (newTab: string): void => {
        setValue('dollarOff', '')
        setValue('percentageOff', '')
        setValue('fixedPriceOff', '')
        setValue('customPercentageOff', '')
        setActiveTab(newTab)
    }

    let content = null
    if(dealLevel === 'product') {
        if(activeTab === 'dollar') {
            content = <TextInputField
                title="Enter dollar ($) off"
                description="Must be numeric values only"
                placeholder="$ 0.00"
                type="number"
                name="dollarOff"
            />
        }

        if(activeTab === 'percentage') {
            content = <>
                <RadioGroupField options={percentageOptions} label="Select percentage" name='percentageOff' />
                <div className={styles['cutom-percentage']}>
                    <TextInputField
                        placeholder="Enter numeric value between 1-99"
                        type="number"
                        noTopGutters
                        disabled={percentageOff !== 'custom'}
                        name="customPercentageOff"
                    />
                    <div className={styles['percentage-icon-container']}>%</div>
                </div>
            </>
        }

        if(activeTab === 'fixed') {
            content = <TextInputField
                title="Enter fixed price value"
                description="Must be numeric values only"
                placeholder="$ 0.00"
                type="number"
                name="fixedPriceOff"
            />
        }
    }

    if(dealLevel === 'basket') {
        content = <div className={styles['basket-fields']}>
            <Typography>Spend</Typography>
            <OutlinedInput
                id="title"
                placeholder='$ 0.00'
                type='number'
            />
            <Typography>Get</Typography>
            <ButtonGroup>
                <Button variant={getButtonVariant('percentage')} onClick={() => handleBasketDealTypeChange('percentage')}>%</Button>
                <Button variant={getButtonVariant('dollar')} onClick={() => handleBasketDealTypeChange('dollar')}>$</Button>
            </ButtonGroup>
            <OutlinedInput
                id="title"
                placeholder='$ 0.00'
                type='number'
            />
            <Typography>Off</Typography>
        </div>
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={3} totalSteps={7} />
        <StepTitle title={"Deal Value"} />
        <RadioGroupField options={dealLevelOptions} label="Is this at a basket level or product level?" name="dealLevel" />
        {dealLevel === 'product' && < StyledTabs tabs={dealTabs} handleTabUpdate={handleTabUpdate} />}
        {content}
        <FormCardPreview title="Customer preview" description="Preview will generate after inputs are completed" />
    </Card>
}

export default Step3