import React from 'react'
import CreateVoucher from '../../../components/CreateVouchers/CreateVoucher'
import { useAppSelector } from "../../../store/index";
import { updatedVoucherType } from '../../../store/feature/voucher/voucherSlice';
import CreateVoucherForm from '../../../components/CreateVouchers/CreateVoucherForm';

function CreateNewVoucher() {

    const voucherType = useAppSelector(updatedVoucherType);

    return (
        <>
            {voucherType === 'promotional' || voucherType === 'serialized' ?
                <CreateVoucherForm />
                : <CreateVoucher />
            }
        </>
    )
}

export default CreateNewVoucher