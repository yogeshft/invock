import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice.js";
import categoriesReducer from "../features/categories/categorySlice.js";
import inventoryReducer from "../features/inventory/inventorySlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    inventory: inventoryReducer,
  },
});
