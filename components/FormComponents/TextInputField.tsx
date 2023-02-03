import React, { FocusEvent } from 'react'
import { useFormContext, useController } from "react-hook-form";
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FieldErrorMessage from '../FormComponents/FieldErrorMessage'
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
    endAdornment?: JSX.Element
    inline?: boolean
    displayDollarFormat?: boolean,
    regular?: boolean
}

const TextInputField = ({ title, description, placeholder, tooltip, required, multiline, type, noBottomGutters, noTopGutters, disabled, name, endAdornment, inline, displayDollarFormat, regular }: ITextFieldProps) => {
    const { control, setValue } = useFormContext()
    const { field, fieldState: { error } } = useController({
        control,
        name
    })
    const { onChange, onBlur, ref, value } = field

    const handleBlur = ({ target: { value } }: FocusEvent<HTMLInputElement>) => {
        setValue(name, value ? parseFloat(value).toFixed(2) : value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }

    const classNames = [styles['form-field']]
    const titleClassNames = []
    let startAdornment = null
    noBottomGutters && classNames.push(styles['no-bottom-margin'])
    noTopGutters && classNames.push(styles['no-top-margin'])
    inline && classNames.push(styles['inline'])
    required && !inline && titleClassNames.push(styles['required'])

    if (displayDollarFormat) {
        startAdornment = <InputAdornment position='start'>
            {value && '$'}
        </InputAdornment>
    }

    const sxOverrides: any = {
        '&.Mui-disabled': {
            backgroundColor: disabled ? '#F0F0F0' : '#ffffff'
        },
        '&.Mui-error': {
            background: '#FEFAF9'
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
        },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        },
    }

    if (!inline) {
        sxOverrides['width'] = '350px'
    }

    if (regular) {
        sxOverrides['width'] = '100%'
    }

    if (inline) {
        return <div className={classNames.join(' ')}>
            {title && <Typography variant='body1' className={titleClassNames.join(' ')}>
                {title}
            </Typography>}
            {description && <Typography variant="caption" display="block" gutterBottom>
                {description}
            </Typography>}
            <div>
                <div>
                    <OutlinedInput
                        id="title"
                        placeholder={placeholder}
                        sx={sxOverrides}
                        multiline={multiline}
                        type={type}
                        disabled={disabled}
                        onChange={onChange}
                        onBlur={displayDollarFormat ? handleBlur : onBlur}
                        inputRef={ref}
                        name={name}
                        value={value}
                        endAdornment={<InputAdornment position="end">
                            {endAdornment}
                            {error && <InfoOutlinedIcon className={styles['error-icon']} />}
                        </InputAdornment>
                        }
                        startAdornment={startAdornment}
                        error={Boolean(error)}
                    />
                </div>
                <div>
                    {error && <FieldErrorMessage message={error.message} />}
                </div>
            </div>
        </div>
    }

    return <div className={classNames.join(' ')}>
        {title && <Typography variant='body1' className={titleClassNames.join(' ')}>
            {title}
        </Typography>}
        {description && <Typography variant="caption" display="block" gutterBottom>
            {description}
        </Typography>}
        <OutlinedInput
            id="title"
            placeholder={placeholder}
            sx={sxOverrides}
            multiline={multiline}
            type={type}
            disabled={disabled}
            onChange={onChange}
            onBlur={displayDollarFormat ? handleBlur : onBlur}
            inputRef={ref}
            name={name}
            value={value}
            endAdornment={<InputAdornment position="end">
                {endAdornment}
                {error && <InfoOutlinedIcon className={styles['error-icon']} />}
            </InputAdornment>
            }
            error={Boolean(error)}
            minRows={3}
            startAdornment={startAdornment}
        />
        {error && <FieldErrorMessage message={error.message} />}
    </div>
}

export default TextInputField