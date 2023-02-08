import { ICreateDealFormState } from './CreateDealFormStateType'

const createDealDefaultFormState: ICreateDealFormState = {
    dealType: 'Discount',
    title: '',
    description: '',
    identifier: '',
    priority: '',
    stackingType: '',
    dealLevel: 'product',
    dealDiscountTab: 'dollar',
    dollarOff: '',
    percentageOff: '10',
    fixedPriceOff: '',
    customPercentageOff: '',
    basketSpend: '',
    basketDiscount: '',
    englishMessage: '',
    frenchMessage: '',
    productsCollectionTab: 'uploadProduct',
    dealApplyType: '',
    dealLevelOptions: 'no',
    mch: [],
    exmch: [],
    liam: [],
    exliam: [],
    productExclusionsCollectionTab: 'uploadProduct',
    file: {},
    exfile: {},
    startDatePicker: null,
    endDatePicker: null,
    startTimePicker: null,
    endTimePicker: null
}

export default createDealDefaultFormState