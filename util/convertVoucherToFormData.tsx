import { MULTI_BUY_DEAL_TYPE, STACKING_TYPES, percentageOptions } from "../constants/FormOptions";
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
    voucherExclusions: { product },
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
    exmch: product?.mch || [],
    exliam: product?.liam || [],
  };
};

const getDealValues = (voucher: any) => {
    const {
      voucherValues: { scopeType, rewards, rewardType },
    } = voucher;

    const { voucherExclusions: { spend } } = voucher

    const dealValues: any = {};
    if (scopeType === "PRODUCT") {
      if (rewardType === "$_OFF") {
        dealValues["dollarOff"] = String(
          convertCentsToDollar(rewards?.[0]?.value)
        );
        dealValues["dealDiscountTab"] = "dollar";
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
  
    dealValues["basketDiscount"] =
      rewardType === "%_OFF"
        ? String(rewards?.[0]?.value)
        : String(convertCentsToDollar(rewards?.[0]?.value));
    dealValues["basketSpend"] = String(convertCentsToDollar(spend?.minimum));
    dealValues["basketDealType"] =
      rewardType === "%_OFF" ? "percentage" : "dollar";
  
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
      basketDealType: 'dollar'
    };
  
    const { voucherGeneralInfo, voucherValues, vouchersProductsAndCollections, voucherExclusions, vouchersDateInEffect} = voucher;
    const {
      code,
      type,
      description,
      priority,
      stackingType
    } = voucherGeneralInfo;
    const { scopeType } = voucherValues;
    const { priceApplicability } = voucherExclusions;
    const { product } = voucherExclusions;

    const { validFrom, validTo } = vouchersDateInEffect;
 
    formData["externalVoucherCode"] = code;
    formData["voucherType"] = type;
    formData["description"] = description;
    formData["priority"] = priority;
    formData["stackingType"] =
      Object.keys(STACKING_TYPES).find(
        (key) => STACKING_TYPES[key] === stackingType
      ) || "";
    formData["voucherLevel"] = scopeType.toLowerCase();
    formData["dealApplyType"] = priceApplicability === null ? "all" : "regular_priced_only";
    formData["dealLevelOptions"] = Object.values(product).some(
      (value) => Array.isArray(value) && value.length > 0) ? "yes" : "no";
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
      ...getMchLiamValues(voucher)
    };
  };
  
  export default convertVoucherDataToFormData;