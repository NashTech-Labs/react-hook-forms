import React, { MouseEvent } from "react";
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
import { updateVoucherType } from "../../store/feature/voucher/voucherSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { getNewVoucherData, updateNewVoucher } from "../../store/feature/voucher/newVoucherSlice";
import moment from "moment";

const CreateVoucherForm = () => {

  const router = useRouter();

  const dispatch = useAppDispatch();

  const draftFormValues = useAppSelector(getNewVoucherData)

  const formMethods = useForm<ICreateVoucherFormState>({
    defaultValues: draftFormValues || createVoucherDefaultFormState,
    resolver: yupResolver(schema),
    mode: "all",
  });

  const {
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = formMethods

  const voucherLevel = getValues("voucherLevel");

  const handleBack = () => {
    dispatch(updateVoucherType(''))
  };

  const handleCancel = () => {
    dispatch(updateVoucherType(''))
    router.push("/vouchers");
  };

  const handleFormSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    const cleanForm = await trigger(undefined, { shouldFocus: true });

    if (cleanForm) {
      setValue("draftCreatedTimestamp", moment());
      dispatch(updateNewVoucher(formMethods.getValues()))
      router.push("/vouchers/create/summary");
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Grid className={commonStyles.mainSection}>
        <Grid container justifyContent="center">
          <Grid item lg={6} md={8} sm={9}>
            <Grid display="flex" justifyContent="space-between" mt={8}>
              <Typography
                data-testid="createDealTitle"
                variant="h3"
                className={commonStyles.heading}
              >
                Create New Promotional Voucher
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <GeneralInformation />
        <VoucherValue />
        {/* <NumberCodes /> */}
        <DateInEffect />
        {voucherLevel === "product" ? <ProductsCollection currentStep={6} totalSteps={7} /> : null}
        <Exclusions dealLevelName={voucherLevel} currentStep={voucherLevel === "product" ? 7 : 5} totalSteps={voucherLevel === "product" ? 7 : 5} />

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

      </Grid>
    </FormProvider>
  );
};

export default CreateVoucherForm;
