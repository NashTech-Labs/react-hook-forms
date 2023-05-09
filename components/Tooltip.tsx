import React from 'react'
import { Tooltip } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import TOOLTIP_TEXT from '../constants/Tooltips'

interface ICustomTooltip {
    descriptionKey?: string
    customStyles?: object
}

const CustomTooltip = ({ descriptionKey = '', customStyles = {} }: ICustomTooltip) => {
 return <Tooltip title={TOOLTIP_TEXT[descriptionKey]} arrow placement='top-start'
  componentsProps={{
    tooltip : {
        sx : {
            backgroundColor: '#333333',
            padding: '14px',
            fontSize: '14px',
            fontWeight: 400
        }
    },
    arrow : {
        sx: {
            color: '#333333'
        }
    }
  }}
>
 <HelpIcon sx={{ fontSize: '20px', ...customStyles }}/>
</Tooltip>
}

export default CustomTooltip