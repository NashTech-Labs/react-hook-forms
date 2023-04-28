import  React from 'react'
import {Button, Typography} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import styles from './DraftModal.module.css'
import commonStyles from './Steps.module.css'
import {useAppDispatch} from '../../store'
import {updateDraftDeal} from '../../store/feature/deal/draftDealSlice'

interface IDraftModal {
    loading: boolean
    closeModal: Function
}

const DraftModal = ({ loading, closeModal }: IDraftModal) => {
  const router = useRouter();
  const dispatch = useAppDispatch()
   
  const handleExit = () => {
    closeModal()
    router.push('/deals')
    dispatch(updateDraftDeal({}))
  }
  
  const handleClose = () => {
    closeModal()
  }

  let content = null
  if(loading) {
    content =  <div className={styles['draft-modal-saving']}>
        <div className={styles['save-text']}>Saving progress...</div>
        <div>
          <CircularProgress thickness={5} size={70}/>
        </div>
    </div>
  } else {
    content = <div>
        <Typography className={styles['draft-modal-heading']}>Saved. How would you like to proceed?</Typography>
        <div className={styles['btn-container']}>
          <Button
              data-testid="exit-btn"
              variant="contained"
              className={commonStyles.cancelBtn}
              onClick={handleExit}
          >
            Just exit
          </Button>
          <Button
            variant="contained"
            className={commonStyles.continueBtn}
            onClick={handleClose}
          >
              Continue editing deal
          </Button>
        </div>
    </div>
  }

  return content
}

export default DraftModal