import React from 'react'
import { useForm, FormProvider } from "react-hook-form";
import GeneralInformation from './GeneralInformation'
import createDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import { ICreateDealFormState } from '../../constants/CreateDealFormStateType'
import DealValue from './DealValue';
import ProductsCollection from './ProductsCollection/ProductsCollection';
import Exclusions from './Exclusions/Exclusions';

const CreateDealForm = () => {

    const handleFormSubmit = (values: ICreateDealFormState): void => {
        // TODO: form submit
    }

    const formMethods = useForm<ICreateDealFormState>({
        defaultValues: createDealDefaultFormState
    });

    return <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
            <GeneralInformation />
            <DealValue />
            <ProductsCollection />
            <Exclusions />
        </form>
    </FormProvider>
}

export default CreateDealForm