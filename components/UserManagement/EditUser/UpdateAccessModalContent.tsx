import React, { ChangeEventHandler, MouseEventHandler } from 'react'
import { Typography, Grid, Button, FormControlLabel, Checkbox } from '@mui/material'
import classes from './EditUserModal.module.css'

interface IUpdateAccessModalContent {
  isAgent: boolean
  isAdmin: boolean
  handleChange: ChangeEventHandler
  error: string
  closeModal: MouseEventHandler
  handleUpdateRole: MouseEventHandler
}

const UpdateAccessModalContent = ({ isAgent, isAdmin, handleChange, error, closeModal, handleUpdateRole }: IUpdateAccessModalContent) => {
  return <>
    <Typography variant="subtitle1" >
      Roles
    </Typography>
    <Typography variant="subtitle2" className={classes['modal-subheading']} >
      Select the role(s) that you wish to add to this user&apos;s profile
    </Typography>
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAgent}
            onChange={handleChange}
            name="agent"
            inputProps={{
              // @ts-ignore
              "data-testid": "agent-checkbox"
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
        label="User"
      />
    </div>
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAdmin}
            onChange={handleChange}
            name="administrator"
            data-testid="administrator-checkbox"
          />
        }
        sx={{
          "& .MuiSvgIcon-root": { fontSize: 24 },
          "& .MuiFormControlLabel-label": {
            fontSize: "14px",
            color: "#666B73",
          },
        }}
        label="Administrator"
      />
    </div>
    {error && <div data-testid="error" className={classes['error-text']}>{error}</div>}
    <Grid container mt={3}>
      <Grid item lg={6}>
        <Button className={classes["exit-btn"]} onClick={closeModal}>
          Exit
        </Button>
      </Grid>
      <Grid item lg={6} sx={{ textAlign: "right" }}>
        <Button
          className={classes["confirm-btn"]}
          variant="contained"
          onClick={e => handleUpdateRole(e)}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  </>
}

export default UpdateAccessModalContent