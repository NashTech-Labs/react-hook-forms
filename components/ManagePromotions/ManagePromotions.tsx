import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import * as yup from "yup";
import commonStyles from "../CreateDeal/Steps.module.css";
import {yupResolver} from '@hookform/resolvers/yup';
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SelectField from '../FormComponents/SelectField'
import TextInputField from '../FormComponents/TextInputField'
import styles from './ManagePromotions.module.css'
import { JF_PROMOTION_TYPE, SDM_PROMOTION_TYPE , LOB_OPTIONS } from '../../constants/FormOptions'
import ManagePromotionsModal from './ManagePromotionsModal'
import { useAppSelector } from '../../store';
import { updatedPromotionType } from '../../store/feature/voucher/voucherSlice';

export interface IManagePromotionsFormState {
  promotionType: string,
  promotionId: string,
  levelOfBusiness: string
}

const managePromotionsFormDefaultValue = {
  promotionType: '',
  promotionId: '',
  levelOfBusiness: ''
}

const schema = yup.object().shape({
  promotionType: yup.string().required('Promotion Type is required'),
  promotionId:  yup.string().required('Promotion ID is required'),
  levelOfBusiness:  yup.string().required('LOB is required')
})

const ManagePromotions = () => {
  const router = useRouter()

  const promotionType = useAppSelector(updatedPromotionType);

  const [open, setOpen] = useState<boolean>(false)
  const formMethods = useForm<IManagePromotionsFormState>({
    resolver: yupResolver(schema),
    defaultValues: managePromotionsFormDefaultValue,
    mode: 'all'
  });

  const lob = useWatch({
    control: formMethods.control,
    name: 'levelOfBusiness'
  })

  useEffect(() => {
   formMethods.resetField('promotionType')
  },[lob, formMethods])

  const closePromotionsModal = (success: boolean): void => {
   setOpen(false)
   success && formMethods.reset()
  }

  const handleDisablePromotion = async () => {
    const cleanForm = await formMethods.trigger(undefined, { shouldFocus: true })
    cleanForm && setOpen(true)
  }

  const handleBack = () => {
    if (promotionType === 'deals')
    {
      router.push('/deals')
    }
    else {
      router.push('/vouchers')
    }
  }

  const promotionTypeValues = lob === 'JOE_FRESH' ? JF_PROMOTION_TYPE : SDM_PROMOTION_TYPE

  return <Box sx={{ margin: '5% 25%' }}>
    <Typography className={styles.heading}>
      Manage Promotions
    </Typography>
    <FormProvider {...formMethods}>
      <Card raised sx={{ padding: '20px', margin:'20px 0px' }}>
        <Stack sx={{ margin: '20px 0px'}}>
          <SelectField
            required
            title="LOB"
            name="levelOfBusiness"
            options={LOB_OPTIONS}
            inputHeight
          />
          <SelectField
            required
            title="Promotion type"
            name="promotionType"
            options={promotionTypeValues}
            inputHeight
            topGutters
          />
          <TextInputField
            title="Promotion ID"
            placeholder="Enter promotion ID"
            name="promotionId"
            required
            type="text"
            inputHeight={true}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" className={commonStyles['cancelBtn']} onClick={handleBack} data-testid="back-btn">Go Back</Button>
            <Button
              onClick={() => handleDisablePromotion()}
              variant="outlined"
              className={styles.disablePromotionsBtn}
              data-testId="disable-btn"
            >
              <VisibilityOffIcon sx={{ marginRight: "5px" }} />
              Disable
            </Button>
        </Stack>
      </Card>
    </FormProvider>
    <ManagePromotionsModal closeModal={closePromotionsModal} open={open} formValues={formMethods.getValues()}/>
  </Box>
}

export default ManagePromotions