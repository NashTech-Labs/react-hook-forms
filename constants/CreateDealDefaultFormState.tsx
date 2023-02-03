import { ICreateDealFormState } from './CreateDealFormStateType'

const createDealDefaultFormState: ICreateDealFormState = {
    title: '',
    description: '',
    identifier: '',
    priority: '',
    stackingType: '',
    dealLevel: 'product',
    dollarOff: '',
    percentageOff: '10',
    fixedPriceOff: '',
    customPercentageOff: '',
    basketSpend: '',
    basketDiscount: '',
    englishMessage: '',
    frenchMessage: '',
    mch: [],
    exmch: [],
    liam: [],
    exliam: [],
    file: {},
    exfile: {}
}

export default createDealDefaultFormState