import { FREE_SHIPPING_DEAL_TYPE, minimumSpendOptions, MULTI_BUY_DEAL_TYPE, percentageOptions, STACKING_TYPES } from '../constants/FormOptions'
import {convertToEST} from './ConvertDateTime'

const convertCentsToDollar = (value: number) => {
    if(value) return value/100
    return ''
}

const getDealValues = (deal: any) => {
   const { dealValue : { scopeType, rewardsValue, rewardType, spend } } = deal
   const dealValues: any = {}
   if(scopeType === 'PRODUCT') {
      if(rewardType === '$_OFF') {
         dealValues['dollarOff'] = String(convertCentsToDollar(rewardsValue?.[0]?.value))
         dealValues['dealDiscountTab'] = 'dollar'
      }
      if(rewardType === '%_OFF') {
        const percentageValue = String(rewardsValue?.[0]?.value)
        const isNotCustomPercentage = percentageOptions.some(({ value }) => value  === percentageValue)
        dealValues['dealDiscountTab'] = 'percentage'
        if(isNotCustomPercentage) {
         dealValues['percentageOff'] = String(rewardsValue?.[0]?.value)
         dealValues['customPercentageOff'] = ''
        } else {
         dealValues['percentageOff'] = 'custom'
           dealValues['customPercentageOff'] = String(rewardsValue?.[0]?.value)
        }
     }
     if(rewardType === '$_FIXED') {
        dealValues['fixedPriceOff'] = String(convertCentsToDollar(rewardsValue?.[0]?.value))
        dealValues['dealDiscountTab'] = 'fixed'
     }
   } else {
       dealValues['basketDiscount'] =  rewardType === '%_OFF' ? String(rewardsValue?.[0]?.value) : String(convertCentsToDollar(rewardsValue?.[0]?.value))
       dealValues['basketSpend'] =  String(convertCentsToDollar(spend?.minimum))
       dealValues['basketDealType'] = rewardType === '%_OFF' ? 'percentage' : 'dollar'
   }

   return dealValues
}

const getMultibuyValues = (deal: any) => {
   const values: any = {}
   const { generalDealInfo: { type }, dealValue : { rewardsValue, rewardType, quantity } } = deal
   if(type === MULTI_BUY_DEAL_TYPE) {
      values['dealCriteria'] = rewardsValue.map(({ value, restrictions }: any) => {
         const criteria: any = {
            get: rewardType === '%_OFF_MULTI' ? String(value) : String(convertCentsToDollar(value))
         }
         if(restrictions) {
            const { quantity: { minimum } } = restrictions
            criteria['buy'] = String(minimum)
         } else if(quantity) {
            criteria['buy'] = String(quantity.minimum)
         }
         return criteria
      })
      values['dealCriteriaType'] = rewardType
   }

   return values
}

const getFreeShippingValues = (deal: any) => {
 const values: any = {}

 const { generalDealInfo: { type }, dealValue } = deal

 if(type === FREE_SHIPPING_DEAL_TYPE) {
   const minimum = dealValue?.spend?.minimum
   if(!minimum) return values
   const spendValue = String(convertCentsToDollar(minimum))
   const isNotCustom = minimumSpendOptions.some(({ value }) => value === spendValue)
   if(isNotCustom){
      values['spendMinimum'] = spendValue
      values['customMinimumSpend'] = ''
   } else {
      values['spendMinimum'] = 'CUSTOM'
      values['customMinimumSpend'] = spendValue
   }
 }

 return values
}

const convertDealDataToFormData = (deal: any) => {
 const formData: any = {
    mch: [],
    exmch: [],
    liam: [],
    exliam: [],
    fileMCH: [],
    exFileMCH: [],
    fileLIAM: [],
    exFileLIAM: [],
    productsCollectionTab: 'uploadProduct',
    productExclusionsCollectionTab: 'uploadProduct',
 }

 const { generalDealInfo, dealValue, applicableProduct, exclusion } = deal
 const { title, description, priority, stacking_type, type, promotion_message_english, promotion_message_french, valid_from, valid_to } = generalDealInfo
 const { scopeType } = dealValue
 const { priceApplicability } = applicableProduct
 const { product } = exclusion

 formData['dealType'] = type
 formData['title'] = title
 formData['description'] = description
 formData['priority'] = priority
 formData['stackingType'] = Object.keys(STACKING_TYPES).find(key => STACKING_TYPES[key] === stacking_type) || ''
 formData['dealLevel'] = scopeType.toLowerCase()
 formData['englishMessage'] = promotion_message_english
 formData['frenchMessage'] = promotion_message_french
 formData['dealApplyType'] = priceApplicability === null ? 'all' : 'regular_priced_only'
 formData['dealLevelOptions'] = Object.values(product).some(value => Array.isArray(value) && value.length > 0) ? 'yes' : 'no'
 formData['isListValid'] = type === MULTI_BUY_DEAL_TYPE
 formData['startDatePicker'] = convertToEST('')
 formData['startTimePicker'] = convertToEST('')
 formData['endDatePicker'] = convertToEST('')
 formData['endTimePicker'] = convertToEST('')
 if(valid_from) {
   formData['startDatePicker'] = convertToEST(valid_from)
   formData['startTimePicker'] = convertToEST(valid_from)
 }
 if(valid_to) {
   formData['endDatePicker'] = convertToEST(valid_to)
   formData['endTimePicker'] = convertToEST(valid_to)
 }

 return {
   ...formData,
   ...getDealValues(deal),
   ...getMultibuyValues(deal),
   ...getFreeShippingValues(deal)
 }
}

export default convertDealDataToFormData