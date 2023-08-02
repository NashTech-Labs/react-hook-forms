import React from 'react'
import { Box, Button, Card, Chip, Grid, Switch, SwitchProps, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import StepTitle from '../StepTitle';
import styles from "../Summary/Summary.module.css";
import { useAppSelector } from "../../store";
import { updatedVoucherId } from '../../store/feature/voucher/voucherSlice';
import { useGetVoucherPreviewQuery } from '../../api/voucherPreview';
import { statusOptions, voucherTypeOptions } from '../../constants/FormOptions';
import { convertToEST } from '../../util/ConvertDateTime';
import { dealStatus } from '../../constants/DealStatus';
import { capitalizeWords } from '../../util/format';
import { userProfileState } from '../../store/feature/auth/authSlice';

function VoucherSummary() {

  const router = useRouter();

  const user = useAppSelector(userProfileState);

  const voucherId = useAppSelector(updatedVoucherId);

  const { data } = useGetVoucherPreviewQuery({ voucherId, user });

  const discountTypeDealLabel = data?.voucherValues?.rewardType === '%_OFF' ? 'Percentage (%) off' : 'Fixed off'

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
    if (data?.voucherValues?.rewards) {
      if (!data?.voucherValues?.rewards[0]?.value) return ''

      const value = dealValue(data?.voucherValues?.rewards[0]?.value, data?.voucherValues?.rewardType)

      if (data?.voucherValues?.scopeType === 'BASKET') {
        return `Spend $${(Number(data?.voucherExclusions?.spend?.minimum) / 100).toFixed(2)} Get ${value} off`
      }

      return `${value} off product(s)`
    }
  }

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
    const x = document.createElement("A");
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
    const x = document.createElement("A");
    x.setAttribute("href", csvString);
    x.setAttribute("download", "productList.csv");
    document.body.appendChild(x);
    x.click();
  }

  return (
    <>
      <Grid container>
        <Grid item lg={12} md={9} sm={6}>
          <Grid container display="flex" justifyContent='space-around' mb={4} mt={4}></Grid>
          <Grid item lg={9} className={styles.titleContainer} >
            <Typography variant="h4" className={styles.title}>{data?.voucherGeneralInfo?.code}</Typography>
            <Typography mt={2} className={styles["sub-title"]} >voucher created on {data?.vouchersDateInEffect?.createdAt ? convertToEST(data?.vouchersDateInEffect?.createdAt).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>
            <Chip className={styles.Chip} sx={{ backgroundColor: dealStatus[data?.voucherGeneralInfo?.status], mb: 1, fontColor: "#000000" }}
              label={statusOptions[data?.voucherGeneralInfo?.status]} />
          </Grid>

          <Card className={styles["step-card-container"]}>
            <StepTitle title={"Voucher type"} />
            <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
            <Typography >{voucherTypeOptions[data?.voucherGeneralInfo?.type]}</Typography>
          </Card>

          <Card className={styles["step-card-container"]}>
            <StepTitle title={"General information"} />

            <Grid container>
              <Grid item lg={12} md={9} sm={6} display="flex">
                <Grid item lg={7}>
                  <Typography data-testid="title" variant="h4" className={styles.heading} mt={4} mb={1}>
                    Voucher Code
                  </Typography>
                  <Typography className={styles.content} >{data?.voucherGeneralInfo?.code}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Description
                  </Typography>
                  <Typography className={styles.content}>{data?.voucherGeneralInfo?.description}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Priority
                  </Typography>
                  <Typography className={styles.content}>{data?.voucherGeneralInfo?.priority}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Stacking type
                  </Typography>
                  <Typography className={styles.content}>{ToProperCase(data?.voucherGeneralInfo?.stackingType || '')}</Typography>
                </Grid>
              </Grid>
            </Grid>

          </Card>


          <Card className={styles["step-card-container"]}>
            <StepTitle title={"Voucher Value"} />

            <Grid container>
              <Grid item lg={12} md={9} sm={6} display="flex">
                <Grid item lg={7}>
                  <Typography data-testid="title" variant="h4" className={styles.heading} mt={4} mb={1}>
                    Is this at a basket level or product level?
                  </Typography>
                  <Typography className={styles.content} >{capitalizeWords(data?.voucherValues?.scopeType || '')}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Type
                  </Typography>
                  <Typography className={styles.content} >{data?.voucherValues?.rewardType === "$_OFF" ?
                    'Dollar ($) off' : discountTypeDealLabel}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Value
                  </Typography>
                  <Typography className={styles.content}>{data?.voucherValues?.rewards ?
                    dealValue(data?.voucherValues?.rewards[0]?.value, data?.voucherValues?.rewardType) : null}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Customer Preview
                  </Typography>
                  <Typography className={styles.content}>{getDealValuePreview(data)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>


          <Card className={styles["step-card-container"]}>
            <StepTitle title={"Date in effect"} />

            <Grid container>
              <Grid item lg={12} md={9} sm={6} display="flex">
                <Grid item lg={7}>
                  <Typography data-testid="title" variant="h4" className={styles.heading} mt={4} mb={1}>
                    Start Date
                  </Typography>
                  <Typography className={styles.content} >{data?.vouchersDateInEffect?.validFrom ? convertToEST(data?.vouchersDateInEffect?.validFrom).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    End Date
                  </Typography>
                  <Typography className={styles.content} >{data?.vouchersDateInEffect?.validTo ? convertToEST(data?.vouchersDateInEffect?.validTo).format("MMMM D, YYYY [at] h:mm A z") : null}</Typography>

                  <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                    Customer preview
                  </Typography>
                  {data?.vouchersDateInEffect?.validFrom && data?.vouchersDateInEffect?.validTo && <Typography className={styles.content}>Starts {convertToEST(data?.vouchersDateInEffect?.validFrom).format("MMMM D (h:mm A z)")} and ends {convertToEST(data?.vouchersDateInEffect?.validTo).format("MMMM D (h:mm A z)")}</Typography>}
                </Grid>
              </Grid>
            </Grid>
          </Card>

          {data?.vouchersProductsAndCollections?.scopes?.length > 0 ?

            <Card className={styles["step-card-container"]}>
              <StepTitle title={"Applicable products for voucher"} />

              <Grid container>
                <Grid item lg={12} md={9} sm={6}>
                  <Grid item lg={7}>
                    <Typography data-testId="collection" variant="h5" className={styles.heading} mt={4} mb={1}>
                      Collection
                    </Typography>
                    <Grid className={styles.downloadSection}>
                      <Button data-testId="btn"
                        onClick={() => downloadScopeExcel(data?.vouchersProductsAndCollections?.scopes)}
                        className={styles.downloadButton} variant="contained" >Download products</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card> : null}

          <Card className={styles["step-card-container"]}>
            <StepTitle title={data?.voucherValues?.scopeType === 'PRODUCT' ? "Exclusions" : "Product applicability"} />

            <Grid container>
              <Grid item lg={12} md={9} sm={6}>
                <Grid item lg={7}>
                  <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                    What items does this deal apply to?
                  </Typography>
                  <Typography className={styles.content} >{data?.voucherExclusions?.priceApplicability?.value === 'REGULAR_ONLY' ? 'Regular priced items only' : 'All'}</Typography>
                  {data?.voucherExclusions?.product?.liam?.length > 0 || data?.voucherExclusions?.product?.mch?.length > 0
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
                        <Button data-testId="exbtn"
                          onClick={() => downloadExcel(data?.voucherExclusions?.product)}
                          className={styles.downloadButton} variant="contained" >Download products</Button>
                      </Grid>
                    </>
                    : null}
                </Grid>
              </Grid>
            </Grid>
          </Card>

          <Grid display="flex" justifyContent='space-between' ml={4} mb={4} mt={5} sx={{ margin: '1.3% 25%' }}>
            <Button data-testId='back' onClick={() => router.push('/vouchers')} className={styles.btn} variant="outlined">Go Back</Button>
            {/* <Button data-testId='edit' className={styles.btn} variant="contained">Edit</Button> */}
          </Grid>

        </Grid>
      </Grid>
    </>
  )
}

export default VoucherSummary