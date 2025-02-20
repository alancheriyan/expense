import React from "react";
import { subscribeToIncomeTypes, updateIncomeType, addIncomeType } from "../redux/incomeTypeSlice";
import EditableList from "../Components/EditableList";

const IncomeType = ({ showHeading }) => {
  return (
    <EditableList
      title="Income Type"
      dataSelector={(state) => state.incomeTypes}
      subscribeAction={subscribeToIncomeTypes}
      updateAction={updateIncomeType}
      addAction={addIncomeType}
      showHeading={showHeading}
    />
  );
};

export default IncomeType;
