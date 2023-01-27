import {ICreateDealFormState} from './CreateDealFormStateType'

const createDealDefaultFormState: ICreateDealFormState = {
    title: '',
    description: '',
    identifier: '',
    priority: '',
    stackingType: '',
    dealLevel: 'product',
    dollarOff: '',
    percentageOff: '',
    fixedPriceOff: '',
    customPercentageOff: ''
}

export default createDealDefaultFormState