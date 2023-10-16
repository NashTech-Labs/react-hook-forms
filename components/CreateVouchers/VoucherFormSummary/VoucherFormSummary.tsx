import React from 'react'
import { Button, Card, Grid, Typography } from '@mui/material'
import { Chip } from '@mui/material';
import summaryStyles from '../../Summary/Summary.module.css'
import commonStyles from '../../CreateDeal/Steps.module.css'
import StepTitle from '../../StepTitle';
import config from './VoucherFormConfig';
import serilizedconfig from './serilizedFormConfig'
import { getNewVoucherData, updateNewVoucher } from '../../../store/feature/voucher/newVoucherSlice';
import { useAppDispatch, useAppSelector } from '../../../store';
import moment from 'moment';
import { useRouter } from 'next/router';
import createVoucherDefaultFormState from '../../../constants/CreateVoucherDefaultFormState';
import { useEditVoucherMutation } from '../../../api/editVoucher';
import generateCreateVoucherPayload from '../../../util/createVoucherPayload';
import { notifyError, notifySuccess } from '../../../util/Notification/Notification';
import { userProfileState } from '../../../store/feature/auth/authSlice';
import { updatedBatchSize, updatedVoucherEditing, updatedVoucherId } from '../../../store/feature/voucher/voucherSlice';
import generateCreateSerializedVoucherPayload from '../../../util/createSerializedVoucherPayload';

function VoucherFormSummary() {

    const router = useRouter();

    const dispatch = useAppDispatch();

    const user = useAppSelector(userProfileState)

    const batch_size = useAppSelector(updatedBatchSize)

    const isVoucherEditing = useAppSelector(updatedVoucherEditing);

    const voucherId = useAppSelector(updatedVoucherId);

    const newVoucherData: any = useAppSelector(getNewVoucherData)

    const [editVoucher] = useEditVoucherMutation();

    const excludeSteps: string[] = []

    const { externalVoucherCode, draftCreatedTimestamp, voucherLevel, voucherType } = newVoucherData

    if (voucherLevel === 'basket') {
        excludeSteps.push('Products and Collections')
    }

    if (voucherType !== "SERIALIZED") {
        excludeSteps.push('Banner Restrictions', 'Voucher Validity', 'Number of Codes', 'Promotional messages')
    }

    const handleCreateVoucher = async () => {

        if (voucherType === "SERIALIZED") {
            console.log(newVoucherData)
            const editPayloadData = generateCreateSerializedVoucherPayload(newVoucherData, false, batch_size)
            const formattedPayloadWithUser = {
            ...editPayloadData,
            voucherId: voucherId,
            username: user?.name
        }
        await editVoucher(formattedPayloadWithUser)
            .unwrap()
            .then((data) => {
                if (data) {
                    notifySuccess(isVoucherEditing ? "Voucher successfully saved" : "Voucher successfully created")
                    router.push('/vouchers')
                    dispatch(updateNewVoucher(createVoucherDefaultFormState))
                }
            })
            .catch((error: any) => {
                notifyError(
                    error.data?.details ? error.data?.details : "Something went wrong",
                    "voucher-failed"
                )
            })
        }

        else {

        const editPayloadData = generateCreateVoucherPayload(newVoucherData, false)
        const formattedPayloadWithUser = {
            ...editPayloadData,
            voucherId: voucherId,
            username: user?.name
        }
        await editVoucher(formattedPayloadWithUser)
            .unwrap()
            .then((data) => {
                if (data) {
                    notifySuccess(isVoucherEditing ? "Voucher successfully saved" : "Voucher successfully created")
                    router.push('/vouchers')
                    dispatch(updateNewVoucher(createVoucherDefaultFormState))
                }
            })
            .catch((error: any) => {
                notifyError(
                    error.data?.details ? error.data?.details : "Something went wrong",
                    "voucher-failed"
                )
            })
        }
    }

    const handleCancel = () => {
        router.push("/vouchers")
    }

    return (
        <>
            <Grid container justifyContent="center" sx={{ marginTop: "32px" }}>
                <Grid item lg={6} md={8} sm={9}>
                    <Typography variant="h4" className={summaryStyles.title}>{externalVoucherCode}</Typography>
                    <Typography mt={2} className={summaryStyles['sub-title']}>Draft created on {moment(draftCreatedTimestamp).format('MMMM D, YYYY [at] h:mm A z [EST]')}</Typography>
                    <Chip label="Draft" className={summaryStyles.Chip} sx={{ backgroundColor: "#666B73", marginBottom: "16px" }} />
                </Grid>
            </Grid>

            {/* Cards Section */}

            { voucherType === "SERIALIZED" ? 

                Object.keys(serilizedconfig).filter(step => !excludeSteps.includes(step)).map((stepTitle: string) => {
                    const basketLevelTitle = voucherLevel === 'basket' ? 'Product Applicability' : stepTitle
                    const computedTitle = stepTitle === 'Exclusions' ? basketLevelTitle : stepTitle
                    return <Card className={commonStyles["step-card-container-summary"]} key={stepTitle}>
                        <StepTitle title={computedTitle} />
                        {
                            serilizedconfig[stepTitle].map(({ title, getValue, shouldHide }) => {
                                if (shouldHide && shouldHide(newVoucherData)) {
                                    return null
                                }
                                return <>
                                    <Typography variant="h4" className={summaryStyles.heading} mt={4}>{title}</Typography>
                                    {<Typography className={summaryStyles.content}>{getValue(newVoucherData)}</Typography>}
                                </>
                            })
                        }

                    </Card>
                })
             :
                Object.keys(config).filter(step => !excludeSteps.includes(step)).map((stepTitle: string) => {
                    const basketLevelTitle = voucherLevel === 'basket' ? 'Product Applicability' : stepTitle
                    const computedTitle = stepTitle === 'Exclusions' ? basketLevelTitle : stepTitle
                    return <Card className={commonStyles["step-card-container-summary"]} key={stepTitle}>
                        <StepTitle title={computedTitle} />
                        {
                            config[stepTitle].map(({ title, getValue, shouldHide }) => {
                                if (shouldHide && shouldHide(newVoucherData)) {
                                    return null
                                }
                                return <>
                                    <Typography variant="h4" className={summaryStyles.heading} mt={4}>{title}</Typography>
                                    {<Typography className={summaryStyles.content}>{getValue(newVoucherData)}</Typography>}
                                </>
                            })
                        }

                    </Card>
                })
            }

            {/* Cards Section */}

            <Grid container justifyContent="center">
                <Grid item lg={6} md={8} sm={9} my={5}>
                    <Grid className={commonStyles.btnSection}>
                        <Button
                            variant="contained"
                            className={commonStyles.cancelBtn}
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </Button>
                        <div>
                            <Button
                                onClick={() => router.push("/vouchers/create")}
                                variant="text"
                                className={commonStyles['text-style-btn']}
                            >
                                Go back and edit
                            </Button>
                            <Button
                                onClick={() => handleCreateVoucher()}
                                variant="contained"
                                className={commonStyles.continueBtn}
                            >
                                {isVoucherEditing ? 'Save' : 'Create'}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default VoucherFormSummary