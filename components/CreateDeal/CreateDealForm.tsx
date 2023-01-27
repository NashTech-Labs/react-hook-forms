import React from 'react'
import {useForm, FormProvider} from "react-hook-form";
import Step2 from './Step2'
import createDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import {ICreateDealFormState} from '../../constants/CreateDealFormStateType'

const CreateDealForm = () => {
    const formMethods = useForm<ICreateDealFormState>({
        defaultValues: createDealDefaultFormState
    });

    return <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
            <Step2 />
        </form>
    </FormProvider>
}

export default CreateDealForm