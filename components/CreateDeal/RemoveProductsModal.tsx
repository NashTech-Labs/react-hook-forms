import React, {
  ChangeEvent,
  MouseEventHandler,
  useState,
  useMemo,
  useCallback,
} from "react";
import Modal from "react-modal";
import { useFormContext } from "react-hook-form";
import DataTable from "react-data-table-component";
import {
  Typography,
  Stack,
  OutlinedInput,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useAppSelector } from "../../store";
import { updatedDealId } from "../../store/feature/deal/dealSlice";
import { useGetDealPreviewQuery } from "../../api/dealPreview";
import styles from "./RemoveProductsModal.module.css";
import { userProfileState } from "../../store/feature/auth/authSlice";
import { useGetVoucherPreviewQuery } from "../../api/voucherPreview";
import { updatedVoucherId } from "../../store/feature/voucher/voucherSlice";

// const PAGE_SIZE = 10;

const draftModalcustomStyles = {
  content: {
    width: "800px",
    top: "50%",
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
  headCells: {
    style: {
      backgroundColor: "#F0F0F0",
      borderBottom: "3px solid #666B73",
      fontSize: "16px",
      fontWeight: "bolder", // override the cell padding for head cells
    },
  },
  table: {
    style: {
      height: "515px",
    },
  },
};

interface IRemoveProductsModal {
  isOpen: boolean;
  handleClose: MouseEventHandler;
  exclusions?: boolean;
  isVoucher?: boolean;
}

const RemoveProductsModal = ({
  isOpen,
  handleClose,
  exclusions,
  isVoucher,
}: IRemoveProductsModal) => {
  const { getValues, setValue } = useFormContext();
  const [search, setSearch] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const user = useAppSelector(userProfileState);
  const dealId = useAppSelector(updatedDealId);
  const voucherId = useAppSelector(updatedVoucherId);
  const { data } = useGetDealPreviewQuery(
    { dealId, user },
    { skip: isVoucher }
  );
  const { data: voucherData } = useGetVoucherPreviewQuery(
    { voucherId, user },
    { skip: !isVoucher }
  );

  const handleSearchChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
  };
  const handleChange = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleCancelConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const onClose = (e: any) => {
    const {
      removeMchList = [],
      removeLiamList = [],
      removeLiamExclusionsList = [],
      removeMchExclusionsList = [],
    } = getValues();
    if (exclusions) {
      const newExMch: Array<any> = [];
      const newExLiam: Array<any> = [];

      const combinedRemovalForExclusions = [
        ...removeLiamExclusionsList,
        ...removeMchExclusionsList,
      ].map(({ value }) => value);

      let existingExclusionsMch = data?.exclusion?.product?.mch;
      let existingExclusionsLiam = data?.exclusion?.product?.liam;

      if (isVoucher) {
        existingExclusionsMch = voucherData?.voucherExclusions?.product?.mch;
        existingExclusionsLiam = voucherData?.voucherExclusions?.product?.liam;
      }

      existingExclusionsMch?.forEach((mch: string) => {
        !combinedRemovalForExclusions.includes(mch) && newExMch.push(mch);
      });
      existingExclusionsLiam?.forEach((liam: string) => {
        !combinedRemovalForExclusions.includes(liam) && newExLiam.push(liam);
      });

      setValue("exmch", newExMch, { shouldValidate: true });
      setValue("exliam", newExLiam, { shouldValidate: true });
    } else {
      const newMch: Array<any> = [];
      const newLiam: Array<any> = [];

      let existingScopes = data?.dealValue?.scopeValue;
      if (isVoucher) {
        existingScopes = voucherData?.vouchersProductsAndCollections?.scopes;
      }

      const combinedRemovalForInclusions = [
        ...removeMchList,
        ...removeLiamList,
      ].map(({ value }) => value);

      existingScopes?.forEach((scope: any) => {
        const { value, sub_type } = scope;
        if (!combinedRemovalForInclusions.includes(value)) {
          if (sub_type === "MCH") {
            newMch.push(value);
          } else {
            newLiam.push(value);
          }
        }
      });

      setValue("mch", newMch, { shouldValidate: true });
      setValue("liam", newLiam, { shouldValidate: true });
    }

    handleClose(e);
  };

  let records: Array<{ value: string; type: string; id: string }> = [];

  if (exclusions) {
    let mch = data?.exclusion?.product?.mch || [];
    let liam = data?.exclusion?.product?.liam || [];
    if (isVoucher) {
      mch = voucherData?.voucherExclusions?.product?.mch || [];
      liam = voucherData?.voucherExclusions?.product?.liam || [];
    }
    mch.forEach((value: string) => {
      records.push({
        value,
        type: "mch",
        id: value,
      });
    });
    liam.forEach((value: string) => {
      records.push({
        value,
        type: "liam",
        id: value,
      });
    });
  } else {
    records = isVoucher
      ? voucherData?.vouchersProductsAndCollections?.scopes || []
      : data?.dealValue?.scopeValue || [];
  }

  const handleDeleteProducts = async () => {
    const productsToBeRemoved = selectedRows.map(
      ({ value }: { value: string }) => value
    );
    const mch: Array<any> = [];
    const liam: Array<any> = [];
    const removeMchList = getValues("removeMchList") || [];
    const removeLiamList = getValues("removeLiamList") || [];
    const removeMchExclusionsList = getValues("removeMchExclusionsList") || [];
    const removeLiamExclusionsList =
      getValues("removeLiamExclusionsList") || [];

    if (exclusions) {
      records.forEach((record) => {
        const { type, value } = record;
        if (type === "mch" && productsToBeRemoved.includes(value)) {
          mch.push(record);
        } else if (type === "liam" && productsToBeRemoved.includes(value)) {
          liam.push(record);
        }
      });
      setValue(
        "removeMchExclusionsList",
        [...removeMchExclusionsList, ...mch],
        {
          shouldValidate: true,
        }
      );
      setValue(
        "removeLiamExclusionsList",
        [...removeLiamExclusionsList, ...liam],
        {
          shouldValidate: true,
        }
      );
    } else {
      const scopes = isVoucher
        ? voucherData?.vouchersProductsAndCollections?.scopes
        : data?.dealValue?.scopeValue;
      scopes.forEach((scope: { value: string; sub_type: string }) => {
        const { value, sub_type } = scope;
        if (productsToBeRemoved.includes(value)) {
          if (sub_type === "MCH") {
            mch.push(scope);
          } else if (sub_type === "LIAM") {
            liam.push(scope);
          }
        }
      });
      setValue("removeMchList", [...removeMchList, ...mch], {
        shouldValidate: true,
      });
      setValue("removeLiamList", [...removeLiamList, ...liam], {
        shouldValidate: true,
      });
    }

    setShowConfirmation(false);
    setConfirmationMessage(
      "Products deleted. Deleted products will need to be uploaded by LIAM or MCH to be featured in this promotion again."
    );
  };

  const columns: any = useMemo(
    () => [
      {
        name: "Products",
        selector: (row: any) => row.value,
      },
    ],
    []
  );

  let tableData: Array<{ value: string }> = [];

  if (data || voucherData) {
    if (confirmationMessage) {
      const removeMchList = getValues("removeMchList") || [];
      const removeLiamList = getValues("removeLiamList") || [];
      const removeMchExclusionsList =
        getValues("removeMchExclusionsList") || [];
      const removeLiamExclusionsList =
        getValues("removeLiamExclusionsList") || [];
      const combinedList = [
        ...removeMchList,
        ...removeLiamList,
        ...removeMchExclusionsList,
        ...removeLiamExclusionsList,
      ].map(({ value }) => value);
      tableData = records.filter(({ value }) => {
        return !combinedList.includes(value);
      });
    } else if (search) {
      tableData = records.filter(({ value }: { value: string }) =>
        value.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      tableData = records;
    }
  }

  let content = null;

  if (showConfirmation) {
    content = (
      <Stack spacing={2}>
        <Typography variant="h5">
          Are you sure you wish to permanently remove these product(s) from this
          promotion?
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            className={styles.cancelBtn}
            onClick={handleCancelConfirmation}
            data-testid="no-cancel-btn"
          >
            No, cancel
          </Button>
          <Button
            variant="contained"
            className={styles.confirmationBtn}
            onClick={handleDeleteProducts}
          >
            Yes, remove products(s)
          </Button>
        </Stack>
      </Stack>
    );
  } else {
    content = (
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">
            Remove applicable products for promotion
          </Typography>
          <IconButton>
            <CloseIcon onClick={onClose} />
          </IconButton>
        </Stack>
        {confirmationMessage && (
          <Box className={styles.confirmationMessage}>
            <Stack direction="row" alignItems="center">
              <ErrorOutlineOutlinedIcon sx={{ color: "#E1251B" }} />
              <Typography padding={1} sx={{ fontWeight: 600 }}>
                {confirmationMessage}
              </Typography>
            </Stack>
          </Box>
        )}
        <OutlinedInput
          sx={{
            minWidth: "350px",
            height: "40px",
          }}
          endAdornment={<SearchOutlined />}
          placeholder="Search by LIAM or MCH"
          value={search}
          onChange={handleSearchChange}
          inputProps={{
            "data-testId": "search",
          }}
        />
        <DataTable
          responsive
          persistTableHead
          data={tableData}
          highlightOnHover
          columns={columns}
          customStyles={customStyles}
          selectableRows
          onSelectedRowsChange={handleChange}
          pagination
        />
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="outlined"
            sx={{
              color: "#333333",
              border: "1px solid #CCCCCC",
              width: "fit-content",
              textTransform: "none",
            }}
            onClick={handleDeleteClick}
            data-testId="delete-btn"
          >
            Delete selected
          </Button>
          {/* <Pagination
            page={page}
            count={Math.ceil(tableData?.length / 10)}
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
          /> */}
        </Stack>
      </Stack>
    );
  }
  return (
    <Modal
      style={draftModalcustomStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
};

export default RemoveProductsModal;
