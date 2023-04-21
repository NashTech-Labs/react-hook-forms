import { Box, Button, Card, Chip, Grid, IconButton, Switch, SwitchProps, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import StepTitle from "../StepTitle";
import styles from "./Summary.module.css";
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import { updatedDealId } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";
import { capitalizeWords } from "../../util/format";
import DownloadIcon from '@mui/icons-material/Download';
import { convertToEST } from "../../util/ConvertDateTime";
import { dealStatus } from "../../constants/DealStatus";
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from "react-modal";
import EditDealModal from "./EditDealModal";

const editDealStyles = {
    content: {
        width: "27%",
        top: "40%",
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

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 65,
    height: 31,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            marginLeft: "22px",
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#467E1B',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 26,
        height: 28,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#666B73' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

function Summary() {
    const dealId = useAppSelector(updatedDealId);

    const { data, refetch } = useGetDealPreviewQuery(dealId);

    const router = useRouter();

    const [customerPreview, setCustomerPreview] = useState<string[]>([])

    const [isOpen, setIsOpen] = useState(false);

    const [isDealActive, setIsDealActive] = useState<boolean>(true)

    const downloadScopeExcel = (data: any) => {

        let mch: string[] = []
        let liam: string[] = []

        data.map((data: any) => {
            if (data.sub_type === "LIAM") {
                mch.push(data.value)
            }
            if (data.sub_type === "MCH") {
                liam.push(data.value)
            }
        })

        const csvMapping: string[] = []
        if (mch) {
            mch.forEach((value: string) => {
                csvMapping.push(value)
            })
        }

        if (liam) {
            liam.forEach((value: string, index: number) => {
                const currentValue = csvMapping[index]
                csvMapping[index] = currentValue ? `${currentValue},${value}` : `,${value}`
            })
        }

        let csvString = csvMapping.reduce((acc, cur) => `${acc}\n${cur}`);
        csvString = "data:application/csv," + encodeURIComponent(csvString);
        var x = document.createElement("A");
        x.setAttribute("href", csvString);
        x.setAttribute("download", "productList.csv");
        document.body.appendChild(x);
        x.click();
    }

    const downloadExcel = (value = {}) => {
        const { mch, liam }: any = value
        const csvMapping: string[] = []
        if (mch) {
            mch.forEach((value: string) => {
                csvMapping.push(value)
            })
        }

        if (liam) {
            liam.forEach((value: string, index: number) => {
                const currentValue = csvMapping[index]
                csvMapping[index] = currentValue ? `${currentValue},${value}` : `,${value}`
            })
        }

        let csvString = csvMapping.reduce((acc, cur) => `${acc}\n${cur}`);
        csvString = "data:application/csv," + encodeURIComponent(csvString);
        var x = document.createElement("A");
        x.setAttribute("href", csvString);
        x.setAttribute("download", "productList.csv");
        document.body.appendChild(x);
        x.click();
    }

    const ToProperCase = (string: string) => {
        let str = string.replace(/_/g, " ")
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
    }

    const dealValue = (value: string, type: string) => {

        if (type === "$_OFF" || type === "$_FIXED") {
            return `$${(Number(value) / 100).toFixed(2)}`
        }

        if (type === "%_OFF") {
            return `${value}%`
        }

        else {
            return (Number(value) / 100).toFixed(2)
        }
    }

    const getDealValuePreview = (data: any) => {
        if (!data?.dealValue?.rewardsValue[0]?.value) return ''

        const value = dealValue(data?.dealValue?.rewardsValue[0]?.value, data?.dealValue?.rewardType)

        if (data?.dealValue?.scopeType === 'BASKET') {
            return `Spend $${(Number(data?.dealValue?.spend?.minimum) / 100).toFixed(2)} Get ${value} off`
        }

        return `${value} off product(s)`
    }

    useEffect(() => {
        if (data) {
            if (data?.generalDealInfo?.type === "MULTI_BUY") {

                if (!data?.dealValue?.quantity?.minimum) return

                let previewData = data?.dealValue?.rewardsValue

                let customerPreviewData: string[] = []

                if (previewData.length === 1) {
                    previewData.forEach((value: any) => {
                        if (data?.dealValue?.rewardType === "$_OFF_MULTI") {
                            customerPreviewData.push(`Buy ${data?.dealValue?.quantity?.minimum} Get $${(Number(value.value) / 100).toFixed(2)} Off`)
                        }
                        if (data?.dealValue?.rewardType === "$_FIXED_MULTI") {
                            customerPreviewData.push(`Buy ${data?.dealValue?.quantity?.minimum} For $${(Number(value.value) / 100).toFixed(2)}`)
                        }

                        if (data?.dealValue?.rewardType === "%_OFF_MULTI") {
                            customerPreviewData.push(`Buy ${data?.dealValue?.quantity?.minimum} Get ${value.value}% Off`)
                        }
                    });
                }
                else {
                    previewData.forEach((value: any) => {
                        if (data?.dealValue?.rewardType === "$_OFF_MULTI") {
                            customerPreviewData.push(`Buy ${value?.restrictions?.quantity?.minimum} Get $${(Number(value.value) / 100).toFixed(2)} Off`)
                        }
                        if (data?.dealValue?.rewardType === "$_FIXED_MULTI") {
                            customerPreviewData.push(`Buy ${value?.restrictions?.quantity?.minimum} For $${(Number(value.value) / 100).toFixed(2)}`)
                        }

                        if (data?.dealValue?.rewardType === "%_OFF_MULTI") {
                            customerPreviewData.push(`Buy ${value?.restrictions?.quantity?.minimum} Get ${value.value}% Off`)
                        }
                    });
                }
                setCustomerPreview(customerPreviewData)
            }
        }


    }, [data])

    useEffect(() => {
        if (data?.generalDealInfo?.status === "ACTIVE") {
            setIsDealActive(true)
        }
        else {
            setIsDealActive(false)
        }
    }, [data, router])

    const handleChange = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false);
    };

    const disableDeal = () => {
        setIsDealActive(!isDealActive)
    }


    return (
        <Grid container>
            <Grid item lg={12} md={9} sm={6}>

                <Grid container display="flex" justifyContent='space-around' mb={4} mt={4}>
                    <Grid item lg={9} className={styles.titleContainer} >
                        <Typography variant="h4" className={styles.title}>{data?.generalDealInfo?.title}</Typography>
                        <Typography mt={2} className={styles["sub-title"]} >Draft created on {data?.generalDealInfo?.created_at ? convertToEST(data?.generalDealInfo?.created_at).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>
                        <Chip className={data?.generalDealInfo?.status === "INACTIVE" ? styles.inactiveChip : styles.Chip}
                            sx={{ backgroundColor: dealStatus[data?.generalDealInfo?.status], mb: 1, fontColor: "#000000" }}
                            label={data?.generalDealInfo?.status ? capitalizeWords(data?.generalDealInfo?.status) : null} />
                    </Grid>

                    {data?.generalDealInfo?.status === "ACTIVE" || data?.generalDealInfo?.status === "INACTIVE" ?
                        <Grid mt={3} item lg={6} className={data?.generalDealInfo?.status === "ACTIVE" ? styles.toggleSection : styles.toggleDisabledSection} >
                            <Grid mt={1} >
                                <FormControlLabel
                                    control={<IOSSwitch
                                        checked={isDealActive}
                                        sx={{ m: 1, marginLeft: "38%" }}
                                        onChange={handleChange}
                                    />}
                                    label=""
                                />
                            </Grid>
                            <Grid mt={1} ml={3}>
                                <Typography className={styles.activeHeading} >{data?.generalDealInfo?.status === "ACTIVE" ? "ACTIVE" : "DISABLED"}</Typography>
                                <Typography className={styles.activePeriod} >{data?.generalDealInfo?.valid_to ? convertToEST(data?.generalDealInfo?.valid_to).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>
                            </Grid>
                        </Grid>
                        : null}
                </Grid>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Deal type"} />
                    <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
                    <Typography >{data?.generalDealInfo?.type ? capitalizeWords(data?.generalDealInfo?.type) : null}</Typography>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"General information"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6} display="flex">
                            <Grid item lg={7}>
                                <Typography data-testid="title" variant="h4" className={styles.heading} mt={4} mb={1}>
                                    Title
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.title}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Description
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.description}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Identifier
                                </Typography>
                                <Typography className={styles.content}>{data?.generalDealInfo?.code}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Priority
                                </Typography>
                                <Typography className={styles.content}>{data?.generalDealInfo?.priority}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Stacking type
                                </Typography>
                                <Typography className={styles.content}>{ToProperCase(data?.generalDealInfo?.stacking_type || '')}</Typography>
                            </Grid>
                            {/* <Grid mt={3}>
                                <Typography>Media</Typography>
                                <Grid className={styles.img} >
                                    <Box className={styles["no-image"]}>
                                        <LocalOfferIcon sx={{ color: "#CCCCCC" }} />
                                    </Box>
                                </Grid>
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Card>

                {data?.generalDealInfo?.type === 'FREE_SHIPPING' ?
                    <Card className={styles["step-card-container"]}>
                        <StepTitle title={"Shipping method"} />
                        <Typography variant="h4" className={styles.heading} mt={4}>Method</Typography>
                        <Typography >Standard</Typography>
                    </Card> : null}

                {data?.generalDealInfo?.type === 'FREE_SHIPPING' ?
                    <Card className={styles["step-card-container"]}>
                        <StepTitle title={"Spend minimum"} />
                        <Typography variant="h4" className={styles.heading} mt={4}>Value</Typography>
                        <Typography >{data?.dealValue?.spend?.minimum ? `$${(Number(data?.dealValue?.spend?.minimum) / 100).toFixed(2)}` :
                            "No minimum"}</Typography>

                        <Typography variant="h4" className={styles.heading} mt={4}>Customer preview</Typography>
                        <Typography >{data?.dealValue?.spend?.minimum ? `Spend minimum of $${(Number(data?.dealValue?.spend?.minimum) / 100).toFixed(2)}` :
                            "Spend No Minimum"}</Typography>
                    </Card> : null}


                {data?.generalDealInfo?.type === "DISCOUNT" &&
                    <>
                        <Card className={styles["step-card-container"]}>
                            <StepTitle title={"Deal value"} />

                            <Grid container>
                                <Grid item lg={12} md={9} sm={6}>
                                    <Grid item lg={7}>
                                        <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                            Is this at a basket level or product level?
                                        </Typography>
                                        <Typography className={styles.content} >{capitalizeWords(data?.dealValue?.scopeType || '')}</Typography>

                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Type
                                        </Typography>
                                        <Typography className={styles.content} >{data?.dealValue?.rewardType === "$_OFF" ?
                                            'Dollar ($) off' : data?.dealValue?.rewardType === '%_OFF' ? 'Percentage (%) off' : 'Fixed off'}
                                        </Typography>

                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Value
                                        </Typography>

                                        <Typography className={styles.content}>{data?.dealValue?.rewardsValue[0]?.value ?
                                            dealValue(data?.dealValue?.rewardsValue[0]?.value, data?.dealValue?.rewardType) : null}</Typography>

                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Customer preview
                                        </Typography>
                                        <Typography className={styles.content}>{getDealValuePreview(data)}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </>}


                {data?.generalDealInfo?.type === "MULTI_BUY" &&
                    <>
                        <Card className={styles["step-card-container"]}>
                            <StepTitle title={"Deal criteria"} />

                            <Grid container>
                                <Grid item lg={12} md={9} sm={6}>
                                    <Grid item lg={7}>
                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Type
                                        </Typography>
                                        <Typography className={styles.content} >
                                            Multi-buy
                                        </Typography>

                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Tiers
                                        </Typography>

                                        <Typography className={styles.content}>{data?.dealValue?.rewardsValue.length > 0 ?
                                            data?.dealValue?.rewardsValue.length : null}</Typography>

                                        <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                            Customer preview
                                        </Typography>
                                        {customerPreview.map((data: string, index: number) => {
                                            return <Typography key={index} className={styles.content}>{data}</Typography>
                                        })}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </>}

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Date in effect"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={12}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    Start Date
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.valid_from ? convertToEST(data?.generalDealInfo?.valid_from).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    End Date
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.valid_to ? convertToEST(data?.generalDealInfo?.valid_to).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Customer preview
                                </Typography>
                                {data?.generalDealInfo?.valid_from && data?.generalDealInfo?.valid_to && <Typography className={styles.content}>Starts {convertToEST(data?.generalDealInfo?.valid_from).format("MMMM D (h:mm A z)")} and ends {convertToEST(data?.generalDealInfo?.valid_to).format("MMMM D (h:mm A z)")}</Typography>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                {data?.dealValue?.scopeValue?.length > 0 ?

                    <Card className={styles["step-card-container"]}>
                        <StepTitle title={"Products and Collections"} />

                        <Grid container>
                            <Grid item lg={12} md={9} sm={6}>
                                <Grid item lg={7}>
                                    <Typography data-testId="collection" variant="h5" className={styles.heading} mt={4} mb={1}>
                                        Collection
                                    </Typography>
                                    <Grid className={styles.downloadSection}>
                                        <Typography className={styles.content} >
                                            {parseInt(data?.dealValue?.scopeValue?.length)} products</Typography>
                                        <IconButton
                                            data-testId="btn"
                                            onClick={() => downloadScopeExcel(data?.dealValue?.scopeValue)}
                                        >
                                            <DownloadIcon className={styles.downloadIcon} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card> : null}

                {data?.generalDealInfo?.type === 'FREE_SHIPPING' ?
                    null :
                    <Card className={styles["step-card-container"]}>
                        <StepTitle title={data?.dealValue?.scopeType === 'PRODUCT' ? "Exclusions" : "Product applicability"} />

                        <Grid container>
                            <Grid item lg={12} md={9} sm={6}>
                                <Grid item lg={7}>
                                    <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                        What items does this deal apply to?
                                    </Typography>
                                    <Typography className={styles.content} >{data?.applicableProduct?.priceApplicability?.value === 'REGULAR_ONLY' ? 'Regular priced items only' : 'All'}</Typography>
                                    {data?.exclusion?.product?.liam?.length > 0 || data?.exclusion?.product?.mch?.length > 0
                                        ?
                                        <>
                                            <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                                Will there be additional products excluded from this deal?
                                            </Typography>
                                            <Typography className={styles.content} >Yes</Typography>
                                            <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                                Collection
                                            </Typography>
                                            <Grid className={styles.downloadSection}>
                                                <Typography className={styles.content} >
                                                    {parseInt(data?.exclusion?.product?.liam?.length) +
                                                        parseInt(data?.exclusion?.product?.mch?.length)} products</Typography>
                                                <IconButton
                                                    data-testId="exbtn"
                                                    onClick={() => downloadExcel(data?.exclusion?.product)}
                                                >
                                                    <DownloadIcon className={styles.downloadIcon} />
                                                </IconButton>
                                            </Grid>
                                        </>
                                        : null}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                }

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Promotional messages"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    English message
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.promotion_message_english}</Typography>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    French message
                                </Typography>
                                <Typography className={styles.content} >{data?.generalDealInfo?.promotion_message_french}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Grid display="flex" justifyContent='space-around' ml={4} mb={4} mt={5}>
                    <Button data-testId='back' onClick={() => router.push('/deals')} className={styles.btn} variant="contained">Go Back</Button>
                    <Typography></Typography>
                </Grid>

            </Grid >

            <Box>
                <Modal
                    style={editDealStyles}
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                >
                    <EditDealModal
                        closeModal={closeModal}
                        isDealActive={isDealActive}
                        disableDeal={disableDeal}
                        data={data}
                        dealId={dealId}
                        refetch={refetch}
                    />
                </Modal>
            </Box>

        </Grid >
    );
}

export default Summary;
