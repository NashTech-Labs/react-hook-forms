import React, { MouseEvent, useState } from "react";
import Modal from "react-modal";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography } from "@mui/material";
import commonStyles from "../CreateDeal/Steps.module.css";
import styles from "../CreateDeal/CreateDealForm.module.css";
import GeneralInformation from "./GeneralInformation";
import createVoucherDefaultFormState from "../../constants/CreateVoucherDefaultFormState";
import { ICreateVoucherFormState } from "../../constants/CreateVoucherFormStateType";
import schema from "./CreateVoucherValidationSchema";
import VoucherValue from "./VoucherValue";
// import ReportingInformation from './ReportingInformation';
import DateInEffect from "../CreateDeal/DateInEffect/DateInEffect";
import NumberCodes from "./numberCodes/NumberCodes";
import ProductsCollection from "../CreateDeal/ProductsCollection/ProductsCollection";
import Exclusions from "../CreateDeal/Exclusions/Exclusions";
import { useRouter } from "next/router";
import {
  updateVoucherType,
  updatedVoucherEditing,
  updatedVoucherId,
} from "../../store/feature/voucher/voucherSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  getNewVoucherData,
  updateNewVoucher,
} from "../../store/feature/voucher/newVoucherSlice";
import moment from "moment";
import convertVoucherDataToFormData from "../../util/convertVoucherToFormData";
import ExitEditModal from "../CreateDeal/ExitEditModal";
import { EDIT_SCENARIO_FILED_EXCEPTIONS } from "../../constants/FormOptions";
import generalInformationStyles from "../CreateDeal/GeneralInformation.module.css";
import { useEditVoucherMutation } from "../../api/editVoucher";
import generateCreateVoucherPayload from "../../util/createVoucherPayload";
import { userProfileState } from "../../store/feature/auth/authSlice";
import {
  notifyError,
  notifySuccess,
} from "../../util/Notification/Notification";
import DraftModal from "../CreateDeal/DraftModal";

interface ICreateVoucherFrom {
  voucher?: object;
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

  const isVoucherEditing = useAppSelector(updatedVoucherEditing);
  const draftFormValues = useAppSelector(getNewVoucherData);
  const voucherId = useAppSelector(updatedVoucherId);
  const user = useAppSelector(userProfileState);
  const [editVoucher] = useEditVoucherMutation();
  const formDefaultValues = voucher
    ? convertVoucherDataToFormData(voucher)
    : draftFormValues || createVoucherDefaultFormState;

  const formMethods = useForm<ICreateVoucherFormState>({
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
  const draftButtonLabel = voucherId ? "Save" : "Save as draft";
  const voucherLevel = getValues("voucherLevel");

  const handleBack = () => {
    dispatch(updateVoucherType(""));
  };

  const handleCancel = () => {
    dispatch(updateVoucherType(""));
    router.push("/vouchers");
  };

  const handleFormSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    const cleanForm = await trigger(undefined, { shouldFocus: true });

    if (errors.externalVoucherCode) {
      setError("externalVoucherCode", {
        message: "Error: " + errors?.externalVoucherCode?.message,
      });
    }

    const cleanFormForEditScenario = Object.keys(errors).every((error) =>
      EDIT_SCENARIO_FILED_EXCEPTIONS.includes(error)
    );

    if (cleanForm && !errors.externalVoucherCode) {
      setValue("draftCreatedTimestamp", moment());
      dispatch(updateNewVoucher(formMethods.getValues()));
      router.push("/vouchers/create/summary");
    }
  };

  const handleEditCancel = () => {
    setExitModal(true);
  };

  const handleExitModalClose = () => {
    setExitModal(false);
  };

  const closeDraftModal = () => {
    setShowDraftModal(false);
  };

  const handleDraftSave = async () => {
    const editPayloadData = generateCreateVoucherPayload(getValues(), true);
    const formattedPayloadWithUser = {
      ...editPayloadData,
      voucherId,
      username: user?.name,
    };
    setShowDraftModal(true);
    setSubmitting(true);
    await editVoucher(formattedPayloadWithUser)
      .unwrap()
      .then((data) => {
        if (data) {
          notifySuccess("Voucher successfully saved");
          dispatch(updateNewVoucher(createVoucherDefaultFormState));
        }
      })
      .catch((error: any) => {
        notifyError(
          error.data?.details ? error.data?.details : "Something went wrong",
          "voucher-failed"
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

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
          onClick={(e) => handleFormSubmit(e)}
          data-testid="continue-btn"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  if (isVoucherEditing) {
    ctaContent = (
      <div className={styles["submit-btn-container"]}>
        <div>
          <Button
            variant="outlined"
            className={commonStyles["cancelBtn"]}
            onClick={() => handleEditCancel()}
            ata-testid="cancel-btn"
          >
            Cancel
          </Button>
        </div>
        <div className={styles["submit-container"]}>
          <Button
            variant="contained"
            className={commonStyles["continueBtn"]}
            onClick={(e) => handleFormSubmit(e)}
            data-testid="continue-btn"
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Grid className={commonStyles.mainSection}>
        <Grid container sx={{ margin: "3.3% 25%" }}>
          <Grid item lg={6} md={6} sm={6}>
            <Typography
              data-testid="createVocuherTitle"
              variant="h3"
              className={commonStyles.heading}
            >
              Create New Promotional Voucher
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6}>
            <Button
              data-testid="draft-btn"
              variant="contained"
              className={generalInformationStyles.draftBtn}
              onClick={() => handleDraftSave()}
            >
              {draftButtonLabel}
            </Button>
          </Grid>
        </Grid>
        <GeneralInformation
          isVoucherEditing={isVoucherEditing}
          currentStep={2}
          totalSteps={voucherLevel === "basket" ? 5 : 6}
        />
        <VoucherValue
          currentStep={3}
          totalSteps={voucherLevel === "basket" ? 5 : 6}
        />
        {/* <NumberCodes /> */}
        <DateInEffect
          currentStep={4}
          totalSteps={voucherLevel === "basket" ? 5 : 6}
        />
        {voucherLevel === "product" ? (
          <ProductsCollection currentStep={5} totalSteps={6} />
        ) : null}
        <Exclusions
          dealLevelName={voucherLevel}
          currentStep={voucherLevel === "product" ? 6 : 5}
          totalSteps={voucherLevel === "product" ? 6 : 5}
        />

        {ctaContent}

        <Modal
          style={draftModalcustomStyles}
          isOpen={exitModal}
          onRequestClose={handleExitModalClose}
        >
          <ExitEditModal
            closeModal={handleExitModalClose}
            isVoucherEditing={true}
          />
        </Modal>
      </Grid>
      <Modal
        style={draftModalcustomStyles}
        isOpen={showDraftModal}
        onRequestClose={closeDraftModal}
      >
        <DraftModal
          loading={submitting}
          closeModal={closeDraftModal}
          isVoucher={true}
        />
      </Modal>
    </FormProvider>
  );
};

export default CreateVoucherForm;
