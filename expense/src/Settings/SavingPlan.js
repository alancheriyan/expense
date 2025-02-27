import React from "react";
import { subscribeToSavings, updateSaving, addSaving } from "../redux/savingSlice";
import EditableList from "../Components/EditableList";

const SavingPlan = ({ showHeading }) => {
  return (
    <EditableList
      title="Saving Plans"
      dataSelector={(state) => state.savingPlanType}
      subscribeAction={subscribeToSavings}
      updateAction={updateSaving}
      addAction={addSaving}
      showHeading={showHeading}
      showAmount={true}
      AmountText="Goal"
      amountFieldName="goalAmount"
    />
  );
};

export default SavingPlan;