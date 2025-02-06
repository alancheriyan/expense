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

const IncomeType = ({ data, onIncomeTypeChange }) => {
  const [incomeTypes, setIncomeTypes] = useState(data || []);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const handleInputChange = (id, value) => {
    const updatedIncomeTypes = incomeTypes.map((incomeType) =>
      incomeType.id === id ? { ...incomeType, name: value } : incomeType
    );
    setIncomeTypes(updatedIncomeTypes);

    const incomeType = updatedIncomeTypes.find((cat) => cat.id === id);
    if (incomeType) {
      saveIncomeType(incomeType);
    }
  };

  const handleAddRow = async () => {
    try {
      const docRef = await addDoc(collection(db, dbSetting.IncomeTable), {
        name: "",
        isActive: true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
      });

      setIncomeTypes((prevIncomeTypes) => [
        ...prevIncomeTypes,
        { id: docRef.id, name: "" },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const saveIncomeType = async (incomeType) => {
    const updatedIncomeTypes = [...incomeTypes];
    const incomeTypeToUpdate = updatedIncomeTypes.find(
      (cat) => cat.id === incomeType.id
    );

    if (incomeTypeToUpdate) {
      incomeTypeToUpdate.name = incomeType.name;
      setIncomeTypes(updatedIncomeTypes);

      try {
        await updateDoc(doc(db, dbSetting.IncomeTable, incomeType.id), {
          name: incomeType.name,
          isActive: true,
          updatedOn: serverTimestamp(),
          userId: userId,
        });

        onIncomeTypeChange(updatedIncomeTypes);
      } catch (error) {
        console.error("Error updating document: ", error);
        message.error(`Failed to update Income Type: ${incomeType.name}`);
      }
    }
  };

  return (
    <div>
      <Title
        style={{ marginBottom: "20px", fontSize: "10px" }}
        className="delius-swash-caps-regular"
      >
        Income Type
      </Title>

      <div style={{ marginBottom: "20px" }}>
        {incomeTypes.map((incomeType) => (
          <Input
            key={incomeType.id}
            value={incomeType.name}
            onChange={(e) => handleInputChange(incomeType.id, e.target.value)}
            placeholder="Enter Income Type"
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
        <span className="delius-regular">Add Income Type</span>
      </Button>
    </div>
  );
};

export default IncomeType;
