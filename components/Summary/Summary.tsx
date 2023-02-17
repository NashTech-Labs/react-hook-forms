import { Box, Button, Card, Chip, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import StepTitle from "../StepTitle";
import styles from "./Summary.module.css";
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import { updatedDealId } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { dateTimeFormat, dateTimeFormatPreview, CapitalizeWords } from "../../util/format";
import DownloadIcon from '@mui/icons-material/Download';

function Summary() {
    const dealId = useAppSelector(updatedDealId);

    const { data } = useGetDealPreviewQuery(dealId);

    const router = useRouter();

    const downloadExcel = (value: any) => {
        let Results = [[value?.liam], [value?.mch]]
        var CsvString = "";
        Results.forEach((RowItem: any, RowIndex: any) => {
            RowItem.forEach((ColItem: any, ColIndex: any) => {
                CsvString += ColItem + ',';
            });
            CsvString += "\r\n";
        });
        CsvString = "data:application/csv," + encodeURIComponent(CsvString);
        var x = document.createElement("A");
        x.setAttribute("href", CsvString);
        x.setAttribute("download", "productList.csv");
        document.body.appendChild(x);
        x.click();
    }

    return (
        <Grid container>
            <Grid item lg={12} md={9} sm={6}>

                <Grid container display="flex" justifyContent='space-around' mb={4} mt={5}>
                    <Grid item lg={9} className={styles.titleContainer} >
                        <Typography variant="h4" className={styles.title}>{data?.createDealRequest?.title}</Typography>
                        <Typography mt={2} className={styles["sub-title"]} >Draft created on {data?.createDealRequest?.created_at ? dateTimeFormat(data?.createDealRequest?.created_at) : null}</Typography>
                        <Chip className={styles.Chip} label={data?.createDealRequest?.status ? CapitalizeWords(data?.createDealRequest?.status) : null} />
                    </Grid>
                    <Typography></Typography>
                </Grid>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Deal type"} />
                    <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
                    <Typography >{data?.createDealRequest?.type ? CapitalizeWords(data?.createDealRequest?.type) : null}</Typography>
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
                                <Typography className={styles.content}>{data?.createDealRequest?.stacking_type}</Typography>
                            </Grid>
                            <Grid mt={3}>
                                <Typography>Media</Typography>
                                <Grid className={styles.img} >
                                    <Box className={styles["no-image"]}>
                                        <LocalOfferIcon sx={{ color: "#CCCCCC" }} />
                                    </Box>
                                </Grid>
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
                                <Typography className={styles.content} >{data?.dealValue?.scopeType}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Type
                                </Typography>
                                <Typography className={styles.content} >{data?.dealValue?.rewardType === "$_OFF" ?
                                    'Dollar ($) off' : data?.dealValue?.rewardType === '%_OFF' ? 'Percentage (%) off' : 'Fixed price'}
                                </Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Value
                                </Typography>
                                <Typography className={styles.content}>{data?.dealValue?.rewardsValue[0]?.value}{data?.dealValue?.rewardType === "$_OFF" || data?.dealValue?.rewardType === "FIXED_OFF" ?
                                    '$' : data?.dealValue?.rewardType === '%_OFF' ? '%' : null}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Customer preview
                                </Typography>
                                <Typography className={styles.content}>{data?.dealValue?.rewardsValue[0]?.value}{data?.dealValue?.rewardType === "$_OFF" ?
                                    '$' : data?.dealValue?.rewardType === '%_OFF' ? '%' : null} off product(s)</Typography>
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
                                        <Typography className={styles.content} onClick={() => downloadExcel(data?.dealValue?.scopeValue?.product_code)} >ProductList.csv</Typography>
                                        <DownloadIcon className={styles.downloadIcon} />
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
                                        <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                            Will there be additional products excluded from this deal?
                                        </Typography>
                                        <Typography className={styles.content} >Yes</Typography>
                                        <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                            Collection
                                        </Typography>
                                        <Typography className={styles.content} >Disney-Clothing-Oct 4.xcel</Typography>
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

            </Grid>
        </Grid>
    );
}

export default Summary;
