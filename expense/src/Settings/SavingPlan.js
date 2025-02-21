import React from "react";
import { subscribeToSavings, updateSaving, addSaving } from "../redux/savingSlice";
import EditableList from "../Components/EditableList";

const SavingPlan = ({ showHeading }) => {
  return (
    <EditableList
      title="Saving Plans"
      dataSelector={(state) => state.categories}
      subscribeAction={subscribeToSavings}
      updateAction={updateSaving}
      addAction={addSaving}
      showHeading={showHeading}
    />
  );
};

export default SavingPlan;
