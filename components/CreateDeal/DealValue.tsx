import React, { ChangeEvent, useEffect } from 'react'
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
import { dealLevelOptions, dealTabs, percentageOptions } from '../../constants/FormOptions'
import { useAppDispatch } from '../../store';
import { updateDealLevel } from '../../store/feature/deal/dealSlice';

const DealValue = () => {
    const dispatch = useAppDispatch();
    const { control, setValue, clearErrors, setFocus } = useFormContext()
    const dealDiscountTab = useWatch({
        control,
        name: 'dealDiscountTab'
    })
    const percentageOff = useWatch({
        control,
        name: 'percentageOff'
    })
    const dollarOff = useWatch({
        control,
        name: 'dollarOff'
    })
    const fixedPriceOff = useWatch({
        control,
        name: 'fixedPriceOff'
    })
    const customPercentageOff = useWatch({
        control,
        name: 'customPercentageOff'
    })
    const basketSpend = useWatch({
        control,
        name: 'basketSpend'
    })
    const basketDiscount = useWatch({
        control,
        name: 'basketDiscount'
    })
    const dealLevel = useWatch({
        control,
        name: 'dealLevel'
    })
    const basketDealType = useWatch({
        control,
        name: 'basketDealType'
    })

    useEffect(() => {
        dealLevel === 'basket' && setFocus('basketSpend')
    }, [dealLevel, setFocus])

    const displayDollarFormat = basketDealType === 'dollar'
    const displayPercentageFormat = basketDealType === 'percentage'

    const getButtonVariant = (type: string) => {
        return type === basketDealType ? 'contained' : 'outlined'
    }

    const handleBasketDealTypeChange = (type: string): void => {
        setValue('basketDealType', type, { shouldValidate: true })
        clearErrors('basketDiscount')
    }

    useEffect(() => {
        setValue('dealDiscountTab', dealDiscountTab)
    }, [dealDiscountTab])

    const handleTabUpdate = (newTab: string): void => {
        if (newTab === 'percentage') {
            if (percentageOff === 'custom') {
                setValue('dollarOff', '')
                setValue('fixedPriceOff', '')
            } else {
                setValue('dollarOff', '')
                setValue('fixedPriceOff', '')
                setValue('percentageOff', 10)
                setValue('customPercentageOff', '')
            }
        } else {
            setValue('percentageOff', '')
            setValue('dollarOff', '')
            setValue('fixedPriceOff', '')
            setValue('customPercentageOff', '')
        }
        setValue('dealDiscountTab', newTab)
    }

    const handleCustomPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== 'custom') {
            setValue('customPercentageOff', '', { shouldValidate: true })
        }
    }

    useEffect(() => {
        if (dealLevel === 'product') {
            dispatch(updateDealLevel('product'))
        }
        if (dealLevel === 'basket') {
            dispatch(updateDealLevel('basket'))
        }
    }, [dealLevel, dispatch])

    const handleChange = (e: any) => {
        const level = e.target.value
        dispatch(updateDealLevel(level))
        if (level === 'product') {
            setValue('basketSpend', '')
            setValue('basketDiscount', '')
        } else {
            setValue('percentageOff', 10)
            setValue('dollarOff', '')
            setValue('fixedPriceOff', '')
            setValue('customPercentageOff', '')
            setValue('dealApplyType', '')
            setValue('dealLevelOptions', 'no')
            setValue('productExclusionsCollectionTab', 'uploadProduct')
            setValue('exFileName', null)
            setValue('exFileMCH', [])
            setValue('exFileLIAM', [])
            setValue('exliam', [])
            setValue('exmch', [])
        }
    }

    let content = null

    if (dealLevel === 'product') {
        if (dealDiscountTab === 'dollar') {
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

        if (dealDiscountTab === 'percentage') {
            content = <>
                <RadioGroupField options={percentageOptions} label="Select percentage" name='percentageOff' required handleChange={handleCustomPercentageChange} />
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

        if (dealDiscountTab === 'fixed') {
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
            <div style={{ marginTop: '20px' }}>
                <TextInputField
                    name="basketSpend"
                    placeholder='$ 0.00'
                    type='number'
                    title="Spend"
                    inline
                    required
                    displayDollarFormat
                />
            </div>
            <Typography>Get</Typography>
            <ButtonGroup>
                <Button variant={getButtonVariant('percentage')} onClick={() => handleBasketDealTypeChange('percentage')}>%</Button>
                <Button variant={getButtonVariant('dollar')} onClick={() => handleBasketDealTypeChange('dollar')}>$</Button>
            </ButtonGroup>
            <div style={{ marginTop: '20px' }}>
                <TextInputField
                    name="basketDiscount"
                    placeholder={`${displayDollarFormat ? '$' : '%'} 0.00`}
                    type='number'
                    inline
                    required
                    displayDollarFormat={displayDollarFormat}
                    displayPercentageFormat={displayPercentageFormat}
                    endAdornment={basketDiscount ? displayDollarFormat ? undefined : <div style={{ position: 'absolute', left: '60px'}}>%</div> : undefined}
                />
            </div>
            <Typography>Off</Typography>
        </div>
    }

    let customerPreview = 'Preview will generate after inputs are completed'

    if (dealLevel === 'product') {
        if (dealDiscountTab === 'percentage' && percentageOff) {
            if (percentageOff === 'custom') {
                if (customPercentageOff) {
                    customerPreview = `${customPercentageOff}% off products(s)`
                }
            } else {
                customerPreview = `${percentageOff}% off products(s)`
            }
        } else if (dollarOff || fixedPriceOff) {
            customerPreview = `$${dollarOff || fixedPriceOff} off product(s)`
        }
    } else if (basketSpend && basketDiscount) {
        customerPreview = `Spend $${basketSpend}, Get ${basketDealType === 'dollar' ? '$' : ''}${basketDiscount}${basketDealType === 'percentage' ? '%' : ''} off`
    }

    return <Card className={commonStyles["step-card-container"]}>
        <StepLabel currentStep={3} totalSteps={7} />
        <StepTitle title={"Deal Value"} />
        <RadioGroupField options={dealLevelOptions} label="Is this at a basket level or product level?" name="dealLevel" required handleChange={handleChange} />
        {dealLevel === 'product' && < StyledTabs tabs={dealTabs} handleTabUpdate={handleTabUpdate} defaultValue={dealDiscountTab} />}
        {content}
        <FormCardPreview title="Customer preview" description={customerPreview} />
    </Card>
}

export default DealValue