import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import classes from "./AddUser.module.css";
import {
  notifySuccess,
  notifyError,
} from "../../../util/Notification/Notification";
import { isValidEmail } from "../../../util/Validation/Validation";
import { useAddUserMutation } from "../../../api/addUser";

interface ReceivedProp {
  closeModal(): any;
  refetch(): any;
}

function AddUser({ closeModal, refetch }: ReceivedProp) {
  const [userEmail, setEmail] = useState("");
  const [userRole, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [addUser] = useAddUserMutation();

  const addAgent = async () => {
    const agentDetails = {
      emailId: userEmail,
      roles: [userRole],
      business: "JOE_FRESH",
    };
    if (emailError || roleError) {
      checkEmailValidation();
      checkRoleValidation();
    } else {
      closeModalfn();
      await addUser(agentDetails)
        .unwrap()
        .then(() => {
          refetch();
          notifySuccess(`${userEmail} has been successfully added`);
        })
        .catch((error) =>
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "add-user"
          )
        );
    }
  };

  const closeModalfn = () => {
    closeModal();
  };

  const handleSelectChange = ({
    target: { value },
  }: SelectChangeEvent): void => {
    setRole(value);
    setRoleError("");
  };

  const handleEmailChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>): void => {
    setEmail(value);
    setEmailError("");
  };

  const checkEmailValidation = () => {
    if (!isValidEmail(userEmail)) {
      setEmailError("That looks like an invalid email");
    } else {
      setEmailError("");
    }
  };

  const checkRoleValidation = () => {
    if (userRole === "") {
      setRoleError("You must select a role");
    } else {
      setRoleError("");
    }
  };

  return (
    <>
      <Box p={1} data-testid="addUserModal" sx={{ padding: 0 }}>
        <Grid container alignItems="center" my={3}>
          <Grid item lg={11}>
            <Typography variant="h5" className={classes["modal-heading"]}>
              Add a User
            </Typography>
          </Grid>
          <Grid item lg={1} sx={{ cursor: "pointer", textAlign: "right" }}>
            <CloseIcon onClick={closeModalfn} data-testid="closeIcon" />
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          sx={{ color: "#333333", mt: 2, fontSize: "16px" }}
        >
          What is their email?
        </Typography>
        <Typography variant="body2" sx={{ color: "#666B73", fontSize: "12px" }}>
          Email
        </Typography>
        <FormControl fullWidth>
          <OutlinedInput
            sx={
              emailError
                ? {
                    mt: 1,
                    "&": {
                      border: "1px solid #e1251b",
                      background: "#FEFAF9",
                      borderRadius: "4px",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  }
                : {
                    mt: 1,
                    "&": {
                      border: "1px solid #333333",
                      borderRadius: "4px",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  }
            }
            placeholder="eg. johndoe@mail.com"
            size="small"
            inputProps={{}}
            endAdornment={
              emailError ? (
                <InputAdornment position="end">
                  <ErrorOutlineIcon sx={{ color: "red" }} />
                </InputAdornment>
              ) : null
            }
            value={userEmail}
            onChange={handleEmailChange}
            onBlur={checkEmailValidation}
          />
        </FormControl>
        {emailError ? (
          <Typography
            variant="body2"
            mt={1}
            className={classes.error}
            data-testid="emailError"
          >
            {emailError}
          </Typography>
        ) : null}

        <Typography
          variant="body2"
          sx={{ color: "#333333", mt: 2, fontSize: "16px" }}
        >
          What is their role?
        </Typography>
        <Typography variant="body2" sx={{ color: "#666B73", fontSize: "12px" }}>
          Role
        </Typography>
        <FormControl fullWidth>
          <Select
            id="role-select"
            displayEmpty
            sx={
              roleError
                ? {
                    mt: 1,
                    "&": {
                      border: "1px solid #e1251b",
                      background: "#FEFAF9",
                      borderRadius: "4px",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  }
                : {
                    mt: 1,
                    "&": {
                      border: "1px solid #333333",
                      borderRadius: "4px",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  }
            }
            value={userRole}
            size="small"
            endAdornment={
              roleError ? (
                <InputAdornment position="end">
                  <ErrorOutlineIcon
                    sx={{ color: "red", marginRight: "16px" }}
                  />
                </InputAdornment>
              ) : null
            }
            onChange={handleSelectChange}
            onBlur={checkRoleValidation}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <div style={{ color: "#666B73" }}>Select</div>;
              }
              return selected;
            }}
          >
            <MenuItem value={"BO_ADMIN"}>Admin</MenuItem>
            <MenuItem value={"BO_USER"}>User</MenuItem>
          </Select>
        </FormControl>
        {roleError ? (
          <Typography
            variant="body2"
            mt={1}
            className={classes.error}
            data-testid="roleError"
          >
            {roleError}
          </Typography>
        ) : null}
        <Grid container mt={6} mb={2}>
          <Grid item lg={6}>
            <Button
              className={classes["exit-btn"]}
              onClick={closeModalfn}
              data-testid="exitBtn"
            >
              Exit
            </Button>
          </Grid>
          <Grid item lg={6} sx={{ textAlign: "right" }}>
            <Button
              className={classes["add-btn"]}
              variant="contained"
              onClick={addAgent}
              disabled={!Boolean(userEmail && userRole)}
              data-testid="addBtn"
            >
              Add user
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AddUser;
