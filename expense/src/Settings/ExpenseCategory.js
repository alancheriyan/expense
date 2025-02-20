import React from "react";
import { subscribeToCategories, updateCategory, addCategory } from "../redux/expensecategorySlice";
import EditableList from "../Components/EditableList";

const ExpenseCategory = ({ showHeading }) => {
  return (
    <EditableList
      title="Expense Category"
      dataSelector={(state) => state.categories}
      subscribeAction={subscribeToCategories}
      updateAction={updateCategory}
      addAction={addCategory}
      showHeading={showHeading}
    />
  );
};

export default ExpenseCategory;
