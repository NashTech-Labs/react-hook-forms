import {configureStore} from "@reduxjs/toolkit";
import {persistStore} from "redux-persist";
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const generateStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
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

