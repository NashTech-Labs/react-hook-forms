import { FormControl, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import styles from './FormComponents.module.css'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

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
                    {error && <ErrorOutlineIcon className={styles['error-icon']} />}
                    {field.value && !error ? <CheckCircleOutlineOutlinedIcon className={styles['valid-icon']} /> : null}
                </InputAdornment>
                }
                error={Boolean(error)}
            />
            <Grid>
                {error && <FieldErrorMessage message={error.message} />}
            </Grid>
        </FormControl>
    )
}

export default ManualAddForm