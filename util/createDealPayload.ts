import moment from 'moment'
import { ICreateDealFormState } from '../constants/CreateDealFormStateType'

const getRewardType = ({ dealDiscountTab, dollarOff, percentageOff, fixedPriceOff }: ICreateDealFormState) => {
    let rewardType = '$_OFF'
    let rewardValue = null
    
    if(dealDiscountTab === 'dollar'){
        rewardType = '%_OFF'
        rewardValue = dollarOff
    }
    if(dealDiscountTab === 'percentage'){
        rewardType = '%_OFF'
        rewardValue = percentageOff
    }

    if(dealDiscountTab === 'fixed') {
        rewardType = 'FIXED_OFF'
        rewardValue = fixedPriceOff
    }

    return {
        rewardType,
        rewardValue
    }
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
         endDatePicker
        } = formData
    const { rewardType, rewardValue } = getRewardType(formData)

    return {
        "title": title,
        "description": description,
        "priority": priority,
        "stacking_type": stackingType,
        "scope_type": dealLevel,
        "scopes": {
            "product_code": {
               "liam": liam,
                "mch": mch
            },
            "price_applicability": {
                "value": dealApplyType
            }
        },
        "reward_type": rewardType,
        "rewards": [
            {
                "value": rewardValue,
                "restrictions": null
            }
        ],
        "valid_from": moment.utc(startDatePicker).valueOf(),
        "valid_to": moment.utc(endDatePicker).valueOf(),
        "promo_restrictions": {
            "product_code": {
               "liam": exliam,
                "mch": exmch
            },
            "price_applicability": {
                "value": dealApplyType
            }
        },
        "store_id": "1234",
        "promotion_message_english": englishMessage,
        "promotion_message_french": frenchMessage,
        "deal_stage": "DRAFT",
        "username": "Alex"
    }

}

export default generateCreateDealPayload