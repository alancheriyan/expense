import React from "react";
import { subscribeToPaymentTypes, updatePaymentType, addPaymentType } from "../redux/paymentTypeSlice";
import EditableList from "../Components/EditableList";

const PaymentType = ({ showHeading }) => {
  return (
    <EditableList
      title="Payment Type"
      dataSelector={(state) => state.paymentTypes}
      subscribeAction={subscribeToPaymentTypes}
      updateAction={updatePaymentType}
      addAction={addPaymentType}
      showHeading={showHeading}
    />
  );
};

export default PaymentType;
