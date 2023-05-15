import { DealPreview } from "../../api/dealPreview"

export const editPayload = (data: DealPreview, name: string, isDealActive: boolean) => {

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
            spend: data?.dealValue?.spend
        },
        "store_id": "5264",
        "promotion_message_english": data?.generalDealInfo?.promotion_message_english,
        "promotion_message_french": data?.generalDealInfo?.promotion_message_french,
        "username": name
    }

    if (data?.generalDealInfo?.type !== "FREE_SHIPPING") {
        payload["promo_restrictions"]["price_applicability"] = data?.applicableProduct?.priceApplicability?.value
        payload["promo_restrictions"]["product_code"] = {
            "liam": data?.exclusion?.product?.liam
        }
        payload["promo_restrictions"]["category"] = {
            "mch": data?.exclusion?.product?.mch
        }
    }

    if (data?.generalDealInfo?.type === "MULTI_BUY") {
        if (data?.dealValue?.rewardsValue.length === 1) {
            payload["promo_restrictions"]["quantity"] =
                data?.dealValue?.quantity
        }
    }

    return payload

}