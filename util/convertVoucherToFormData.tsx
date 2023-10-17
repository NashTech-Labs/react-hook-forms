import {
  MULTI_BUY_DEAL_TYPE,
  STACKING_TYPES,
  percentageOptions,
} from "../constants/FormOptions";
import { convertToEST } from "./ConvertDateTime";

const convertCentsToDollar = (value: number) => {
  if (value) return value / 100;
  return "";
};

const getMchLiamValues = (voucher: any) => {
  const mch: Array<string> = [];
  const liam: Array<string> = [];
  const {
    vouchersProductsAndCollections: { scopes },
    voucherExclusions,
  } = voucher;
  scopes?.forEach(({ value, sub_type }: any) => {
    if (sub_type === "MCH") {
      mch.push(value);
    } else {
      liam.push(value);
    }
  });

  return {
    mch,
    liam,
    exmch: voucherExclusions?.product?.mch || [],
    exliam: voucherExclusions?.product?.liam || [],
  };
};

const getDealValues = (voucher: any) => {
  const {
    voucherValues: { scopeType, rewards, rewardType },
    voucherGeneralInfo: { type, quantity, enMessage, frMessage },
    voucherBannerRestriction,
  } = voucher;

  const { voucherExclusions } = voucher;

  const dealValues: any = {};

  if (type === "SERIALIZED") {
    dealValues["englishMessage"] = enMessage;
    dealValues["frenchMessage"] = frMessage;
    dealValues["voucherQuantity"] = quantity;
    dealValues["restrictions"] =
      voucherBannerRestriction?.banner?.include || [];
    dealValues["pickUpOrders"] =
      voucherBannerRestriction?.fulfillment?.allowed_types?.includes("PICKUP");
    dealValues["deliveryOrders"] =
      voucherBannerRestriction?.fulfillment?.allowed_types?.includes(
        "DELIVERY"
      );
  }
  if (scopeType === "PRODUCT") {
    if (rewardType === "$_OFF") {
      dealValues["dollarOff"] = String(
        convertCentsToDollar(rewards?.[0]?.value)
      );
      if (type === "SERIALIZED") {
        dealValues["voucherDiscountTab"] = "dollar";
        if (rewards[0]?.restrictions) {
          dealValues["voucherValueDollarOffCriteria"] = "MULTI_BUY";
          dealValues["dollarOffMultiBuyQuantity"] = String(
            rewards[0]?.restrictions?.quantity?.minimum
          );
          dealValues["dollarOffMultiBuyDiscount"] = String(
            convertCentsToDollar(rewards?.[0]?.value)
          );
        } else {
          dealValues["voucherValueDollarOffCriteria"] =
            "restrictions" in rewards ? "MULTI_BUY" : "MINIMUM_SPEND";
          dealValues["dollarOffSpend"] = voucherExclusions?.spend
            ? String(voucherExclusions?.spend?.minimum)
            : null;
        }
      } else {
        dealValues["dealDiscountTab"] = "dollar";
      }
    }
    if (rewardType === "%_OFF") {
      const percentageValue = String(rewards?.[0]?.value);
      const isNotCustomPercentage = percentageOptions.some(
        ({ value }) => value === percentageValue
      );
      dealValues["dealDiscountTab"] = "percentage";
      if (isNotCustomPercentage) {
        dealValues["percentageOff"] = String(rewards?.[0]?.value);
        dealValues["customPercentageOff"] = "";
      } else {
        dealValues["percentageOff"] = "custom";
        dealValues["customPercentageOff"] = String(rewards?.[0]?.value);
      }
    }
    if (rewardType === "$_FIXED") {
      dealValues["fixedPriceOff"] = String(
        convertCentsToDollar(rewards?.[0]?.value)
      );
      dealValues["dealDiscountTab"] = "fixed";
    }

    return dealValues;
  }

  if (type === "SERIALIZED") {
    if (rewardType === "$_OFF") {
      dealValues["basketDollarOff"] = String(
        convertCentsToDollar(rewards?.[0]?.value)
      );
      dealValues["voucherDiscountTab"] = "dollar";
    }

    if (rewardType === "POINTS") {
      dealValues["basketdollarPointDiscount"] = String(
        convertCentsToDollar(rewards?.[0]?.value)
      );
      dealValues["basketpointsApplyType"] = voucherExclusions?.spend
        ? String(convertCentsToDollar(voucherExclusions?.spend?.minimum))
        : null;
      dealValues["voucherDiscountTab"] = "points";
    }

    if (rewardType === "NO_FEE") {
      dealValues["fulfillmentSpend"] = voucherExclusions?.spend
        ? String(convertCentsToDollar(voucherExclusions?.spend?.minimum))
        : null;
      dealValues["waivefess"] = rewards?.[0]?.value === "ALL_FULFILLMENT_FEES";
      dealValues["voucherDiscountTab"] = "fulfillment";
    }
  } else {
    dealValues["basketDiscount"] =
      rewardType === "%_OFF"
        ? String(rewards?.[0]?.value)
        : String(convertCentsToDollar(rewards?.[0]?.value));
    dealValues["basketSpend"] = voucherExclusions?.spend
      ? String(convertCentsToDollar(voucherExclusions?.spend?.minimum))
      : null;
    dealValues["basketDealType"] =
      rewardType === "%_OFF" ? "percentage" : "dollar";
  }

  return dealValues;
};

const convertVoucherDataToFormData = (voucher: any) => {
  const formData: any = {
    mch: [],
    exmch: [],
    liam: [],
    exliam: [],
    fileMCH: [],
    exFileMCH: [],
    fileLIAM: [],
    exFileLIAM: [],
    productsCollectionTab: "uploadProduct",
    productExclusionsCollectionTab: "uploadProduct",
    basketDealType: "dollar",
    dealDiscountTab: "dollar",
    restrictions: [],
  };

  const {
    voucherGeneralInfo,
    voucherValues,
    vouchersProductsAndCollections,
    voucherExclusions,
    vouchersDateInEffect,
  } = voucher;
  const { code, type, description, priority, stackingType } =
    voucherGeneralInfo;
  // const { scopeType } = voucherValues;
  // const { priceApplicability } = voucherExclusions;
  // const { product } = voucherExclusions;

  const { validFrom, validTo } = vouchersDateInEffect;

  formData["externalVoucherCode"] = code;
  formData["voucherType"] = type;
  formData["description"] = description || "";
  formData["priority"] = priority;
  formData["stackingType"] =
    Object.keys(STACKING_TYPES).find(
      (key) => STACKING_TYPES[key] === stackingType
    ) || "";
  formData["voucherLevel"] = voucherValues?.scopeType
    ? voucherValues?.scopeType?.toLowerCase()
    : "product";
  formData["dealApplyType"] =
    voucherExclusions?.priceApplicability === null
      ? "all"
      : "regular_priced_only";
  formData["dealLevelOptions"] = voucherExclusions?.product
    ? Object.values(voucherExclusions?.product).some(
        (value) => Array.isArray(value) && value.length > 0
      )
      ? "yes"
      : "no"
    : "no";
  formData["startDatePicker"] = convertToEST("");
  formData["startTimePicker"] = convertToEST("");
  formData["endDatePicker"] = convertToEST("");
  formData["endTimePicker"] = convertToEST("");
  if (validFrom) {
    formData["startDatePicker"] = convertToEST(validFrom);
    formData["startTimePicker"] = convertToEST(validFrom);
  }
  if (validTo) {
    formData["endDatePicker"] = convertToEST(validTo);
    formData["endTimePicker"] = convertToEST(validTo);
  }

  return {
    ...formData,
    ...getDealValues(voucher),
    ...getMchLiamValues(voucher),
  };
};

export default convertVoucherDataToFormData;
