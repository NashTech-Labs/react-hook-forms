import React, {useState} from 'react'
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
    const [percentage, setPercentage] = useState<number | null | string>(null)
    const [dealLevel, setDealLevel] = useState<string>(dealLevelOptions[0]?.value)
    const [basketDealType, setBasketDealType] = useState<string>('dollar')

    const getButtonVariant = (type: string) => {
        return type === basketDealType ? 'contained' : 'outlined'
    }

    const handleBasketDalTypeChange = (type: string): void => {
        setBasketDealType(type)
    }

    let content = null
    if(dealLevel === 'product') {
        if(activeTab === 'dollar') {
            content = <TextInputField
                title="Enter dollar ($) off"
                description="Must be numeric values only"
                placeholder="$ 0.00"
                type="number"
            />
        }

        if(activeTab === 'percentage') {
            content = <>
                <RadioGroupField options={percentageOptions} label="Select percentage" defaultValue='10' onChange={setPercentage} />
                <div className={styles['cutom-percentage']}>
                    <TextInputField
                        placeholder="Enter numeric value between 1-99"
                        type="number"
                        noTopGutters
                        disabled={percentage !== 'custom'}
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
                <Button variant={getButtonVariant('percentage')} onClick={() => handleBasketDalTypeChange('percentage')}>%</Button>
                <Button variant={getButtonVariant('dollar')} onClick={() => handleBasketDalTypeChange('dollar')}>$</Button>
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
        <RadioGroupField options={dealLevelOptions} label="Is this at a basket level or product level?" defaultValue="product" onChange={setDealLevel} />
        {dealLevel === 'product' && < StyledTabs tabs={dealTabs} setActiveTab={setActiveTab} />}
        {content}
        <FormCardPreview title="Customer preview" description="Preview will generate after inputs are completed" />
    </Card>
}

export default Step3