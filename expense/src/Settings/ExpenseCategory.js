import React, { useEffect } from "react";
import { Typography, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToCategories, updateCategory, addCategory } from "../redux/expensecategorySlice";

const { Title } = Typography;

const ExpenseCategory = () => {
  const dispatch = useDispatch();
  const { data: categories = [], loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToCategories()); // Subscribe to real-time updates
    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Error: ${error}`);
    }
  }, [error]);

  const handleInputChange = (id, value) => {
    dispatch(updateCategory({ id, name: value }));
  };

  const handleAddRow = () => {
    dispatch(addCategory());
  };

  return (
    <div>
      <Title
        style={{ marginBottom: "20px", fontSize: "10px" }}
        className="delius-swash-caps-regular"
      >
        Expense Category
      </Title>

      <div style={{ marginBottom: "20px" }}>
        {categories.length > 0 &&
          categories.map((category) => (
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
