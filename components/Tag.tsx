import React from 'react'
import Chip from '@mui/material/Chip';

interface ITag {
    label: string
    extraSpacing?: boolean
}

const Tag = ({label, extraSpacing}: ITag) => <Chip label={label} sx={{margin: extraSpacing ? '17px 0px 24px 0px' : '10px 0px', backgroundColor: '#E6ECF6', fontWeight: '700'}} />

export default Tag