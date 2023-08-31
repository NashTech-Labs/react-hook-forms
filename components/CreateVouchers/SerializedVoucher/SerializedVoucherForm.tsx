import React, { MouseEvent, useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography, Chip } from "@mui/material";
import commonStyles from "../../CreateDeal/Steps.module.css";
import styles from "../../CreateDeal/CreateDealForm.module.css";
import GeneralInformation from "./GeneralInformation";
import createSerializedVoucherDefaultFormState from "../../../constants/SerializedVoucherDefaultFormState";
import { ICreateSerializedVoucherFormState } from "../../../constants/SerializedVoucherFormStateType";
import schema from "./SerializedVoucherValidationSchema";
import SerializedVoucherValue from "./SerializedVoucherValue";
import DateInEffect from "../../CreateDeal/DateInEffect/DateInEffect";
import {
  updateVoucherType,
  updatedVoucherEditing,
  updatedVoucherId,
  updatedVoucherType,
} from "../../../store/feature/voucher/voucherSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getNewVoucherData,
  updateNewVoucher,
} from "../../../store/feature/voucher/newVoucherSlice";
import moment from "moment";
import convertVoucherDataToFormData from "../../../util/convertVoucherToFormData";
import generalInformationStyles from "../CreateDeal/GeneralInformation.module.css";
import generateCreateVoucherPayload from "../../../util/createVoucherPayload";
import { userProfileState } from "../../../store/feature/auth/authSlice";
import { dealStatus } from "../../../constants/DealStatus";
import { convertToEST } from "../../../util/ConvertDateTime";
import { capitalizeWords } from "../../../util/format";
import { JOE_FRESH_LOB } from "../../../constants/lob";
import { lobState } from "../../../store/feature/selectlob/lobSlice";
import BannerRestrictions from "./BannerRestrictions";

interface ICreateVoucherFrom {
  voucher?: any;
}

const draftModalcustomStyles = {
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

const CreateVoucherForm = ({ voucher }: ICreateVoucherFrom) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [exitModal, setExitModal] = useState<boolean>(false);
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkForDuplicateInProgress, setCheckForDuplicateInProgress] =
    useState<boolean>(false);

  const [isSaveDisable, setIsSaveDisable] = useState<boolean>(false);

  const isVoucherEditing = useAppSelector(updatedVoucherEditing);
  const draftFormValues = useAppSelector(getNewVoucherData);
  const voucherId = useAppSelector(updatedVoucherId);
  const user = useAppSelector(userProfileState);
  const voucherType = useAppSelector(updatedVoucherType);
  const lobType = useAppSelector(lobState);
  const formDefaultValues = voucher
    ? convertVoucherDataToFormData(voucher)
    : draftFormValues || createSerializedVoucherDefaultFormState;
  const formMethods = useForm<ICreateSerializedVoucherFormState>({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
    mode: "all",
  });

  const {
    getValues,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = formMethods;
  const draftButtonLabel = isVoucherEditing ? "Save" : "Save as draft";
  const voucherLevel = getValues("voucherLevel");

  const externalVoucherCode = getValues("externalVoucherCode");

  const handleBack = () => {
    dispatch(updateVoucherType(""));
  };

  const handleCancel = () => {
    dispatch(updateVoucherType(""));
    router.push("/vouchers");
  };

  let headerContent = (
    <Grid container sx={{ margin: "3.3% 25%" }}>
      <Grid item lg={6} md={6} sm={6}>
        <Typography
          data-testid="createVocuherTitle"
          variant="h3"
          className={commonStyles.heading}
        >
          Create New Serialized Voucher
        </Typography>
      </Grid>
      {/* {
        <Grid item lg={6} md={6} sm={6}>
          <Button
            data-testid="draft-btn"
            variant="contained"
            className={generalInformationStyles.draftBtn}
            onClick={() => handleDraftSave()}
            disabled={
              checkForDuplicateInProgress || submitting || isSaveDisable
            }
          >
            {draftButtonLabel}
          </Button>
        </Grid>
      } */}
    </Grid>
  );

  let ctaContent = (
    <div className={styles["submit-btn-container"]}>
      <div>
        <Button
          variant="outlined"
          className={commonStyles["cancelBtn"]}
          onClick={handleCancel}
          ata-testid="cancel-btn"
        >
          Cancel
        </Button>
      </div>
      <div className={styles["submit-container"]}>
        <Button
          variant="text"
          onClick={handleBack}
          className={commonStyles["text-style-btn"]}
          data-testid="back-btn"
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          className={commonStyles["continueBtn"]}
          // onClick={(e) => handleFormSubmit(e)}
          data-testid="continue-btn"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  //   if (isVoucherEditing) {
  //     ctaContent = (
  //       <div className={styles["submit-btn-container"]}>
  //         <div>
  //           <Button
  //             variant="outlined"
  //             className={commonStyles["cancelBtn"]}
  //             onClick={() => handleEditCancel()}
  //             ata-testid="cancel-btn"
  //           >
  //             Cancel
  //           </Button>
  //         </div>
  //         <div className={styles["submit-container"]}>
  //           <Button
  //             variant="contained"
  //             className={commonStyles["continueBtn"]}
  //             onClick={(e) => handleFormSubmit(e)}
  //             data-testid="continue-btn"
  //           >
  //             Save
  //           </Button>
  //         </div>
  //       </div>
  //     );

  //     headerContent = (
  //       <>
  //         <Grid
  //           container
  //           justifyContent="space-between"
  //           className={generalInformationStyles["heading-container"]}
  //         >
  //           <Grid item lg={5} md={5} sm={5}>
  //             <Typography
  //               variant="h3"
  //               className={generalInformationStyles.heading}
  //               data-testid="form-title"
  //             >
  //               {voucher?.voucherGeneralInfo?.code || externalVoucherCode}
  //             </Typography>
  //           </Grid>
  //           <Grid item lg={7} md={7} sm={7}>
  //             <Button
  //               data-testid="draft-btn"
  //               variant="contained"
  //               className={generalInformationStyles.draftBtn}
  //               onClick={() => handleDraftSave()}
  //             >
  //               {draftButtonLabel}
  //             </Button>
  //           </Grid>
  //         </Grid>
  //         <Typography className={generalInformationStyles.draftTime}>
  //           voucher created on
  //           {voucher?.vouchersDateInEffect?.createdAt
  //             ? convertToEST(voucher?.vouchersDateInEffect?.createdAt).format(
  //                 "MMMM D, YYYY [at] h:mm A z"
  //               )
  //             : null}
  //         </Typography>
  //         <Chip
  //           className={
  //             voucher?.voucherGeneralInfo?.status === "INACTIVE"
  //               ? generalInformationStyles.inactiveChip
  //               : generalInformationStyles.Chip
  //           }
  //           sx={{
  //             margin: "0 25%",
  //             backgroundColor: dealStatus[voucher?.voucherGeneralInfo?.status],
  //             mb: 1,
  //             fontColor: "#000000",
  //           }}
  //           label={
  //             voucher?.voucherGeneralInfo?.status
  //               ? capitalizeWords(voucher?.voucherGeneralInfo?.status)
  //               : null
  //           }
  //         />
  //       </>
  //     );
  //   }

  return (
    <FormProvider {...formMethods}>
      <Grid className={commonStyles.mainSection}>
        {headerContent}
        <GeneralInformation
          isVoucherEditing={isVoucherEditing}
          currentStep={2}
          totalSteps={voucherLevel === "basket" ? 9 : 10}
          setCheckForDuplicateInProgress={setCheckForDuplicateInProgress}
        />
        <BannerRestrictions
          currentStep={3}
          totalSteps={voucherLevel === "basket" ? 9 : 10}
        />
        <SerializedVoucherValue
          currentStep={4}
          totalSteps={voucherLevel === "basket" ? 9 : 10}
        />
      </Grid>
      {ctaContent}
    </FormProvider>
  );
};

export default CreateVoucherForm;
