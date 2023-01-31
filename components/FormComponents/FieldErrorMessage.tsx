import React from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import styles from './FormComponents.module.css'

interface IFieldErrorMessage {
    message : string | undefined
}

const FieldErrorMessage = ({ message }: IFieldErrorMessage) => {
 return <FormHelperText className={styles['error-text']}>{message}</FormHelperText>
}

export default FieldErrorMessage