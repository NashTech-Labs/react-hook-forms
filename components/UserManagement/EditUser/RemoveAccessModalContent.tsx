import React, { ChangeEventHandler, MouseEventHandler } from 'react'
import { Typography, Grid, Button, FormControlLabel, Checkbox } from '@mui/material'
import classes from './EditUserModal.module.css'

interface IRemoveAccessModalContent {
  consent: boolean
  handleChange: ChangeEventHandler
  closeModal: MouseEventHandler
  handleRemoveUser: MouseEventHandler
}

const RemoveAccessModalContent = ({ consent, handleChange, closeModal, handleRemoveUser }: IRemoveAccessModalContent) => {
  return <>
    <Typography variant="subtitle2" className={classes['modal-subheading']} >
      This will remove them from the system and their existing User/Admin role(s). Are you sure you want to remove this user?
    </Typography>
    <FormControlLabel
      control={
        <Checkbox
          checked={consent}
          onChange={handleChange}
          name="consent"
          inputProps={{
            // @ts-ignore
            "data-testid": "consent"
          }}
        />
      }
      sx={{
        "& .MuiSvgIcon-root": { fontSize: 24 },
        "& .MuiFormControlLabel-label": {
          fontSize: "14px",
          color: "#666B73",
        },
      }}
      label="Yes, I understand and would like to proceed."
    />
    <Grid container mt={3}>
      <Grid item lg={6}>
        <Button className={classes["exit-btn"]} onClick={closeModal} data-testid="exit-btn">
          Exit
        </Button>
      </Grid>
      <Grid item lg={6} sx={{ textAlign: "right" }}>
        <Button
          className={classes["confirm-btn"]}
          variant="contained"
          disabled={!consent}
          onClick={handleRemoveUser}
          data-testid="confirm-removel-btn"
        >
          Confirm removal
        </Button>
      </Grid>
    </Grid>
  </>
}

export default RemoveAccessModalContent