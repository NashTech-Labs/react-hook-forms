import moment from 'moment'
import {ICreateDealFormState} from '../../constants/CreateDealFormStateType'
import { dealLevelExclusionOptions, dealApplyOptions , stackTypeOptions} from '../../constants/FormOptions'
import { capitalizeWords } from '../../util/format'

const getFormattedDate = (date: any, time: any) => `${moment(date).format('MMMM DD, YYYY')} ${moment(time).format('hh:mma z')} EST`

interface IConfigValue {
    title: string
    getValue: Function
    shouldHide?:  Function
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
        // {
        //     title: 'Identifier', getValue: (formData: ICreateDealFormState) => {
        //         const {identifier} = formData
        //         return identifier
        //     }
        // },
        {
            title: 'Priority', getValue: (formData: ICreateDealFormState) => {
                const {priority} = formData
                return priority
            }
        },
        {
            title: 'Stacking Type', getValue: (formData: ICreateDealFormState) => {
                const {stackingType} = formData
                return stackTypeOptions[stackingType]
            }
        }
    ],
    'Deal value': [{
        title: 'Is this at a basket level or product level?',
        getValue: (formData: ICreateDealFormState) => {
            const {dealLevel} = formData
            return capitalizeWords(dealLevel || '')
        }
    },
    {
        title: 'Type',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff, dealLevel, basketDealType} = formData
            if (dealLevel === 'basket') return  basketDealType === 'dollar' ? 'Dollar ($) off' : 'Percentage (%) off'
            if(dollarOff) return 'Dollar ($) off'
            if(percentageOff) return 'Percentage (%) off'
            if(fixedPriceOff) return 'Fixed off' 
        }
    },
    {
        title: 'Value',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff, customPercentageOff, dealLevel, basketDealType, basketDiscount} = formData
            if (dealLevel === 'basket') {
                return basketDealType === 'dollar' ? `$${basketDiscount}` : `${basketDiscount}%`  
            }
            
            if(dollarOff || fixedPriceOff){
                return `$${dollarOff || fixedPriceOff}`
            } 

            return `${percentageOff === 'custom' ? customPercentageOff : percentageOff}%`
        }
    },
    {
        title: 'Customer preview',
        getValue: (formData: ICreateDealFormState) => {
            const {dollarOff, percentageOff, fixedPriceOff, basketSpend, basketDiscount, basketDealType,customPercentageOff} = formData
            if(basketSpend) return `Spend $${basketSpend} Get ${basketDealType === 'dollar' ? '$' : ''}${basketDiscount}${basketDealType === 'percentage' ? '%' : ''} off`
            if(dollarOff || fixedPriceOff) return `$${dollarOff || fixedPriceOff} off product(s)`
            if(percentageOff) return `${percentageOff === 'custom' ? customPercentageOff : percentageOff}% off product(s)`
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
    'Products and Collections': [
        // {
        //     title: 'Collection',
        //     getValue: (formData: ICreateDealFormState) => {
        //         const {fileName} = formData
        //         return fileName
        //     },
        //     shouldHide: (formData: ICreateDealFormState) => {
        //         const {productsCollectionTab} = formData
        //         return productsCollectionTab === 'addProduct'
        //     }
        // },
        {
            title: 'Mch',
            getValue: (formData: ICreateDealFormState) => {
                const {mch, fileMCH, productsCollectionTab} = formData
                const data = productsCollectionTab === 'uploadProduct' ? fileMCH : mch
                return data.length > 0 ? data.map(value => String(value).toUpperCase()).join(', ') : 'None'
            },
            // shouldHide: (formData: ICreateDealFormState) => {
            //     const {productsCollectionTab} = formData
            //     return productsCollectionTab === 'uploadProduct'
            // }
        },
        {
            title: 'Liam',
            getValue: (formData: ICreateDealFormState) => {
                const {liam, fileLIAM, productsCollectionTab} = formData
                const data = productsCollectionTab === 'uploadProduct' ? fileLIAM : liam
                return data.length > 0 ? data.map(value => String(value).toUpperCase()).join(', ') : 'None'
            },
            // shouldHide: (formData: ICreateDealFormState) => {
            //     const {productsCollectionTab} = formData
            //     return productsCollectionTab === 'uploadProduct'
            // }
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
            title: 'Will there be additional products excluded from this deal?',
            getValue: (formData: ICreateDealFormState) => {
                const {dealLevelOptions} = formData
                return dealLevelExclusionOptions.find(({value})=> value === dealLevelOptions)?.label
            },
            shouldHide : (formData: ICreateDealFormState) => {
                const {dealLevel} = formData
                return dealLevel === "basket"
            },
        },
        // {
        //     title: 'Collection',
        //     getValue: (formData: ICreateDealFormState) => {
        //         const {exFileName} = formData
        //         return exFileName
        //     },
        //     shouldHide : (formData: ICreateDealFormState) => {
        //         const {dealLevelOptions, productExclusionsCollectionTab, dealLevel} = formData
        //         return dealLevel === "basket" || dealLevelOptions === 'no' || (dealLevelOptions === 'yes' &&  productExclusionsCollectionTab === 'addProduct')
        //     },
        // },
        {
            title: 'Mch',
            getValue: (formData: ICreateDealFormState) => {
                const {exmch,exFileMCH, productExclusionsCollectionTab} = formData
                const data = productExclusionsCollectionTab === 'uploadProduct' ? exFileMCH : exmch
                return data.length > 0 ? data.map(value => String(value).toUpperCase()).join(', ') : 'None'
            },
            shouldHide: (formData: ICreateDealFormState) => {
                const {dealLevelOptions,dealLevel} = formData
                return dealLevel === "basket" || dealLevelOptions === 'no'
            }
        },
        {
            title: 'Liam',
            getValue: (formData: ICreateDealFormState) => {
                const {exliam,exFileLIAM, productExclusionsCollectionTab} = formData
                const data = productExclusionsCollectionTab === 'uploadProduct' ? exFileLIAM : exliam
                return data.length > 0 ? data.map(value => String(value).toUpperCase()).join(', ') : 'None'
            },
            shouldHide: (formData: ICreateDealFormState) => {
                const {dealLevelOptions,dealLevel} = formData
                return dealLevel === "basket" || dealLevelOptions === 'no'
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