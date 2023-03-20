import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import styles from './FormCardPreview.module.css'

interface IFormCardPreview {
    title: string
    description: string[]
}

const FormCardPreview = ({ title, description }: IFormCardPreview) => {
    return <Box className={styles['preview-container']}>
        <Typography className={styles['title']}>{title}</Typography>
        <div className={styles['description-container']}>
            <div> <SellOutlinedIcon /></div>
            <div>
                {description.map((data, index) => {
                    return <Typography key={index} className={styles['description']}>{data}</Typography>
                })
                }
            </div>
        </div>
    </Box>
}

export default FormCardPreview