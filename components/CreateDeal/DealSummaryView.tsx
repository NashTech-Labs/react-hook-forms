import React from 'react'
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
import { updateDealStep } from '../../store/feature/deal/dealSlice';
import CreateDealDefaultFormState from '../../constants/CreateDealDefaultFormState'

const DealSummaryView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const newDealData = useAppSelector(getNewDealData)
  const user = useAppSelector(userProfileState)

  const [createDeals] = useCreateDealsMutation();

  const handleCreateDeal = async () => {
    const formattedPayload = generateCreateDealPayload(newDealData)
    const formattedPayloadWithUser = {
      ...formattedPayload,
      username: user?.name
    }
    console.log("Create deal payload", formattedPayloadWithUser)
    await createDeals(formattedPayloadWithUser)
      .unwrap()
      .then((data) => {
        if (data) {
          dispatch(updateNewDeal(CreateDealDefaultFormState))
          dispatch(updateDealStep(0));
          router.push("/deals");
          notifySuccess("Deal successfully created")
        }
      })
      .catch((error) => {
        notifyError(
          error.data?.details ? error.data?.details : "Something went wrong",
          "deal-failed"
        )
      });
  }

  return <>
    {
      Object.keys(config).map((stepTitle: string) => {
        return <Card className={commonStyles["step-card-container"]} key={stepTitle}>
          <StepTitle title={stepTitle} />
          {
            config[stepTitle].map(({ title, getValue }) => {
              return <>
                <Typography variant="h4" className={summaryStyles.heading} mt={4}>{title}</Typography>
                <Typography className={summaryStyles.content}>{getValue(newDealData)}</Typography>
              </>
            })
          }

        </Card>
      })
    }
    <Grid container justifyContent="center">
      <Grid item lg={6} md={8} sm={9}>
        <Grid className={commonStyles.btnSection}>
          <Button
            variant="contained"
            className={commonStyles.cancelBtn}
            onClick={() => router.push("/deals")}
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
            >
              Create
            </Button>
          </div>
        </Grid>
      </Grid>
    </Grid>
  </>

}

export default DealSummaryView