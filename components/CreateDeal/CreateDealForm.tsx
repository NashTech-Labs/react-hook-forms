import React, { MouseEvent, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import GeneralInformation from "./GeneralInformation";
import createDealDefaultFormState from "../../constants/CreateDealDefaultFormState";
import { ICreateDealFormState } from "../../constants/CreateDealFormStateType";
import DealValue from "./DealValue";
import ProductsCollection from "./ProductsCollection/ProductsCollection";
import Exclusions from "./Exclusions/Exclusions";
import PromotionalMessages from "./PromotionalMessages/PromotionalMessages";
import styles from "./CreateDealForm.module.css";
import commonStyles from "./Steps.module.css";
import { useAppDispatch, useAppSelector } from "../../store/index";
import {
  updatedDealLevel,
  updatedDealStep,
  updateDealLevel,
  updateDealStep,
  getIsEditing,
} from "../../store/feature/deal/dealSlice";
import {
  updateNewDeal,
  getNewDealData,
} from "../../store/feature/deal/newDealSlice";
import DateInEffect from "./DateInEffect/DateInEffect";
import DealCriteria from "./DealCriteria/DealCriteria";
import SpendMinimum from "./SpendMinimum";
import generateCreateDealPayload from "../../util/createDealPayload";
import { userProfileState } from "../../store/feature/auth/authSlice";
import { useCreateDealsMutation } from "../../api/createDeal";
import {
  notifyError,
  notifySuccess,
} from "../../util/Notification/Notification";
import DraftModal from "./DraftModal";
import { updateDraftDeal } from "../../store/feature/deal/draftDealSlice";
import { useEditDealsMutation } from "../../api/editDeal";
import convertDealDataToFormData from "../../util/convertDealToFormData";
import {
  MULTI_BUY_DEAL_TYPE,
  FREE_SHIPPING_DEAL_TYPE,
  DISCOUNT_DEAL_TYPE,
  EDIT_SCENARIO_FILED_EXCEPTIONS,
} from "../../constants/FormOptions";
import ExitEditModal from "./ExitEditModal";
import ShippingMethod from "./ShippingMethod/ShippingMethod";

interface ICreateDealFrom {
  deal?: object;
}

const draftModalcustomStyles = {
  content: {
    width: "500px",
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "2px",
    background: "#fff",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    padding: "16px",
    gap: "10px",
  },
  overlay: {
    zIndex: "999",
    background: "rgba(0,0,0,0.4",
  },
};

const MAX_FILE_SIZE = 1000000; //1MB

const validFileExtensions: any = [
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

function isValidFileType(fileName: any) {
  const afterDot = fileName?.substr(fileName?.indexOf("."));
  return fileName && validFileExtensions.includes(afterDot);
}

const isEndDateTimeValid = (
  endDateOrTime: any,
  startDateOrTime: object,
  operation: string
) => {
  if (operation === ">=") {
    return endDateOrTime >= startDateOrTime;
  }
  if (operation === ">") {
    return endDateOrTime > startDateOrTime;
  }
  return true;
};

const schema = yup
  .object()
  .shape({
    title: yup
      .string()
      .max(80, "Error: Title should be less than 80 characters")
      .required("Error: Title is required"),
    description: yup
      .string()
      .max(250, "Error: Description should be less than 250 characters"),
    priority: yup
      .number()
      .typeError("Error: Priority is required")
      .min(1, "Error: Priority should be between 1 and 100")
      .max(100, "Error: Priority should be between 1 and 100")
      .test(
        "priority",
        "Error: Priority should be whole number",
        (value: any) => value && value % 1 === 0
      )
      .required("Error: Priority is required"),
    stackingType: yup.string().required("Error: Stacking type is required"),
    dollarOff: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(1, "Error: Must be minimum of $1.00")
      .test(
        "dollar-off",
        "Error: Dollar($) value required",
        (value, context) => {
          if (
            context?.parent?.dealType === MULTI_BUY_DEAL_TYPE ||
            context?.parent?.dealType === FREE_SHIPPING_DEAL_TYPE
          ) {
            return true;
          } else if (
            context?.parent?.dealDiscountTab === "dollar" &&
            context?.parent?.dealLevel === "product"
          ) {
            return value !== undefined;
          } else return true;
        }
      ),
    customPercentageOff: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(1, "Error: Percentage value should be between 1-99")
      .max(99, "Error: Percentage value should be between 1-99")
      .test(
        "custom-percentage-off",
        "Error: Percentage(%) value required",
        (value, context) => {
          if (context?.parent?.percentageOff === "custom") {
            return value !== undefined;
          } else return true;
        }
      ),
    fixedPriceOff: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(1, "Error: Must be a minimum of $1.00")
      .test(
        "fixed-price-off",
        "Error: Dollar($) value required",
        (value, context) => {
          if (context?.parent?.dealDiscountTab === "fixed") {
            return value !== undefined;
          } else return true;
        }
      ),
    customMinimumSpend: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .test(
        "custom-spend-minimum",
        "Error: Dollar($) value required",
        (value, context) => {
          if (context?.parent?.spendMinimum === "CUSTOM") {
            return value !== undefined;
          } else return true;
        }
      ),
    basketSpend: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(1, "Error: Must be a minimum of $1.00")
      .test(
        "basket-spend",
        "Error: Dollar($) value required",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket"
          ) {
            return value !== undefined;
          } else return true;
        }
      ),
    basketDiscount: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .test(
        "basket-discount",
        "Error: Dollar($) value required",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket" &&
            context?.parent?.basketDealType === "dollar"
          ) {
            return value !== undefined;
          } else return true;
        }
      )
      .test(
        "basket-discount",
        "Error: Discount amount can't be greater than or equal to the spending amount",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket" &&
            context?.parent?.basketDealType === "dollar"
          ) {
            return value !== undefined && value < context?.parent?.basketSpend;
          } else return true;
        }
      )
      .test(
        "basket-discount-smaller",
        "Error: Must be a minimum of $1.00",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket" &&
            context?.parent?.basketDealType === "dollar"
          ) {
            return value !== undefined && value >= 1;
          } else return true;
        }
      )
      .test(
        "basket-discount",
        "Error: Percentage(%) value required",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket" &&
            context?.parent?.basketDealType === "percentage"
          ) {
            return value !== undefined;
          } else return true;
        }
      )
      .test(
        "basket-discount",
        "Error: Percentage(%) must be between 1-99",
        (value, context) => {
          if (
            context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE &&
            context?.parent?.dealLevel === "basket" &&
            context?.parent?.basketDealType === "percentage"
          ) {
            return value !== undefined && value > 0 && value < 100;
          } else return true;
        }
      ),
    englishMessage: yup
      .string()
      .required("Error: English message required")
      .max(250, "Error: Message should be less than 250 characters"),
    frenchMessage: yup
      .string()
      .required("Error: French message required")
      .max(250, "Error: Message should be less than 250 characters"),
    mch: yup
      .array()
      .of(
        yup
          .string()
          .required("Error: MCH field required")
          .matches(/^[mM]/, "Error: Must start with M")
          .min(9, "Error: Valid MCH required")
          .max(9, "Error: Valid MCH required")
      ),
    exmch: yup
      .array()
      .of(
        yup
          .string()
          .required("Error: MCH field required")
          .matches(/^[mM]/, "Error: Must start with M")
          .min(9, "Error: Valid MCH required")
          .max(9, "Error: Valid MCH required")
      ),
    liam: yup.array().of(
      yup
        .string()
        .required("Error: LIAM field required")
        .matches(/^[a-zA-Z]/, "Error: Must start with letter")
        .matches(/[A-Za-z](\w{12})+_EA/, "Error: Valid LIAM required")
        .min(16, "Error: Valid LIAM required")
        .max(16, "Error: Valid LIAM required")
    ),
    exliam: yup.array().of(
      yup
        .string()
        .required("Error: LIAM field required")
        .matches(/^[a-zA-Z]/, "Error: Must start with letter")
        .matches(/[A-Za-z](\w{12})+_EA/, "Error: Valid LIAM required")
        .min(16, "Error: Valid LIAM required")
        .max(16, "Error: Valid LIAM required")
    ),
    file: yup
      .mixed()
      .test("file-required", "Error: File required", (value, context) => {
        if (
          value?.size > 0 ||
          context?.parent?.dealLevel === "basket" ||
          context?.parent?.mch?.length > 0 ||
          context?.parent?.liam?.length > 0 ||
          context?.parent?.dealType === FREE_SHIPPING_DEAL_TYPE
        ) {
          return true;
        } else return false;
      })
      .test(
        "not-valid-size",
        "Error: Max allowed size is 1 MB",
        (value, context) => {
          if (
            context?.parent?.mch?.length < 1 &&
            context?.parent?.liam.length < 1
          ) {
            if (
              context?.parent?.productsCollectionTab === "uploadProduct" &&
              context?.parent?.dealLevel === "product" &&
              context?.parent?.dealType === DISCOUNT_DEAL_TYPE
            ) {
              return value?.size && value.size < MAX_FILE_SIZE;
            } else return true;
          } else return true;
        }
      )
      .test(
        "is-valid-type",
        "Error: File Type not accepted",
        (value, context) => {
          if (
            context?.parent?.mch?.length < 1 &&
            context?.parent?.liam.length < 1
          ) {
            if (
              context?.parent?.productsCollectionTab === "uploadProduct" &&
              context?.parent?.dealLevel === "product" &&
              context?.parent?.dealType === DISCOUNT_DEAL_TYPE
            ) {
              return isValidFileType(value && value?.name?.toLowerCase());
            } else return true;
          } else return true;
        }
      ),
    exfile: yup
      .mixed()
      .test("ex-file-required", "Error: FIle required", (value, context) => {
        if (
          (value?.size > 0 && context?.parent?.dealLevelOptions === "yes") ||
          context?.parent?.dealLevelOptions === "no" ||
          context?.parent?.exmch?.length > 0 ||
          context?.parent?.exliam?.length > 0
        ) {
          return true;
        } else return false;
      })
      .test(
        "not-valid-size",
        "Error: Max allowed size is 1 MB",
        (value, context) => {
          if (
            context?.parent?.exmch?.length < 1 &&
            context?.parent?.exliam.length < 1
          ) {
            if (
              context?.parent?.productExclusionsCollectionTab ===
                "uploadProduct" &&
              context?.parent?.dealLevelOptions === "yes"
            ) {
              return value?.size && value.size < MAX_FILE_SIZE;
            } else return true;
          } else return true;
        }
      )
      .test(
        "is-valid-type",
        "Error: File Type not accepted",
        (value, context) => {
          if (
            context?.parent?.exmch?.length < 1 &&
            context?.parent?.exliam.length < 1
          ) {
            if (
              context?.parent?.productExclusionsCollectionTab ===
                "uploadProduct" &&
              context?.parent?.dealLevelOptions === "yes"
            ) {
              return isValidFileType(value && value?.name?.toLowerCase());
            } else return true;
          } else return true;
        }
      ),
    dealApplyType: yup
      .mixed()
      .test(
        "dollar-value-required",
        "Error: Select applicable products",
        (value: any, context: any) => {
          if (context?.parent?.dealType !== FREE_SHIPPING_DEAL_TYPE) {
            if (value !== "") {
              return true;
            } else return false;
          } else return true;
        }
      ),
    startDatePicker: yup
      .date()
      .typeError("Error: Valid date required")
      .test(
        "test-start-date",
        "Error: You cannot add date before yesterday",
        function (value, context) {
          return isEndDateTimeValid(
            value,
            context.parent.startDatePicker,
            ">="
          );
        }
      )
      .required("Error: Date required")
      .nullable(),
    startTimePicker: yup
      .date()
      .typeError("Error: Valid time required")
      .required("Error: Time required")
      .nullable(),
    endDatePicker: yup
      .date()
      .typeError("Error: Valid date required")
      .required("Error: Date required")
      .nullable()
      .test(
        "test-end-date",
        "Error: End date smaller than start date",
        function (value, context) {
          return isEndDateTimeValid(
            value,
            context.parent.startDatePicker,
            ">="
          );
        }
      ),
    endTimePicker: yup
      .date()
      .typeError("Error: Valid time required")
      .required("Error: Time required")
      .nullable()
      .test(
        "test-end-time",
        "Error: End time must be greater than start time",
        function (value, context) {
          return isEndDateTimeValid(value, context.parent.startTimePicker, ">");
        }
      ),
    dealCriteria: yup.array().of(
      yup.object().shape({
        isListValid: yup.boolean(),
        buy: yup
          .string()
          .when("isListValid", {
            is: true,
            then: yup.string().required("Error: Items required"),
          })
          .nullable()
          .test(
            "test-valid-list-items",
            "Error: Enter valid items",
            (value: any, context: any) => {
              let data = context?.from[1]?.value?.dealCriteria;
              let index = data.findIndex((x: any) => x.buy === value);
              if (data.length > 1) {
                if (
                  (parseInt(value) === parseInt(data[data.length - 1].buy) &&
                    parseInt(value) > parseInt(data[data.length - 2].buy)) ||
                  (index === 0 &&
                    parseInt(value) < parseInt(data[index + 1].buy) &&
                    parseInt(value) !== parseInt(data[data.length - 1].buy)) ||
                  (index > 0 &&
                    index < data.length - 1 &&
                    parseInt(value) > parseInt(data[index - 1].buy) &&
                    parseInt(value) < parseInt(data[index + 1].buy))
                ) {
                  return true;
                } else return false;
              } else return true;
            }
          ),
        get: yup
          .mixed()
          .test(
            "dollar-value-required",
            "Error: Dollar ($) value required",
            (value: any, context: any) => {
              if (
                context?.from[1]?.value?.dealCriteriaType === "%_OFF_MULTI" ||
                context?.from[1]?.value?.dealCriteriaType === "$_FIXED_MULTI" ||
                (value > 0 &&
                  context?.from[1]?.value?.dealCriteriaType ===
                    "$_OFF_MULTI") ||
                context?.from[1]?.value?.dealType === DISCOUNT_DEAL_TYPE ||
                context?.from[1]?.value?.dealType === FREE_SHIPPING_DEAL_TYPE
              ) {
                return true;
              }
              return false;
            }
          )
          .test(
            "fixed-value-required",
            "Error: Dollar ($) value required",
            (value: any, context: any) => {
              if (
                context?.from[1]?.value?.dealCriteriaType === "%_OFF_MULTI" ||
                context?.from[1]?.value?.dealCriteriaType === "$_OFF_MULTI" ||
                (value > 0 &&
                  context?.from[1]?.value?.dealCriteriaType ===
                    "$_FIXED_MULTI") ||
                context?.from[1]?.value?.dealType === DISCOUNT_DEAL_TYPE ||
                context?.from[1]?.value?.dealType === FREE_SHIPPING_DEAL_TYPE
              ) {
                return true;
              }
              return false;
            }
          )
          .test(
            "percent-value-required",
            "Error: Percentage (%) value required",
            (value: any, context: any) => {
              if (
                context?.from[1]?.value?.dealCriteriaType === "$_OFF_MULTI" ||
                context?.from[1]?.value?.dealCriteriaType === "$_FIXED_MULTI" ||
                (value > 0 &&
                  context?.from[1]?.value?.dealCriteriaType ===
                    "%_OFF_MULTI") ||
                context?.from[1]?.value?.dealType === DISCOUNT_DEAL_TYPE ||
                context?.from[1]?.value?.dealType === FREE_SHIPPING_DEAL_TYPE
              ) {
                return true;
              }
              return false;
            }
          )
          .test(
            "percent-value-required-value",
            "Error: Percentage value should be between 1-99",
            (value: any, context: any) => {
              if (
                context?.from[1]?.value?.dealCriteriaType === "$_OFF_MULTI" ||
                context?.from[1]?.value?.dealCriteriaType === "$_FIXED_MULTI" ||
                (value > 0 &&
                  value < 100 &&
                  context?.from[1]?.value?.dealCriteriaType ===
                    "%_OFF_MULTI") ||
                context?.from[1]?.value?.dealType === DISCOUNT_DEAL_TYPE ||
                context?.from[1]?.value?.dealType === FREE_SHIPPING_DEAL_TYPE
              ) {
                return true;
              }
              return false;
            }
          )
          .test(
            "valid-value-required",
            "Error: Enter valid value",
            (value: any, context: any) => {
              let getdata = context?.from[1]?.value?.dealCriteria;
              let index = getdata.findIndex((x: any) => x.get === value);
              if (getdata.length > 1) {
                if (
                  (parseInt(value) ===
                    parseInt(getdata[getdata.length - 1].get) &&
                    parseInt(value) >
                      parseInt(getdata[getdata.length - 2].get)) ||
                  (index === 0 &&
                    parseInt(value) < parseInt(getdata[index + 1].get)) ||
                  (index > 0 &&
                    index < parseInt(getdata.length) - 1 &&
                    parseInt(value) > parseInt(getdata[index - 1].get) &&
                    parseInt(value) < parseInt(getdata[index + 1].get))
                ) {
                  return true;
                } else return false;
              } else return true;
            }
          ),
      })
    ),
  })
  .required();

const CreateDealForm = ({ deal }: ICreateDealFrom) => {
  const [submitting, setSubmitting] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [exitModal, setExitModal] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(userProfileState);
  const draftFormValues = useAppSelector(getNewDealData);
  const dealLevelName = useAppSelector(updatedDealLevel);
  let dealName = useAppSelector(updatedDealStep);
  const isEditing = useAppSelector(getIsEditing);
  const [createDeals] = useCreateDealsMutation();
  const [editDeal] = useEditDealsMutation();
  const formDefaultValues = deal
    ? convertDealDataToFormData(deal)
    : draftFormValues || createDealDefaultFormState;
  const formMethods = useForm<ICreateDealFormState>({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
    mode: "all",
  });
  const {
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = formMethods;

  if (isEditing) {
    dealName = formDefaultValues["dealType"];
  }
  console.log(getValues());
  const handleFormDraftSubmit = async (dealId: number) => {
    setValue("draftCreatedTimestamp", moment());
    dispatch(updateNewDeal(getValues()));
    const formattedPayload = generateCreateDealPayload(getValues(), true);
    const formattedPayloadWithUser = {
      ...formattedPayload,
      username: user?.name,
    };

    setSubmitting(true);
    setShowDraftModal(true);
    if (dealId) {
      const editPayload = {
        ...formattedPayloadWithUser,
        dealId,
      };
      await editDeal(editPayload)
        .unwrap()
        .then((data) => {
          if (data) {
            notifySuccess("Deal successfully saved");
          }
        })
        .catch((error: any) => {
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "deal-failed"
          );
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      await createDeals(formattedPayloadWithUser)
        .unwrap()
        .then((data) => {
          if (data) {
            dispatch(updateDraftDeal(data));
            notifySuccess("Deal successfully saved");
          }
        })
        .catch((error) => {
          notifyError(
            error.data?.details ? error.data?.details : "Something went wrong",
            "deal-failed"
          );
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const handleFormSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    const cleanForm = await trigger(undefined, { shouldFocus: true });

    const cleanFormForEditScenario = Object.keys(errors).every((error) =>
      EDIT_SCENARIO_FILED_EXCEPTIONS.includes(error)
    );

    if (cleanForm) {
      setValue("draftCreatedTimestamp", moment());
      dispatch(updateNewDeal(getValues()));
      router.push("/deals/create/summary");
    }
  };

  const handleBack = () => {
    dispatch(updateDealStep(""));
    dispatch(updateDealLevel("product"));
  };

  const handleCancel = () => {
    dispatch(updateDealStep(""));
    router.push("/deals");
  };

  const closeDraftModal = () => {
    setShowDraftModal(false);
  };

  const handleEditCancel = () => {
    setExitModal(true);
  };

  const handleExitModalClose = () => {
    setExitModal(false);
  };

  let ctaContent = (
    <div className={styles["submit-btn-container"]}>
      <div>
        <Button
          variant="outlined"
          className={commonStyles["cancelBtn"]}
          onClick={handleCancel}
          ata-testid="cancel-btn"
        >
          Cancel
        </Button>
      </div>
      <div className={styles["submit-container"]}>
        <Button
          variant="text"
          onClick={handleBack}
          className={commonStyles["text-style-btn"]}
          data-testid="back-btn"
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          className={commonStyles["continueBtn"]}
          onClick={(e) => handleFormSubmit(e)}
          data-testid="continue-btn"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  if (isEditing) {
    ctaContent = (
      <div className={styles["submit-btn-container"]}>
        <div>
          <Button
            variant="outlined"
            className={commonStyles["cancelBtn"]}
            onClick={() => handleEditCancel()}
            ata-testid="cancel-btn"
          >
            Cancel
          </Button>
        </div>
        <div className={styles["submit-container"]}>
          <Button
            variant="contained"
            className={commonStyles["continueBtn"]}
            onClick={(e) => handleFormSubmit(e)}
            data-testid="continue-btn"
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form id="test">
        <GeneralInformation
          handleFormDraftSubmit={handleFormDraftSubmit}
          deal={deal}
        />
        {dealName === DISCOUNT_DEAL_TYPE && <DealValue />}
        {dealName === MULTI_BUY_DEAL_TYPE && <DealCriteria />}
        {dealName === FREE_SHIPPING_DEAL_TYPE && (
          <>
            <ShippingMethod /> <SpendMinimum />
          </>
        )}
        <DateInEffect deal={deal} />
        {dealName === FREE_SHIPPING_DEAL_TYPE ||
        dealLevelName === "basket" ? null : (
          <ProductsCollection />
        )}
        {dealName === FREE_SHIPPING_DEAL_TYPE ? null : (
          <Exclusions dealLevelName={dealLevelName} deal={deal} />
        )}
        <PromotionalMessages dealLevelName={dealLevelName} />
        {ctaContent}
      </form>
      <Modal
        style={draftModalcustomStyles}
        isOpen={showDraftModal}
        onRequestClose={closeDraftModal}
      >
        <DraftModal loading={submitting} closeModal={closeDraftModal} />
      </Modal>
      <Modal
        style={draftModalcustomStyles}
        isOpen={exitModal}
        onRequestClose={handleExitModalClose}
      >
        <ExitEditModal closeModal={handleExitModalClose} />
      </Modal>
    </FormProvider>
  );
};

export default CreateDealForm;
