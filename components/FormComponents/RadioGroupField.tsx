import React from 'react'
import { useFormContext, useController } from "react-hook-form";
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import styles from './FormComponents.module.css'

interface IRadioControlOption {
    value: string
    label: string
}

interface IRadioGroupFieldProps {
    options: IRadioControlOption[]
    label?: string
    name: string
    required?: boolean
    handleChange?: Function
}

const RadioGroupField = ({ options, label, name, required, handleChange }: IRadioGroupFieldProps) => {
    const { control } = useFormContext()
    const { field } = useController({
        control,
        name
    })
    const { onChange, onBlur, value } = field
    const titleClassNames = []
    titleClassNames.push(styles['labelHeading'])
    required && titleClassNames.push(styles['required'])

    return <FormControl className={styles["form-field"]}>
        <FormLabel sx={{
            '&.Mui-focused': {
                color: 'black'
            }
        }} id="demo-radio-buttons-group-label" className={titleClassNames.join(' ')}>{label}</FormLabel>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            onChange={(e) => {
                onChange(e)
                handleChange && handleChange(e)
            }}
            onBlur={onBlur}
            name={name}
            value={value}
            sx={{
                ".MuiFormControlLabel-root": {
                    height: '33px'
                }
            }}
        >
            {
                options.map(({ value, label }) => <FormControlLabel key={value} value={value} control={<Radio />} label={label} />)
            }
        </RadioGroup>
    </FormControl>
}

export default RadioGroupField