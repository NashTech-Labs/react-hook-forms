import { ICreateVoucherFormState } from "../constants/CreateVoucherFormStateType";
import { DEAL_APPLY_TYPE, STACKING_TYPES } from "../constants/FormOptions";
import { ICreateSerializedVoucherFormState } from "../constants/SerializedVoucherFormStateType";
import { convertDateTime } from "./ConvertDateTime";

const getRewardType = ({
  voucherDiscountTab,
  dollarOff,
  voucherLevel,
  basketDollarOff,
  pointsApplyType,
  basketpointsApplyType,
  waivefess,
  voucherValueDollarOffCriteria,
  dollarOffMultiBuyDiscount,
  dollarOffMultiBuyQuantity,
}: ICreateSerializedVoucherFormState) => {
  let rewardType = "$_OFF";
  let rewardValue = null;

  if (voucherLevel === "basket") {
    if (voucherDiscountTab === "dollar") {
      rewardValue = (Number(basketDollarOff) * 100).toFixed();
    }

    if (voucherDiscountTab === "points") {
      rewardType = "POINTS";
      rewardValue = basketpointsApplyType;
    }

    if (voucherDiscountTab === "fulfillment") {
      rewardType = "NO_FEE";
      rewardValue = waivefess ? "ALL_FULFILLMENT_FEES" : null;
    }
  } else {
    if (voucherDiscountTab === "dollar") {
      if (voucherValueDollarOffCriteria === "MINIMUM_SPEND") {
        rewardValue = (Number(dollarOff) * 100).toFixed();
      } 
      if (voucherValueDollarOffCriteria === "MULTI_BUY")
      {
        rewardType = "$_OFF_MULTI";
        rewardValue = (Number(dollarOffMultiBuyDiscount) * 100).toFixed();
      }
    }

    if (voucherDiscountTab === "points") {
      rewardType = "POINTS";
      rewardValue = pointsApplyType;
    }
  }

  return {
    rewardType,
    rewardValue: [
      {
        value: String(rewardValue),
      },
    ],
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
    return ["PICKUP", "DELIVERY"];
  }

  if (pickUpOrders) {
    return ["PICKUP"];
  }

  if (deliveryOrders) {
    return ["DELIVERY"];
  }
};

const getRestrictions = (restrictions: string[]) => {
  const restrictionsArray = restrictions.map((item) => item.toUpperCase());
  return restrictionsArray;
};

const getVoucherApplyType = (dealApplyType: string) =>
  DEAL_APPLY_TYPE[dealApplyType];

const generateCreateSerializedVoucherPayload = (
  formData: ICreateSerializedVoucherFormState,
  isDraft: boolean,
  batch_size: number
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
    basketpointsApplyType,
    voucherQuantity,
    voucherType,
    restrictions,
    englishMessage,
    frenchMessage,
    pickUpOrders,
    deliveryOrders,
    dollarOffSpend,
    voucherDiscountTab,
    voucherValueDollarOffCriteria,
    fulfillmentSpend,
    dollarPointDiscount,
    basketdollarPointDiscount,
    dollarOffMultiBuyQuantity
  } = formData;

  const { rewardType, rewardValue } = getRewardType(formData);
  const voucherApplyTypeEnum = getVoucherApplyType(dealApplyType);

  const payload: any = {
    description: description,
    code: externalVoucherCode.toUpperCase(),
    // scopes: getScopeData(productsCollectionTab, fileLIAM, fileMCH, liam, mch),
    rewards: rewardValue,
    reward_type: rewardType,
    priority: priority,
    status: "DRAFT",
    quantity: voucherQuantity,
    redemptions_per_customer: 1,
    valid_from: convertDateTime(startDatePicker, startTimePicker),
    valid_to: convertDateTime(endDatePicker, endTimePicker),
    stacking_type: STACKING_TYPES[stackingType],
    scope_type: voucherLevel?.toUpperCase(),
    promo_restrictions: {},
    // display_message_en: englishMessage,
    // display_message_fr: frenchMessage,
    is_serialized: true,
    action: isDraft ? "DISABLE" : "PUBLISH",
    batch_size: batch_size,
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

  if (voucherLevel?.toUpperCase() === "BASKET" && voucherDiscountTab === "points") {
    payload["promo_restrictions"]["spend"] = {
      minimum: Number((Number(basketdollarPointDiscount) * 100).toFixed()),
      maximum: null,
    };
  }

  if (voucherDiscountTab === "dollar" && voucherValueDollarOffCriteria === "MULTI_BUY") {
    payload["promo_restrictions"]["spend"] = {
      minimum: Number(dollarOffMultiBuyQuantity),
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
      allowed_types: getDeliveryDetails(pickUpOrders, deliveryOrders),
    };
    payload["promo_restrictions"]["banner"] = {
      include: getRestrictions(restrictions),
    };
    if (
      voucherDiscountTab === "dollar" &&
      voucherValueDollarOffCriteria === "MINIMUM_SPEND"
    ) {
      payload["promo_restrictions"]["spend"] = {
        minimum: Number((dollarOffSpend)).toFixed(),
        maximum: null,
      };
    }

    if (voucherLevel?.toUpperCase() === "PRODUCT" && voucherDiscountTab === "points") {
      payload["promo_restrictions"]["spend"] = {
        minimum: Number((Number(dollarPointDiscount) * 100).toFixed()),
        maximum: null,
      };
    }

    if (voucherDiscountTab === "fulfillment" && voucherLevel === "basket") {
      payload["promo_restrictions"]["spend"] = {
        minimum: Number((Number(fulfillmentSpend) * 100).toFixed()),
        maximum: null,
      };
    }
  }

  return payload;
};

export default generateCreateSerializedVoucherPayload;
