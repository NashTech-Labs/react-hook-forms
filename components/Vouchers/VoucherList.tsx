import React, {
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  useEffect
} from "react";
import Card from "@mui/material/Card";
import {
  Box,
  CardContent,
  Divider,
  Grid,
  Typography,
  Pagination,
  PaginationItem,
  Chip,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Button, OutlinedInput } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "./VoucherList.module.css";
import DataTable from "react-data-table-component";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../store";
import { useGetVoucherListQuery } from "../../api/voucherList";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { dealStatus } from "../../constants/DealStatus"
import { dateFormat } from "../../util/format";
import TableLoader from "../TableLoader/TableLoader";
import CreateIcon from "@mui/icons-material/Create";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FilterVoucherSection from "./FilterVoucherSection";
import { getVoucherFilters } from "../../store/feature/voucher/voucherFilterSlice";
import { updateVoucherEditing, updateVoucherId, updateVoucherType } from "../../store/feature/voucher/voucherSlice";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Modal from "react-modal";
import DeleteVoucher from "../DeleteVoucher/DeleteVoucher";
import { userProfileState } from "../../store/feature/auth/authSlice";
import { lobState } from "../../store/feature/selectlob/lobSlice";

function VoucherList() {
  const router = useRouter();

  const dispatch = useAppDispatch()

  const lobType = useAppSelector(lobState);

  const filters = useAppSelector(getVoucherFilters)

  const [page, setPage] = useState(1)

  const [search, setSearch] = useState<string>('')

  const user = useAppSelector(userProfileState)

  const { data, isLoading, error, refetch } = useGetVoucherListQuery({ search, filters, page, user });

  const [selectedRows, setSelectedRows] = useState<any>([]);


  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePagination = useCallback((e: ChangeEvent<unknown>, number: number): void => {
    setPage(number)
  }, [])

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
    refetch();
  }

  useEffect(() => {
    refetch();
    dispatch(updateVoucherEditing(false))
  }, [lobType])

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSelectionCriteria = useMemo(() => {
    return (row: any) => {
      return selectedRows?.some(
        (selectableRow: any) => selectableRow.voucherId === row.voucherId
      );
    };
  }, []);

  useEffect(() => {
    setPage(1)
  }, [search, filters])

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

  const noDealsComponent = <Box className={styles["no-data-box"]}>
    <Typography
      variant="body2"
      className={styles["no-data-text"]}
    >
      There are currently no vouchers to view
    </Typography>
    <Button
      onClick={() => router.push("/vouchers/create")}
      variant="outlined"
      className={styles["create-new-btn"]}
      data-testid="createNew-btn"
    >
      <CreateIcon sx={{ marginRight: "5px" }} />
      Create new
    </Button>
  </Box>

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
              <strong>{row.code}</strong>
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
        selector: (row: any) => (row.type ? row.type : null),
      },
      {
        name: "Value",
        selector: (row: any) => {
          if (row?.spend?.minimum > 0) {

            if (
              row.voucherValues[0]?.rewardType === "$_OFF"
            ) {
              return (
                <Grid display="grid">
                  <Grid> Spend ${(Number(row?.spend?.minimum) / 100).toFixed(2)} </Grid>
                  <Grid> Get ${(Number(row.voucherValues[0]?.rewardValue) / 100).toFixed(2)} Off </Grid>
                </Grid>
              )
            }
            if (row.voucherValues[0]?.rewardType === "%_OFF") {
              return (
                <Grid display="grid">
                  <Grid> Spend ${(Number(row?.spend?.minimum) / 100).toFixed(2)} </Grid>
                  <Grid> Get {row.voucherValues[0]?.rewardValue}% Off </Grid>
                </Grid>
              )
            }
            else {
              if (
                row.voucherValues[0]?.rewardType === "$_OFF" ||
                row.voucherValues[0]?.rewardType === "$_FIXED"
              ) {
                return `$${(Number(row.voucherValues[0]?.rewardValue) / 100).toFixed(2)} Off`;
              }
              if (row.voucherValues[0]?.rewardType === "%_OFF") {
                return `${row.voucherValues[0]?.rewardValue}% Off`;
              }
            }
          }

        else{

          if (
            row.voucherValues[0]?.rewardType === "%_OFF"
          ) {
            return `${row.voucherValues[0]?.rewardValue}% Off`;
          }
          if (
            row.voucherValues[0]?.rewardType === "$_OFF"
          ) {

            return `$${(Number(row.voucherValues[0]?.rewardValue) / 100).toFixed(2)} Off`;
          }
          if (
            row.voucherValues[0]?.rewardType === "$_FIXED"
          ) {
            return `$${(Number(row.voucherValues[0]?.rewardValue) / 100).toFixed(2)} Off`;
          }
        }
      }
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

  const viewDetails = (value: string) => {
    dispatch(updateVoucherId(value))
    router.push("vouchers/view");
  };

  const handleCreateVoucher = () => {
    dispatch(updateVoucherType(""))
    router.push("/vouchers/create");
  };

  let content = null;

  if (isLoading) {
    content = <TableLoader />;
  }

  const clearSearch = () => {
    setSearch('')
  }

  if (data) {
    const searchEndAdorment = search ? <CloseIcon
      onClick={clearSearch}
      sx={{
        cursor: 'pointer'
      }} /> : <SearchOutlined />
    content = (
      <>
        <Grid
          item
          display="flex"
          justifyContent="space-between"
          lg={8}
          md={9}
          sm={9}
          mt={8}
          mb={4}
        >
          <Typography variant="h3" className={styles.heading}>
            Vouchers
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleCreateVoucher}
              variant="contained"
              className={styles.btn}
              data-testid="createVoucher"
            >
              <CreateIcon sx={{ marginRight: "5px" }} />
              Create new
            </Button>
            { lobType?.lob === "Online Groceries" ? null : 
            <Button
              onClick={() => router.push("/deals/managePromotions")}
              variant="outlined"
              className={styles.managePromotionsBtn}
            >
              <VisibilityOffIcon sx={{ marginRight: "5px" }} />
              Manage Promotions
            </Button>
            }
          </Stack>
        </Grid>
        <Grid
          item
          lg={8}
          md={9}
          sm={9}
          mt={8}
          mb={4}
          sx={{
            margin: "0px 0px 30px 0px",
          }}
        >
          <OutlinedInput
            sx={{
              minWidth: "350px",
            }}
            value={search}
            endAdornment={searchEndAdorment}
            placeholder="Search by code"
            onChange={handleSearchChange}
            inputProps={{
              "data-testId": "search",
            }}
          />
        </Grid>

        <Grid item lg={8} md={9} sm={9} mt={2}>
          <Card className={styles["deal-card"]}>
            <CardContent sx={{ padding: "0px" }}>
              <FilterVoucherSection />
              <DataTable
                persistTableHead
                data={data ? data.listOfVouchers : data}
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
                    ".MuiPaginationItem-text": {
                      color: "#276ADD",
                    },
                    ".Mui-selected": {
                      color: "#333333",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </>
    )
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
                noDataComponent={noDealsComponent}
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

  return (
    <Grid
      container
      justifyContent="center"
      direction="row"
      alignItems="center"
      className={styles.container}
      data-testid="vouchers"
    >
      {content}
      <Box>
        <Modal
          style={deleteDealStyles}
          isOpen={isOpen}
          onRequestClose={closeModal}
        >
          <DeleteVoucher
            closeModal={closeModal}
            selectedVouchers={selectedRows}
            refetch={refetch}
          />
        </Modal>
      </Box>
    </Grid>
  );
}

export default VoucherList;
