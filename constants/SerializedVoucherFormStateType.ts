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
    restrictions: Array<string>;
    pickUpOrders: boolean;
    deliveryOrders: boolean;
    useVoucherOptions: string;
}
