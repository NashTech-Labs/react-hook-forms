import React from "react";
import CreateDealForm from "../../../components/CreateDeal/CreateDealForm";
import CreateDeal from "../../../components/CreateDeal/CreateDeal";
import { updatedDealStep } from "../../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../../store/index";

const CreateNewDeal = () => {
  const stepCount = useAppSelector(updatedDealStep);

  return (
    <>
      {stepCount === 1 ? (
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
