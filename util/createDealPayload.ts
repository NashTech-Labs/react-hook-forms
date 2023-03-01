import { ICreateDealFormState } from '../constants/CreateDealFormStateType'
import { DEAL_APPLY_TYPE, STACKING_TYPES} from '../constants/FormOptions'
import { convertDateTime } from './ConvertDateTime'

const getRewardType = ({ dealDiscountTab, dollarOff, percentageOff, fixedPriceOff, customPercentageOff, dealLevel, basketDealType, basketDiscount }: ICreateDealFormState) => {
    let rewardType = '$_OFF'
    let rewardValue = null

    if (dealLevel === 'basket') { 
        if (basketDealType === 'dollar') {
            rewardType = '$_OFF'
            rewardValue = basketDiscount    
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
        rewardValue = dollarOff
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
        rewardValue = fixedPriceOff
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

    if (productsCollectionTab === "uploadProduct")
    {
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
    }

    if (productsCollectionTab !== "uploadProduct")
    {
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
    }

    return data
} 

const generateCreateDealPayload  = (formData : ICreateDealFormState) => {
    const { 
         title,
         description,
         priority,
         stackingType,
         dealLevel,
         mch,
         liam ,
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
         productExclusionsCollectionTab
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
        "reward_type": rewardType,
        "rewards": [
            {
                "value": String(rewardValue)
            }
        ],
        "valid_from": convertDateTime(startDatePicker,startTimePicker),
        "valid_to": convertDateTime(endDatePicker,endTimePicker),
        "promo_restrictions": {
            "product_code": {
                "liam": productExclusionsCollectionTab === "uploadProduct" ? exFileLIAM : exliam
            },
            "category": {
                "mch": productExclusionsCollectionTab === "uploadProduct" ? exFileMCH : exmch
            }
        },
        "store_id": "5264",
        "promotion_message_english": englishMessage,
        "promotion_message_french": frenchMessage,
        "status": "DRAFT",
    }

    if(dealApplyTypeEnum === 'REGULAR_ONLY') {
        payload['price_applicability'] = {
            "value": dealApplyTypeEnum
        }
    }

    return payload

}

export default generateCreateDealPayload