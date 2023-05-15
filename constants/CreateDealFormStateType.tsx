export interface ICreateDealFormState {
    dealType: string
    isListValid: boolean
    title: string
    description: string
    identifier: string
    priority: string
    stackingType: string
    dealLevel: string
    dollarOff: string
    dealDiscountTab: string
    percentageOff: string
    fixedPriceOff: string
    customPercentageOff: string
    basketSpend: string
    basketDiscount: string
    englishMessage: string
    frenchMessage: string
    productsCollectionTab: string
    productExclusionsCollectionTab: string
    dealApplyType: string
    dealLevelOptions: string
    mch: string[]
    exmch: string[]
    liam: string[]
    exliam: string[]
    fileMCH: string[]
    exFileMCH: string[]
    fileLIAM: string[]
    exFileLIAM: string[]
    fileName: string
    exFileName: string
    startDatePicker: object | null
    endDatePicker: object | null
    startTimePicker: object | null
    endTimePicker: object | null
    collectionFileName: string
    basketDealType: string
    draftCreatedTimestamp: object | null
    dealCriteria: any
    dealCriteriaType: string
    spendMinimum: string
    customMinimumSpend: string
    shippingMethodType: string
}