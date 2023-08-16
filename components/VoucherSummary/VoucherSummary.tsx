import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Switch,
  SwitchProps,
  Typography,
  Stack,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import StepTitle from "../StepTitle";
import styles from "../Summary/Summary.module.css";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  updateVoucherEditing,
  updateVoucherType,
  updatedVoucherEditing,
  updatedVoucherId,
} from "../../store/feature/voucher/voucherSlice";
import { useGetVoucherPreviewQuery } from "../../api/voucherPreview";
import { statusOptions, voucherTypeOptions } from "../../constants/FormOptions";
import { convertToEST } from "../../util/ConvertDateTime";
import { dealStatus } from "../../constants/DealStatus";
import { capitalizeWords } from "../../util/format";
import { userProfileState } from "../../store/feature/auth/authSlice";
import CreateVoucherForm from "../CreateVouchers/CreateVoucherForm";
import CustomTooltip from "../Tooltip";
import Modal from "react-modal";
import { styled } from "@mui/material/styles";
import EditDealModal from "../Summary/EditDealModal";
import { useCreateVoucherMutation } from "../../api/createVoucher";
import {
  notifySuccess,
  notifyError,
} from "../../util/Notification/Notification";
import { updateVoucherId } from "../../store/feature/voucher/voucherSlice";

const editDealStyles = {
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

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 65,
  height: 31,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      marginLeft: "22px",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#467E1B",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 26,
    height: 28,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#666B73" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function VoucherSummary() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVoucherActive, setIsVoucherActive] = useState<boolean>(true);
  const [noEditModal, setNoEditModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAppSelector(userProfileState);
  const voucherId = useAppSelector(updatedVoucherId);
  const isVoucherEditing = useAppSelector(updatedVoucherEditing);
  const { data, refetch } = useGetVoucherPreviewQuery({ voucherId, user });
  const [createVoucher] = useCreateVoucherMutation();
  const discountTypeDealLabel =
    data?.voucherValues?.rewardType === "%_OFF"
      ? "Percentage (%) off"
      : "Fixed off";

  const ToProperCase = (string: string) => {
    let str = string.replace(/_/g, " ");
    return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
  };

  const dealValue = (value: string, type: string) => {
    if (type === "$_OFF" || type === "$_FIXED") {
      return `$${(Number(value) / 100).toFixed(2)}`;
    }

    if (type === "%_OFF") {
      return `${value}%`;
    } else {
      return (Number(value) / 100).toFixed(2);
    }
  };

  const getDealValuePreview = (data: any) => {
    if (data?.voucherValues?.rewards) {
      if (!data?.voucherValues?.rewards[0]?.value) return "";

      const value = dealValue(
        data?.voucherValues?.rewards[0]?.value,
        data?.voucherValues?.rewardType
      );

      if (data?.voucherValues?.scopeType === "BASKET") {
        return `Spend $${(
          Number(data?.voucherExclusions?.spend?.minimum) / 100
        ).toFixed(2)} Get ${value} off`;
      }

      return `${value} off product(s)`;
    }
  };

  const downloadScopeExcel = (data: any) => {
    let mch: string[] = [];
    let liam: string[] = [];

    data.map((data: any) => {
      if (data.sub_type === "LIAM") {
        mch.push(data.value);
      }
      if (data.sub_type === "MCH") {
        liam.push(data.value);
      }
    });

    const csvMapping: string[] = [];
    if (mch) {
      mch.forEach((value: string) => {
        csvMapping.push(value);
      });
    }

    if (liam) {
      liam.forEach((value: string, index: number) => {
        const currentValue = csvMapping[index];
        csvMapping[index] = currentValue
          ? `${currentValue},${value}`
          : `,${value}`;
      });
    }

    let csvString = csvMapping.reduce((acc, cur) => `${acc}\n${cur}`);
    csvString = "data:application/csv," + encodeURIComponent(csvString);
    const x = document.createElement("A");
    x.setAttribute("href", csvString);
    x.setAttribute("download", "productList.csv");
    document.body.appendChild(x);
    x.click();
  };

  const downloadExcel = (value = {}) => {
    const { mch, liam }: any = value;
    const csvMapping: string[] = [];
    if (mch) {
      mch.forEach((value: string) => {
        csvMapping.push(value);
      });
    }

    if (liam) {
      liam.forEach((value: string, index: number) => {
        const currentValue = csvMapping[index];
        csvMapping[index] = currentValue
          ? `${currentValue},${value}`
          : `,${value}`;
      });
    }

    let csvString = csvMapping.reduce((acc, cur) => `${acc}\n${cur}`);
    csvString = "data:application/csv," + encodeURIComponent(csvString);
    const x = document.createElement("A");
    x.setAttribute("href", csvString);
    x.setAttribute("download", "productList.csv");
    document.body.appendChild(x);
    x.click();
  };

  const handleEditClick = () => {
    if (data?.voucherGeneralInfo?.status === "ENDED") {
      const payload = {
        code: data?.voucherGeneralInfo?.code,
        status: "DRAFT",
        is_serialized: false,
        username: user.name,
      };
      createVoucher(payload)
        .then((response: any) => {
          const { data: createVoucherResponseData, error } = response;
          if (createVoucherResponseData) {
            dispatch(updateVoucherEditing(true));
            dispatch(
              updateVoucherType(data?.voucherGeneralInfo?.type.toLowerCase())
            );
            dispatch(updateVoucherId(createVoucherResponseData.id));
            notifySuccess("Voucher successfully saved");
          }
          if (error) {
            notifyError(`Error: ${error?.data?.details}`, "duplicate-voucher");
          }
        })
        .catch((error: any) => {
          console.error(error);
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "voucher-failed"
          );
        });
    } else {
      dispatch(updateVoucherEditing(true));
      dispatch(updateVoucherType(data?.voucherGeneralInfo?.type.toLowerCase()));
    }
  };

  useEffect(() => {
    if (data?.voucherGeneralInfo?.status === "ACTIVE") {
      setIsVoucherActive(true);
    } else {
      setIsVoucherActive(false);
    }
  }, [data, router]);

  const handleChange = () => {
    setIsOpen(true);
    setNoEditModal(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const disableDeal = () => {
    setIsVoucherActive(!isVoucherActive);
  };

  let content = null;

  if (isVoucherEditing) {
    content = <CreateVoucherForm voucher={data} />;
  } else {
    content = (
      <>
        <Card className={styles["step-card-container"]}>
          <StepTitle title={"Voucher type"} />
          <Typography variant="h4" className={styles.heading} mt={4}>
            Type
          </Typography>
          <Typography>
            {voucherTypeOptions[data?.voucherGeneralInfo?.type]}
          </Typography>
        </Card>

        <Card className={styles["step-card-container"]}>
          <StepTitle title={"General information"} />

          <Grid container>
            <Grid item lg={12} md={9} sm={6} display="flex">
              <Grid item lg={7}>
                <Typography
                  data-testid="title"
                  variant="h4"
                  className={styles.heading}
                  mt={4}
                  mb={1}
                >
                  Voucher Code
                </Typography>
                <Typography className={styles.content}>
                  {data?.voucherGeneralInfo?.code}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Description
                </Typography>
                <Typography className={styles.content}>
                  {data?.voucherGeneralInfo?.description}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Priority
                </Typography>
                <Typography className={styles.content}>
                  {data?.voucherGeneralInfo?.priority}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Stacking type
                </Typography>
                <Typography className={styles.content}>
                  {ToProperCase(data?.voucherGeneralInfo?.stackingType || "")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Card className={styles["step-card-container"]}>
          <StepTitle title={"Voucher Value"} />

          <Grid container>
            <Grid item lg={12} md={9} sm={6} display="flex">
              <Grid item lg={7}>
                <Typography
                  data-testid="title"
                  variant="h4"
                  className={styles.heading}
                  mt={4}
                  mb={1}
                >
                  Is this at a basket level or product level?
                </Typography>
                <Typography className={styles.content}>
                  {capitalizeWords(data?.voucherValues?.scopeType || "")}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Type
                </Typography>

                {data?.voucherValues?.rewardType ? (
                  <>
                    <Typography className={styles.content}>
                      {data?.voucherValues?.rewardType === "$_OFF"
                        ? "Dollar ($) off"
                        : discountTypeDealLabel}
                    </Typography>
                  </>
                ) : null}

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Value
                </Typography>
                <Typography className={styles.content}>
                  {data?.voucherValues?.rewards
                    ? dealValue(
                        data?.voucherValues?.rewards[0]?.value,
                        data?.voucherValues?.rewardType
                      )
                    : null}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Customer Preview
                </Typography>
                <Typography className={styles.content}>
                  {getDealValuePreview(data)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Card className={styles["step-card-container"]}>
          <StepTitle title={"Date in effect"} />

          <Grid container>
            <Grid item lg={12} md={9} sm={6} display="flex">
              <Grid item lg={7}>
                <Typography
                  data-testid="title"
                  variant="h4"
                  className={styles.heading}
                  mt={4}
                  mb={1}
                >
                  Start Date
                </Typography>
                <Typography className={styles.content}>
                  {data?.vouchersDateInEffect?.validFrom
                    ? convertToEST(
                        data?.vouchersDateInEffect?.validFrom
                      ).format("MMMM D, YYYY [at] h:mm A z")
                    : null}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  End Date
                </Typography>
                <Typography className={styles.content}>
                  {data?.vouchersDateInEffect?.validTo
                    ? convertToEST(data?.vouchersDateInEffect?.validTo).format(
                        "MMMM D, YYYY [at] h:mm A z"
                      )
                    : null}
                </Typography>

                <Typography
                  variant="h4"
                  className={styles.heading}
                  mt={2}
                  mb={1}
                >
                  Customer preview
                </Typography>
                {data?.vouchersDateInEffect?.validFrom &&
                  data?.vouchersDateInEffect?.validTo && (
                    <Typography className={styles.content}>
                      Starts{" "}
                      {convertToEST(
                        data?.vouchersDateInEffect?.validFrom
                      ).format("MMMM D (h:mm A z)")}{" "}
                      and ends{" "}
                      {convertToEST(data?.vouchersDateInEffect?.validTo).format(
                        "MMMM D (h:mm A z)"
                      )}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {data?.vouchersProductsAndCollections?.scopes?.length > 0 ? (
          <Card className={styles["step-card-container"]}>
            <StepTitle title={"Applicable products for voucher"} />

            <Grid container>
              <Grid item lg={12} md={9} sm={6}>
                <Grid item lg={7}>
                  <Typography
                    data-testId="collection"
                    variant="h5"
                    className={styles.heading}
                    mt={4}
                    mb={1}
                  >
                    Collection
                  </Typography>
                  <Grid className={styles.downloadSection}>
                    <Button
                      data-testId="btn"
                      onClick={() =>
                        downloadScopeExcel(
                          data?.vouchersProductsAndCollections?.scopes
                        )
                      }
                      className={styles.downloadButton}
                      variant="contained"
                    >
                      Download products
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        ) : null}

        <Card className={styles["step-card-container"]}>
          <StepTitle
            title={
              data?.voucherValues?.scopeType === "PRODUCT"
                ? "Exclusions"
                : "Product applicability"
            }
          />

          <Grid container>
            <Grid item lg={12} md={9} sm={6}>
              <Grid item lg={7}>
                <Typography
                  variant="h5"
                  className={styles.heading}
                  mt={4}
                  mb={1}
                >
                  What items does this deal apply to?
                </Typography>
                <Typography className={styles.content}>
                  {data?.voucherExclusions?.priceApplicability?.value ===
                  "REGULAR_ONLY"
                    ? "Regular priced items only"
                    : "All"}
                </Typography>
                {data?.voucherExclusions?.product?.liam?.length > 0 ||
                data?.voucherExclusions?.product?.mch?.length > 0 ? (
                  <>
                    <Typography
                      variant="h5"
                      className={styles.heading}
                      mt={4}
                      mb={1}
                    >
                      Will there be additional products excluded from this deal?
                    </Typography>
                    <Typography className={styles.content}>Yes</Typography>
                    <Typography
                      variant="h5"
                      className={styles.heading}
                      mt={4}
                      mb={1}
                    >
                      Collection
                    </Typography>
                    <Grid className={styles.downloadSection}>
                      <Button
                        data-testId="exbtn"
                        onClick={() =>
                          downloadExcel(data?.voucherExclusions?.product)
                        }
                        className={styles.downloadButton}
                        variant="contained"
                      >
                        Download products
                      </Button>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Grid
          display="flex"
          justifyContent="space-between"
          ml={4}
          mb={4}
          mt={5}
          sx={{ margin: "1.3% 25%" }}
        >
          <Button
            data-testId="back"
            onClick={() => router.push("/vouchers")}
            className={styles.btn}
            variant="outlined"
          >
            Go Back
          </Button>
          <Button
            onClick={() => handleEditClick()}
            className={styles.btn}
            variant="contained"
          >
            {data?.voucherGeneralInfo?.status === "ENDED"
              ? "Re-create"
              : "Edit"}
          </Button>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid container>
        <Grid item lg={12} md={9} sm={6}>
          <Grid
            container
            display="flex"
            justifyContent="space-around"
            mb={4}
            mt={4}
          ></Grid>
          {!isVoucherEditing && (
            <Grid item lg={9} className={styles.titleContainer}>
              <Typography variant="h4" className={styles.title}>
                {data?.voucherGeneralInfo?.code}
              </Typography>
              <Typography mt={2} className={styles["sub-title"]}>
                voucher created on{" "}
                {data?.vouchersDateInEffect?.createdAt
                  ? convertToEST(data?.vouchersDateInEffect?.createdAt).format(
                      "MMMM D, YYYY [at] h:mm A z"
                    )
                  : null}
              </Typography>
              <Chip
                className={
                  data?.voucherGeneralInfo?.status === "INACTIVE"
                    ? styles.inactiveChip
                    : styles.Chip
                }
                sx={{
                  backgroundColor: dealStatus[data?.voucherGeneralInfo?.status],
                  mb: 1,
                  fontColor: "#000000",
                }}
                label={statusOptions[data?.voucherGeneralInfo?.status]}
              />
            </Grid>
          )}

          {/* Active and Inactive */}

          {data?.voucherGeneralInfo?.status === "ACTIVE" ||
          data?.voucherGeneralInfo?.status === "INACTIVE" ? (
            <Grid
              container
              mt={3}
              item
              lg={6}
              ml="25%"
              className={
                data?.voucherGeneralInfo?.status === "ACTIVE"
                  ? styles.toggleSection
                  : styles.toggleDisabledSection
              }
            >
              <Grid mt={1} item lg={5}>
                <Stack direction={"row"} gap={2}>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        data-testId="toggleClick"
                        checked={isVoucherActive}
                        sx={{ m: 1, marginLeft: "38%" }}
                        onChange={handleChange}
                      />
                    }
                    label=""
                  />
                  <Stack>
                    <Typography className={styles.activeHeading}>
                      {data?.voucherGeneralInfo?.status === "ACTIVE"
                        ? "ACTIVE"
                        : "DISABLED"}
                    </Typography>
                    <Typography className={styles.activePeriod}>
                      {data?.vouchersDateInEffect?.validTo
                        ? convertToEST(
                            data?.vouchersDateInEffect?.validTo
                          ).format("MMMM D, YYYY [at] h:mm A z")
                        : null}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item lg={7}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: "20px",
                  }}
                >
                  <CustomTooltip descriptionKey="VOUCHER_TOGGLE" />
                </Box>
              </Grid>
            </Grid>
          ) : null}

          {/* Active and Inactive */}

          <Grid>{content}</Grid>

          <Box>
            <Modal
              style={editDealStyles}
              isOpen={isOpen}
              onRequestClose={closeModal}
            >
              <EditDealModal
                closeModal={closeModal}
                isDealActive={isVoucherActive}
                disableDeal={disableDeal}
                data={data}
                dealId={voucherId}
                refetch={refetch}
              />
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default VoucherSummary;
