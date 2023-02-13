import moment from 'moment'
import {ICreateDealFormState} from '../../constants/CreateDealFormStateType'
import { dealLevelExclusionOptions, dealApplyOptions } from '../../constants/FormOptions'

const getFormattedDate = (date: any, time: any) => `${moment(date).format('MMMM DD, YYYY')} ${moment(time).format('H:mm a z')}`

interface IConfigValue {
    title: string
    getValue: Function
}

interface IConfig {
    [index: string]: IConfigValue[]
}

const config: IConfig = {
    'Deal type': [{
        title: 'Type',
        getValue: (formData: ICreateDealFormState) => {
            const {dealType} = formData
            return dealType
        }
    }],
    'General Information': [
        {
            title: 'Title', getValue: (formData: ICreateDealFormState) => {
                const {title} = formData
                return title
            }
        },
        {
            title: 'Description', getValue: (formData: ICreateDealFormState) => {
                const {description} = formData
                return description
            }
        },
        {
            title: 'Identifier', getValue: (formData: ICreateDealFormState) => {
                const {identifier} = formData
                return identifier
            }
        },
        // {
        //     title: 'Priority', getValue: (formData: ICreateDealFormState) => {
        //         const {priority} = formData
        //         return priority
        //     }
        // },
        {
            title: 'Stacking Type', getValue: (formData: ICreateDealFormState) => {
                const {stackingType} = formData
                return stackingType
            }
        }
    ],
    'Deal value': [{
        title: 'is this at a basket level or product level?',
        getValue: (formData: ICreateDealFormState) => {
            const {dealLevel} = formData
            return dealLevel
        }
    },
    {
        title: 'Type',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff} = formData
            if(dollarOff) return 'Dollar ($) off'
            if(percentageOff) return 'Percentage (%) off'
            if(fixedPriceOff) return 'Dollar ($) off'
        }
    },
    {
        title: 'Value',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff} = formData
            return dollarOff || percentageOff || fixedPriceOff
        }
    },
    {
        title: 'Customer preview',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff, basketSpend, basketDiscount} = formData
            if(basketSpend) return `replace proper message here`
            if(dollarOff || fixedPriceOff) return `$${dollarOff || fixedPriceOff} off prodcts(s)`
            if(percentageOff) return `${percentageOff}% off product(s)`
        }
    }
    ],
    'Date in effect': [{
        title: 'Start Date',
        getValue: (formData: ICreateDealFormState) => {
            const {startDatePicker, startTimePicker} = formData
            return getFormattedDate(startDatePicker, startTimePicker)
        }
    },
    {
        title: 'End Date',
        getValue: (formData: ICreateDealFormState) => {
            const {endDatePicker, endTimePicker} = formData
            return getFormattedDate(endDatePicker, endTimePicker)
        }
    },
    {
        title: 'Customer preview',
        getValue: (formData: ICreateDealFormState) => {
            const {startDatePicker,startTimePicker, endDatePicker, endTimePicker} = formData
            return `Starts ${getFormattedDate(startDatePicker, startTimePicker)} and ends ${getFormattedDate(endDatePicker, endTimePicker)}`
        }
    }],
    'Prodcuts and Collections': [
        {
            title: 'Collection',
            getValue: (formData: ICreateDealFormState) => {
                const {fileName} = formData
                return fileName
            }
        }
    ],
    'Exclusions': [
        {
            title: 'What items does this deal apply to?',
            getValue: (formData: ICreateDealFormState) => {
                const {dealApplyType} = formData
                return dealApplyOptions[dealApplyType]
            }
        },
        {
            title: 'Will there be additional prodcuts excluded from this deal?',
            getValue: (formData: ICreateDealFormState) => {
                const {dealLevelOptions} = formData
                return dealLevelExclusionOptions.find(({value})=> value === dealLevelOptions)?.label
            }
        },
        {
            title: 'Collection',
            getValue: (formData: ICreateDealFormState) => {
                const {exFileName} = formData
                return exFileName
            }
        }
    ],
    'Promotional messages': [
        {
            title: 'English message',
            getValue: (formData: ICreateDealFormState) => {
                const {englishMessage} = formData
                return englishMessage
            }
        },
        {
            title: 'French message',
            getValue: (formData: ICreateDealFormState) => {
                const {frenchMessage} = formData
                return frenchMessage
            }
        }
    ]
}


export default config