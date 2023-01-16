import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const persistauthConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistauthConfig, authReducer);

export const generateStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
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
