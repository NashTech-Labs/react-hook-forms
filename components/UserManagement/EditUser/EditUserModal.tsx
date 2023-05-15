import {Typography, Box} from '@mui/material'
import React, {useState, ChangeEvent, MouseEventHandler} from 'react'
import classes from './EditUserModal.module.css'
import EditAccessModalContent from './EditAccessModalContent'
import UpdateAccessModalContent from './UpdateAccessModalContent'
import RemoveAccessModalContent from './RemoveAccessModalContent'
import {IRolesPayload,useUpdateUserMutation} from '../../../api/updateUser';
import {notifySuccess, notifyError} from "../../../util/Notification/Notification";

interface IEditUSerModal {
  closeModal: MouseEventHandler
  user: any
  handleRemoveUser: MouseEventHandler
  selectedRow: any
  refetch: Function
}

const EditUserModal = ({closeModal, user, handleRemoveUser, selectedRow, refetch}: IEditUSerModal) => {
  const [isUpdateRole, setIsUpdateRole] = useState(false)
  const [isRemoveUser, setIsRemoveUser] = useState(false)
  const [consent, setConsent] = useState(false)
  const [isAgent, setIsAgent] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<any>(null)
  const {emailId} = user || {}
  const [updateUser] = useUpdateUserMutation()

  const handleChange = ({target: {name, checked}}: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if(name === "agent") {
      setIsAgent(checked)
      setIsAdmin(false)
      return
    }
    if(name == "administrator") {
      setIsAdmin(checked)
      setIsAgent(false)
    }
    setConsent(checked)
  }

  const handleUpdateRole = async (e: any) => {
    if(isAdmin || isAgent) {
      setError(null)
      if(!selectedRow) return;
      const payload:IRolesPayload = {
        roles_to_add : [],
        roles_to_remove: []
      }

      if(isAdmin){
        payload["roles_to_add"] = ["BO_ADMIN"]
        payload["roles_to_remove"] = ["BO_USER"]
      }

      if(isAgent){
        payload["roles_to_add"] = ["BO_USER"]
        payload["roles_to_remove"] = ["BO_ADMIN"]
      }

      await updateUser({user: selectedRow, payload})
        .then(() => {
          refetch()
        })
        .then(() => {notifySuccess(`User has been successfully updated`);})
        .catch((updateUserError) => notifyError(updateUserError?.data?.error, "update-user"));

      closeModal(e)
    } else {
      setError("At least 1 role must be selected")
    }
  }

  let title = <>Edit access for <i>{emailId}</i></>
  let content = <EditAccessModalContent closeModal={closeModal} setIsUpdateRole={setIsUpdateRole} setIsRemoveUser={setIsRemoveUser} />

  if(isUpdateRole) {
    title = <>Update role for <i>{emailId}</i></>
    content = <UpdateAccessModalContent isAdmin={isAdmin} isAgent={isAgent} handleChange={handleChange} error={error} closeModal={closeModal} handleUpdateRole={handleUpdateRole} />
  }

  if(isRemoveUser) {
    title = <>Remove user <i>{emailId}</i>?</>
    content = <RemoveAccessModalContent consent={consent} handleChange={handleChange} closeModal={closeModal} handleRemoveUser={handleRemoveUser} />
  }

  return <Box p={1}>
    <Typography variant="h5" className={classes["modal-heading"]} data-testid="edit-access-modal">
      {title}
    </Typography>
    {content}
  </Box>


}

export default EditUserModal