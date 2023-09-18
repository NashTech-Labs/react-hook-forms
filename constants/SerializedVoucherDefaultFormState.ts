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
    dealLevelOptions: "no",
    useVoucherOptions: 'justOnce',
    startDatePicker: null,
    endDatePicker: null,
    startTimePicker: null,
    endTimePicker: null,
    voucherQuantity: null,
    voucherValidity: 'no',
    usageOfVoucher: null,
    voucherDiscountTab: "dollar",
    website: true,
    mobileApplication: true,
    dealApplyType: "",
    productsCollectionTab: "uploadProduct",
    mch: [],
    liam: [],
    fileName: '',
    exFileName: '',
    exmch: [],
    exliam: [],
    fileMCH: [],
    exFileMCH: [],
    fileLIAM: [],
    exFileLIAM: [],
    englishMessage: "",
    frenchMessage: ""
};

export default createSerializedVoucherDefaultFormState;
