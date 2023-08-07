import { ICreateVoucherFormState } from "../constants/CreateVoucherFormStateType";
import { DEAL_APPLY_TYPE, STACKING_TYPES } from "../constants/FormOptions";
import { convertDateTime } from "./ConvertDateTime";

const getRewardType = ({
  dealDiscountTab,
  dollarOff,
  percentageOff,
  fixedPriceOff,
  customPercentageOff,
  voucherLevel,
  basketDealType,
  basketDiscount,
}: ICreateVoucherFormState) => {
  let rewardType = "$_OFF";
  let rewardValue = null;

  if (voucherLevel === "basket") {
    if (basketDealType === "dollar") {
      rewardValue = basketDiscount
        ? (Number(basketDiscount) * 100).toFixed()
        : basketDiscount;
    }

    if (basketDealType === "percentage") {
      rewardType = "%_OFF";
      rewardValue = basketDiscount;
    }
  } else {
    if (dealDiscountTab === "dollar") {
      rewardValue = dollarOff ? (Number(dollarOff) * 100).toFixed() : dollarOff;
    }

    if (dealDiscountTab === "percentage") {
      if (percentageOff === "custom") {
        rewardType = "%_OFF";
        rewardValue = customPercentageOff;
      } else {
        rewardType = "%_OFF";
        rewardValue = percentageOff;
      }
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

const getVoucherApplyType = (dealApplyType: string) =>
  DEAL_APPLY_TYPE[dealApplyType];

const generateCreateVoucherPayload = (
  formData: ICreateVoucherFormState,
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
    valid_from: convertDateTime(startDatePicker, startTimePicker),
    valid_to: convertDateTime(endDatePicker, endTimePicker),
    stacking_type: STACKING_TYPES[stackingType],
    scope_type: voucherLevel?.toUpperCase(),
    promo_restrictions: {},
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
      minimum: (Number(basketSpend) * 100).toFixed(),
      maximum: null,
    };
  }

  if (voucherApplyTypeEnum === "REGULAR_ONLY") {
    payload["promo_restrictions"]["price_applicability"] = {
      value: voucherApplyTypeEnum,
    };
  }

  return payload;
};

export default generateCreateVoucherPayload;
