import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from "react";
import Card from "@mui/material/Card";
import { Box, CardContent, Divider, Grid, Typography, Pagination, PaginationItem, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
import { useAppDispatch, useAppSelector } from "../../../store";
import { updateDealId } from "../../../store/feature/deal/dealSlice";
import { dealStatus } from "../../../constants/DealStatus";
import FilterSection from './FilterSection'
import { getFilters } from "../../../store/feature/filters/filtersSlice";

interface IDealsProps {
  search: string
}

function Deals({ search }: IDealsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getFilters)
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch } = useGetAllListQuery({ search, filters, page });
  const [selectedRows, setSelectedRows] = useState<any>([]);

  useEffect(() => {
    if (error) {
      notifyError("Oops! Something went wrong", "all-deal-error");
    }
  }, [error]);

  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePagination = useCallback((e: ChangeEvent<unknown>, number: number): void => {
    setPage(number)
  }, [])

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const NoDealsComponent = () => <Box className={styles["no-data-box"]}>
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
                className={row.status === "INACTIVE" ? styles["inactiveChip"] : styles["chip"]}
                sx={{
                  backgroundColor:
                    dealStatus[row.status],
                }}
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

          if (row.type === "MULTI_BUY") {
            if (
              row.dealValue[0].rewardType === "%_OFF_MULTI"
            ) {
              return (
                row.dealValue.map((data: any, index: number) => {
                  return (<Grid key={index} display="grid">
                    <Grid> Buy {data.buyQuantity} get {parseInt(data.rewardValue)}% off</Grid>
                  </Grid>)
                })
              )
            }
            if (
              row.dealValue[0].rewardType === "$_OFF_MULTI"
            ) {
              return (
                row.dealValue.map((data: any, index: number) => {
                  return (<Grid key={index} display="grid">
                    <Grid> Buy {data.buyQuantity} get ${(Number(data.rewardValue) / 100).toFixed(2)} off</Grid>
                  </Grid>)
                })
              )
            }
            if (
              row.dealValue[0].rewardType === "$_FIXED_MULTI"
            ) {
              return (
                row.dealValue.map((data: any, index: number) => {
                  return (<Grid key={index} display="grid">
                    <Grid> Buy {data.buyQuantity} For ${(Number(data.rewardValue) / 100).toFixed(2)}</Grid>
                  </Grid>)
                })
              )
            }
          }

          else if (row.type === "FREE_SHIPPING") {
            return (
              <Grid display="grid">
                <Grid> {row?.spend?.minimum ? `Spend minimum of $${(Number(row.spend.minimum) / 100).toFixed(2)}` : "No minimum"}</Grid>
              </Grid>
            )
          }

          else {

            if (row?.spend?.minimum > 0) {
              if (
                row.dealValue[0].rewardType === "$_OFF"
              ) {
                return (
                  <Grid display="grid">
                    <Grid> Spend ${(Number(row?.spend?.minimum) / 100).toFixed(2)} </Grid>
                    <Grid> Get ${(Number(row.dealValue[0].rewardValue) / 100).toFixed(2)} Off </Grid>
                  </Grid>
                )
              }
              if (row.dealValue[0].rewardType === "%_OFF") {
                return (
                  <Grid display="grid">
                    <Grid> Spend ${(Number(row?.spend?.minimum) / 100).toFixed(2)} </Grid>
                    <Grid> Get {row.dealValue[0].rewardValue}% Off </Grid>
                  </Grid>
                )
              }
            }
            else {
              if (
                row.dealValue[0].rewardType === "$_OFF" ||
                row.dealValue[0].rewardType === "$_FIXED"
              ) {
                return `$${(Number(row.dealValue[0].rewardValue) / 100).toFixed(2)} Off`;
              }
              if (row.dealValue[0].rewardType === "%_OFF") {
                return `${row.dealValue[0].rewardValue}% Off`;
              }
            }
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
                noDataComponent={<NoDealsComponent />}
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

    if (data.deals.length > 0) {
      content = (
        <Grid item lg={8} md={9} sm={9} mt={2}>
          <Card className={styles["deal-card"]}>
            <CardContent sx={{ padding: "0px" }}>
              <FilterSection />
              <DataTable
                persistTableHead
                data={data.deals}
                highlightOnHover
                columns={columns}
                customStyles={customStyles}
                selectableRows
                onSelectedRowsChange={handleChange}
                selectableRowSelected={handleSelectionCriteria}
              />
            </CardContent>

            <Grid container justifyContent="space-between">
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: "16px" }} />}
                  className={styles["delete-btn"]}
                  disabled={selectedRows.length < 1}
                  onClick={handleDeleteClick}
                  data-testid="delete-btn"
                >
                  {selectedRows.length > 0 ? `Delete (${selectedRows.length} selected)` : 'Delete'}
                </Button>
              </Grid>
              <Grid item>
                <Pagination
                  page={page}
                  count={data?.paginationInfo?.['total_pages']}
                  hidePrevButton={page === 1}
                  onChange={handlePagination}
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{ previous: undefined, next: NavigateNextIcon }}
                      {...item}
                    />
                  )}
                  sx={{
                    '.MuiPaginationItem-text': {
                      color: '#276ADD'
                    },
                    '.Mui-selected': {
                      color: '#333333'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      );
    }

    else {
      content = (
        <>
          <Grid item lg={8} md={9} sm={9} mt={2}>
            <Card className={styles["deal-card"]}>
              <CardContent sx={{ padding: "0px" }}>
                <FilterSection />
                <Typography
                  variant="h5"
                  sx={{ mb: 3 }}
                  className={styles["deal-card-header"]}
                >
                  {search ? `0 Results for ${search}` : ''}
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
                        {search ? `No results for ${search}. Try another search.` : <NoDealsComponent />}
                      </Typography>
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
