import { configureStore } from "@reduxjs/toolkit";
import incomeTypeReducer from "./incomeTypeSlice";
import categoryReducer from "./expensecategorySlice";

const store = configureStore({
  reducer: {
    incomeTypes: incomeTypeReducer,
    categories: categoryReducer, 
  },
});

export default store;
