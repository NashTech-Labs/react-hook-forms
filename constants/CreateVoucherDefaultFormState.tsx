import { ICreateVoucherFormState } from "./CreateVoucherFormStateType";

const createVoucherDefaultFormState: ICreateVoucherFormState = {
  externalVoucherCode: "",
  draftCreatedTimestamp: null,
  voucherType: "PROMOTIONAL",
  description: "",
  priority: "",
  stackingType: "always_apply",
  voucherPerformance: "yes",
  voucherPerformanceBy: "mch",
  voucherPerformanceMCH: "",
  voucherPerformanceUPC: "",
  voucherLevel: "product",
  includeFreeShipping: "true",
  dealDiscountTab: "dollar",
  dealApplyType: "",
  dollarOff: "",
  percentageOff: "",
  fixedPriceOff: "",
  customPercentageOff: "",
  basketSpend: "",
  basketDiscount: "",
  basketDealType: "dollar",
  startDatePicker: null,
  endDatePicker: null,
  startTimePicker: null,
  endTimePicker: null,
  useVoucherOptions: "justOnce",
  voucherQuantity: "",
  usageOfVoucher: "",
  productExclusionsCollectionTab: "uploadProduct",
  productsCollectionTab: "uploadProduct",
  mch: [],
  liam: [],
  dealLevelOptions: "no",
  fileName: '',
  exFileName: '',
  exmch: [],
  exliam: [],
  fileMCH: [],
  exFileMCH: [],
  fileLIAM: [],
  exFileLIAM: [],
};

export default createVoucherDefaultFormState;
