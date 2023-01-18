import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Card from "@mui/material/Card";
import { Box, Button, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-modal";
import styles from "./UserList.module.css";
import { useGetUserRoleListQuery } from "../../api/getAllUsers";
import AddUser from "./AddUser/AddUser";

const UserList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data,isError,refetch} = useGetUserRoleListQuery();

  const addModalStyles = {
    content: {
      width: "27%",
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "2px",
      background: "#fff",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      padding: "16px",
      gap: "10px",
    },
    overlay: {
      zIndex: "999",
      background: "rgba(0,0,0,0.4",
    },
  };

  const customStyles = {
    rows: {
      style: {
        height: "62px", // override the row height
        width: "100%",
        fontSize: "16px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#F0F0F0",
        borderBottom: "3px solid #666B73",
        fontSize: "16px",
        fontWeight: "bolder", // override the cell padding for head cells
      },
    },
    cells: {
      style: {
        width: "30%",
        paddingLeft: "14px",
        paddingRight: "8px",
      },
    },
  };

  const columns: TableColumn<any>[] = [
    {
      name: "Email",
      selector: (row) => row.emailId,
    },
    {
      name: "Access",
      selector: (row) => (
        <>
          <p className={styles.accessText}>
            {row.profiles[0]?.JOE_FRESH?.roles[0]}{" "}
            {row.profiles[0]?.JOE_FRESH?.roles[1]
              ? `${" & " + row.profiles[0]?.JOE_FRESH?.roles[1]}`
              : null}
          </p>
        </>
      )
    },
    {
      name: "Action",
      cell: () => (
        <Button
          sx={{
            fontWeight: "400",
            textDecoration: "underline",
            textTransform: "initial",
            marginTop: "-8%",
          }}
          data-testid="edit-user-access-btn"
        >
          Edit access
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  let content = null;

  if(isError) {
    content = (
      <>
        <Card className={styles["users-card"]}>
          <CardContent sx={{padding: "0px"}}>
            <Typography
              variant="h5"
              className={styles["users-card-header"]}
              mb={3}
            >
              All Users
            </Typography>
            <Typography
              variant="body2"
              sx={{fontSize: "16px", color: "#666B73"}}
            >
              This information is not available at this time.
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  }

  if (data) {
    content = (
      <>
        <Card className={styles["users-card"]}>
          <CardContent sx={{ padding: "0px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                className={styles["users-card-header"]}
                mb={3}
              >
                All Users
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon fontSize="large" />}
                className={styles["add-btn"]}
                sx={{ mb: 3 }}
                onClick={handleAddClick}
              >
                Add user
              </Button>
            </Box>

            <DataTable
              persistTableHead
              columns={columns}
              noDataComponent={
                <Typography mt={2} fontWeight={400}>
                  {"No results"}
                </Typography>
              }
              data={data}
              customStyles={customStyles}
              highlightOnHover
            />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Box data-testid="userList">
        <Typography variant="h1" mb={5} className={styles["section-header"]}>
          Roles and Permissions
        </Typography>
        {content}
      </Box>

      <Modal
        style={addModalStyles}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <AddUser closeModal={closeModal} refetch={refetch}/>
      </Modal>
    </>
  );
};

export default UserList;
