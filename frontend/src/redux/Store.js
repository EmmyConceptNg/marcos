import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: UserReducer,
});



const persistConfig = {
  key: "root",
  storage,
  // You may place other configurations like `whitelist` or `blacklist` for the reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

