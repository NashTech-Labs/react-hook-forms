import React from "react";
import { Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import styles from "./DraftModal.module.css";
import commonStyles from "./Steps.module.css";
import { useAppDispatch } from "../../store";
import { updateDraftDeal } from "../../store/feature/deal/draftDealSlice";
import {
  updateDealEditing,
  updateDealStep,
} from "../../store/feature/deal/dealSlice";
import CreateDealDefaultFormState from "../../constants/CreateDealDefaultFormState";
import createVoucherDefaultFormState from "../../constants/CreateVoucherDefaultFormState";
import { updateNewDeal } from "../../store/feature/deal/newDealSlice";
import {
  updateVoucherEditing,
  updateVoucherType,
} from "../../store/feature/voucher/voucherSlice";
import { updateNewVoucher } from "../../store/feature/voucher/newVoucherSlice";

interface IDraftModal {
  loading: boolean;
  closeModal: Function;
  isVoucher?: boolean;
}

const DraftModal = ({ loading, closeModal, isVoucher }: IDraftModal) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleExit = () => {
    closeModal();
    if (isVoucher) {
      router.push("/vouchers");
      dispatch(updateDraftDeal({}));
      dispatch(updateVoucherEditing(false));
      dispatch(updateVoucherType(""));
      dispatch(updateNewVoucher(createVoucherDefaultFormState));
      return;
    }
    router.push("/deals");
    dispatch(updateDraftDeal({}));
    dispatch(updateDealEditing(false));
    dispatch(updateDealStep(""));
    dispatch(updateNewDeal(CreateDealDefaultFormState));
  };

  const handleClose = () => {
    closeModal();
  };

  let content = null;
  if (loading) {
    content = (
      <div className={styles["draft-modal-saving"]}>
        <div className={styles["save-text"]}>Saving progress...</div>
        <div>
          <CircularProgress thickness={5} size={70} />
        </div>
      </div>
    );
  } else {
    content = (
      <div>
        <Typography className={styles["draft-modal-heading"]}>
          Saved. How would you like to proceed?
        </Typography>
        <div className={styles["btn-container"]}>
          <Button
            data-testid="exit-btn"
            variant="contained"
            className={commonStyles.cancelBtn}
            onClick={handleExit}
          >
            Just exit
          </Button>
          <Button
            variant="contained"
            className={commonStyles.continueBtn}
            onClick={handleClose}
          >
            Continue editing {isVoucher ? "voucher" : "deal"}
          </Button>
        </div>
      </div>
    );
  }

  return content;
};

export default DraftModal;
