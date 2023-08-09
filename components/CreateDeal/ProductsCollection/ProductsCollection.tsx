import React, { useState } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import Tag from "../../Tag";
import StyledTabs from "../../StyledTabs";
import UploadExcel from "./UploadExcel/UploadExcel";
import ManuallyAdd from "./ManuallyAdd/ManuallyAdd";
import { productCollectionTabs } from "../../../constants/FormOptions";
import StepperCard from "../StepperCard";
import { useAppSelector } from "../../../store";
import { getIsEditing } from "../../../store/feature/deal/dealSlice";
import RemoveProductsModal from "../RemoveProductsModal";
import { updatedVoucherEditing } from "../../../store/feature/voucher/voucherSlice";

function ProductsCollection({ currentStep, totalSteps }: any) {
  const [showRemoveProductsModal, setShowRemoveProductsModals] =
    useState<boolean>(false);
  const { setValue, control } = useFormContext();

  const isVoucherEditing = useAppSelector(updatedVoucherEditing);
  const isEditing = useAppSelector(getIsEditing);
  const productsCollectionTab = useWatch({
    control,
    name: "productsCollectionTab",
  });

  const handleTabUpdate = (newTab: string): void => {
    setValue("productsCollectionTab", newTab, { shouldValidate: true });
  };

  let content = null;

  if (productsCollectionTab === "uploadProduct") {
    content = (
      <>
        <UploadExcel uploadStep="file" />
      </>
    );
  }

  if (productsCollectionTab === "addProduct") {
    content = (
      <>
        <ManuallyAdd mchValue="mch" liamValue="liam" />
      </>
    );
  }

  const closeModal = () => {
    setShowRemoveProductsModals(false);
  };

  const isEditFlow = isEditing || isVoucherEditing;
  return (
    <>
      <StepperCard
        step={"PRODUCTS_AND_COLLECTIONS"}
        inProgressIcon={CheckroomOutlinedIcon}
      >
        <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
        <StepTitle title={"Products and Collections"} />
        <Tag label="Internal facing" />
        {isEditFlow && (
          <Box marginBottom={3} marginTop={2}>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() => setShowRemoveProductsModals(true)}
            >
              Remove products
            </Button>
          </Box>
        )}
        {isEditFlow && (
          <Box
            sx={{
              backgroundColor: "#E6ECF6",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <Stack>
              <Typography sx={{ fontWeight: 600 }}>Please note:</Typography>
              <Typography sx={{ fontWeight: 400 }}>
                Newly added LIAMs will be appended to the existing list. If no
                new products are added the old list of LIAMs will be applicable
                after you save your changes
              </Typography>
            </Stack>
          </Box>
        )}
        <StyledTabs
          tabs={productCollectionTabs}
          handleTabUpdate={handleTabUpdate}
          defaultValue={productsCollectionTab}
        />
        {content}
      </StepperCard>
      <RemoveProductsModal
        isOpen={showRemoveProductsModal}
        handleClose={closeModal}
        isVoucher={isVoucherEditing}
      />
    </>
  );
}

export default ProductsCollection;
