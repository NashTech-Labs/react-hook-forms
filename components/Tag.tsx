import React from 'react'
import Chip from '@mui/material/Chip';

interface ITag {
    label: string
}

const Tag = ({label}: ITag) => <Chip label={label} sx={{margin: '10px 0px', backgroundColor: '#E6ECF6', fontWeight: '700'}} />

export default Tag