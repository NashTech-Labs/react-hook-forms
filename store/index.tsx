import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RolesOfUser } from "../api/getRoles";
import { userRoleList } from "../api/getAllUsers";
import { addUser } from "../api/addUser";

const persistauthConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistauthConfig, authReducer);

export const generateStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: persistedAuthReducer,
      [RolesOfUser.reducerPath]: RolesOfUser.reducer,
      [userRoleList.reducerPath]: userRoleList.reducer,
      [addUser.reducerPath]: addUser.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([
        RolesOfUser.middleware,
        userRoleList.middleware,
        addUser.middleware
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
