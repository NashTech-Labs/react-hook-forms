import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Typography, Chip, Checkbox, InputAdornment, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import classes from './FilterModal.module.css'
import FieldErrorMessage from "../FormComponents/FieldErrorMessage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getVoucherFilters, updateVoucheFilters } from '../../store/feature/voucher/voucherFilterSlice'
import { statusOptions, voucherTypeOptions } from '../../constants/FormOptions'

interface IFilterModal {
    closeModal: Function
}

const ChipComponentStyleOverrides = {
    margin: "0px 5px",
    padding: '5px 10px',
    '&.MuiButtonBase-root': {
        border: '1px solid #276ADD',
        color: '#276ADD'
    },
    '&.MuiChip-filled': {
        backgroundColor: '#276ADD',
        color: '#ffffff'
    },
    '.MuiChip-label': {
        fontWeight: "700 !important",
        fontSize: '16px',
    },
    '&.MuiSvgIcon-root': {
        color: '#ffffff'
    }
}

const FilterVoucherModal = ({ closeModal }: IFilterModal) => {
    const dispatch = useDispatch()
    const filters = useSelector(getVoucherFilters)
    const [status, setStatus] = useState<string[]>([])
    const [dealType, setDealType] = useState<string[]>([])
    const [openStartDate, setOpenStartDate] = useState<boolean>(false);
    const [openEndDate, setOpenEndDate] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<any | null>(null)
    const [startDateChecked, setStartDateChecked] = useState<boolean>(false)
    const [endDate, setEndDate] = useState<any | null>(null)
    const [endDateChecked, setendDateChecked] = useState<boolean>(false)

    useEffect(() => {
        const { status, dealType, startDate, endDate } = filters
        if (status) setStatus(status)
        if (dealType) setDealType(dealType)
        if (startDate) {
            setStartDate(startDate)
            setStartDateChecked(true)
        }
        if (endDate) {
            setEndDate(endDate)
            setendDateChecked(true)
        }
    }, [filters])

    const startDateDisabled = !startDateChecked
    const endDateDisabled = !endDateChecked
    const endDateError = (startDate && endDate) ? endDate.isBefore(startDate) : false

    const handleStatusFilterClick = (value: string) => {
        setStatus(status => {
            if (status.includes(value)) {
                return status.filter(status => status !== value)
            }
            return [...status, value]
        })
    }

    const handleDealTypeFilterClick = (value: string) => {
        setDealType(dealType => {
            if (dealType.includes(value)) {
                return dealType.filter(deal => deal !== value)
            }
            return [...dealType, value]
        })
    }

    const handleStartDateChecked = () => {
        setStartDateChecked(startDateChecked => {
            if (startDateChecked) {
                setStartDate(null)
            }
            return !startDateChecked
        })
    }

    const handleEndDateChecked = () => {
        setendDateChecked(endDateChecked => {
            if (endDateChecked) {
                setEndDate(null)
            }
            return !endDateChecked
        })
    }

    const handleStartDateChange = (value: string | null) => {
        setStartDate(value)
    }

    const handleEndDateChange = (value: string | null) => {
        setEndDate(value)
    }

    const handleClear = () => {
        setStatus([])
        setDealType([])
        setStartDate(null)
        setEndDate(null)
        setStartDateChecked(false)
        setendDateChecked(false)
        setOpenStartDate(false)
        setOpenEndDate(false)
    }

    const getFilterCount = () => {
        let count = 0
        if (status) count = count + status.length
        if (dealType) count = count + dealType.length
        if (startDate) count++
        if (endDate) count++

        return count
    }

    const submitFilters = () => {
        if (endDateError) return
        dispatch(updateVoucheFilters({
            status,
            dealType,
            endDate,
            startDate,
            count: getFilterCount()
        }))
        closeModal()
    }

    const errorBackgroundColor = endDateError ? '#FEFAF9' : '#ffffff'

    return <>
        <Box p={1} data-testid="deleteDealModal" sx={{ padding: 0 }}>
            <Grid container alignItems="center" my={2}>
                <Grid item lg={11}>
                    <Typography variant="h5" className={classes["modal-heading"]}>
                        Filter
                    </Typography>
                </Grid>
                <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }} >
                    <IconButton onClick={() => closeModal()} data-testId="close-icon">
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Typography>
                Status
            </Typography>
            <Box my={2}>
                {
                    Object.keys(statusOptions).map(key => <Chip
                        key={key}
                        label={statusOptions[key]}
                        onClick={() => handleStatusFilterClick(key)}
                        onDelete={() => handleStatusFilterClick(key)}
                        deleteIcon={status.includes(key) ? <DoneIcon sx={{
                            '&.MuiSvgIcon-root': {
                                color: '#ffffff'
                            }
                        }
                        } /> : <div />}
                        sx={ChipComponentStyleOverrides}
                        variant={status.includes(key) ? 'filled' : 'outlined'}
                        data-testId={key}
                    />)
                }
            </Box>
            {/* <Typography className={classes['deal-type-field']}>
                Voucher type
            </Typography>
            <Box my={2}>
                {
                    Object.keys(voucherTypeOptions).map(key => <Chip
                        key={key}
                        label={voucherTypeOptions[key]}
                        onClick={() => handleDealTypeFilterClick(key)}
                        onDelete={() => { }}
                        deleteIcon={dealType.includes(key) ? <DoneIcon sx={{
                            '&.MuiSvgIcon-root': {
                                color: '#ffffff'
                            }
                        }
                        } /> : <div />}
                        sx={ChipComponentStyleOverrides}
                        variant={dealType.includes(key) ? 'filled' : 'outlined'}
                    />)
                }
            </Box> */}
            <div className={classes['date-field-container']}>
                <div>
                    <Checkbox checked={startDateChecked} onChange={handleStartDateChecked} sx={{ padding: '0px', marginRight: '22px' }} style={{
                        transform: "scale(1.25)",
                    }}
                        inputProps={{
                            // @ts-ignore
                            "data-testId": "start-date-checkbox"
                        }}
                    />
                </div>
                <div>
                    <Typography className={classes['date-label']}>Start date of voucher</Typography>
                    <Typography className={classes['date-sub-label']}>Select date</Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label={startDate === null ? "MM/DD/YYYY" : ''}
                            inputFormat="MM/DD/YYYY"
                            disabled={startDateDisabled}
                            open={openStartDate}
                            onClose={() => {
                                setOpenStartDate(false);
                            }}
                            value={startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => {
                                return <TextField
                                    size="small"
                                    {...params}
                                    id={'startDate'}
                                    error={false}
                                    inputProps={{ ...params.inputProps, "data-testid": 'startDate' }}
                                    InputLabelProps={{ shrink: false }}
                                    sx={{
                                        backgroundColor: startDateDisabled ? '#F0F0F0' : '#ffffff'
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{
                                                        marginRight: "-12px"
                                                    }}
                                                    onClick={() => setOpenStartDate(true)}
                                                    disabled={startDateDisabled}
                                                >
                                                    <CalendarMonthIcon
                                                        sx={
                                                            !startDateDisabled
                                                                ? { color: "#333333" }
                                                                : { color: "rgba(0,0,0,0.38)" }
                                                        }
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className={classes['date-field-container']}>
                <div>
                    <Checkbox checked={endDateChecked} onChange={handleEndDateChecked} sx={{ padding: '0px', marginRight: '22px' }} style={{
                        transform: "scale(1.25)",
                    }}
                        inputProps={{
                            // @ts-ignore
                            "data-testId": "end-date-checkbox"
                        }}
                    />
                </div>
                <div>
                    <Typography className={classes['date-label']}>End date of voucher</Typography>
                    <Typography className={classes['date-sub-label']}>Select date</Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label={endDate === null ? "MM/DD/YYYY" : ''}
                            inputFormat="MM/DD/YYYY"
                            disabled={endDateDisabled}
                            open={openEndDate}
                            onClose={() => {
                                setOpenEndDate(false);
                            }}
                            value={endDate}
                            minDate={startDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => {
                                return <TextField
                                    size="small"
                                    {...params}
                                    id={'endDate'}
                                    error={endDateError}
                                    inputProps={{ ...params.inputProps, "data-testid": 'endDate' }}
                                    InputLabelProps={{ shrink: false }}
                                    sx={{
                                        backgroundColor: endDateDisabled ? '#F0F0F0' : errorBackgroundColor
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{
                                                        marginRight: "-12px"
                                                    }}
                                                    onClick={() => setOpenEndDate(true)}
                                                    disabled={endDateDisabled}
                                                >
                                                    <CalendarMonthIcon
                                                        sx={
                                                            !endDateDisabled
                                                                ? { color: "#333333" }
                                                                : { color: "rgba(0,0,0,0.38)" }
                                                        }
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            }}
                        />
                        {endDateError && <FieldErrorMessage testId={`end-date-field-error`} message={'End date must be after Start date'} />}
                    </LocalizationProvider>
                </div>
            </div>
            <Grid container mt={10} mb={1}>
                <Grid item lg={6}>
                    <Button
                        className={classes["exit-btn"]}
                        onClick={() => closeModal()}
                        variant="outlined"
                        data-testId="exit-btn"
                    >
                        Exit
                    </Button>
                </Grid>
                <Grid item lg={6} sx={{ textAlign: "right" }}>
                    <Button
                        className={classes["clear-filter-btn"]}
                        onClick={handleClear}
                        data-testid="exitBtn"
                        variant="outlined"
                        data-testId="clear-btn"
                    >
                        {`Clear filters(${getFilterCount()})`}
                    </Button>
                    <Button
                        className={classes["submit-btn"]}
                        variant="contained"
                        data-testid="submitBtn"
                        onClick={submitFilters}
                        data-testId="update-btn"
                    >
                        Update
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </>
}

export default FilterVoucherModal