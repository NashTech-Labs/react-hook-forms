import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import styles from './FormCardPreview.module.css'

interface IFormCardPreview {
    title: string
    description: string
}

const FormCardPreview = ({title, description}: IFormCardPreview) => {
    return <Box className={styles['preview-container']}>
        <Typography className={styles['title']}>{title}</Typography>
        <div className={styles['description-container']}>
            <div> <DiscountOutlinedIcon /></div>
            <div> <Typography className={styles['description']}>{description}</Typography></div>
        </div>
    </Box>
}

export default FormCardPreview