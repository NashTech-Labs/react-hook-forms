import React from 'react'
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import GeneralInformation from './GeneralInformation'
import createDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import { ICreateDealFormState } from '../../constants/CreateDealFormStateType'
import DealValue from './DealValue';
import ProductsCollection from './ProductsCollection/ProductsCollection';
import Exclusions from './Exclusions/Exclusions';
import PromotionalMessages from './PromotionalMessages/PromotionalMessages';
import DateInEffect from './DateInEffect/DateInEffect';

const MAX_FILE_SIZE = 1000000; //1MB

const validFileExtensions: any = ['.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm', '.xls', '.xlt', '.xml', '.xlam', '.xla', '.xlw', '.xlr'];

function isValidFileType(fileName: any) {
    var afterDot = fileName?.substr(fileName?.indexOf('.'));
    return fileName && validFileExtensions.includes(afterDot);
}

const isEndDateTimeValid = (endDateOrTime:any, startDateOrTime:object,operation:string)=>{
    if(operation === ">="){
        return (endDateOrTime>=startDateOrTime);
    }
    if(operation === ">"){
        return(endDateOrTime>startDateOrTime);
    } 
    return true
}

const schema = yup.object().shape({
    title: yup.string().max(80, 'Error: Title should be less than 80 characters').required('Error: Title is required'),
    identifier: yup.string().max(15, 'Error: Identifier should be less than 15 characters').required('Error: Identifier is required'),
    priority: yup.number().typeError('Error: Priority is required').min(1, 'Error: Priority should be between 1 and 100').max(100, 'Error: Priority should be between 1 and 100').required('Error: Priority is required'),
    stackingType: yup.string().required('Error: Stacking type is required'),
    dollarOff: yup.number().typeError('Error: Dollar($) value required').min(0, 'Error: Dollar ($) value must be greater than $0').required('Error: Dollar ($) value required'),
    customPercentageOff: yup.number().typeError('Error: Percentage(%) value required').min(1, 'Error: Percentage value should be between 1-99').max(99, 'Error: Percentage value should be between 1-99').required('Error: Percentage(%) value required'),
    fixedPriceOff: yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required'),
    basketSpend: yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required'),
    basketDiscount: yup.number().typeError('Error: Dollar($) value required').min(1, 'Error: Must be a minimum of $1.00').required('Error: Dollar ($) value required'),
    englishMessage: yup.string().required('Error: English message required'),
    frenchMessage: yup.string().required('Error: French message required'),
    mch: yup.array().of(yup.string().required('Error: MCH field required').matches(/^[mM]/, "Error: Must start with M").min(9, "Error: Valid MCH required").max(9, "Error: Valid MCH required")),
    exmch: yup.array().of(yup.string().required('Error: LIAM field required').matches(/^[mM]/, "Error: Must start with M").min(9, "Error: Valid MCH required").max(9, "Error: Valid MCH required")),
    liam: yup.array().of(yup.string().required('Error: MCH field required').matches(/^[a-zA-Z]/, "Error: Must start with letter").min(13, "Error: Valid LIAM required").max(13, "Error: Valid LIAM required")),
    exliam: yup.array().of(yup.string().required('Error: LIAM field required').matches(/^[a-zA-Z]/, "Error: Must start with letter").min(13, "Error: Valid LIAM required").max(13, "Error: Valid LIAM required")),
    file: yup
        .mixed()
        .required("Error: File required")
        .test("not-valid-size", "Max allowed size is 100KB",
            value => value && value.size < MAX_FILE_SIZE)
        .test("is-valid-type", "Error: File Type not accepted",
            value => isValidFileType(value && value?.name?.toLowerCase())),
    exfile: yup
        .mixed()
        .required("Error: File Required")
        .test("not-valid-size", "Error: Max allowed size is 1 MB",
            value => value && value.size < MAX_FILE_SIZE)
        .test("is-valid-type", "Error: File Type not accepted",
            value => isValidFileType(value && value?.name?.toLowerCase())),
    startDatePicker:yup.date().typeError("Error: Valid date required").min(new Date().toJSON().slice(0, 10),"Error: You cannot add date before today").required('Error: Date required').nullable(),
    startTimePicker:yup.date().min(new Date(),"Error: You cannot select time before current time").required('Error: Time required').nullable(),
    endDatePicker:yup.date().typeError("Error: Valid date required").required('Error: Date required').nullable()
        .test("test-end-date","Error: End date smaller than start date",function(value,context){
            return isEndDateTimeValid(value, context.parent.startDatePicker,">=");
        }),
    endTimePicker:yup.date().required('Error: Time required').nullable()
        .test("test-end-time","Error: End time must be greater than start time",function(value,context){
            return isEndDateTimeValid(value, context.parent.startTimePicker,">");
        }),
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
            <DateInEffect />
            <ProductsCollection />
            <Exclusions />
            <PromotionalMessages />
        </form>
    </FormProvider>
}

export default CreateDealForm