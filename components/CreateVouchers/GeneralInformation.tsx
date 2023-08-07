import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import FeedIcon from "@mui/icons-material/Feed";
import StepperCard from "../CreateDeal/StepperCard";
import SelectField from "../FormComponents/SelectField";
import TextInputField from "../FormComponents/TextInputField";
import { stackTypeOptionsVouchers } from "../../constants/FormOptions";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import Tag from "../Tag";
import { useAppSelector, useAppDispatch } from "../../store";
import { getUser } from "../../store/feature/auth/authSlice";
import { useCreateVoucherMutation } from "../../api/createVoucher";
import { updateVoucherId } from "../../store/feature/voucher/voucherSlice";

interface numbersOfSteps {
  isVoucherEditing: boolean;
  currentStep: number;
  totalSteps: number;
}

const GeneralInformation = ({
  isVoucherEditing,
  currentStep,
  totalSteps,
}: numbersOfSteps) => {
  const dispatch = useAppDispatch();

  const [previousVoucherCode, setPreviousVoucherCode] = useState<any>(null);
  const {
    setValue,
    setError,
    formState: { errors },
  } = useFormContext();
  const user = useAppSelector(getUser);
  const [createVoucher] = useCreateVoucherMutation();
  const checkForDuplicateVouchers = async (code: string) => {
    const payload = {
      code: code.toUpperCase(),
      status: "DRAFT",
      is_serialized: false,
      username: user.userProfile.name,
    };
    createVoucher(payload).then((response: any) => {
      const { data, error } = response;
      if (data) {
        dispatch(updateVoucherId(data.id));
      }
      if (error) {
        setError("externalVoucherCode", {
          message: "Error: " + error?.data?.details,
        });
      }
    });
  };

  const customHandleBlur = (value: string) => {

    if (value.length > 23) {
      return;
    }

    if (!value) {
      return;
    }

    setValue("externalVoucherCode", value);
    if (previousVoucherCode !== value) {
      checkForDuplicateVouchers(value);
    }
    setPreviousVoucherCode(value);
  };

  return (
    <StepperCard inProgressIcon={FeedIcon} error step={"GENERAL_INFORMATION"}>
      <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
      <StepTitle title={"General Information"} />
      <Tag label="Internal facing" />
      <TextInputField
        title="External Voucher Code"
        description="Max 22 characters"
        placeholder="eg. Sasha20"
        name="externalVoucherCode"
        disabled={isVoucherEditing}
        required
        inputHeight={true}
        tooltipKey={""}
        customHandleBlur={customHandleBlur}
      />
      <TextInputField
        title="Description"
        placeholder="Enter description for voucher"
        multiline
        name="description"
        tooltipKey={""}
      />
      <TextInputField
        title="Priority"
        description="Numeric value must be 1 to 100"
        placeholder="eg 100"
        name="priority"
        required
        type="number"
        inputHeight={true}
        tooltipKey={"PRIORITY"}
      />
      <SelectField
        options={stackTypeOptionsVouchers}
        name="stackingType"
        title="Stacking Type"
        required
        inputHeight={true}
        tooltipKey={"STACKING_TYPE"}
      />
    </StepperCard>
  );
};

export default GeneralInformation;
