import React, {useState, SyntheticEvent} from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from '@mui/material/styles/styled'

interface ITab {
    label: string
    value: string
}

interface IStyledTabsProps {
    tabs: ITab[]
    handleTabUpdate: Function
}

const StyledTabs = ({tabs, handleTabUpdate}: IStyledTabsProps) => {
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
        TabIndicatorProps={{style: {height: '4px'}}}
    >
        {tabs.map(({label}, index) => <Tab key={`${label}-${index}`} label={label} />)}
    </Tabs>
}

export default StyledTabs