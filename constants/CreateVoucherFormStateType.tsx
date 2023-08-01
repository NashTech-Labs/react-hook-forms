export interface ICreateVoucherFormState {
  externalVoucherCode: string;
  draftCreatedTimestamp: object | null;
  voucherType: string;
  description: string;
  priority: string;
  stackingType: string;
  voucherPerformance: string;
  voucherPerformanceBy: string;
  voucherPerformanceMCH: string;
  voucherPerformanceUPC: string;
  voucherLevel: string;
  includeFreeShipping: string;
  dealDiscountTab: string;
  percentageOff: string;
  customPercentageOff: string;
  dollarOff: string;
  fixedPriceOff: string;
  basketSpend: string;
  basketDiscount: string;
  basketDealType: string;
  startDatePicker: any;
  endDatePicker: any;
  startTimePicker: any;
  endTimePicker: any;
  useVoucherOptions: string;
  voucherQuantity: string;
  usageOfVoucher: string;
  productExclusionsCollectionTab: string;
  productsCollectionTab: string;
  mch: Array<string>;
  liam: Array<string>;
  fileMCH: Array<string>;
  fileLIAM: Array<string>;
  exFileMCH: Array<string>;
  exFileLIAM: Array<string>;
  exmch: Array<string>;
  exliam: Array<string>;
  dealLevelOptions: string;
  fileName: string;
  exFileName: string;
  dealApplyType: string;
}
