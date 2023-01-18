import React, {useState, useEffect, useCallback, useMemo} from "react";
import Card from "@mui/material/Card";
import {Box, CardContent, Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import styles from "./Deals.module.css";
import DataTable, {TableColumn} from "react-data-table-component";
import {useGetAllListQuery} from "../../api/getAllDeals";
import TableLoader from "../TableLoader/TableLoader";
import CreateIcon from "@mui/icons-material/Create";
import {AllDealsList} from "../../api/getAllDeals";
import {dateFormat} from "../../util/format";
import Chip from "@mui/material/Chip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function Deals() {
  const {data, isLoading} = useGetAllListQuery();

  console.log(data);

  const [selectedRows, setSelectedRows] = useState<any>([]);

  useEffect(() => {
    console.log("state", selectedRows);
  }, [selectedRows]);

  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

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

  const columns: TableColumn<AllDealsList>[] = useMemo(
    () => [
      {
        name: "Deal",
        // width: "35%",
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

  let content = null;

  if(isLoading) {
    content = <TableLoader />;
  }

  if(data) {
    content = (
      <Grid item lg={8} md={9} sm={9}>
        <Grid display="flex" justifyContent="space-between" mt={8} mb={4}>
          <Typography variant="h3" className={styles.heading}>
            Deals & Promotions
          </Typography>

          <Button variant="contained" className={styles.btn}>
            <CreateIcon sx={{marginRight: "5px"}} />
            Create new
          </Button>
        </Grid>

        <Card className={styles["deal-card"]}>
          <CardContent sx={{padding: "0px"}}>
            <Typography
              variant="h5"
              sx={{mb: 3}}
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

          <Grid display="flex" justifyContent="space-between" mt={3} mb={4}>
            <Grid>
              <DeleteOutlineIcon />
              Delete
            </Grid>

            <Grid></Grid>
          </Grid>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center">
      {content}
    </Grid>
  );
}

export default Deals;
