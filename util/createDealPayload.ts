import { ICreateDealFormState } from '../constants/CreateDealFormStateType'
import { DEAL_APPLY_TYPE, DISCOUNT_DEAL_TYPE, FREE_SHIPPING_DEAL_TYPE, MULTI_BUY_DEAL_TYPE, STACKING_TYPES} from '../constants/FormOptions'
import { convertDateTime } from './ConvertDateTime'

const getRewardType = ({ dealDiscountTab, dollarOff, percentageOff, fixedPriceOff, customPercentageOff, dealLevel, basketDealType, basketDiscount }: ICreateDealFormState) => {
    let rewardType = '$_OFF'
    let rewardValue = null

    if (dealLevel === 'basket') { 
        if (basketDealType === 'dollar') {
            rewardValue = basketDiscount ? (Number(basketDiscount) * 100).toFixed() : basketDiscount
        }

        if (basketDealType === 'percentage')
        {
            rewardType = '%_OFF'
            rewardValue = basketDiscount
        }
    }

    else {
    
    if(dealDiscountTab === 'dollar'){
        rewardValue = dollarOff ? (Number(dollarOff) * 100).toFixed() : dollarOff
    }

    if(dealDiscountTab === 'percentage'){

        if (percentageOff === "custom") {
            rewardType = '%_OFF'
            rewardValue = customPercentageOff
        }
        else {
            rewardType = '%_OFF'
            rewardValue = percentageOff
        }
    }

    if(dealDiscountTab === 'fixed') {
        rewardType = '$_FIXED'
        rewardValue = fixedPriceOff ? (Number(fixedPriceOff) * 100).toFixed() : fixedPriceOff
    }

    }

    return {
        rewardType,
        rewardValue
    }
}

const getDealApplyType = (dealApplyType: string) => DEAL_APPLY_TYPE[dealApplyType]

const getScopeData = (productsCollectionTab: string, fileLIAM: string[], fileMCH: string[], liam: string[], mch: string[]) => {
    let data: any = []

        fileLIAM.forEach((value: string) => {
            data.push({
                    "type": "PRODUCT_CODE",
                    "sub_type": "LIAM",
                    "value": value,
            })
        })

        fileMCH.forEach((value: string) => {
            data.push({
                    "type": "CATEGORY",
                    "sub_type": "MCH",
                    "value": value,
            })
        })
    
        liam.forEach((value: string) => {
            data.push({
                    "type": "PRODUCT_CODE",
                    "sub_type": "LIAM",
                    "value": value,
            })
        })

        mch.forEach((value: string) => {
            data.push({
                    "type": "CATEGORY",
                    "sub_type": "MCH",
                    "value": value,
            })
        })

    return data
} 

const getRewardMultiBuy = (data: any, dealCriteriaType: string) => {
    let rewardData: any = []

    if (data.length === 1)
    {
        data.forEach((element: any, index: number) => {
            rewardData.push({
                value: dealCriteriaType === '$_OFF_MULTI' || dealCriteriaType === '$_FIXED_MULTI' ? (Number(element.get) * 100).toFixed() : element.get,
            }) 
        });
    }

    else
    {
        data.forEach((element: any, index: number) => {
            rewardData.push({
                value: dealCriteriaType === '$_OFF_MULTI' || dealCriteriaType === '$_FIXED_MULTI' ? (Number(element.get) * 100).toFixed() : element.get, 
                // element.get,
                restrictions: {
                    quantity: {
                        minimum: parseInt(element.buy),
                        maximum: data.length === rewardData.length ? null : Number(data[index + 1]?.buy) - 1 
                    }
                }
            }) 
        });
    }

    return rewardData

}

const generateCreateDealPayload  = (formData : ICreateDealFormState, isDraft: boolean) => {
    const { 
         title,
         description,
         priority,
         stackingType,
         dealLevel,
         mch,
         dealType,
         dealCriteria,
         dealCriteriaType,
         liam,
         dealApplyType,
         exmch,
         exliam,
         englishMessage,
         frenchMessage,
         startDatePicker,
         startTimePicker,
         endDatePicker,
         endTimePicker,
         fileMCH,
         exFileMCH,
         fileLIAM,
         exFileLIAM,
         productsCollectionTab,
         basketSpend,
         spendMinimum, 
         customMinimumSpend
        } = formData
    const { rewardType, rewardValue } = getRewardType(formData)
    const dealApplyTypeEnum = getDealApplyType(dealApplyType)
    const payload: any = {
        "title": title,
        "description": description,
        "priority": priority,
        "stacking_type": STACKING_TYPES[stackingType],
        "scope_type": dealType === FREE_SHIPPING_DEAL_TYPE ? "BASKET" : dealLevel?.toUpperCase(),
        "scopes": getScopeData(productsCollectionTab, fileLIAM, fileMCH, liam, mch),
        "valid_from": convertDateTime(startDatePicker,startTimePicker),
        "valid_to": convertDateTime(endDatePicker,endTimePicker),
        "store_id": "5264",
        "promotion_message_english": englishMessage,
        "promotion_message_french": frenchMessage,
        "promo_restrictions" : {},
        "status": isDraft ? 'DRAFT' : "PUBLISHED"

    }

    if (dealLevel === 'product' && dealType !== "FREE_SHIPPING" ) {
        payload["promo_restrictions"]['product_code'] = {
            "liam": [...exFileLIAM, ...exliam]
        }
        payload["promo_restrictions"]['category'] = {
            "mch": [...exFileMCH, ...exmch]
        }
    }


    if(dealApplyTypeEnum === 'REGULAR_ONLY') {
        payload["promo_restrictions"]['price_applicability'] = {
            "value": dealApplyTypeEnum
        }
    }

    if(dealLevel?.toUpperCase() === 'BASKET') {
        payload["promo_restrictions"]['spend'] = {
            "minimum": (Number(basketSpend) * 100).toFixed(),
            "maximum": null
        }
    }

    if (dealType === DISCOUNT_DEAL_TYPE) {
        payload["rewards"] = [
            {
                "value": String(rewardValue)
            }
        ]
        payload["reward_type"] = rewardType
    }

    if (dealType === MULTI_BUY_DEAL_TYPE) {
        payload["rewards"] = getRewardMultiBuy(dealCriteria, dealCriteriaType)
        payload["reward_type"] = dealCriteriaType;
        if (dealCriteria.length === 1)
        {
            payload["promo_restrictions"]["quantity"] = {
                minimum: parseInt(dealCriteria[dealCriteria.length - 1].buy),
                maximum: null
            }
        }
    }

    if (dealType === FREE_SHIPPING_DEAL_TYPE) {
        const notCustomValue = spendMinimum === 'NO_MINIMUM' ? "0" : (Number(spendMinimum) * 100).toFixed()
        payload["reward_type"] = "NO_FEE"
        payload["rewards"] = [{
            value: "SHIPPING",
            restrictions: {}
        }]
        payload["promo_restrictions"]['spend'] = {
            "minimum": spendMinimum === 'CUSTOM' ? (Number(customMinimumSpend) * 100).toFixed() : notCustomValue,
            "maximum": null
        }
    }
    
    return payload
}

export default generateCreateDealPayload