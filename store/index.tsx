import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import dealReducer from "./feature/deal/dealSlice";
import newDealReducer from './feature/deal/newDealSlice'
import draftDealReducer from './feature/deal/draftDealSlice'
import filtersReducer from './feature/filters/filtersSlice'
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

const persistauthConfig = {
  key: "auth",
  storage,
};

const dealsCount = {
  key: "deal",
  storage,
};

const newDeal = {
  key: 'newDeal',
  storage
}

const persistedAuthReducer = persistReducer(persistauthConfig, authReducer);

const persistedDealReducer = persistReducer(dealsCount, dealReducer);

const persistedNewDeal = persistReducer(newDeal, newDealReducer)

export const generateStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: persistedAuthReducer,
      deal: persistedDealReducer,
      newDeal: persistedNewDeal,
      draftDeal: draftDealReducer,
      filters: filtersReducer,
      [RolesOfUser.reducerPath]: RolesOfUser.reducer,
      [userRoleList.reducerPath]: userRoleList.reducer,
      [addUser.reducerPath]: addUser.reducer,
      [viewAllDeals.reducerPath]: viewAllDeals.reducer,
      [deleteDeal.reducerPath]: deleteDeal.reducer,
      [removeUser.reducerPath]: removeUser.reducer,
      [updateUser.reducerPath]: updateUser.reducer,
      [createDeals.reducerPath]: createDeals.reducer,
      [dealPreview.reducerPath]: dealPreview.reducer,
      [editDeals.reducerPath]: editDeals.reducer
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
        editDeals.middleware
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
