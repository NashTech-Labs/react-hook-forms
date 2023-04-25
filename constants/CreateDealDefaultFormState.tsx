import { ICreateDealFormState } from './CreateDealFormStateType'
import {DISCOUNT_DEAL_TYPE} from './FormOptions'

const createDealDefaultFormState: ICreateDealFormState = {
    dealType: DISCOUNT_DEAL_TYPE,
    title: '',
    description: '',
    identifier: '',
    priority: '50',
    stackingType: '',
    dealLevel: 'product',
    dealDiscountTab: 'dollar',
    dollarOff: '',
    percentageOff: '',
    fixedPriceOff: '',
    customPercentageOff: '',
    basketSpend: '',
    basketDiscount: '',
    englishMessage: '',
    frenchMessage: '',
    productsCollectionTab: 'uploadProduct',
    dealApplyType: '',
    dealLevelOptions: 'no',
    isListValid: false,
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
    dealCriteriaType: "%_OFF_MULTI",
    spendMinimum: 'NO_MINIMUM',
    customMinimumSpend: '',
    shippingMethodType: 'standard'
}

export default createDealDefaultFormState