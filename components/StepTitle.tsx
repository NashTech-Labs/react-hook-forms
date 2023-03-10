import React from 'react'
import { Typography } from '@mui/material'

interface IStepTitle {
    title: string
}

const StepTitle = ({ title }: IStepTitle) => <Typography variant='h5' sx={{ color: "#1C1B1F", fontWeight: 600, fontSize: '24px', lineHeight: '28px' }}>
    {title}
</Typography>

export default StepTitle