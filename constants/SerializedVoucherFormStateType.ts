export interface ICreateSerializedVoucherFormState {
    externalVoucherCode: string;
    draftCreatedTimestamp: object | null;
    voucherType: string;
    description: string;
    priority: string;
    stackingType: string;
    voucherLevel: string;
    dealDiscountTab: string;
    dollarOff: string;
    fixedPriceOff: string;
    basketSpend: string;
    basketDiscount: string;
    regionRestriction: string;
    dealApplyType: string;
    regionRestrictions: Array<string>
    restrictions: Array<string>;
    pickUpOrders: boolean;
    deliveryOrders: boolean;
    useVoucherOptions: string;
    startDatePicker: object | null;
    endDatePicker: object | null;
    startTimePicker: object | null;
    endTimePicker: object | null;
    voucherValidity: string;
    usageOfVoucher: number | null;
    dealLevelOptions: string,
    voucherQuantity: string | null;
    voucherDiscountTab: string;
    pointsApplyType: string;
    dollarPointDiscount: string;
    basketpointsApplyType: string,
    basketdollarPointDiscount: string,
    fulfillmentSpend: string,
    website: boolean,
    mobileApplication: boolean,
    productsCollectionTab: string;
    mch: Array<string>;
    liam: Array<string>;
    fileMCH: Array<string>;
    fileLIAM: Array<string>;
    exFileMCH: Array<string>;
    exFileLIAM: Array<string>;
    exmch: Array<string>;
    exliam: Array<string>;
    fileName: string;
    exFileName: string;
    englishMessage: string;
    frenchMessage: string;
    voucherValueDollarOffCriteria: string;
    dollarOffSpend: string
    dollarOffMultiBuyQuantity: string
    basketDollarOff: string
    waivefess: boolean
}
