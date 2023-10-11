import moment from "moment";
import { ICreateVoucherFormState } from "../../../constants/CreateVoucherFormStateType";
import {
  voucherTypeOptions,
  stackTypeOptions,
  dealApplyOptions,
  dealLevelExclusionOptions,
} from "../../../constants/FormOptions";
import { capitalizeWords } from "../../../util/format";
import { ICreateSerializedVoucherFormState } from "../../../constants/SerializedVoucherFormStateType";

const getFormattedDate = (date: any, time: any) =>
  `${moment(date).format("MMMM DD, YYYY")} ${moment(time).format(
    "hh:mma z"
  )} EST`;

interface IConfigValue {
  title: string;
  getValue: Function;
  shouldHide?: Function;
}

interface IConfig {
  [index: string]: IConfigValue[];
}

const config: IConfig = {
  "Voucher type": [
    {
      title: "Type",
      getValue: (formData: ICreateVoucherFormState) => {
        const { voucherType } = formData;
        return voucherTypeOptions[voucherType];
      },
    },
  ],
  "General Information": [
    {
      title: "Voucher Code",
      getValue: (formData: ICreateVoucherFormState) => {
        const { externalVoucherCode } = formData;
        return externalVoucherCode;
      },
    },
    {
      title: "Description",
      getValue: (formData: ICreateVoucherFormState) => {
        const { description } = formData;
        return description;
      },
    },
    {
      title: "Priority",
      getValue: (formData: ICreateVoucherFormState) => {
        const { priority } = formData;
        return priority;
      },
    },
    {
      title: "Stacking Type",
      getValue: (formData: ICreateVoucherFormState) => {
        const { stackingType } = formData;
        return stackTypeOptions[stackingType];
      },
    },
  ],
  "Banner Restrictions": [
    {
      title: "Banner",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { restrictions } = formData;
        return restrictions.length > 0 ? restrictions.join(", ") : "None";
      },
    },
    {
      title: "Is this voucher restricted to a specific location?",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { regionRestrictions } = formData;
        return regionRestrictions?.length > 0
          ? regionRestrictions.join(", ")
          : "NO";
      },
    },
  ],
  "Voucher value": [
    {
      title: "Is this at a basket level or product level?",
      getValue: (formData: ICreateVoucherFormState) => {
        const { voucherLevel } = formData;
        return capitalizeWords(voucherLevel || "");
      },
    },
    {
      title: "Type",
      getValue: (formData: ICreateVoucherFormState) => {
        const {
          dollarOff,
          percentageOff,
          fixedPriceOff,
          voucherLevel,
          basketDealType,
        } = formData;
        if (voucherLevel === "basket")
          return basketDealType === "dollar"
            ? "Dollar ($) off"
            : "Percentage (%) off";
        if (dollarOff) return "Dollar ($) off";
        if (percentageOff) return "Percentage (%) off";
        if (fixedPriceOff) return "Fixed off";
      },
    },
    {
      title: "Value",
      getValue: (formData: ICreateVoucherFormState) => {
        const {
          dollarOff,
          percentageOff,
          fixedPriceOff,
          customPercentageOff,
          voucherLevel,
          basketDealType,
          basketDiscount,
        } = formData;
        if (voucherLevel === "basket") {
          return basketDealType === "dollar"
            ? `$${basketDiscount}`
            : `${basketDiscount}%`;
        }

        if (dollarOff || fixedPriceOff) {
          return `$${dollarOff || fixedPriceOff}`;
        }

        return `${
          percentageOff === "custom" ? customPercentageOff : percentageOff
        }%`;
      },
    },
    {
      title: "Customer preview",
      getValue: (formData: ICreateVoucherFormState) => {
        const {
          dollarOff,
          percentageOff,
          fixedPriceOff,
          basketSpend,
          basketDiscount,
          basketDealType,
          customPercentageOff,
        } = formData;
        if (basketSpend)
          return `Spend $${basketSpend} Get ${
            basketDealType === "dollar" ? "$" : ""
          }${basketDiscount}${basketDealType === "percentage" ? "%" : ""} off`;
        if (dollarOff || fixedPriceOff)
          return `$${dollarOff || fixedPriceOff} off product(s)`;
        if (percentageOff)
          return `${
            percentageOff === "custom" ? customPercentageOff : percentageOff
          }% off product(s)`;
      },
    },
  ],
  "Voucher Validity": [
    {
      title: "Is this voucher for new customers only?",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { voucherValidity } = formData;
        return voucherValidity.toUpperCase();
      },
    },
    {
      title: "Which platform(s) is this voucher eligible for redemption on?",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { website, mobileApplication } = formData;
        if (website && mobileApplication)
          return "Website and Mobile Application";
        if (website) return "Website";
        if (mobileApplication) return "Mobile Application";
      },
    },
  ],
  "Number of Codes": [
    {
      title: "Number of vouchers to create",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { voucherQuantity } = formData;
        return voucherQuantity;
      },
    },
    {
      title: "How often can the customer use this voucher?",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { useVoucherOptions, usageOfVoucher } = formData;
        return useVoucherOptions === "moreThanOnce"
          ? usageOfVoucher
          : "Just once";
      },
    },
  ],
  "Date in effect": [
    {
      title: "Start Date",
      getValue: (formData: ICreateVoucherFormState) => {
        const { startDatePicker, startTimePicker } = formData;
        return getFormattedDate(startDatePicker, startTimePicker);
      },
    },
    {
      title: "End Date",
      getValue: (formData: ICreateVoucherFormState) => {
        const { endDatePicker, endTimePicker } = formData;
        return getFormattedDate(endDatePicker, endTimePicker);
      },
    },
    {
      title: "Customer preview",
      getValue: (formData: ICreateVoucherFormState) => {
        const {
          startDatePicker,
          startTimePicker,
          endDatePicker,
          endTimePicker,
        } = formData;
        return `Starts ${getFormattedDate(
          startDatePicker,
          startTimePicker
        )} and ends ${getFormattedDate(endDatePicker, endTimePicker)}`;
      },
    },
  ],
  "Products and Collections": [
    {
      title: "Collection",
      getValue: (formData: ICreateVoucherFormState) => {
        const { fileName } = formData;
        return fileName;
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { fileName } = formData;
        return !fileName ? true : false;
      },
    },
    {
      title: "Mch",
      getValue: (formData: ICreateVoucherFormState) => {
        const { mch } = formData;
        return mch.length > 0 ? mch.join(", ").toUpperCase() : "None";
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { mch } = formData;
        return mch.length < 1 ? true : false;
      },
    },
    {
      title: "Liam",
      getValue: (formData: ICreateVoucherFormState) => {
        const { liam } = formData;
        return liam.length > 0 ? liam.join(", ").toUpperCase() : "None";
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { liam } = formData;
        return liam.length < 1 ? true : false;
      },
    },
  ],
  Exclusions: [
    {
      title: "What items does this deal apply to?",
      getValue: (formData: ICreateVoucherFormState) => {
        const { dealApplyType } = formData;
        return dealApplyOptions[dealApplyType];
      },
    },
    {
      title: "Will there be additional products excluded from this deal?",
      getValue: (formData: ICreateVoucherFormState) => {
        const { dealLevelOptions } = formData;
        return dealLevelExclusionOptions.find(
          ({ value }) => value === dealLevelOptions
        )?.label;
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { voucherLevel } = formData;
        return voucherLevel === "basket";
      },
    },
    {
      title: "Collection",
      getValue: (formData: ICreateVoucherFormState) => {
        const { exFileName } = formData;
        return exFileName;
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { dealLevelOptions, exFileName, voucherLevel } = formData;
        return voucherLevel === "basket" ||
          dealLevelOptions === "no" ||
          !exFileName
          ? true
          : false;
      },
    },
    {
      title: "Mch",
      getValue: (formData: ICreateVoucherFormState) => {
        const { exmch } = formData;
        return exmch.length > 0 ? exmch.join(", ").toUpperCase() : "None";
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { dealLevelOptions, voucherLevel, exmch } = formData;
        return voucherLevel === "basket" ||
          dealLevelOptions === "no" ||
          exmch.length < 1
          ? true
          : false;
      },
    },
    {
      title: "Liam",
      getValue: (formData: ICreateVoucherFormState) => {
        const { exliam } = formData;
        return exliam.length > 0 ? exliam.join(", ").toUpperCase() : "None";
      },
      shouldHide: (formData: ICreateVoucherFormState) => {
        const { dealLevelOptions, voucherLevel, exliam } = formData;
        return voucherLevel === "basket" ||
          dealLevelOptions === "no" ||
          exliam.length < 1
          ? true
          : false;
      },
    },
  ],
  "Promotional messages": [
    {
      title: "English message",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { englishMessage } = formData;
        return englishMessage;
      },
    },
    {
      title: "French message",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { frenchMessage } = formData;
        return frenchMessage;
      },
    },
  ],
};

export default config;
