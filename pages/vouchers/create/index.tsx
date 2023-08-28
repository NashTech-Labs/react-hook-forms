import React from "react";
import CreateVoucher from "../../../components/CreateVouchers/CreateVoucher";
import { useAppSelector } from "../../../store/index";
import { updatedVoucherType } from "../../../store/feature/voucher/voucherSlice";
import CreateVoucherForm from "../../../components/CreateVouchers/CreateVoucherForm";
import SerializedVoucherForm from "../../../components/CreateVouchers/SerializedVoucher/SerializedVoucherForm";

function CreateNewVoucher() {
  const voucherType = useAppSelector(updatedVoucherType);
  return (
    <>
      {voucherType === "promotional" && <CreateVoucherForm />}
      {voucherType === "serialized" && <SerializedVoucherForm />}
      {!voucherType && <CreateVoucher />}
    </>
  );
}

export default CreateNewVoucher;
