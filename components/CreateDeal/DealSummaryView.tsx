import React from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import config from './DealSummaryViewConfig'
import StepTitle from "../StepTitle";
import commonStyles from './Steps.module.css'
import summaryStyles from '../Summary/Summary.module.css'
import { useAppSelector } from '../../store';
import { getNewDealData } from '../../store/feature/deal/newDealSlice'

const DealSummaryView = () => {
    const newDealData = useAppSelector(getNewDealData)
    return <>
    {
        Object.keys(config).map((stepTitle: string) => {
            return <Card className={commonStyles["step-card-container"]} key={stepTitle}>
                <StepTitle title={stepTitle} />
                {
                    config[stepTitle].map(({ title , getValue }) => {
                        return <>
                            <Typography variant="h4" className={summaryStyles.heading} mt={4}>{title}</Typography>
                            <Typography className={summaryStyles.content}>{getValue(newDealData)}</Typography>
                        </>
                    })
                }
    
            </Card>
        })
    }
    </>

}

export default DealSummaryView