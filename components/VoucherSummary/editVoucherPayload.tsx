import { voucherPreview } from "../../api/voucherPreview"

export const editVoucherPayload = (data: voucherPreview, name: string, isDealActive: boolean, isVoucherId: number) => {

    const payload: any = {
        description: data?.voucherGeneralInfo?.description,
        voucherId: isVoucherId,
        code: data?.voucherGeneralInfo?.code,
        scopes: data?.vouchersProductsAndCollections?.scopes,
        rewards: [
            {
                value: String(data?.voucherValues?.rewards[0]?.value),
            },
        ],
        reward_type: data?.voucherValues?.rewardType,
        priority: data?.voucherGeneralInfo?.priority,
        status: isDealActive ? "INACTIVE" : "PUBLISHED",
        valid_from: data?.vouchersDateInEffect?.validFrom,
        valid_to: data?.vouchersDateInEffect?.validTo,
        stacking_type: data?.voucherGeneralInfo?.stackingType,
        scope_type: data?.voucherValues?.scopeType,
        promo_restrictions: {},
        username: name
    }

    if (data?.voucherExclusions?.priceApplicability) {
        payload["promo_restrictions"]["price_applicability"] = {
            value: data?.voucherExclusions?.priceApplicability?.value
        }
    }

    if (data?.voucherValues?.scopeType !== "BASKET") {
        payload["promo_restrictions"]["product_code"] = {
            "liam": data?.voucherExclusions?.product?.liam
        }
        payload["promo_restrictions"]["category"] = {
            "mch": data?.voucherExclusions?.product?.mch
        }
    }

    return payload

}