import React, { useState } from "react";
import { Typography, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "../DataAcess/firebase"; // Ensure this imports your initialized Firebase app
import { dbSetting } from "../DataAcess/dbSetting"; // Assuming this contains the necessary table/collection name
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const { Title } = Typography;

const PaymentType = ({ data,onPaymentTypeChange  }) => {
  
  const [paymentTypes, setPaymentTypes] = useState(data || []);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const handleInputChange = (id, value) => {
    const updatedPaymentTypes = paymentTypes.map((paymentType) =>
        paymentType.id === id ? { ...paymentType, name: value } : paymentType
    );
    setPaymentTypes(updatedPaymentTypes);

  
    const paymentType = updatedPaymentTypes.find((cat) => cat.id === id);
    if (paymentType) {
        savePaymentType(paymentType);
    }

  };


  const handleAddRow = async () => {
    try {
      const docRef = await addDoc(collection(db, dbSetting.PaymentTypeTable), {
        name: "",
        isActive:true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
      });
     
      setPaymentTypes((prevPaymentTypes) => [
        ...prevPaymentTypes,
        { id: docRef.id, name: "" },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

 
  const savePaymentType = async (payementType) => {

    const updatedPaymentTypes = [...paymentTypes];
    const paymentTypeToUpdate = updatedPaymentTypes.find((cat) => cat.id === payementType.id);

    if (paymentTypeToUpdate) {
        paymentTypeToUpdate.name = payementType.name;
      setPaymentTypes(updatedPaymentTypes);

      try {
        await updateDoc(doc(db, dbSetting.PaymentTypeTable, payementType.id), {
          name: payementType.name,
          isActive:true,
          updatedOn: serverTimestamp(),
          userId:userId
        });

        onPaymentTypeChange(updatedPaymentTypes);
        
      } catch (error) {
        console.error("Error updating document: ", error);
        message.error(`Failed to update payment Type: ${payementType.name}`);
      }
    }
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
