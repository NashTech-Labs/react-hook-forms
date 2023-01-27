import React from "react";
import CreateDealForm from "../../../components/CreateDeal/CreateDealForm";
import Step1 from "../../../components/CreateDeal/Step1";
import {updatedDealStep} from "../../../store/feature/deal/dealSlice";
import {useAppSelector} from "../../../store/index";

const CreateNewDeal = () => {
  const stepCount = useAppSelector(updatedDealStep);

  return <>{stepCount === 1 ? <CreateDealForm /> : <Step1 />}</>;
};

export default CreateNewDeal;
