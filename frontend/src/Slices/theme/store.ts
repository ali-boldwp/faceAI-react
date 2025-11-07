// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "../theme/reducer";
import authReducer from "../../feature/auth/authSlice"; 

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch; // move after store is declared

export default store;
