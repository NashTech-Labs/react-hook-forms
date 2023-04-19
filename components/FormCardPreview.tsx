import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import styles from './FormCardPreview.module.css'

interface IFormCardPreview {
    title: string
    description: string | null
}

const FormCardPreview = ({title, description}: IFormCardPreview) => {
    return <Box className={styles['preview-container']}>
        <Typography className={styles['title']}>{title}</Typography>
        <div className={styles['description-container']}>
            <div> <SellOutlinedIcon /></div>
            <div> <Typography className={styles['description']}>{description}</Typography></div>
        </div>
    </Box>
}

export default FormCardPreview