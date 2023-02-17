import React, { useState, useEffect, useCallback, useMemo } from "react";
import Card from "@mui/material/Card";
import { Box, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styles from "./Deals.module.css";
import DataTable from "react-data-table-component";
import { useGetAllListQuery } from "../../../api/getAllDeals";
import TableLoader from "../../TableLoader/TableLoader";
import CreateIcon from "@mui/icons-material/Create";
import { dateFormat } from "../../../util/format";
import Chip from "@mui/material/Chip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Modal from "react-modal";
import DeleteDeal from "../../DeleteDeal/DeleteDeal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { notifyError } from "../../../util/Notification/Notification";
import { useAppDispatch } from "../../../store";
import { updateDealId } from "../../../store/feature/deal/dealSlice";

function Deals() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error, refetch } = useGetAllListQuery();
  const [selectedRows, setSelectedRows] = useState<any>([]);

  useEffect(() => {
    if (error) {
      notifyError("Oops! Something went wrong", "all-deal-error");
    }
  }, [error]);

  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const deleteDealStyles = {
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
        minHeight: "108px", // override the row height
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
        paddingLeft: "16px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const columns: any = useMemo(
    () => [
      {
        name: "Deal",
        width: "35%",
        selector: (row: any) => (
          <Grid container>
            <Grid item lg={3}>
              {row.mediaUrl ? (
                <img
                  className={styles.dealimg}
                  src="https://rukminim1.flixcart.com/image/832/832/xif0q/kids-dress/9/7/j/8-9-years-plus-buti-baby-gown-blue-fashion-dream-original-imafxu7rqutbdzvq-bb.jpeg?q=70"
                />
              ) : (
                <Box className={styles["no-image"]}>
                  <LocalOfferIcon sx={{ color: "#CCCCCC" }} />
                </Box>
              )}
            </Grid>
            <Grid item lg={9}>
              <strong>{row.dealTitle}</strong>
              <div className={styles["deal-duration"]}>
                {row.validFrom && row.validTo
                  ? `${dateFormat(row.validFrom)} - ${dateFormat(row.validTo)}`
                  : null}
              </div>
              <Chip
                className={styles["chip"]}
                label={
                  row.status.charAt(0).toUpperCase() +
                  row.status.slice(1).toLowerCase()
                }
              />
            </Grid>
          </Grid>
        ),
      },
      {
        name: "Type",
        selector: (row: any) => {
          return (
            row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()
          );
        },
      },
      {
        name: "Value",
        selector: (row: any) => {
          if (
            row.dealValue[0].rewardType === "$_OFF" ||
            row.dealValue[0].rewardType === "FIXED_OFF"
          ) {
            return `$${row.dealValue[0].rewardValue} Off`;
          }
          if (row.dealValue[0].rewardType === "%_OFF") {
            return `${row.dealValue[0].rewardValue}% Off`;
          }
        },
      },
      {
        name: "Identifier",
        selector: (row: any) => row.identifier,
      },
      {
        name: "Action",
        cell: (row: any) => (
          <Button
            sx={{
              fontWeight: "400",
              textDecoration: "underline",
              textTransform: "initial",
              marginTop: "-8%",
            }}
            onClick={() => viewDetails(row.id)}
            data-testid="view-btn"
          >
            View
          </Button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    []
  );

  const viewDetails = (value: Number) => {
    router.push("deals/view");
    dispatch(updateDealId(value));
  };

  const handleSelectionCriteria = useMemo(() => {
    return (row: any) => {
      return selectedRows?.some(
        (selectableRow: any) => selectableRow.id === row.id
      );
    };
  }, []);

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  let content = null;

  if (isLoading) {
    content = <TableLoader />;
  }

  if (error) {
    content = (
      <>
        <Grid item lg={8} md={9} sm={9} mt={2}>
          <Card className={styles["deal-card"]}>
            <CardContent sx={{ padding: "0px" }}>
              <Typography
                variant="h5"
                sx={{ mb: 3 }}
                className={styles["deal-card-header"]}
              >
                All
              </Typography>
              <DataTable
                persistTableHead
                data={[]}
                noDataComponent={
                  <Box className={styles["no-data-box"]}>
                    <Typography
                      variant="body2"
                      className={styles["no-data-text"]}
                    >
                      There are currently no deals to view
                    </Typography>
                    <Button
                      onClick={() => router.push("/deals/create")}
                      variant="outlined"
                      className={styles["create-new-btn"]}
                      data-testid="createNew-btn"
                    >
                      <CreateIcon sx={{ marginRight: "5px" }} />
                      Create new
                    </Button>
                  </Box>
                }
                highlightOnHover
                columns={columns}
                customStyles={customStyles}
                selectableRows
              />
              <Divider sx={{ margin: "0px -20px 25px -20px" }} />
            </CardContent>
          </Card>
        </Grid>
      </>
    );
  }

  if (data) {
    content = (
      <Grid item lg={8} md={9} sm={9} mt={2}>
        <Card className={styles["deal-card"]}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography
              variant="h5"
              sx={{ mb: 3 }}
              className={styles["deal-card-header"]}
            >
              All
            </Typography>
            <DataTable
              persistTableHead
              data={data}
              highlightOnHover
              columns={columns}
              customStyles={customStyles}
              selectableRows
              onSelectedRowsChange={handleChange}
              selectableRowSelected={handleSelectionCriteria}
            />
          </CardContent>

          <Grid container alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon sx={{ fontSize: "16px" }} />}
                className={styles["delete-btn"]}
                disabled={selectedRows.length < 1}
                onClick={handleDeleteClick}
                data-testid="delete-btn"
              >
                Delete
              </Button>
            </Grid>
            {selectedRows.length > 0 && (
              <Grid item>
                <Typography variant="body2">{`(${selectedRows.length} selected)`}</Typography>
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" data-testid="homepage">
      {content}
      <Box>
        <Modal
          style={deleteDealStyles}
          isOpen={isOpen}
          onRequestClose={closeModal}
        >
          <DeleteDeal
            closeModal={closeModal}
            selectedDeals={selectedRows}
            refetch={refetch}
          />
        </Modal>
      </Box>
    </Grid>
  );
}

export default Deals;
