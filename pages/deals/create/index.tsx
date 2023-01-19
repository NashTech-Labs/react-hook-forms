import React from "react";
import Step2 from "../../../components/CreateDeal/Step2";
import Step1 from "../../../components/CreateDeal/Step1";
import { updatedDealStep } from "../../../store/feature/deal/dealSlice";
import { useAppSelector } from "../../../store/index";

const CreateNewDeal = () => {
  const stepCount = useAppSelector(updatedDealStep);

  return <>{stepCount === 1 ? <Step2 /> : <Step1 />}</>;
};

export default CreateNewDeal;
