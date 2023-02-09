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
import { useAppSelector } from '../../store';
import { getNewDealData } from '../../store/feature/deal/newDealSlice'
import { userProfileState } from '../../store/feature/auth/authSlice';
import generateCreateDealPayload from '../../util/createDealPayload'
import { useCreateDealsMutation } from '../../api/createDeal';
import { notifyError, notifySuccess } from '../../util/Notification/Notification';

const DealSummaryView = () => {
  const router = useRouter();
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
        if (data?.dealGeneralInfo?.code) {
          router.push("/deals");
          notifySuccess("Deal successfully created")
        }
      })
      .catch((error) => {
        notifyError(
          error.data?.details ? error.data?.details : "Something went wrong",
          "deal-failed"
        )
        console.log(error)
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
            onClick={() => router.push("/deals/create")}
          >
            Cancel
          </Button>
          <div>
            <Button
              onClick={() => router.push("/deals/create")}
              variant="text"
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