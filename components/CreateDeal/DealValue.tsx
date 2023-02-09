import React, { useState, ChangeEvent } from 'react'
import { useFormContext, useWatch } from "react-hook-form";
import Card from "@mui/material/Card";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import RadioGroupField from '../FormComponents/RadioGroupField'
import StyledTabs from '../StyledTabs'
import TextInputField from '../FormComponents/TextInputField'
import styles from "./DealValue.module.css";
import FormCardPreview from '../FormCardPreview'
import commonStyles from './Steps.module.css'
import { dealLevelOptions, dealTabs, percentageOptions} from '../../constants/FormOptions'

const DealValue = () => {
    const [activeTab, setActiveTab] = useState(dealTabs[0]?.value)
    const [basketDealType, setBasketDealType] = useState<string>('dollar')
    const { control, setValue } = useFormContext()
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
        if(newTab !== 'percentage'){
            setValue('dollarOff', '')
            setValue('percentageOff', 10)
            setValue('fixedPriceOff', '')
            setValue('customPercentageOff', '')
        }
        setActiveTab(newTab)
        setValue('dealDiscountTab', newTab)
    }

    const handleCustomPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.value !== 'custom'){
        setValue('customPercentageOff', '',{ shouldValidate: true})
      }
    }

    let content = null

    if (dealLevel === 'product') {
        if (activeTab === 'dollar') {
            content = <TextInputField
                title="Enter dollar ($) off"
                description="Must be numeric values only"
                placeholder="$ 0.00"
                type="number"
                name="dollarOff"
                required
                displayDollarFormat
            />
        }

        if (activeTab === 'percentage') {
            content = <>
                <RadioGroupField options={percentageOptions} label="Select percentage" name='percentageOff' required handleChange={handleCustomPercentageChange}/>
                <div className={styles['cutom-percentage']}>
                    <TextInputField
                        placeholder="Enter numeric value between 1-99"
                        noTopGutters
                        disabled={percentageOff !== 'custom'}
                        name="customPercentageOff"
                    />
                    <div className={styles['percentage-icon-container']}>%</div>
                </div>
            </>
        }

        if (activeTab === 'fixed') {
            content = <TextInputField
                title="Enter fixed price value"
                description="Must be numeric values only"
                placeholder="$ 0.00"
                type="number"
                name="fixedPriceOff"
                required
                displayDollarFormat
            />
        }
    }

    if (dealLevel === 'basket') {
        content = <div className={styles['basket-fields']}>
            <TextInputField
                name="basketSpend"
                placeholder='$ 0.00'
                type='number'
                title="Spend"
                inline
                required
                displayDollarFormat
            />
            <Typography>Get</Typography>
            <ButtonGroup>
                <Button variant={getButtonVariant('percentage')} onClick={() => handleBasketDealTypeChange('percentage')}>%</Button>
                <Button variant={getButtonVariant('dollar')} onClick={() => handleBasketDealTypeChange('dollar')}>$</Button>
            </ButtonGroup>
            <TextInputField
                name="basketDiscount"
                placeholder='$ 0.00'
                type='number'
                inline
                required
                displayDollarFormat
            />
            <Typography>Off</Typography>
        </div>
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={3} totalSteps={7} />
        <StepTitle title={"Deal Value"} />
        <RadioGroupField options={dealLevelOptions} label="Is this at a basket level or product level?" name="dealLevel" required/>
        {dealLevel === 'product' && < StyledTabs tabs={dealTabs} handleTabUpdate={handleTabUpdate} />}
        {content}
        <FormCardPreview title="Customer preview" description="Preview will generate after inputs are completed" />
    </Card>
}

export default DealValue