import React from 'react'
import {useFormContext, useController} from "react-hook-form";
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
    label: string
    name: string
}

const RadioGroupField = ({options, label, name}: IRadioGroupFieldProps) => {
    const {control} = useFormContext()
    const {field} = useController({
        control,
        name
    })
    const {onChange, onBlur, value} = field

    return <FormControl className={styles["form-field"]}>
        <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            value={value}
        >
            {
                options.map(({value, label}) => <FormControlLabel key={value} value={value} control={<Radio />} label={label} />)
            }
        </RadioGroup>
    </FormControl>
}

export default RadioGroupField