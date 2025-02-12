import React, { useEffect, useState } from "react";
import { Typography, Input, Button, message,Popconfirm,  Row, Col  } from "antd";
import { PlusOutlined,MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToCategories, updateCategory, addCategory } from "../redux/expensecategorySlice";

const { Title } = Typography;

const ExpenseCategory = ({showHeading}) => {
  const dispatch = useDispatch();
  const { data: categories = [], loading, error } = useSelector((state) => state.categories);
  const [IsDisplayHeading,setIsDisplayHeading]= useState(true);

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToCategories()); // Subscribe to real-time updates
    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Error: ${error}`);
    }
  }, [error]);

  useEffect(()=>{
      if(showHeading!==undefined){
        setIsDisplayHeading(showHeading);
      }
  },[])

  const handleInputChange = (id, value) => {
    dispatch(updateCategory({ id, field: "name", value }));
  };
  
  const handleDeleteRow = (id) => {
    dispatch(updateCategory({ id, field: "status", value: false }));
  };
  

  const handleAddRow = () => {
    dispatch(addCategory());
  };

  return (
    <div>
      {IsDisplayHeading?( <Title
        style={{ marginBottom: "20px", fontSize: "10px" }}
        className="delius-swash-caps-regular"
        
      >
        Expense Category
      </Title>):""}
     
      <div style={{ marginBottom: "20px" }}>
        {categories.length > 0 &&
          categories.map((category) => (
            <Row key={category.id} align="middle" style={{ marginBottom: "10px" }}>
              <Col flex="auto">
                <Input
                  value={category.name}
                  onChange={(e) => handleInputChange(category.id, e.target.value)}
                  placeholder="Enter category name"
                  className="delius-regular"
                />
              </Col>
              <Col flex="40px" style={{ textAlign: "center" }}>
                <Popconfirm
                  title="Are you sure you want to delete this category?"
                  onConfirm={() => handleDeleteRow(category.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <MinusCircleOutlined
                    style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                  />
                </Popconfirm>
              </Col>
            </Row>
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
