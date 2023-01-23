import React from 'react'
import Typography from '@mui/material/Typography';

interface IStepLabel {
    currentStep: number
    totalSteps: number
}

const StepLabel = ({ currentStep, totalSteps }: IStepLabel) => {
    return <Typography gutterBottom sx={{ color: '#276ADD', fontSize: '14px', fontWeight: 600 }}>
        STEP {currentStep} OF {totalSteps}
    </Typography>
}

export default StepLabel