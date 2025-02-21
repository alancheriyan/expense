import { configureStore } from "@reduxjs/toolkit";
import incomeTypeReducer from "./incomeTypeSlice";
import categoryReducer from "./expensecategorySlice";
import paymentTypeReducer  from "./paymentTypeSlice";
import savingReducer  from "./savingSlice";

const store = configureStore({
  reducer: {
    incomeTypes: incomeTypeReducer,
    categories: categoryReducer, 
    paymentTypes:paymentTypeReducer,
    savingPlanType:savingReducer
  },
});

export default store;
