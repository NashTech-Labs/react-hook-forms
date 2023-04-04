import { ICreateDealFormState } from '../constants/CreateDealFormStateType'
import { DEAL_APPLY_TYPE, STACKING_TYPES} from '../constants/FormOptions'
import { convertDateTime } from './ConvertDateTime'

const getRewardType = ({ dealDiscountTab, dollarOff, percentageOff, fixedPriceOff, customPercentageOff, dealLevel, basketDealType, basketDiscount }: ICreateDealFormState) => {
    let rewardType = '$_OFF'
    let rewardValue = null

    if (dealLevel === 'basket') { 
        if (basketDealType === 'dollar') {
            rewardType = '$_OFF'
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
        rewardType = '$_OFF'
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

        fileLIAM.map((value: string, index: Number) => {
            data.push({
                    "type": "PRODUCT_CODE",
                    "sub_type": "LIAM",
                    "value": value,
            })
        })

        fileMCH.map((value: string, index: Number) => {
            data.push({
                    "type": "CATEGORY",
                    "sub_type": "MCH",
                    "value": value,
            })
        })
    
        liam.map((value: string, index: Number) => {
            data.push({
                    "type": "PRODUCT_CODE",
                    "sub_type": "LIAM",
                    "value": value,
            })
        })

        mch.map((value: string, index: Number) => {
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
                value: dealCriteriaType === '$_OFF' || dealCriteriaType === '$_FIXED' ? (Number(element.get) * 100).toFixed() : element.get,
                restrictions: {
                    quantity: {
                        minimum: element.buy,
                        maximum: null
                    }
                }
            }) 
        });
    }

    else
    {
        data.forEach((element: any, index: number) => {
            rewardData.push({
                value: dealCriteriaType === '$_OFF' || dealCriteriaType === '$_FIXED' ? (Number(element.get) * 100).toFixed() : element.get, 
                // element.get,
                restrictions: {
                    quantity: {
                        minimum: element.buy,
                        maximum: data.length === rewardData.length ? null : Number(data[index + 1]?.buy) - 1 
                    }
                }
            }) 
        });
    }

    return rewardData

}

const generateCreateDealPayload  = (formData : ICreateDealFormState) => {
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
         basketSpend
        } = formData
    const { rewardType, rewardValue } = getRewardType(formData)
    const dealApplyTypeEnum = getDealApplyType(dealApplyType)

    const payload: any = {
        "title": title,
        "description": description,
        "priority": priority,
        "stacking_type": STACKING_TYPES[stackingType],
        "scope_type": dealLevel?.toUpperCase(),
        "scopes": getScopeData(productsCollectionTab, fileLIAM, fileMCH, liam, mch),
        "valid_from": convertDateTime(startDatePicker,startTimePicker),
        "valid_to": convertDateTime(endDatePicker,endTimePicker),
        "promo_restrictions": {
            "product_code": {
                "liam": [...exFileLIAM, ...exliam]
            },
            "category": {
                "mch": [...exFileMCH, ...exmch]
            }
        },
        "store_id": "5264",
        "promotion_message_english": englishMessage,
        "promotion_message_french": frenchMessage,
        "status": "DRAFT",
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

    if (dealType === 'Discount') {
        payload["rewards"] = [
            {
                "value": String(rewardValue)
            }
        ],
        payload["reward_type"] = rewardType
    }

    if (dealType === 'Multi-buy') {
        payload["rewards"] = getRewardMultiBuy(dealCriteria, dealCriteriaType),
        payload["reward_type"] = dealCriteriaType === '$_OFF' ? '$_OFF_MULTI' :  dealCriteriaType === "%_OFF" ? "%_OFF_MULTI" : "$_FIXED_MULTI";
        if (dealCriteria.length === 1)
        {
            payload["promo_restrictions"]["quantity"] = {
                minimum: dealCriteria[dealCriteria.length - 1].buy,
                maximum: null
            }
        }
    }

    return payload

}

export default generateCreateDealPayload