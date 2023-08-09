import React, { useEffect, useState } from "react";
import {
  Grid,
  SelectChangeEvent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import DoDisturbOutlinedIcon from "@mui/icons-material/DoDisturbOutlined";
import StepTitle from "../../StepTitle";
import StepLabel from "../../StepLabel";
import RadioGroupField from "../../FormComponents/RadioGroupField";
import Tag from "../../Tag";
import {
  dealApplyOptions,
  productCollectionTabs,
  dealLevelExclusionOptions,
} from "../../../constants/FormOptions";
import UploadExcel from "../ProductsCollection/UploadExcel/UploadExcel";
import ManuallyAdd from "../ProductsCollection/ManuallyAdd/ManuallyAdd";
import StyledTabs from "../../StyledTabs";
import { useFormContext, useWatch } from "react-hook-form";
import SelectField from "../../FormComponents/SelectField";
import exclusionStyles from "./Exclusions.module.css";
import StepperCard from "../StepperCard";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getIsEditing,
  updateDealLevel,
} from "../../../store/feature/deal/dealSlice";
import RemoveProductsModal from "../RemoveProductsModal";
import { updatedVoucherEditing } from "../../../store/feature/voucher/voucherSlice";

const Exclusions = ({ dealLevelName, deal, currentStep, totalSteps }: any) => {
  const [showRemoveProductsModal, setShowRemoveProductsModals] =
    useState<boolean>(false);
  const { control, setValue } = useFormContext();
  const dispatch = useAppDispatch();
  const isVoucherEditing = useAppSelector(updatedVoucherEditing);
  const isEditing = useAppSelector(getIsEditing);
  const dealOptions = useWatch({
    control,
    name: "dealLevelOptions",
  });

  const productExclusionsCollectionTab = useWatch({
    control,
    name: "productExclusionsCollectionTab",
  });

  const handleChange = ({ target: { value } }: SelectChangeEvent) => {
    if (value === "no") {
      setValue("exmch", []);
      setValue("exliam", []);
      setValue("exfile", null);
      setValue("productExclusionsCollectionTab", "uploadProduct");
    }
  };

  const handleTabUpdate = (newTab: string): void => {
    setValue("productExclusionsCollectionTab", newTab, {
      shouldValidate: true,
    });
  };

  let content = null;

  if (productExclusionsCollectionTab === "uploadProduct") {
    content = (
      <>
        <UploadExcel uploadStep="exfile" />
      </>
    );
  }

  if (productExclusionsCollectionTab === "addProduct") {
    content = (
      <>
        <ManuallyAdd mchValue="exmch" liamValue="exliam" />
      </>
    );
  }

  const closeModal = () => {
    setShowRemoveProductsModals(false);
  };

  useEffect(() => {
    if (deal?.dealValue?.scopeType) {
      dispatch(updateDealLevel(deal?.dealValue?.scopeType.toLowerCase()));
    }
  }, [deal]);

  return (
    <StepperCard step={"EXCLUSIONS"} inProgressIcon={DoDisturbOutlinedIcon}>
      <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
      <StepTitle
        title={
          dealLevelName === "product" ? "Exclusions" : "Product Applicability"
        }
      />
      <Tag label="Internal facing" extraSpacing />
      <Grid display="grid">
        <div className={exclusionStyles["deal-apply-container"]}>
          <SelectField
            options={dealApplyOptions}
            name="dealApplyType"
            title="What items does this deal apply to?"
            required
            inputHeight={true}
          />
        </div>
        {((isEditing && deal?.dealValue?.scopeType === "PRODUCT") ||
          isVoucherEditing) && (
          <Box marginBottom={2} mt={2}>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() => setShowRemoveProductsModals(true)}
            >
              Remove products
            </Button>
          </Box>
        )}
        {((isEditing && deal?.dealValue?.scopeType === "PRODUCT") ||
          isVoucherEditing) && (
          <Typography sx={{ marginBottom: "10px" }}>
            The Exclusions added in this step will be appended to existing
            Exclusions on the {isVoucherEditing ? "voucher" : "deal"}
          </Typography>
        )}
        {dealLevelName === "product" ? (
          <>
            <RadioGroupField
              noBottomGutters
              options={dealLevelExclusionOptions}
              label="Will there be additional products excluded from this deal?"
              name="dealLevelOptions"
              required={true}
              handleChange={handleChange}
            />
            {dealOptions === "yes" ? (
              <>
                <StyledTabs
                  tabs={productCollectionTabs}
                  handleTabUpdate={handleTabUpdate}
                  defaultValue={productExclusionsCollectionTab}
                />
                {content}
              </>
            ) : null}
          </>
        ) : null}
      </Grid>
      <RemoveProductsModal
        isOpen={showRemoveProductsModal}
        handleClose={closeModal}
        exclusions={true}
        isVoucher={isVoucherEditing}
      />
    </StepperCard>
  );
};

export default Exclusions;
