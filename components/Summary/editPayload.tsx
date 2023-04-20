import { dealPreview } from "../../api/dealPreview"

export const editPayload = (data: dealPreview, name: string, isDealActive: boolean) => {

    const payload: any = {
        "title": data?.generalDealInfo?.title,
        "description": data?.generalDealInfo?.description,
        "status": isDealActive ? "INACTIVE" : "PUBLISHED",
        "priority": data?.generalDealInfo?.priority,
        "stacking_type": data?.generalDealInfo?.stacking_type,
        "scope_type": data?.dealValue?.scopeType,
        "scopes": data?.dealValue?.scopeValue,
        "reward_type": data?.dealValue?.rewardType,
        "rewards": data?.dealValue?.rewardsValue,
        "valid_from": data?.generalDealInfo?.valid_from,
        "valid_to": data?.generalDealInfo?.valid_to,
        "promo_restrictions": {
            "product_code": {
                "liam": data?.exclusion?.product?.liam
            },
            "category": {
                "mch": data?.exclusion?.product?.mch
            },
            // "price_applicability": {
            //     "value": data?.applicableProduct?.priceApplicability?.value
            // }

            spend: data?.dealValue?.spend
        },
        "store_id": "5264",
        "promotion_message_english": data?.generalDealInfo?.promotion_message_english,
        "promotion_message_french": data?.generalDealInfo?.promotion_message_french,
        "username": name
    }

    if (data?.generalDealInfo?.type !== "FREE_SHIPPING") {
        payload["promo_restrictions"]["price_applicability"] = data?.applicableProduct?.priceApplicability?.value
    }

    return payload

}