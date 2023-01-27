import React from 'react'
import {useFormContext, useController} from "react-hook-form";
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import styles from './FormComponents.module.css'

interface ITextFieldProps {
    title?: string
    description?: string
    placeholder?: string
    tooltip?: string
    required?: boolean
    multiline?: boolean
    type?: string
    noBottomGutters?: boolean
    noTopGutters?: boolean
    disabled?: boolean
    name: string
}

const TextInputField = ({title, description, placeholder, tooltip, required, multiline, type, noBottomGutters, noTopGutters, disabled, name}: ITextFieldProps) => {
    const {control} = useFormContext()
    const {field} = useController({
        control,
        name
    })
    const {onChange, onBlur, ref, value} = field

    const classNames = [styles['form-field']]
    noBottomGutters && classNames.push(styles['no-bottom-margin'])
    noTopGutters && classNames.push(styles['no-top-margin'])

    return <div className={classNames.join(' ')}>
        <Typography variant='body1'>
            {title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
            {description}
        </Typography>
        <OutlinedInput
            id="title"
            placeholder={placeholder}
            sx={{
                width: '350px',
                '&.Mui-disabled': {
                    backgroundColor: disabled ? '#F0F0F0' : '#ffffff'
                }
            }}
            multiline={multiline}
            type={type}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            name={name}
            value={value}
        />
    </div>
}

export default TextInputField