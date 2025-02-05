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

const ExpenseCategory = ({ data,onCategoriesChange  }) => {
  
  const [categories, setCategories] = useState(data || []);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  // Handle input changes
  const handleInputChange = (id, value) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, name: value } : category
    );
    setCategories(updatedCategories);

  
    const category = updatedCategories.find((cat) => cat.id === id);
    if (category) {
      saveCategory(category);
    }

  };

  // Handle adding a new category
  const handleAddRow = async () => {
    try {
      const docRef = await addDoc(collection(db, dbSetting.CategoryTable), {
        name: "",
        isActive:true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
      });
      // Add the new category with the Firebase-generated ID to the state
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: docRef.id, name: "" },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Save or update a single category in Firebase
  const saveCategory = async (category) => {
    // Find the category in the state
    const updatedCategories = [...categories];
    const categoryToUpdate = updatedCategories.find((cat) => cat.id === category.id);

    if (categoryToUpdate) {
      categoryToUpdate.name = category.name;
      setCategories(updatedCategories);

      // Update Firestore document if the category already exists in Firebase
      try {
        await updateDoc(doc(db, dbSetting.CategoryTable, category.id), {
          name: category.name,
          isActive:true,
          updatedOn: serverTimestamp(),
          userId:userId
        });

        onCategoriesChange(updatedCategories);
        
      } catch (error) {
        console.error("Error updating document: ", error);
        message.error(`Failed to update category: ${category.name}`);
      }
    }
  };

  return (
    <div>
      <Title
        style={{ marginBottom: "20px",fontSize:"10px"  }}
        className="delius-swash-caps-regular"
      >
        Expense Category
      </Title>

      <div style={{ marginBottom: "20px" }}>
        {categories.map((category) => (
          <Input
            key={category.id}
            value={category.name}
            onChange={(e) => handleInputChange(category.id, e.target.value)}
            placeholder="Enter category name"
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
        <span className="delius-regular">Add Category</span>
      </Button>
    </div>
  );
};

export default ExpenseCategory;
