import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import voucherSlice from "./feature/voucher/voucherSlice";
import dealReducer from "./feature/deal/dealSlice";
import newDealReducer from "./feature/deal/newDealSlice";
import newVoucherReducer from "./feature/voucher/newVoucherSlice";
import draftDealReducer from "./feature/deal/draftDealSlice";
import filtersReducer from "./feature/filters/filtersSlice";
import voucherFilterSlice from "./feature/voucher/voucherFilterSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RolesOfUser } from "../api/getRoles";
import { userRoleList } from "../api/getAllUsers";
import { addUser } from "../api/addUser";
import { viewAllDeals } from "../api/getAllDeals";
import { deleteDeal } from "../api/deleteDeal";
import { removeUser } from "../api/removeUser";
import { updateUser } from "../api/updateUser";
import { createDeals } from "../api/createDeal";
import { dealPreview } from "../api/dealPreview";
import { editDeals } from "../api/editDeal";
import { disablePromotions } from "../api/disablePromotion";
import { voucherList } from "../api/voucherList";
import { voucherPreviewAPI } from "../api/voucherPreview";
import { createVoucher } from "../api/createVoucher";
import { editVoucher } from "../api/editVoucher";
import { deleteVoucher } from "../api/deleteVoucher";
import lobSlice from "./feature/selectlob/lobSlice";
import { userLobs } from "../api/getuserLobs";

const persistauthConfig = {
  key: "auth",
  storage,
};

const dealsCount = {
  key: "deal",
  storage,
};

const newDeal = {
  key: "newDeal",
  storage,
};

const newVoucher = {
  key: "newVoucher",
  storage,
};

const voucher = {
  key: "voucher",
  storage,
};

const persistConfigLOB = {
  key: "lob",
  storage,
};

const persistedLOBReducer = persistReducer(
  persistConfigLOB,
  lobSlice
);

const persistedAuthReducer = persistReducer(persistauthConfig, authReducer);

const persistedDealReducer = persistReducer(dealsCount, dealReducer);

const persistedNewDeal = persistReducer(newDeal, newDealReducer);

const persistedVoucher = persistReducer(voucher, voucherSlice);

const persistedNewVoucher = persistReducer(newVoucher, newVoucherReducer);

export const generateStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: persistedAuthReducer,
      deal: persistedDealReducer,
      newDeal: persistedNewDeal,
      newVoucher: persistedNewVoucher,
      draftDeal: draftDealReducer,
      filters: filtersReducer,
      voucher: persistedVoucher,
      voucherFilters: voucherFilterSlice,
      lob: persistedLOBReducer,
      [RolesOfUser.reducerPath]: RolesOfUser.reducer,
      [userRoleList.reducerPath]: userRoleList.reducer,
      [addUser.reducerPath]: addUser.reducer,
      [viewAllDeals.reducerPath]: viewAllDeals.reducer,
      [deleteDeal.reducerPath]: deleteDeal.reducer,
      [removeUser.reducerPath]: removeUser.reducer,
      [updateUser.reducerPath]: updateUser.reducer,
      [createDeals.reducerPath]: createDeals.reducer,
      [dealPreview.reducerPath]: dealPreview.reducer,
      [userLobs.reducerPath]:userLobs.reducer,
      [editDeals.reducerPath]: editDeals.reducer,
      [disablePromotions.reducerPath]: disablePromotions.reducer,
      [voucherList.reducerPath]: voucherList.reducer,
      [voucherPreviewAPI.reducerPath]: voucherPreviewAPI.reducer,
      [createVoucher.reducerPath]: createVoucher.reducer,
      [editVoucher.reducerPath]: editVoucher.reducer,
      [deleteVoucher.reducerPath]: deleteVoucher.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([
        RolesOfUser.middleware,
        createDeals.middleware,
        userRoleList.middleware,
        addUser.middleware,
        viewAllDeals.middleware,
        deleteDeal.middleware,
        removeUser.middleware,
        updateUser.middleware,
        dealPreview.middleware,
        editDeals.middleware,
        disablePromotions.middleware,
        voucherList.middleware,
        voucherPreviewAPI.middleware,
        createVoucher.middleware,
        editVoucher.middleware,
        deleteVoucher.middleware,
        userLobs.middleware
      ]),
    preloadedState,
  });
};

export const store = generateStore();

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof generateStore>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
