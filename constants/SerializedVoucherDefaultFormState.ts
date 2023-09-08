import {ICreateSerializedVoucherFormState} from "./SerializedVoucherFormStateType";

const createSerializedVoucherDefaultFormState: ICreateSerializedVoucherFormState = {
    externalVoucherCode: "",
    draftCreatedTimestamp: null,
    voucherType: "SERIALIZED",
    description: "",
    priority: "",
    stackingType: "always_apply",
    dealDiscountTab: "dollar",
    dollarOff: "",
    fixedPriceOff: "",
    basketSpend: "",
    basketDiscount: "",
    regionRestriction: 'no',
    regionRestrictions: [],
    voucherLevel: 'product',
    restrictions: [],
    pickUpOrders: true,
    deliveryOrders: true,
    useVoucherOptions: 'justOnce',
    startDatePicker: null,
    endDatePicker: null,
    startTimePicker: null,
    endTimePicker: null,
    voucherQuantity: null,
    voucherValidity: 'no',
    usageOfVoucher: null
};

export default createSerializedVoucherDefaultFormState;
