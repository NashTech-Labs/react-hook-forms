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

const serilizedconfig: IConfig = {
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
      title: "Voucher is valid for?",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const { pickUpOrders, deliveryOrders } = formData;
        let value = "";
        if (pickUpOrders) {
          value += "Pickup";
        }
        if (deliveryOrders) {
          value += value ? ", Delivery" : "Delivery";
        }
        return value;
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
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const {
          dollarOff,
          fixedPriceOff,
          voucherLevel,
          dollarOffMultiBuyQuantity,
          pointsApplyType,
          basketpointsApplyType,
          fulfillmentSpend,
        } = formData;
        if (dollarOff) return "Dollar ($) off";
        if (fixedPriceOff) return "Fixed off";
        if (dollarOffMultiBuyQuantity) return "Dollar ($) off";
        if (pointsApplyType || basketpointsApplyType) return "Points";
        if (fulfillmentSpend) return "Fulfillment";
      },
    },
    {
      title: "Value",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const {
          dollarOff,
          fixedPriceOff,
          voucherLevel,
          dollarOffMultiBuyDiscount,
          pointsApplyType,
          basketpointsApplyType,
          fulfillmentSpend,
        } = formData;

        if (dollarOffMultiBuyDiscount) {
          return `$${dollarOffMultiBuyDiscount}`;
        }

        if (dollarOff || fixedPriceOff) {
          return `$${dollarOff || fixedPriceOff}`;
        }

        if (pointsApplyType || basketpointsApplyType) {
          return `${pointsApplyType || basketpointsApplyType}`;
        }

        if (fulfillmentSpend) {
          return `$${fulfillmentSpend}`;
        }
      },
    },
    {
      title: "Customer preview",
      getValue: (formData: ICreateSerializedVoucherFormState) => {
        const {
          dollarOff,
          dollarOffSpend,
          dollarOffMultiBuyDiscount,
          dollarOffMultiBuyQuantity,
          pointsApplyType,
          dollarPointDiscount,
          basketpointsApplyType,
          basketdollarPointDiscount,
          fulfillmentSpend,
        } = formData;
        if (dollarOff || dollarOffSpend)
          return `Spend $${(Number(dollarOffSpend) / 100).toFixed(
            2
          )}, Get $${dollarOff} off`;

        if (dollarOffMultiBuyDiscount) {
          return `Buy ${dollarOffMultiBuyQuantity}, Get $${dollarOffMultiBuyDiscount} off`;
        }

        if (dollarPointDiscount || basketdollarPointDiscount) {
          return `Spend $${
            dollarPointDiscount || basketdollarPointDiscount
          }, Get ${pointsApplyType || basketpointsApplyType} Points`;
        }
        if (fulfillmentSpend) {
          return `Spend $${fulfillmentSpend} and Get free pickup or delivery`;
        }
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
  // "Promotional messages": [
  //   {
  //     title: "English message",
  //     getValue: (formData: ICreateSerializedVoucherFormState) => {
  //       const { englishMessage } = formData;
  //       return englishMessage;
  //     },
  //   },
  //   {
  //     title: "French message",
  //     getValue: (formData: ICreateSerializedVoucherFormState) => {
  //       const { frenchMessage } = formData;
  //       return frenchMessage;
  //     },
  //   },
  // ],
};

export default serilizedconfig;
