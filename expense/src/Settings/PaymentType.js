import React, { useEffect } from "react";
import { Typography, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToPaymentTypes, updatePaymentType, addPaymentType } from "../redux/paymentTypeSlice";

const { Title } = Typography;

const PaymentType = () => {
  
   const dispatch = useDispatch();
    const { data: paymentTypes = [], loading, error } = useSelector((state) => state.paymentTypes);
  useEffect(() => {
     const unsubscribe = dispatch(subscribeToPaymentTypes()); // Subscribe to real-time updates
     return () => unsubscribe(); // Cleanup on unmount
   }, [dispatch]);
 
   useEffect(() => {
     if (error) {
       message.error(`Error: ${error}`);
     }
   }, [error]);
 
   const handleInputChange = (id, value) => {
     dispatch(updatePaymentType({ id, name: value }));
   };
 
   const handleAddRow = () => {
     dispatch(addPaymentType());
   };

  return (
    <div>
      <Title
        style={{ marginBottom: "20px",fontSize:"10px"  }}
        className="delius-swash-caps-regular"
      >
        Payment Type
      </Title>

      <div style={{ marginBottom: "20px" }}>
        {paymentTypes.map((paymentType) => (
          <Input
            key={paymentType.id}
            value={paymentType.name}
            onChange={(e) => handleInputChange(paymentType.id, e.target.value)}
            placeholder="Enter Payment Type"
            style={{ marginBottom: "10px" }}
            className="delius-regular"
          />
        ))}
      </div>

      <Button
        type="dashed"
        onClick={handleAddRow}
        block
        icon={<PlusOutlined />}
        style={{ marginBottom: "20px" }}
      >
        <span className="delius-regular">Add Payment Type</span>
      </Button>
    </div>
  );
};

export default PaymentType;
