import React from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import styles from './FormComponents.module.css'

interface IFieldErrorMessage {
    message : string | undefined
    testId : string
}

const FieldErrorMessage = ({ message, testId }: IFieldErrorMessage) => {
 return <FormHelperText className={styles['error-text']} data-testid={testId}>{message}</FormHelperText>
}

export default FieldErrorMessage