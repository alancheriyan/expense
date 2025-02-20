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
  showHeading = true 
}) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector(dataSelector);
  const [isDisplayHeading, setIsDisplayHeading] = useState(true);
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
    if (showHeading !== undefined) {
      setIsDisplayHeading(showHeading);
    }
  }, []);

  // Local input change handler
  const handleInputChange = (id, value) => {
    setEditedValues((prev) => ({ ...prev, [id]: value }));
  };

  // Blur handler to update Redux state
  const handleInputBlur = (id) => {
    if (editedValues[id] !== undefined && editedValues[id] !== "") {
      dispatch(updateAction({ id, field: fieldName, value: editedValues[id] }));
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
        {data.map((item) => (
          <Row key={item.id} align="middle" style={{ marginBottom: "10px" }}>
            <Col flex="auto">
              <Input
                value={editedValues[item.id] !== undefined ? editedValues[item.id] : item[fieldName]}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                onBlur={() => handleInputBlur(item.id)}
                placeholder={`Enter ${title}`}
                className="delius-regular"
              />
            </Col>
            <Col flex="40px" style={{ textAlign: "center" }}>
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
