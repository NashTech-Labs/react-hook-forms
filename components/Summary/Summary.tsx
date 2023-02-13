import { Button, Card, Chip, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import StepTitle from "../StepTitle";
import styles from "./Summary.module.css";
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import { updatedDealId } from "../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../store/index";

function Summary() {
    const dealId = useAppSelector(updatedDealId);

    const { data } = useGetDealPreviewQuery(dealId);

    const router = useRouter();

    const downloadExcel = (value: any) => {
        let Results = [[value?.liam], [value?.mch]]
        var CsvString = "";
        Results.forEach((RowItem: any, RowIndex: any) => {
            RowItem.forEach((ColItem: any, ColIndex: any) => {
                console.log(ColItem)
                CsvString += ColItem + ',';
            });
            CsvString += "\r\n";
        });
        CsvString = "data:application/csv," + encodeURIComponent(CsvString);
        var x = document.createElement("A");
        x.setAttribute("href", CsvString);
        x.setAttribute("download", "Disney-Clothing-Oct 4.xlsx");
        document.body.appendChild(x);
        x.click();
    }

    return (
        <Grid container>
            <Grid item lg={12} md={9} sm={6}>

                <Grid container display="flex" justifyContent='space-around' mb={4} mt={5}>
                    <Grid item lg={9} className={styles.titleContainer} >
                        <Typography variant="h4" className={styles.title}>{data?.dealGeneralInfo?.title}</Typography>
                        <Typography mt={2} >Draft created on Nov 1, 2022 at 1:20 PM EST</Typography>
                        <Chip className={styles.Chip} label="Draft" />
                    </Grid>
                    <Typography></Typography>
                </Grid>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Deal type"} />
                    <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
                    <Typography>Discount</Typography>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"General information"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6} display="flex">
                            <Grid item lg={7}>
                                <Typography variant="h4" className={styles.heading} mt={4} mb={1}>
                                    Title
                                </Typography>
                                <Typography className={styles.content} >{data?.dealGeneralInfo?.title}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Description
                                </Typography>
                                <Typography className={styles.content} >{data?.dealGeneralInfo?.description}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Identifier
                                </Typography>
                                <Typography className={styles.content}>{data?.dealGeneralInfo?.code}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Priority
                                </Typography>
                                <Typography className={styles.content}>{data?.dealGeneralInfo?.priority}</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Stacking type
                                </Typography>
                                <Typography className={styles.content}>{data?.dealGeneralInfo?.stacking_type}</Typography>
                            </Grid>
                            <Grid mt={3}>
                                <Typography>Media</Typography>
                                <Grid className={styles.img} >
                                    <Typography variant="h4" className={styles.imgContainer} >WIP</Typography>
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
                                <Typography className={styles.content}>{data?.dealValue?.rewardsValue[0]?.value}{data?.dealValue?.rewardType === "$_OFF" ?
                                    '$' : data?.dealValue?.rewardType === '%_OFF' ? '%' : null} </Typography>

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
                                <Typography className={styles.content} >March 12, 2023  12:00pm EST</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    End Date
                                </Typography>
                                <Typography className={styles.content} >March 12, 2023  12:00pm EST</Typography>

                                <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                    Customer preview
                                </Typography>
                                <Typography className={styles.content}>Starts March 1 (7:00 AM EST) and ends March 7 (4:00 PM EST)</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Products and Collections"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    Collection
                                </Typography>
                                <Typography className={styles.content} onClick={() => downloadExcel(data?.dealValue?.scopeValue?.product_code)} >Disney-Clothing-Oct 4.xcel</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Card className={styles["step-card-container"]}>
                    <StepTitle title={"Exclusions"} />

                    <Grid container>
                        <Grid item lg={12} md={9} sm={6}>
                            <Grid item lg={7}>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    What items does this deal apply to?
                                </Typography>
                                <Typography className={styles.content} >{data?.applicableProduct?.priceApplicability?.value === 'REGULAR_ONLY' ? 'Regular priced items only' : 'All'}</Typography>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    Will there be additional products excluded from this deal?
                                </Typography>
                                <Typography className={styles.content} >Yes</Typography>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    Collection
                                </Typography>
                                <Typography className={styles.content} >Disney-Clothing-Oct 4.xcel</Typography>
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
                                <Typography className={styles.content} >{data?.dealGeneralInfo?.promotion_message_english}</Typography>
                                <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                    French message
                                </Typography>
                                <Typography className={styles.content} >{data?.dealGeneralInfo?.promotion_message_french}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>

                <Grid display="flex" justifyContent='space-around' ml={4} mb={4}>
                    <Button onClick={() => router.push('/deals')} variant="contained">Go Back</Button>
                    <Typography></Typography>
                </Grid>

            </Grid>
        </Grid>
    );
}

export default Summary;
