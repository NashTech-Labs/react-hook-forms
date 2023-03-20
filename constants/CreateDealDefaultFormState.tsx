import { ICreateDealFormState } from './CreateDealFormStateType'

const createDealDefaultFormState: ICreateDealFormState = {
    dealType: 'Discount',
    title: '',
    description: '',
    identifier: '',
    priority: '50',
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
    fileMCH: [],
    exFileMCH: [],
    fileLIAM: [],
    exFileLIAM: [],
    productExclusionsCollectionTab: 'uploadProduct',
    fileName: '',
    exFileName: '',
    startDatePicker: null,
    endDatePicker: null,
    startTimePicker: null,
    endTimePicker: null,
    collectionFileName: '',
    basketDealType: 'dollar',
    draftCreatedTimestamp: null,
    dealCriteria: [{
        buy: '',
        get: ''
    }],
    dealCriteriaType: "%_OFF"
}

export default createDealDefaultFormState