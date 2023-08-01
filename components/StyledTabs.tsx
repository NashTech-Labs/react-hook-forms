import React, { useState, SyntheticEvent } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './FormCardPreview.module.css'

interface ITab {
    label: string
    value: string
}

interface IStyledTabsProps {
    tabs: ITab[]
    handleTabUpdate: Function
    defaultValue?: string
}

const StyledTabs = ({ tabs, handleTabUpdate, defaultValue }: IStyledTabsProps) => {
    const [tab, setTab] = useState<number | Function>(() => {
        if (!defaultValue) return 0
        let index = 0
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i]?.value === defaultValue) {
                index = i
                break;
            }
        }
        return index
    }
    )

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
                color: '#043385 !important',
                fontWeight: 600
            },
            '.MuiTab-root': {
                textTransform: 'inherit',
                fontSize: '16px',
                color: '#191919',
                opacity: 1
            },
            '.MuiTabs-flexContainer': {
                borderBottom: '1px solid #CCCCCC'
            }
        }}
    >
        {tabs.map(({ label }) => <Tab data-testid={label} key={`${label}`} label={label === "Manually add product(s)" && tab === 1 ? <span className={styles.required}>{label}</span> : label} />)}
    </Tabs>
}

export default StyledTabs