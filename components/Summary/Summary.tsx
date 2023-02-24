import { Box, Button, Card, Chip, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import StepTitle from "../StepTitle";
import styles from "./Summary.module.css";
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import { updatedDealId } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { dateTimeFormat, dateTimeFormatPreview, capitalizeWords } from "../../util/format";
import DownloadIcon from '@mui/icons-material/Download';

function Summary() {
    const dealId = useAppSelector(updatedDealId);

    const { data } = useGetDealPreviewQuery(dealId);

    const router = useRouter();

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

        if (type === "$_OFF" || type === "FIXED_OFF") {
            return `$${value}`
        }

        if (type === "%_OFF") {
            return `${value}%`
        }

        else {
            return value
        }
    }

    return (
        <Grid container>
            <Grid item lg={12} md={9} sm={6}>

                <Grid container display="flex" justifyContent='space-around' mb={4} mt={5}>
                    <Grid item lg={9} className={styles.titleContainer} >
                        <Typography variant="h4" className={styles.title}>{data?.createDealRequest?.title}</Typography>
                        <Typography mt={2} className={styles["sub-title"]} >Draft created on {data?.createDealRequest?.created_at ? dateTimeFormat(data?.createDealRequest?.created_at) : null}</Typography>
                        <Chip className={styles.Chip} label={data?.createDealRequest?.status ? capitalizeWords(data?.createDealRequest?.status) : null} />
                    </Grid>
                    <Typography></Typography>
                </Grid>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Deal type"} />
                    <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
                    <Typography >{data?.createDealRequest?.type ? capitalizeWords(data?.createDealRequest?.type) : null}</Typography>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"General information"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6} display="flex">
                            <Grid item lg={7}>
                                <Typography variant="h4" className={styles.heading} mt={4} mb={1}>
                                    Title
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.title}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Description
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.description}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Identifier
                                </Typography>
                                <Typography className={styles.content}>{data?.createDealRequest?.code}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Priority
                                </Typography>
                                <Typography className={styles.content}>{data?.createDealRequest?.priority}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Stacking type
                                </Typography>
                                <Typography className={styles.content}>{ToProperCase(data?.createDealRequest?.stacking_type || '')}</Typography>
                            </Grid>
                            <Grid mt={3}>
                                {/* <Typography>Media</Typography>
                                <Grid className={styles.img} >
                                    <Box className={styles["no-image"]}>
                                        <LocalOfferIcon sx={{ color: "#CCCCCC" }} />
                                    </Box>
                                </Grid> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>


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
                                <Typography className={styles.content}>{data?.dealValue?.rewardsValue[0]?.value ?
                                    dealValue(data?.dealValue?.rewardsValue[0]?.value, data?.dealValue?.rewardType) : null} off product(s)</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Date in effect"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    Start Date
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.valid_from ? dateTimeFormat(data?.createDealRequest?.valid_from) : null}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    End Date
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.valid_to ? dateTimeFormat(data?.createDealRequest?.valid_to) : null}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Customer preview
                                </Typography>
                                <Typography className={styles.content}>Starts {dateTimeFormatPreview(data?.createDealRequest?.valid_from)} and {dateTimeFormatPreview(data?.createDealRequest?.valid_to)}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                {data?.dealValue?.scopeType === 'product' ?

                    <Card className={styles["step-card-container"]}>
                        <StepTitle title={"Products and Collections"} />

                        <Grid container>
                            <Grid item lg={12} md={9} sm={6}>
                                <Grid item lg={7}>
                                    <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                        Collection
                                    </Typography>
                                    <Grid className={styles.downloadSection}>
                                        <Typography className={styles.content} >
                                            {parseInt(data?.dealValue?.scopeValue?.product_code?.liam.length) +
                                                parseInt(data?.dealValue?.scopeValue?.product_code?.mch.length)} products</Typography>
                                        <DownloadIcon onClick={() => downloadExcel(data?.dealValue?.scopeValue?.product_code)} className={styles.downloadIcon} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card> : null}

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={data?.dealValue?.scopeType === 'product' ? "Exclusions" : "Product applicability"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    What items does this deal apply to?
                                </Typography>
                                <Typography className={styles.content} >{data?.applicableProduct?.priceApplicability?.value === 'REGULAR_ONLY' ? 'Regular priced items only' : 'All'}</Typography>
                                {data?.dealValue?.scopeType === 'product' ?
                                    <>
                                        {data?.exclusion?.product.liam.length > 0 || data?.exclusion?.product?.mch?.length > 0
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
                                                        {parseInt(data?.exclusion?.product?.liam.length) +
                                                            parseInt(data?.exclusion?.product?.mch.length)} products</Typography>
                                                    <DownloadIcon onClick={() => downloadExcel(data?.exclusion?.product)} className={styles.downloadIcon} />
                                                </Grid>
                                            </>
                                            : null}
                                    </> : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Promotional messages"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    English message
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.promotion_message_english}</Typography>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    French message
                                </Typography>
                                <Typography className={styles.content} >{data?.createDealRequest?.promotion_message_french}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Grid display="flex" justifyContent='space-around' ml={4} mb={4}>
                    <Button onClick={() => router.push('/deals')} className={styles.btn} variant="contained">Go Back</Button>
                    <Typography></Typography>
                </Grid>

            </Grid >
        </Grid >
    );
}

export default Summary;
