import React, {MouseEventHandler} from 'react'
import { Box, Typography, Button, Grid } from '@mui/material'
import commonStyles from '../CreateDeal/Steps.module.css'
import styles from '../CreateDeal/DraftModal.module.css'
import classes from '../CreateDeal/ExitEditModal.module.css'

interface INoDisableModal {
    closeModal: MouseEventHandler
}

const NoDisableModal = ({ closeModal }: INoDisableModal) => {
 return   <>
 <Box p={1} data-testid="editExitModal" sx={{ padding: 0 }}>
     <Typography className={styles['draft-modal-heading']}>Cannot disable deal</Typography>
     <Typography variant="body2" className={classes["description"]} mt={2}>
       All fields must be completed and / or entered correctly.
     </Typography>
     <Grid container mt={3} mb={1}>
         <Grid item lg={3}>
             <Button
                 className={commonStyles['cancelBtn']} 
                 onClick={closeModal}
                 data-testid="exitBtn"
                 variant='outlined'
             >
                 Go back
             </Button>
         </Grid>
     </Grid>
 </Box>
</>
}

export default NoDisableModal