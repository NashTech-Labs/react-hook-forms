import React, { MouseEvent } from 'react'
import moment from 'moment';
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Button from '@mui/material/Button'
import GeneralInformation from './GeneralInformation'
import createDealDefaultFormState from '../../constants/CreateDealDefaultFormState'
import { ICreateDealFormState } from '../../constants/CreateDealFormStateType'
import DealValue from './DealValue';
import ProductsCollection from './ProductsCollection/ProductsCollection';
import Exclusions from './Exclusions/Exclusions';
import PromotionalMessages from './PromotionalMessages/PromotionalMessages';
import styles from './CreateDealForm.module.css'
import commonStyles from "./Steps.module.css";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { updatedDealLevel, updateDealStep } from "../../store/feature/deal/dealSlice";
import { updateNewDeal, getNewDealData } from '../../store/feature/deal/newDealSlice'
import DateInEffect from './DateInEffect/DateInEffect';

const MAX_FILE_SIZE = 1000000; //1MB

const validFileExtensions: any = ['.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm', '.xls', '.xlt', '.xml', '.xlam', '.xla', '.xlw', '.xlr'];

function isValidFileType(fileName: any) {
    var afterDot = fileName?.substr(fileName?.indexOf('.'));
    return fileName && validFileExtensions.includes(afterDot);
}

const isEndDateTimeValid = (endDateOrTime: any, startDateOrTime: object, operation: string) => {
    if (operation === ">=") {
        return (endDateOrTime >= startDateOrTime);
    }
    if (operation === ">") {
        return (endDateOrTime > startDateOrTime);
    }
    return true
}

const schema = yup.object().shape({
    title: yup.string().max(80, 'Error: Title should be less than 80 characters').required('Error: Title is required'),
    description:yup.string().max(250,'Error: Description should be less than 250 characters'),
    //  identifier: yup.string().max(15, 'Error: Identifier should be less than 15 characters').required('Error: Identifier is required'),
    priority: yup
        .number()
        .typeError('Error: Priority is required')
        .min(1, 'Error: Priority should be between 1 and 100')
        .max(100, 'Error: Priority should be between 1 and 100')
        .test('priority', 'Error: Priority should be whole number', (value: any) => value && value % 1 === 0)
        .required('Error: Priority is required'),
    stackingType: yup.string().required('Error: Stacking type is required'),
    dollarOff: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        // .typeError('Error: Dollar($) value required')
        .min(1, 'Error: Must be minimum of $1.00')
        .test('dollar-off', 'Error: Dollar($) value required', (value, context) => {
            if (context?.parent?.dealDiscountTab === 'dollar' && context?.parent?.dealLevel === 'product') {
                return value !== undefined
            } else return true
        }),
    customPercentageOff: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Percentage value should be between 1-99')
        .max(99, 'Error: Percentage value should be between 1-99')
        .test('custom-percentage-off', 'Error: Percentage(%) value required', (value, context) => {
            if (context?.parent?.percentageOff === 'custom') {
                return value !== undefined
            } else return true
        }),
    fixedPriceOff: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Must be a minimum of $1.00')
        .test('fixed-price-off', 'Error: Dollar($) value required', (value, context) => {
            if (context?.parent?.dealDiscountTab === 'fixed') {
                return value !== undefined
            } else return true
        }),
    basketSpend: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Must be a minimum of $1.00')
        .test('basket-spend', 'Error: Dollar($) value required', (value, context) => {
            if (context?.parent?.dealLevel === 'basket') {
                return value !== undefined
            } else return true
        }),
    basketDiscount: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .test('basket-discount', 'Error: Dollar($) value required', (value, context) => {
            if (context?.parent?.dealLevel === 'basket' && context?.parent?.basketDealType === 'dollar') {
                return value !== undefined
            } else return true
        })
        .test('basket-discount', 'Error: Must be a minimum of $1.00', (value, context) => {
            if (context?.parent?.dealLevel === 'basket' && context?.parent?.basketDealType === 'dollar') {
                return value !== undefined && value >= 1
            } else return true
        })
        .test('basket-discount', 'Error: Percentage(%) value required', (value, context) => {
            if (context?.parent?.dealLevel === 'basket' && context?.parent?.basketDealType === 'percentage') {
                return value !== undefined
            } else return true
        })
        .test('basket-discount', 'Error: Percentage(%) must be between 1-99', (value, context) => {
            if (context?.parent?.dealLevel === 'basket' && context?.parent?.basketDealType === 'percentage') {
                return value !== undefined && value > 0 && value < 100
            } else return true
        }),
    englishMessage: yup.string().required('Error: English message required').max(250, 'Error: Message should be less than 250 characters'),
    frenchMessage: yup.string().required('Error: French message required').max(250, 'Error: Message should be less than 250 characters'),
    mch: yup.array().of(yup.string().required('Error: MCH field required').matches(/^[mM]/, "Error: Must start with M").min(9, "Error: Valid MCH required").max(9, "Error: Valid MCH required")),
    exmch: yup.array().of(yup.string().required('Error: MCH field required').matches(/^[mM]/, "Error: Must start with M").min(9, "Error: Valid MCH required").max(9, "Error: Valid MCH required")),
    liam: yup.array().of(yup.string().required('Error: LIAM field required').matches(/^[a-zA-Z]/, "Error: Must start with letter").min(13, "Error: Valid LIAM required").max(13, "Error: Valid LIAM required")),
    exliam: yup.array().of(yup.string().required('Error: LIAM field required').matches(/^[a-zA-Z]/, "Error: Must start with letter").min(13, "Error: Valid LIAM required").max(13, "Error: Valid LIAM required")),
    file: yup
        .mixed()
        .test("file-required", "Error: FIle required", (value, context) => {
            if (value?.size > 0 || context?.parent?.productsCollectionTab === "addProduct" || context?.parent?.dealLevel === 'basket') {
                return true
            } else return false
        })
        .test("not-valid-size", "Error: Max allowed size is 1 MB", (value, context) => {
            if (context?.parent?.productsCollectionTab === 'uploadProduct' && context?.parent?.dealLevel === 'product') {
                return value?.size && value.size < MAX_FILE_SIZE
            } else return true
        })
        .test("is-valid-type", "Error: File Type not accepted", (value, context) => {
            if (context?.parent?.productsCollectionTab === 'uploadProduct' && context?.parent?.dealLevel === 'product') {
                return isValidFileType(value && value?.name?.toLowerCase())
            } else return true
        }),
    exfile: yup
        .mixed()
        .test("ex-file-required", "Error: FIle required", (value, context) => {
            if (value?.size > 0 && context?.parent?.dealLevelOptions === 'yes' || context?.parent?.dealLevelOptions === 'no' ||
                context?.parent?.productExclusionsCollectionTab === "addProduct") {
                return true
            } else return false
        })
        .test("not-valid-size", "Error: Max allowed size is 1 MB", (value, context) => {
            if (context?.parent?.productExclusionsCollectionTab === 'uploadProduct' && context?.parent?.dealLevelOptions === 'yes') {
                return value?.size && value.size < MAX_FILE_SIZE
            } else return true
        })
        .test("is-valid-type", "Error: File Type not accepted", (value, context) => {
            if (context?.parent?.productExclusionsCollectionTab === 'uploadProduct' && context?.parent?.dealLevelOptions === 'yes') {
                return isValidFileType(value && value?.name?.toLowerCase())
            } else return true
        }),
    dealApplyType: yup.string().required('Error: Select applicable products'),
    startDatePicker: yup.date().typeError("Error: Valid date required").min(new Date().toJSON().slice(0, 10), "Error: You cannot add date before today").required('Error: Date required').nullable(),
    startTimePicker: yup.date().typeError("Error: Valid time required").min(new Date(), "Error: You cannot select time before current time").required('Error: Time required').nullable(),
    endDatePicker: yup.date().typeError("Error: Valid date required").required('Error: Date required').nullable()
        .test("test-end-date", "Error: End date smaller than start date", function (value, context) {
            return isEndDateTimeValid(value, context.parent.startDatePicker, ">=");
        }),
    endTimePicker: yup.date().typeError("Error: Valid time required").required('Error: Time required').nullable()
        .test("test-end-time", "Error: End time must be greater than start time", function (value, context) {
            return isEndDateTimeValid(value, context.parent.startTimePicker, ">");
        }),
}).required();

const CreateDealForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draftFormValues = useAppSelector(getNewDealData)
    const dealLevelName = useAppSelector(updatedDealLevel)

    const formMethods = useForm<ICreateDealFormState>({
        defaultValues: draftFormValues || createDealDefaultFormState,
        resolver: yupResolver(schema),
        mode: 'all'
    });
    const { getValues, trigger, setValue } = formMethods
    const handleFormSubmit = async (e: MouseEvent) => {
        e.preventDefault()
        const cleanForm = await trigger(undefined, { shouldFocus: true })

        if (cleanForm) {
            setValue('draftCreatedTimestamp', moment())
            dispatch(updateNewDeal(getValues()))
            router.push('/deals/create/summary')
        }
    }

    const handleBack = () => {
        dispatch(updateDealStep(0));
    }

    return <FormProvider {...formMethods}>
        <form id="test">
            <GeneralInformation />
            <DealValue />
            <DateInEffect />
            {dealLevelName === 'product' ? <ProductsCollection /> : null}
            <Exclusions dealLevelName={dealLevelName} />
            <PromotionalMessages dealLevelName={dealLevelName} />
            <div className={styles['submit-btn-container']}>
                <div>
                    <Button variant="outlined" className={commonStyles['cancelBtn']} onClick={() => router.push("/deals")} data-testid="cancel-btn">Cancel</Button>
                </div>
                <div className={styles['submit-container']}>
                    <Button variant="text" onClick={handleBack} className={commonStyles['text-style-btn']} data-testid="back-btn">Go Back</Button>
                    <Button variant="contained" className={commonStyles['continueBtn']} onClick={e => handleFormSubmit(e)} data-testid="continue-btn">Continue</Button>
                </div>
            </div>
        </form>
    </FormProvider>
}

export default CreateDealForm