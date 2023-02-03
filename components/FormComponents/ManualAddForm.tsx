import { FormControl, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './FormComponents.module.css'

interface AddFieldProps {
    name: string
    placeholder: string
}

function ManualAddForm({ name, placeholder }: AddFieldProps) {

    const { control } = useFormContext()
    const { field, fieldState: { error } } = useController({
        control,
        name
    })
    const { onChange, onBlur, ref, value } = field

    console.log(field, error)

    return (
        <FormControl fullWidth>
            <OutlinedInput
                sx={{
                    mt: 1,
                    "&": {
                        border: "1px solid #FFF",
                        borderRadius: "4px",
                    },
                    "&.Mui-focused fieldset": {
                        border: "1px solid #FFF",
                    },
                }}
                size="small"
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                name={name}
                value={value}
                endAdornment={<InputAdornment position="end">
                    {/* {endAdornment} */}
                    {error && <InfoOutlinedIcon className={styles['error-icon']} />}
                </InputAdornment>
                }
                error={Boolean(error)}
            />
            <div>
                {error && <FieldErrorMessage message={error.message} />}
            </div>
        </FormControl>
    )
}

export default ManualAddForm