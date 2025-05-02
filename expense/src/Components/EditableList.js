import React, { useEffect, useState } from "react";
import { Typography, Input, Button, message, Popconfirm, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

const { Title } = Typography;

const EditableList = ({ 
  title, 
  dataSelector, 
  subscribeAction, 
  updateAction, 
  addAction, 
  fieldName = "name",
  showHeading = true,
  showAmount = false,
  AmountText = "Amount", 
  amountFieldName = "amount"
}) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector(dataSelector);
  const [isDisplayHeading, setIsDisplayHeading] = useState(showHeading);
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    const unsubscribe = dispatch(subscribeAction()); // Subscribe to real-time updates
    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    setIsDisplayHeading(showHeading);
  }, [showHeading]);

  // Handles input changes for both name and amount fields
  const handleInputChange = (id, value, field) => {
    setEditedValues((prev) => ({ ...prev, [`${id}_${field}`]: value }));
  };

  // Blur handler to update Redux state
  const handleInputBlur = (id, field) => {
    const editedValue = editedValues[`${id}_${field}`];
    if (editedValue !== undefined && editedValue !== "") {
      dispatch(updateAction({ id, field, value: editedValue }));
    }
  };

  const handleDeleteRow = (id) => {
    dispatch(updateAction({ id, field: "status", value: false }));
  };

  const handleAddRow = () => {
    dispatch(addAction());
  };

  return (
    <div>
      {isDisplayHeading && (
        <Title style={{ marginBottom: "20px", fontSize: "10px" }} className="delius-swash-caps-regular">
          {title}
        </Title>
      )}

      <div style={{ marginBottom: "20px" }}>
        {data
        .filter((item) => item.isActive)
        .map((item) => (
          <Row key={item.id} align="middle" style={{ marginBottom: "10px" }} gutter={[8, 0]}>
            {/* Name Input Column */}
            <Col flex={showAmount ? "55%" : "auto"}>
              <Input
                value={editedValues[`${item.id}_${fieldName}`] ?? item[fieldName]}
                onChange={(e) => handleInputChange(item.id, e.target.value, fieldName)}
                onBlur={() => handleInputBlur(item.id, fieldName)}
                placeholder={`Enter ${title}`}
                className="delius-regular"
              />
            </Col>

            {/* Amount Input Column (Only if showAmount is true) */}
            {showAmount && (
              <Col flex="35%">
                <Input
                  value={editedValues[`${item.id}_${amountFieldName}`] ?? item[amountFieldName]}
                  onChange={(e) => handleInputChange(item.id, e.target.value, amountFieldName)}
                  onBlur={() => handleInputBlur(item.id, amountFieldName)}
                  placeholder={AmountText}
                  className="delius-regular"
                  type="number"
                />
              </Col>
            )}

            {/* Delete Icon Column */}
            <Col flex="10%" style={{ textAlign: "center" }}>
              <Popconfirm
                title={`Are you sure you want to delete this ${title}?`}
                onConfirm={() => handleDeleteRow(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <MinusCircleOutlined style={{ fontSize: 18, color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </Col>
          </Row>
        ))}
      </div>

      <Button type="dashed" onClick={handleAddRow} block icon={<PlusOutlined />} style={{ marginBottom: "20px" }}>
        <span className="delius-regular">Add {title}</span>
      </Button>
    </div>
  );
};

export default EditableList;
