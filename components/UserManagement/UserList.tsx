import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Card from "@mui/material/Card";
import { Box, Button, CardContent, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-modal";
import styles from "./UserList.module.css";
import { useGetUserRoleListQuery } from "../../api/getAllUsers";
import AddUser from "./AddUser/AddUser";
import { notifyError, notifySuccess } from "../../util/Notification/Notification";
import EditUserModal from "./EditUser/EditUserModal";
import { useRemoveUserMutation } from "../../api/removeUser";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

const UserList = () => {

  const [isOpen, setIsOpen] = useState(false);
  const { data, isError, refetch } = useGetUserRoleListQuery();
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [removeUser] = useRemoveUserMutation();

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

  const getUserAccess = (profiles: any) => {
    if (Object.keys(profiles[0])[0] === "JOE_FRESH") {
      return (
        `${
          profiles[0]?.JOE_FRESH?.roles[0]
            ? profiles[0]?.JOE_FRESH?.roles[0]?.replace(/_/g, " ")
            : ""
        }` +
        `${
          profiles[0]?.JOE_FRESH?.roles[1]
            ? " & " + profiles[0]?.JOE_FRESH?.roles[1]?.replace(/_/g, " ")
            : ""
        }`
      );
    }

    if (Object.keys(profiles[0])[0] === "ONLINE_GROCERIES") {
      return (
        `${
          profiles[0]?.ONLINE_GROCERIES?.roles[0]
            ? profiles[0]?.ONLINE_GROCERIES?.roles[0]?.replace(/_/g, " ")
            : ""
        }` +
        `${
          profiles[0]?.ONLINE_GROCERIES?.roles[1]
            ? " & " +
              profiles[0]?.ONLINE_GROCERIES?.roles[1]?.replace(/_/g, " ")
            : ""
        }`
      );
    }
  };


  const editUserModalcustomStyles = {
    content: {
      width: "500px",
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

  const columns: TableColumn<any>[] = [
    {
      name: "Email",
      selector: (row) => row.emailId,
    },
    {
      name: "LOB",
      selector: (row) =>
        Object.keys(row.profiles[0])[0] === "ONLINE_GROCERIES"
          ? "PC_EXPRESS"
          : Object.keys(row.profiles[0])[0],
    },
    {
      name: "Access",
      selector: (row) => getUserAccess(row.profiles),
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          sx={{
            fontWeight: "400",
            textDecoration: "underline",
            textTransform: "initial",
            marginTop: "-8%",
          }}
          data-testid="edit-user-access-btn"
          onClick={() => handleEditClick(row)}
        >
          Edit access
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (isError) {
    notifyError("Oops! Something went wrong", "userList-error")
  }

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEditClick = (row: any) => {
    setSelectedRow(row);
    setShowEditUserModal(true);
  };

  const closeRemoveUserModal = () => {
    setShowEditUserModal(false);
  };

  const handleRemoveUser = async () => {
    if (!selectedRow) return;

    await removeUser(selectedRow.customerId)
      .then(() => {
        notifySuccess(`user has been successfully removed`);
        refetch();
      })
      .catch((e) => notifyError(e.data.error, "add-user"));
    closeRemoveUserModal();
  };

  const searchUser = () => {
    const filteredItems: any = data?.filter(
      (item) =>
        JSON.stringify(item.emailId || "")
          .toLowerCase()
          .indexOf(filterText.toLowerCase()) !== -1
    );
    setFilterData(filteredItems);
    setSearchedText(filterText);
  };

  const clearSearch = () => {
    setFilterText("");
  };

  const clearResult = () => {
    setFilterText("");
    setSearchedText("");
    setFilterData([]);
  };

  useEffect(() => {
    const filteredItems: any = data?.filter(
      (item) =>
        JSON.stringify(item.emailId || "")
          .toLowerCase()
          .indexOf(filterText.toLowerCase()) !== -1
    );
    setFilterData(filteredItems);
  }, [data]);

  let content = null;

  if (isError) {
    content = (
      <>
        <Card className={styles["users-card"]}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography
              variant="h5"
              className={styles["users-card-header"]}
              mb={3}
            >
              All Users
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "16px", color: "#666B73" }}
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
              {searchedText?.length > 0 ? (
                <Typography
                  variant="h5"
                  className={styles["users-card-header"]}
                  mb={3}
                  data-testid="searchResult"
                >
                  {filterData?.length}{" "}
                  {filterData.length === 1 ? "Result" : "Results"} for{" "}
                  {searchedText}
                </Typography>
              ) : (
                <Typography
                  variant="h5"
                  className={styles["users-card-header"]}
                  mb={3}
                >
                  All Users
                </Typography>
              )}

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

            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "3%",
                marginTop: "-1%",
              }}
            >
              <Grid>
                <FormControl fullWidth>
                  <OutlinedInput
                    className={styles.search}
                    autoComplete="off"
                    id="outlined-basic"
                    placeholder="Search by Agent or Admin’s email"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") searchUser();
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        {searchedText?.length > 0 ? (
                          <IconButton
                            onClick={clearSearch}
                            sx={{ padding: "3px" }}
                            data-testid="clearIcon"
                          >
                            <ClearIcon sx={{ color: "#333333" }} />
                          </IconButton>
                        ) : (
                          <IconButton sx={{ padding: "3px" }}>
                            <SearchIcon sx={{ color: "#333333" }} />
                          </IconButton>
                        )}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid ml={2}>
                <Button
                  className={styles["search-button"]}
                  variant="contained"
                  disabled={!Boolean(filterText)}
                  onClick={() => searchUser()}
                  data-testid="searchBtn"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            {searchedText?.length > 0 ? (
              <Typography
                width="fit-content"
                className={styles.ClearText}
                onClick={clearResult}
              >
                Clear results and view all users
              </Typography>
            ) : null}

            <DataTable
              persistTableHead
              columns={columns}
              noDataComponent={
                <Typography mt={2} fontWeight={400}>
                  {"No results"}
                </Typography>
              }
              data={searchedText?.length > 0 ? filterData : [...data].reverse()}
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
        <AddUser closeModal={closeModal} refetch={refetch} />
      </Modal>
      <Modal
        style={editUserModalcustomStyles}
        isOpen={showEditUserModal}
        onRequestClose={closeRemoveUserModal}
      >
        <EditUserModal
          closeModal={closeRemoveUserModal}
          user={selectedRow}
          handleRemoveUser={handleRemoveUser}
          selectedRow={selectedRow}
          refetch={refetch}
        />
      </Modal>
    </>
  );
};

export default UserList;
