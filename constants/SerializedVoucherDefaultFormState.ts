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
    voucherLevel: 'product',
    restrictions: [],
    pickUpOrders: true,
    deliveryOrders: true,
    useVoucherOptions: 'justOnce'
};

export default createSerializedVoucherDefaultFormState;
