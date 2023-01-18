import React from 'react'
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

interface ITextFieldProps {
    title: string
    description?: string
    placeholder?: string
    tooltip?: string
    required?: boolean
    multiline?: boolean
}

const TextInputField = ({title, description, placeholder, tooltip, required, multiline}: ITextFieldProps) => {
    return <>
        <Typography variant='body1'>
            {title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
            {description}
        </Typography>
        <OutlinedInput id="title" placeholder={placeholder} sx={{marginBottom: '20px', width: '350px'}} multiline={multiline} />
    </>
}

export default TextInputField