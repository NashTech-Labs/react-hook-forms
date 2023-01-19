import React, { useState, useEffect, useCallback, useMemo } from "react";
import Card from "@mui/material/Card";

import { Box, CardContent, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styles from "./Deals.module.css";
import DataTable, { TableColumn } from "react-data-table-component";
import { useGetAllListQuery } from "../../api/getAllDeals";
import TableLoader from "../TableLoader/TableLoader";
import CreateIcon from "@mui/icons-material/Create";
import { AllDealsList } from "../../api/getAllDeals";
import { dateFormat } from "../../util/format";
import Chip from "@mui/material/Chip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Modal from "react-modal";
import DeleteDeal from "../DeleteDeal/DeleteDeal";

function Deals() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, refetch } = useGetAllListQuery();
  const [selectedRows, setSelectedRows] = useState<any>([]);

  useEffect(() => {
    console.log("state", selectedRows);
  }, [selectedRows]);

  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

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
        height: "108px", // override the row height
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
          <div className={styles.dealContent}>
            <img className={styles.dealimg} src={row.mediaUrl} />{" "}
            <div className={styles.dealTitle}>
              <strong>{row.dealTitle}</strong>
              <br />
              <span>
                {row.valid_from && row.valid_to
                  ? `${dateFormat(row.valid_from)} - ${dateFormat(
                      row.valid_to
                    )}`
                  : null}
              </span>
              <br />
              <Chip className={styles["chip"]} label={row.status} />
            </div>
          </div>
        ),
      },
      {
        name: "Type",
        selector: (row: any) => row.type,
      },
      {
        name: "Value",
        selector: (row: any) => row.dealValue,
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

  if (data) {
    content = (
      <Grid item lg={8} md={9} sm={9}>
        <Grid display="flex" justifyContent="space-between" mt={8} mb={4}>
          <Typography variant="h3" className={styles.heading}>
            Deals & Promotions
          </Typography>

          <Button
            onClick={() => router.push("deals/create")}
            variant="contained"
            className={styles.btn}
          >
            <CreateIcon sx={{ marginRight: "5px" }} />
            Create new
          </Button>
        </Grid>

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
    <Grid container justifyContent="center">
      {content}
      <Box>
        <Modal
          style={addModalStyles}
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
