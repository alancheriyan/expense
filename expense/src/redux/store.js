import { configureStore } from "@reduxjs/toolkit";
import incomeTypeReducer from "./incomeTypeSlice";
import categoryReducer from "./expensecategorySlice";
import paymentTypeReducer  from "./paymentTypeSlice";

const store = configureStore({
  reducer: {
    incomeTypes: incomeTypeReducer,
    categories: categoryReducer, 
    paymentTypes:paymentTypeReducer
  },
});

export default store;
