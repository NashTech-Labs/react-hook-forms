import React, { useState, SyntheticEvent } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from '@mui/material/styles/styled'
import styles from './FormCardPreview.module.css'
import { Typography } from '@mui/material';

interface ITab {
    label: string
    value: string
}

interface IStyledTabsProps {
    tabs: ITab[]
    handleTabUpdate: Function
}

const StyledTabs = ({ tabs, handleTabUpdate }: IStyledTabsProps) => {
    const [tab, setTab] = useState<number>(0)

    const handleChange = (e: SyntheticEvent, newTab: number) => {
        setTab(newTab)
        handleTabUpdate(tabs[newTab]?.value)
    }

    return <Tabs
        value={tab}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        TabIndicatorProps={{ style: { height: '4px' } }}
        sx={{
            '.Mui-selected': {
                color: '#043385',
                fontWeight: 600
            },
            '.MuiTab-root': {
                textTransform: 'inherit',
                fontSize: '16px',
                color: '#000000',
                opacity: 1
            }
        }}
    >
        {tabs.map(({ label }, index) => <Tab key={`${label}-${index}`} label={label === "Manually add product(s)" && tab === 1 ? <Typography className={styles.required}>{label}</Typography> : label} />)}
    </Tabs>
}

export default StyledTabs