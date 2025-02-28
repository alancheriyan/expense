import { configureStore } from "@reduxjs/toolkit";
import incomeTypeReducer from "./incomeTypeSlice";
import categoryReducer from "./expensecategorySlice";
import paymentTypeReducer  from "./paymentTypeSlice";
import savingReducer  from "./savingSlice";
import transactionReducer from "./transactionSlice";
import expenseReducer from "./expenseSlice";
import incomeReducer from "./incomeSlice";

const store = configureStore({
  reducer: {
    incomeTypes: incomeTypeReducer,
    categories: categoryReducer, 
    paymentTypes:paymentTypeReducer,
    savingPlanType:savingReducer,
    transaction:transactionReducer,
    expenses:expenseReducer,
    incomes:incomeReducer
  },
});

export default store;
