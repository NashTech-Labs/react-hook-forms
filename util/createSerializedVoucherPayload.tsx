import { ICreateVoucherFormState } from "../constants/CreateVoucherFormStateType";
import { DEAL_APPLY_TYPE, STACKING_TYPES } from "../constants/FormOptions";
import { ICreateSerializedVoucherFormState } from "../constants/SerializedVoucherFormStateType";
import { convertDateTime } from "./ConvertDateTime";

const getRewardType = ({
  dealDiscountTab,
  dollarOff,
  fixedPriceOff,
  voucherLevel,
  basketDiscount,
}: ICreateSerializedVoucherFormState) => {
  let rewardType = "$_OFF";
  let rewardValue = null;

  if (voucherLevel === "basket") {
    // if (basketDealType === "dollar") {
    //   rewardValue = basketDiscount
    //     ? (Number(basketDiscount) * 100).toFixed()
    //     : basketDiscount;
    // }

    // if (basketDealType === "percentage") {
    //   rewardType = "%_OFF";
    //   rewardValue = basketDiscount;
    // }
  } else {
    if (dealDiscountTab === "dollar") {
      rewardValue = dollarOff ? (Number(dollarOff) * 100).toFixed() : dollarOff;
    }

    if (dealDiscountTab === "percentage") {
      // if (percentageOff === "custom") {
      //   rewardType = "%_OFF";
      //   rewardValue = customPercentageOff;
      // } else {
      //   rewardType = "%_OFF";
      //   rewardValue = percentageOff;
      // }
    }

    if (dealDiscountTab === "fixed") {
      rewardType = "$_FIXED";
      rewardValue = fixedPriceOff
        ? (Number(fixedPriceOff) * 100).toFixed()
        : fixedPriceOff;
    }
  }

  return {
    rewardType,
    rewardValue,
  };
};

const getScopeData = (
  productsCollectionTab: string,
  fileLIAM: string[],
  fileMCH: string[],
  liam: string[],
  mch: string[]
) => {
  let data: any = [];

  fileLIAM.forEach((value: string) => {
    data.push({
      type: "PRODUCT_CODE",
      sub_type: "LIAM",
      value: value,
    });
  });

  fileMCH.forEach((value: string) => {
    data.push({
      type: "CATEGORY",
      sub_type: "MCH",
      value: value,
    });
  });

  liam.forEach((value: string) => {
    data.push({
      type: "PRODUCT_CODE",
      sub_type: "LIAM",
      value: value,
    });
  });

  mch.forEach((value: string) => {
    data.push({
      type: "CATEGORY",
      sub_type: "MCH",
      value: value,
    });
  });

  return data;
};

const getDeliveryDetails = (pickUpOrders: boolean, deliveryOrders: boolean) => {
  
  if (pickUpOrders && deliveryOrders) {
    return ["PICKUP", "DELIVERY"]
  }
  
  if (pickUpOrders) {
    return ["PICKUP"]
  }

  if (deliveryOrders) {
    return ["DELIVERY"]
  }
}

const getRestrictions = (restrictions: string[]) => {
  const restrictionsArray = restrictions.map(item => item.toUpperCase());
  return restrictionsArray
}

const getVoucherApplyType = (dealApplyType: string) =>
  DEAL_APPLY_TYPE[dealApplyType];

const generateCreateSerializedVoucherPayload = (
  formData: ICreateSerializedVoucherFormState,
  isDraft: boolean
) => {
  const {
    externalVoucherCode,
    description,
    priority,
    stackingType,
    voucherLevel,
    mch,
    liam,
    dealApplyType,
    exmch,
    exliam,
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
    voucherQuantity,
    voucherType,
    restrictions,
    englishMessage,
    frenchMessage,
    pickUpOrders,
    deliveryOrders
  } = formData;

  const { rewardType, rewardValue } = getRewardType(formData);
  const voucherApplyTypeEnum = getVoucherApplyType(dealApplyType);

  const payload: any = {
    description: description,
    code: externalVoucherCode.toUpperCase(),
    // scopes: getScopeData(productsCollectionTab, fileLIAM, fileMCH, liam, mch),
    rewards: [
      {
        value: String(rewardValue),
      },
    ],
    reward_type: rewardType,
    priority: priority,
    status: isDraft ? "DRAFT" : "PUBLISHED",
    action: isDraft ? "SAVE" : "PUBLISH",
    quantity: voucherQuantity,
    redemptions_per_customer: 1,
    valid_from: convertDateTime(startDatePicker, startTimePicker),
    valid_to: convertDateTime(endDatePicker, endTimePicker),
    stacking_type: STACKING_TYPES[stackingType],
    scope_type: voucherLevel?.toUpperCase(),
    promo_restrictions: {},
    display_message_en: englishMessage,
    display_message_fr: frenchMessage,
    is_serialized: true
  };

  if (voucherLevel === "product") {
    payload["scopes"] = getScopeData(
      productsCollectionTab,
      fileLIAM,
      fileMCH,
      liam,
      mch
    );
  }

  if (voucherLevel === "product") {
    payload["promo_restrictions"]["product_code"] = {
      liam: [...exFileLIAM, ...exliam],
    };
    payload["promo_restrictions"]["category"] = {
      mch: [...exFileMCH, ...exmch],
    };
  }

  if (voucherLevel?.toUpperCase() === "BASKET") {
    payload["promo_restrictions"]["spend"] = {
      minimum: Number((Number(basketSpend) * 100).toFixed()),
      maximum: null,
    };
  }

  if (voucherApplyTypeEnum === "REGULAR_ONLY") {
    payload["promo_restrictions"]["price_applicability"] = {
      value: voucherApplyTypeEnum,
    };
  }

  if (voucherType === "SERIALIZED") {
    payload["promo_restrictions"]["fulfillment"] = {
      "allowed_types": getDeliveryDetails(pickUpOrders, deliveryOrders),
    };
  }

  if (voucherType === "SERIALIZED") {
    payload["promo_restrictions"]["banner"] = {
      "include": getRestrictions(restrictions),
    };
  }

  return payload;
};

export default generateCreateSerializedVoucherPayload;
