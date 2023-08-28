export const stackTypeOptions: { [index: string]: string } = {
  best_apply: "Best Apply",
  always_apply: "Always Apply",
  override: "Override",
};

export const stackTypeOptionsVouchers: { [index: string]: string } = {
  always_apply: "Always Apply",
};

export const stackTypeFreeShipping: { [index: string]: string } = {
  always_apply: "Always Apply",
};

export const IDENTIFIER_MAX_SIZE = 15;

export const dealApplyOptions: { [index: string]: string } = {
  all: "All",
  regular_priced_only: "Regular priced only",
};

export const dealLevelOptions = [
  { value: "product", label: "Product" },
  { value: "basket", label: "Basket" },
];

export const dealTabs = [
  { label: "Dollar ($) off", value: "dollar" },
  { label: "Percentage (%) off", value: "percentage" },
  { label: "Fixed price", value: "fixed" },
];

export const voucherTabs = [{ label: "Dollar ($) off", value: "dollar" }];

export const percentageOptions = [
  { value: "10", label: "10%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "40", label: "40%" },
  { value: "custom", label: "Add custom value" },
];

export const minimumSpendOptions = [
  { value: "NO_MINIMUM", label: "No minimum" },
  { value: "30", label: "$30" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
  { value: "CUSTOM", label: "Add custom value" },
];

export const productCollectionTabs = [
  { label: "Upload product(s)", value: "uploadProduct" },
  { label: "Manually add product(s)", value: "addProduct" },
];

export const dealLevelExclusionOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

export const DEAL_APPLY_TYPE: { [index: string]: string } = {
  all: "ALL",
  regular_priced_only: "REGULAR_ONLY",
};

export const STACKING_TYPES: { [index: string]: string } = {
  override: "OVERRIDE",
  always_apply: "ALWAYS_APPLY",
  best_apply: "BEST_APPLIES",
};

export const statusOptions: { [index: string]: string } = {
  ACTIVE: "Active",
  READY: "Ready",
  DRAFT: "Draft",
  ENDED: "Ended",
  INACTIVE: "Inactive",
};

export const dealTypeOptions: { [index: string]: string } = {
  MULTI_BUY: "Multi-buy",
  DISCOUNT: "Discount",
  FREE_SHIPPING: "Free shipping",
};

export const voucherTypeOptions: { [index: string]: string } = {
  PROMOTIONAL: "Promotional",
  SERIALIZED: "Serialized",
};

export const JF_PROMOTION_TYPE: { [index: string]: string } = {
  LOYALTY: "Loyalty",
  VOUCHER: "Voucher",
};

export const SDM_PROMOTION_TYPE: { [index: string]: string } = {
  DEAL: "Deal",
  LOYALTY: "Loyalty",
  VOUCHER: "Voucher",
};

export const LOB_OPTIONS: { [index: string]: string } = {
  JOE_FRESH: "Joe Fresh",
  SHOPPERS_DRUG_MART: "Shoppers Drug Mart",
};

export const DISCOUNT_DEAL_TYPE = "DISCOUNT";
export const FREE_SHIPPING_DEAL_TYPE = "FREE_SHIPPING";
export const MULTI_BUY_DEAL_TYPE = "MULTI_BUY";

export const EDIT_SCENARIO_FILED_EXCEPTIONS = [
  "file",
  "exFile",
  "mch",
  "exmch",
  "liam",
  "exliam",
];

export const voucherPerformanceOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
export const MCH = "mch";
export const UPC = "upc";
export const voucherPerformanceTabs = [
  { label: "By MCH", value: MCH },
  { label: "By UPC", value: UPC },
];

export const voucherCodeOptions = [
  { value: "justOnce", label: "Just once" },
  { value: "unlimited", label: "Unlimited" },
];

export const useNumberOfVoucherOptions: { [index: string]: string } = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

export const MAX_FILE_SIZE = 1000000; //1MB

export const validFileExtensions: any = [
  ".xlsx",
  ".xlsm",
  ".xlsb",
  ".xltx",
  ".xltm",
  ".xls",
  ".xlt",
  ".xml",
  ".xlam",
  ".xla",
  ".xlw",
  ".xlr",
];

export function isValidFileType(fileName: any) {
  const afterDot = fileName?.substr(fileName?.indexOf("."));
  return fileName && validFileExtensions.includes(afterDot);
}
