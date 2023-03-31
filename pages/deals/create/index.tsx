import React from "react";
import CreateDealForm from "../../../components/CreateDeal/CreateDealForm";
import CreateDeal from "../../../components/CreateDeal/CreateDeal";
import { updatedDealStep } from "../../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../../store/index";

const CreateNewDeal = () => {
  const dealName = useAppSelector(updatedDealStep);

  return (
    <>
      {dealName === "discount" || dealName === "multi-buy" || dealName === "free-shipping" ? (
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
