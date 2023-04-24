import React from "react";
import CreateDealForm from "../../../components/CreateDeal/CreateDealForm";
import CreateDeal from "../../../components/CreateDeal/CreateDeal";
import { updatedDealStep } from "../../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../../store/index";
import { MULTI_BUY_DEAL_TYPE, DISCOUNT_DEAL_TYPE, FREE_SHIPPING_DEAL_TYPE } from '../../../constants/FormOptions'

const CreateNewDeal = () => {
  const dealName = useAppSelector(updatedDealStep);

  return (
    <>
      {dealName === DISCOUNT_DEAL_TYPE || dealName === MULTI_BUY_DEAL_TYPE || dealName === FREE_SHIPPING_DEAL_TYPE ? (
        <>
          <CreateDealForm />
        </>
      ) : (
        <CreateDeal />
      )}
    </>
  );
};

export default CreateNewDeal;
