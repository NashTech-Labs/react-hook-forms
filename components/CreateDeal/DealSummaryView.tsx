import React, { useState } from 'react'
import moment from 'moment'
import { useRouter } from "next/router";
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import config from './DealSummaryViewConfig'
import StepTitle from "../StepTitle";
import commonStyles from './Steps.module.css'
import summaryStyles from '../Summary/Summary.module.css'
import { useAppDispatch, useAppSelector } from '../../store';
import { getNewDealData, updateNewDeal } from '../../store/feature/deal/newDealSlice'
import { userProfileState } from '../../store/feature/auth/authSlice';
import generateCreateDealPayload from '../../util/createDealPayload'
import { useCreateDealsMutation } from '../../api/createDeal';
import { notifyError, notifySuccess } from '../../util/Notification/Notification';
import { updateDealStep, getIsEditing, updatedDealId, updateDealEditing } from '../../store/feature/deal/dealSlice';
import CreateDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import { Chip } from '@mui/material';
import { useEditDealsMutation } from "../../api/editDeal";
import { DISCOUNT_DEAL_TYPE, FREE_SHIPPING_DEAL_TYPE, MULTI_BUY_DEAL_TYPE } from '../../constants/FormOptions';
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import { addScopesForEditDealPayload, addPromoRestrictionsForEditDealPayload } from '../../util/editDealPayload'

const DealSummaryView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const newDealData = useAppSelector(getNewDealData)
  const user = useAppSelector(userProfileState)
  const isEditing = useAppSelector(getIsEditing)
  const dealId = useAppSelector(updatedDealId)
  const { data } = useGetDealPreviewQuery(dealId);
  const [createDeals] = useCreateDealsMutation();
  const [editDeal] = useEditDealsMutation();
  const [submitting, setSubmitting] = useState(false)
  const excludeSteps: string[] = []
  const handleCancel = () => {
    dispatch(updateDealEditing(false))
    dispatch(updateDealStep(""));
    router.push("/deals")
  }

  console.log(newDealData)

  const handleCreateDeal = async () => {
    const formattedPayload = generateCreateDealPayload(newDealData, false)
    const formattedPayloadWithUser = {
      ...formattedPayload,
      username: user?.name
    }
    if (isEditing) {
      formattedPayloadWithUser['dealId'] = dealId
      formattedPayloadWithUser['scopes'] = addScopesForEditDealPayload(data, formattedPayloadWithUser)
      formattedPayloadWithUser['promo_restrictions'] = addPromoRestrictionsForEditDealPayload(data, formattedPayloadWithUser, newDealData)
    }

    setSubmitting(true)
    if (isEditing) {
      await editDeal(formattedPayloadWithUser)
        .unwrap()
        .then((data) => {
          if (data) {
            router.push("/deals");
            dispatch(updateNewDeal(CreateDealDefaultFormState))
            dispatch(updateDealEditing(false))
            dispatch(updateDealStep(""));
            notifySuccess("Deal successfully saved")
          }
        })
        .catch((error: any) => {
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "deal-failed"
          )
        }).finally(() => {
          setSubmitting(false)
        });
    } else {
      await createDeals(formattedPayloadWithUser)
        .unwrap()
        .then((data) => {
          if (data) {
            dispatch(updateNewDeal(CreateDealDefaultFormState))
            dispatch(updateDealStep(""));
            router.push("/deals");
            notifySuccess("Deal successfully created")
          }
        })
        .catch((error) => {
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "deal-failed"
          )
        }).finally(() => {
          setSubmitting(false)
        });
    }
  }

  const { title, draftCreatedTimestamp, dealLevel, dealType, dealCriteria, dealCriteriaType } = newDealData

  if (dealLevel === 'basket') {
    excludeSteps.push('Products and Collections', 'Deal Criteria', 'Shipping method', 'Spend minimum')
  }

  if (dealLevel === 'product' && dealType === DISCOUNT_DEAL_TYPE) {
    excludeSteps.push('Deal Criteria', 'Shipping method', 'Spend minimum')
  }

  if (dealType === MULTI_BUY_DEAL_TYPE) {
    excludeSteps.push('Deal value', 'Shipping method', 'Spend minimum')
  }

  if (dealType === FREE_SHIPPING_DEAL_TYPE) {
    excludeSteps.push('Deal value', 'Deal Criteria', 'Products and Collections', 'Exclusions')
  }

  let customerPreview: string[] = []

  dealCriteria?.forEach((data: any,) => {
    if (dealCriteriaType === "$_OFF_MULTI") {
      customerPreview.push(`Buy ${data.buy}, Get $${data.get} Off`)
    }
    if (dealCriteriaType === "$_FIXED_MULTI") {
      customerPreview.push(`Buy ${data.buy} For $${data.get}`)
    }

    if (dealCriteriaType === "%_OFF_MULTI") {
      customerPreview.push(`Buy ${data.buy} Get ${data.get}% Off`)
    }
  });

  return <>
    <Grid container justifyContent="center" sx={{ marginTop: "32px" }}>
      <Grid item lg={6} md={8} sm={9}>
        <Typography variant="h4" className={summaryStyles.title}>{title}</Typography>
        <Typography mt={2} className={summaryStyles['sub-title']}>Draft created on {moment(draftCreatedTimestamp).format('MMMM D, YYYY [at] h:mm A z [EST]')}</Typography>
        <Chip label="Draft" className={summaryStyles.Chip} sx={{ backgroundColor: "#666B73", marginBottom: "16px" }} />
      </Grid>
    </Grid>
    {
      Object.keys(config).filter(step => !excludeSteps.includes(step)).map((stepTitle: string) => {
        const basketLevelTitle = dealLevel === 'basket' ? 'Product Applicability' : stepTitle
        const computedTitle = stepTitle === 'Exclusions' ?  basketLevelTitle: stepTitle
        return <Card className={commonStyles["step-card-container-summary"]} key={stepTitle}>
          <StepTitle title={computedTitle} />
          {
            config[stepTitle].map(({ title, getValue, shouldHide }) => {
              if (shouldHide && shouldHide(newDealData)) {
                return null
              }
              return <>
                <Typography variant="h4" className={summaryStyles.heading} mt={4}>{title}</Typography>
                {stepTitle === "Deal Criteria" && title === "Customer preview" ? <> {customerPreview.map((data: any) => { return <> <Typography className={summaryStyles.content}>{data}</Typography> </> })} </> :
                  <Typography className={summaryStyles.content}>{getValue(newDealData)}</Typography>}
              </>
            })
          }

        </Card>
      })
    }
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
              onClick={() => router.push("/deals/create")}
              variant="text"
              className={commonStyles['text-style-btn']}
            >
              Go back and edit
            </Button>
            <Button
              onClick={() => handleCreateDeal()}
              variant="contained"
              className={commonStyles.continueBtn}
              disabled={submitting}
            >
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </div>
        </Grid>
      </Grid>
    </Grid>
  </>

}

export default DealSummaryView