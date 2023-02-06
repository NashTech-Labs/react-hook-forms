import React, { MouseEventHandler } from 'react'
import { Button, Grid } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import classes from './EditUserModal.module.css'

interface IRemoveUserModalContent {
    closeModal: MouseEventHandler
    setIsRemoveUser: Function
    setIsUpdateRole: Function
}

const EditAccessModalContent = ({ closeModal, setIsRemoveUser, setIsUpdateRole }: IRemoveUserModalContent) => {
  return <>
    <Button className={classes["main-option"]} onClick={() => setIsUpdateRole(true)} ><EditOutlinedIcon fontSize='small' />Update Role</Button>
    <Button className={classes["main-option"]} onClick={() => setIsRemoveUser(true)} ><HighlightOffOutlinedIcon fontSize='small' />Remove User</Button>
    <Grid container mt={3}>
      <Grid item >
        <Button className={classes["exit-btn"]} onClick={closeModal} data-testid="exit-edit-modal-btn">
                    Exit
        </Button>
      </Grid>
    </Grid>
  </>
}

export default EditAccessModalContent