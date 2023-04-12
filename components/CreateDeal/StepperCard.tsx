import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import commonStyles from './Steps.module.css'
import styles from './StepperCard.module.css'

const STEP_CONFIG : { [index: string]: any } = {
    GENERAL_INFORMATION: ['title', 'priority', 'stackingType'],
    DEAL_VALUE: ['dollarOff', 'fixedPriceOff', 'basketSpend', 'basketDiscount', ['percentageOff' , 'customPercentageOff']],
    DATE_IN_EFFECT: ['startDatePicker', 'startTimePicker', 'endTimePicker', 'endDatePicker'],
    PRODUCTS_AND_COLLECTIONS: ['mch', 'liam' , 'fileMCH', 'fileLIAM'],
    EXCLUSIONS: ['dealApplyType', 'dealLevelOptions'],
    PROMOTION_MESSAGES: ['englishMessage', 'frenchMessage']
}

const anyOneValueCriteriaSections = ['PRODUCTS_AND_COLLECTIONS', 'DEAL_VALUE']

const getIconProps = ({ error, complete, inProgressIcon } : any) => {
    if(error) return {style: styles['error'] , Icon: ErrorOutlineIcon}
    if(complete) return {style: styles['complete'] , Icon: CheckIcon}
    return {style: styles['inProgress'] , Icon: inProgressIcon}
}

const StepperCard = (props: any) => {
    const { children, step, inProgressIcon } = props
    const { formState , control } = useFormContext()
    const { errors } = formState || {}
    const allValues = useWatch({ control })
    const currentStepFields = STEP_CONFIG[step]
    const error = currentStepFields?.some((field: any) => {
        if(Array.isArray(field)) {
            return field.some(value => errors[value])
        }
        return errors[field]
    })
    let complete = false
    if(anyOneValueCriteriaSections.includes(step)){
        complete = currentStepFields?.some((field: any) => {
            if(Array.isArray(field)){
                return field.some(value => allValues[value])
            }
            const value = allValues[field]
            return Array.isArray(value) ? value.length > 0 && value.every(v => v)  : value
        })
    } else {
        complete = currentStepFields?.every((field: any) => {
            const value = allValues[field]
            return Array.isArray(value) ? value.length > 0 && value.every(v => v) : value
        })
    }
    const {Icon, style } = getIconProps({ error, complete, inProgressIcon })
    let statusLine = styles['dashedLine']
    if(complete)  {
        statusLine = styles['solidLine']
    }
    if(error) {
        statusLine = styles['dashedLine']
    }
  
    return  <Box> 
        <Grid container className={commonStyles["step-card-container"]} >
            <Grid item>
                <Icon className={`${style} ${styles['icon']}`}/>
                <hr className={`${statusLine} ${style}`} />
            </Grid>
            <Grid item className={commonStyles["step-card"]} >
             {children}
            </Grid>
         </Grid>
         </Box>
}

export default StepperCard