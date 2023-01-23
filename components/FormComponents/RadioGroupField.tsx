import React, {ChangeEvent, useState} from 'react'
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
    defaultValue?: string
    onChange?: Function
}

const RadioGroupField = ({options, label, defaultValue, onChange}: IRadioGroupFieldProps) => {
    const [value, setValue] = useState<string>(defaultValue || options[0]?.value)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        onChange && onChange(e.target.value)
    }

    return <FormControl className={styles["form-field"]}>
        <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={defaultValue}
            name="radio-buttons-group"
            onChange={handleChange}
            value={value}
        >
            {
                options.map(({value, label}) => <FormControlLabel key={value} value={value} control={<Radio />} label={label} />)
            }
        </RadioGroup>
    </FormControl>
}

export default RadioGroupField