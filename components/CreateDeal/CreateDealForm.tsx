import React from 'react'
import {useForm, FormProvider} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import  * as yup from "yup";
import GeneralInformation from './GeneralInformation'
import createDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import { ICreateDealFormState } from '../../constants/CreateDealFormStateType'
import DealValue from './DealValue';
import ProductsCollection from './ProductsCollection/ProductsCollection';
import Exclusions from './Exclusions/Exclusions';
import DateInEffect from './DateInEffect';

const schema = yup.object().shape({
    title: yup.string().max(80, 'Error: Title should be less than 80 characters').required('Error: Title is required'),
    identifier: yup.string().max(15 ,'Error: Identifier should be less than 15 characters').required('Error: Identifier is required'),
    priority: yup.number().typeError('Error: Priority is required').min(1, 'Error: Priority should be between 1 and 100').max(100, 'Error: Priority should be between 1 and 100').required('Error: Priority is required'),
    stackingType: yup.string().required('Error: Stacking type is required'),
    dollarOff: yup.number().typeError('Error: Dollar($) value required').min(0, 'Error: Dollar ($) value must be greater than $0').required('Error: Dollar ($) value required'),
    customPercentageOff: yup.number().typeError('Error: Percentage(%) value required').min(1, 'Error: Percentage value should be between 1-99').max(99, 'Error: Percentage value should be between 1-99').required('Error: Percentage(%) value required'),
    fixedPriceOff: yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required'),
    basketSpend : yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required'),
    basketDiscount: yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required')
}).required();

const CreateDealForm = () => {

    const formMethods = useForm<ICreateDealFormState>({
        defaultValues: createDealDefaultFormState,
        resolver: yupResolver(schema),
        mode: 'all'
    });

    const handleFormSubmit = (values: ICreateDealFormState): void => {
        // TODO: form submit
        console.log(values)
    }

    return <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
            <GeneralInformation />
            <DealValue />
            <DateInEffect/>
            <ProductsCollection />
            <Exclusions />
        </form>
    </FormProvider>
}

export default CreateDealForm