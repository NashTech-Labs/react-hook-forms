
import React, {ChangeEvent, MouseEventHandler, useState, useMemo, useCallback} from 'react'
import Modal from 'react-modal'
import {useFormContext} from "react-hook-form";
import DataTable from "react-data-table-component";
import {Typography, Stack, OutlinedInput, Button, Pagination, PaginationItem, IconButton, Box} from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {useAppSelector} from '../../store';
import {userProfileState} from '../../store/feature/auth/authSlice';
import {updatedDealId} from '../../store/feature/deal/dealSlice';
import {useGetDealPreviewQuery} from "../../api/dealPreview";
import {useEditDealsMutation} from '../../api/editDeal';
import {notifyError} from '../../util/Notification/Notification';
import generateCreateDealPayload from '../../util/createDealPayload';
import styles from './RemoveProductsModal.module.css';

const PAGE_SIZE = 10

const draftModalcustomStyles = {
    content: {
        width: "800px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "2px",
        background: "#fff",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        padding: "16px",
        gap: "10px",
    },
    overlay: {
        zIndex: "999",
        background: "rgba(0,0,0,0.4",
    },
};

const customStyles = {
    headCells: {
        style: {
            backgroundColor: "#F0F0F0",
            borderBottom: "3px solid #666B73",
            fontSize: "16px",
            fontWeight: "bolder", // override the cell padding for head cells
        },
    },
    table: {
        style: {
            height: '550px'
        }
    }
};

interface IRemoveProductsModal {
    isOpen: boolean
    handleClose: MouseEventHandler
    exclusions?: boolean
}

const RemoveProductsModal = ({isOpen, handleClose, exclusions}: IRemoveProductsModal) => {
    const {getValues, setValue} = useFormContext()
    const [search, setSearch] = useState<string>("")
    const [page, setPage] = useState<number>(1)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)
    const dealId = useAppSelector(updatedDealId)
    const user = useAppSelector(userProfileState)
    const {data, refetch} = useGetDealPreviewQuery(dealId);
    const [editDeal] = useEditDealsMutation();

    const handlePagination = useCallback((e: ChangeEvent<unknown>, number: number): void => {
        setPage(number)
    }, [])

    const handleSearchChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setSearch(value)
    }
    const handleChange = useCallback((state: any) => {
        console.log("here")
        setSelectedRows(state.selectedRows);
    }, []);

    const handleDeleteClick = useCallback(() => {
        setShowConfirmation(true)
    }, [])

    const handleCancelConfirmation = useCallback(() => {
        setShowConfirmation(false)
    }, [])
    
    let records: Array<{ value: string, type: string, id: string }> = []

    if(exclusions) {
        const mch = data?.exclusion?.product?.mch || []
        const liam = data?.exclusion?.product?.liam || []
        mch.forEach((value: string) => {
            records.push({
                value,
                type: 'mch',
                id: value
            })
        })
        liam.forEach((value: string) => {
            records.push({
                value,
                type: 'liam',
                id: value
            })
        })
    } else {
        records = data?.dealValue?.scopeValue
    }

    const handleDeleteProducts = async () => {
        const productsToBeRemoved = selectedRows.map(({value}: {value: string}) => value)
        let payload = {}
        if(exclusions) {
            const mch :Array<string> = []
            const liam:Array<string>  = []
            records.forEach(({ type, value }) => {
               if(type === "mch" && !productsToBeRemoved.includes(value)) {
                 mch.push(value)
               } else if(type === "liam" && !productsToBeRemoved.includes(value)) {
                liam.push(value)
               }
            })
            const formValues: any = getValues()
            payload = {
                ...generateCreateDealPayload(formValues, false),
                dealId: data?.generalDealInfo?.id,
                username: user?.name,
                "promo_restrictions" : {
                    "product_code" : {
                        liam
                    },
                    category : {
                        mch
                    }
                }
            }
        } else {
            const scopes = data?.dealValue?.scopeValue
            const newScopes = scopes.filter(({value}: {value: string}) => !productsToBeRemoved.includes(value))
            const formValues: any = getValues()
            payload = {
                ...generateCreateDealPayload(formValues, false),
                scopes: newScopes,
                dealId: data?.generalDealInfo?.id,
                username: user?.name
            }
        }

        await editDeal(payload)
            .unwrap()
            .then(() => {
                setConfirmationMessage("Products deleted. Deleted products will need to be uploaded by LIAM or MCH to be featured in this promotion again.")
            })
            .catch((error: any) => {
                notifyError(
                    error.data?.details ? error.data?.details : "Something went wrong",
                    "deal-failed"
                )
            }).finally(() => {
                setShowConfirmation(false)
                refetch()
            })
    }

    const columns: any = useMemo(
        () => [
            {
                name: "Products",
                selector: (row: any) => row.value,
            },
        ],
        []
    );

    let tableData: Array<{value : string }> = []

    if(data) {
        if(search) {
            tableData = records.filter(({value}: {value: string}) => value.toLowerCase().includes(search.toLowerCase()))
        } else {
            tableData = records
        }
    }

    let content = null

    if(showConfirmation) {
        content = <Stack spacing={2}>
            <Typography variant="h5">Are you sure you wish to permanently remove these product(s) from this promotion?</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" className={styles.cancelBtn} onClick={handleCancelConfirmation}>No, cancel</Button>
                <Button variant="contained" className={styles.confirmationBtn} onClick={handleDeleteProducts}>Yes, remove products(s)</Button>
            </Stack>
        </Stack>
    } else {
        content = <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5">Remove applicable products for promotion</Typography>
                <IconButton>
                    <CloseIcon onClick={handleClose} />
                </IconButton>
            </Stack>
            {confirmationMessage && <Box className={styles.confirmationMessage}>
                <Stack direction="row" alignItems="center">
                    <ErrorOutlineOutlinedIcon sx={{color: "#E1251B"}} />
                    <Typography padding={1} sx={{fontWeight: 600}}>{confirmationMessage}</Typography>
                </Stack>
            </Box>}
            <OutlinedInput
                sx={{
                    minWidth: '350px',
                    height: '40px'
                }}
                endAdornment={<SearchOutlined />}
                placeholder="Search by LIAM or MCH"
                value={search}
                onChange={handleSearchChange}
                inputProps={{
                    "data-testId": "search"
                }}
            />
            <DataTable
                responsive
                persistTableHead
                data={tableData.slice(PAGE_SIZE * (page - 1), page * PAGE_SIZE)}
                highlightOnHover
                columns={columns}
                customStyles={customStyles}
                selectableRows
                onSelectedRowsChange={handleChange}
            />
            <Stack direction="row" justifyContent="space-between">
                <Button variant="outlined" sx={{
                    color: '#333333',
                    border: '1px solid #CCCCCC',
                    width: 'fit-content',
                    textTransform: 'none'
                }}
                    onClick={handleDeleteClick}
                >Delete selected</Button>
                <Pagination
                    page={page}
                    count={Math.ceil(tableData?.length / 10)}
                    hidePrevButton={page === 1}
                    onChange={handlePagination}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{previous: undefined, next: NavigateNextIcon}}
                            {...item}
                        />
                    )}
                    sx={{
                        '.MuiPaginationItem-text': {
                            color: '#276ADD'
                        },
                        '.Mui-selected': {
                            color: '#333333'
                        }
                    }}
                />
            </Stack>

        </Stack>
    }
    return <Modal
        style={draftModalcustomStyles}
        isOpen={isOpen}
        onRequestClose={handleClose}
    >
        {content}
    </Modal>
}

export default RemoveProductsModal