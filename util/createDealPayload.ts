import { ICreateDealFormState } from '../constants/CreateDealFormStateType'
import { DEAL_APPLY_TYPE } from '../constants/FormOptions'
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
        rewardType = 'FIXED_OFF'
        rewardValue = fixedPriceOff
    }

    }

    return {
        rewardType,
        rewardValue
    }
}

const getDealApplyType = (dealApplyType: string) => DEAL_APPLY_TYPE[dealApplyType]

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

    return {
        "title": title,
        "description": description,
        "priority": priority,
        "stacking_type": stackingType,
        "scope_type": dealLevel?.toUpperCase(),
        "scopes": {
            "product_code": {
               "liam": productsCollectionTab === "uploadProduct" ? fileLIAM : liam,
                "mch": productsCollectionTab === "uploadProduct" ? fileMCH : mch
            }
        },
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
               "liam": productExclusionsCollectionTab === "uploadProduct" ? exFileLIAM : exliam,
               "mch": productExclusionsCollectionTab === "uploadProduct" ? exFileMCH : exmch
            },
            "price_applicability": {
                "value": getDealApplyType(dealApplyType)
            }
        },
        "store_id": "5264",
        "promotion_message_english": englishMessage,
        "promotion_message_french": frenchMessage,
        "status": "DRAFT",
    }

}

export default generateCreateDealPayload