export interface ICreateDealFormState {
    dealType: string
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
    mch: string[]
    productExclusionsCollectionTab: string
    dealLevelOptions: string
    exmch: string[]
    liam: string[]
    exliam: string[]
    file: any
    exfile: any
    startDatePicker:object | null
    endDatePicker: object | null
    startTimePicker : object | null
    endTimePicker : object | null
}