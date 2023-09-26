import moment from "moment";
import * as yup from "yup";
import {
    MAX_FILE_SIZE,
    isValidFileType,
} from "../../../constants/FormOptions";

const isEndDateTimeValid = (endDateOrTime: any, startDateOrTime: object, operation: string) => {
    if(operation === ">=") {
        return (endDateOrTime >= startDateOrTime);
    }
    if(operation === ">") {
        return (endDateOrTime > startDateOrTime);
    }
    return true
}

const schema = yup.object().shape({
    externalVoucherCode: yup.string().length(3, 'Error: Code should be 3 characters').required('Voucher Code is required'),
    description: yup.string().max(250, 'Error: Description should be less than 250 characters'),
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
            if(context?.parent?.dealDiscountTab === 'dollar' && context?.parent?.voucherLevel === 'product') {
                return value !== undefined
            } else return true
        }),
    customPercentageOff: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Percentage value should be between 1-99')
        .max(99, 'Error: Percentage value should be between 1-99')
        .test('custom-percentage-off', 'Error: Percentage(%) value required', (value, context) => {
            if(context?.parent?.percentageOff === 'custom') {
                return value !== undefined
            } else return true
        }),
    fixedPriceOff: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Must be a minimum of $1.00')
        .test('fixed-price-off', 'Error: Dollar($) value required', (value, context) => {
            if(context?.parent?.dealDiscountTab === 'fixed') {
                return value !== undefined
            } else return true
        }),
    customMinimumSpend: yup.number()
        .transform(value => (isNaN(value) ? undefined : value))
        .test('custom-spend-minimum', 'Error: Dollar($) value required', (value, context) => {
            if(context?.parent?.spendMinimum === 'CUSTOM') {
                return value !== undefined
            } else return true
        }),
    basketSpend: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .min(1, 'Error: Must be a minimum of $1.00')
        .test('basket-spend', 'Error: Dollar($) value required', (value, context) => {
            if(context?.parent?.voucherLevel === 'basket') {
                return value !== undefined
            } else return true
        }),
    basketDiscount: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .test('basket-discount', 'Error: Dollar($) value required', (value, context) => {
            if(context?.parent?.voucherLevel === 'basket') {
                return value !== undefined
            } else return true
        })
        .test('basket-discount', "Error: Discount amount can't be greater than or equal to the spending amount", (value, context) => {
            if(context?.parent?.voucherLevel === 'basket') {
                return value !== undefined && value < context?.parent?.basketSpend
            } else return true
        })
        .test('basket-discount-smaller', 'Error: Must be a minimum of $1.00', (value, context) => {
            if(context?.parent?.voucherLevel === 'basket') {
                return value !== undefined && value >= 1
            } else return true
        }),
    dollarPointDiscount: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .test('basket-discount', 'Error: Dollar($) value required', (value, context) => {
            if(context?.parent?.voucherDiscountTab === 'points') {
                return value !== undefined
            } else return true
        })
        .test('basket-discount', "Error: Discount amount can't be greater than or equal to the spending points", (value, context) => {
            if(context?.parent?.voucherDiscountTab === 'points') {
                return value !== undefined && value < context?.parent?.pointsApplyType
            } else return true
        })
        .test('basket-discount-smaller', 'Error: Must be a minimum of $1.00', (value, context) => {
            if(context?.parent?.voucherDiscountTab === 'points') {
                return value !== undefined && value >= 1
            } else return true
        }),
    voucherQuantity: yup
        .number()
        .required('Error: Number of vouchers required')
        .min(1, 'Error: Number should be greater than 0')
        .typeError('Error: Number of vouchers required')
        .test('voucher_qauntity', 'Error: Voucher qauntity should be whole number', (value: any) => value && value % 1 === 0),
    // usageOfVoucher: yup.string().required('Error: Number of uses required'),
    startDatePicker: yup.date()
        .typeError("Error: Valid date required")
        .test(
            "test-start-date",
            "Error: You cannot add date before yesterday",
            function(value, context) {
                return isEndDateTimeValid(
                    value,
                    context.parent.startDatePicker,
                    ">="
                );
            }
        )
        .required("Error: Date required")
        .nullable(),
    startTimePicker: yup.date().typeError("Error: Valid time required").required('Error: Time required').nullable(),
    endDatePicker: yup.date().typeError("Error: Valid date required").required('Error: Date required').nullable()
        .test("test-end-date", "Error: End date smaller than start date", function(value, context) {
            return isEndDateTimeValid(value, context.parent.startDatePicker, ">=");
        }),
    endTimePicker: yup.date().typeError("Error: Valid time required").required('Error: Time required').nullable()
        .test("test-end-time", "Error: End time must be greater than start time", function(value, context) {
            return isEndDateTimeValid(value, context.parent.startTimePicker, ">");
        }),
    mch: yup
        .array()
        .of(
            yup
                .string()
                .required("Error: MCH field required")
                .matches(/^[mM]/, "Error: Must start with M")
                .min(9, "Error: Valid MCH required")
                .max(9, "Error: Valid MCH required")
        ),
    exmch: yup
        .array()
        .of(
            yup
                .string()
                .required("Error: MCH field required")
                .matches(/^[mM]/, "Error: Must start with M")
                .min(9, "Error: Valid MCH required")
                .max(9, "Error: Valid MCH required")
        ),
    liam: yup.array().of(
        yup
            .string()
            .required("Error: LIAM field required")
            .matches(/^[a-zA-Z]/, "Error: Must start with letter")
            .matches(/[A-Za-z](\w{12})+_EA/, "Error: Valid LIAM required")
            .min(16, "Error: Valid LIAM required")
            .max(16, "Error: Valid LIAM required")
    ),
    exliam: yup.array().of(
        yup
            .string()
            .required("Error: LIAM field required")
            .matches(/^[a-zA-Z]/, "Error: Must start with letter")
            .matches(/[A-Za-z](\w{12})+_EA/, "Error: Valid LIAM required")
            .min(16, "Error: Valid LIAM required")
            .max(16, "Error: Valid LIAM required")
    ),
    file: yup
        .mixed()
        .test("file-required", "Error: FIle required", (value, context) => {
            if(
                value?.size > 0 ||
                context?.parent?.voucherLevel === "basket" ||
                context?.parent?.mch?.length > 0 ||
                context?.parent?.liam?.length > 0
            ) {
                return true;
            } else return false;
        })
        .test(
            "not-valid-size",
            "Error: Max allowed size is 1 MB",
            (value, context) => {
                if(
                    context?.parent?.mch?.length < 1 &&
                    context?.parent?.liam.length < 1
                ) {
                    if(
                        context?.parent?.productsCollectionTab === "uploadProduct" &&
                        context?.parent?.voucherLevel === "product"
                    ) {
                        return value?.size && value.size < MAX_FILE_SIZE;
                    } else return true;
                } else return true;
            }
        )
        .test(
            "is-valid-type",
            "Error: File Type not accepted",
            (value, context) => {
                if(
                    context?.parent?.mch?.length < 1 &&
                    context?.parent?.liam.length < 1
                ) {
                    if(
                        context?.parent?.productsCollectionTab === "uploadProduct" &&
                        context?.parent?.voucherLevel === "product"
                    ) {
                        return isValidFileType(value && value?.name?.toLowerCase());
                    } else return true;
                } else return true;
            }
        ),
    exfile: yup
        .mixed()
        .test("ex-file-required", "Error: FIle required", (value, context) => {
            if(
                (value?.size > 0 && context?.parent?.dealLevelOptions === "yes") ||
                context?.parent?.dealLevelOptions === "no" ||
                context?.parent?.exmch?.length > 0 ||
                context?.parent?.exliam?.length > 0
            ) {
                return true;
            } else return false;
        })
        .test(
            "not-valid-size",
            "Error: Max allowed size is 1 MB",
            (value, context) => {
                if(
                    context?.parent?.exmch?.length < 1 &&
                    context?.parent?.exliam.length < 1
                ) {
                    if(
                        context?.parent?.productExclusionsCollectionTab ===
                        "uploadProduct" &&
                        context?.parent?.dealLevelOptions === "yes"
                    ) {
                        return value?.size && value.size < MAX_FILE_SIZE;
                    } else return true;
                } else return true;
            }
        )
        .test(
            "is-valid-type",
            "Error: File Type not accepted",
            (value, context) => {
                if(
                    context?.parent?.exmch?.length < 1 &&
                    context?.parent?.exliam.length < 1
                ) {
                    if(
                        context?.parent?.productExclusionsCollectionTab ===
                        "uploadProduct" &&
                        context?.parent?.dealLevelOptions === "yes"
                    ) {
                        return isValidFileType(value && value?.name?.toLowerCase());
                    } else return true;
                } else return true;
            }
        ),
    dealApplyType: yup
        .mixed()
        .test(
            "dollar-value-required",
            "Error: Select applicable products",
            (value: any, context: any) => {
                if(value !== "") {
                    return true;
                } else return false;
            }
        ),
    pickUpOrders: yup.mixed().test("fulfilment-error-pickUpOrders", "Error: Fulfillment type is required", (value: boolean, context: any) => {
        if(!value) {
            return context?.parent?.deliveryOrders
        } else return true
    }),
    deliveryOrders: yup.mixed().test("fulfilment-error-deliveryOrders", "Error: Fulfillment type is required", (value: boolean, context: any) => {
        if(!value) {
            return context?.parent?.pickUpOrders
        } else return true
    }),
    website: yup.mixed().test("platform-error-website", "Error: Platform type is required", (value: boolean, context: any) => {
        if(!value) {
            return context?.parent?.mobileApplication
        } else return true
    }),
    mobileApplication: yup.mixed().test("platform-error-mobileApplication", "Error: Platform type is required", (value: boolean, context: any) => {
        if(!value) {
            return context?.parent?.website
        } else return true
    }),
    englishMessage: yup
        .string()
        .required("Error: English message required")
        .max(250, "Error: Message should be less than 250 characters"),
    frenchMessage: yup
        .string()
        .required("Error: French message required")
        .max(250, "Error: Message should be less than 250 characters"),
    restrictions: yup.array().of(yup.string()).min(1, 'At least one banner should be selected')
})

export default schema