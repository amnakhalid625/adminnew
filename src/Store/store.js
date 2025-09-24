import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
    version: 1,
};

// Root reducer
const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here as needed
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
    // devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
