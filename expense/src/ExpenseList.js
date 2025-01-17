import React, { useState } from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export const ExpenseList = ({ dataList }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(dataList);

  // Predefined categories and payment types
  const categories = [
    { id: "1", name: "Food" },
    { id: "2", name: "Transport" },
    { id: "3", name: "Shopping" },
    { id: "4", name: "Utilities" },
  ];

  const paymentTypes = [
    { id: "1", name: "Visa" },
    { id: "2", name: "MasterCard" },
    { id: "3", name: "Amex" },
    { id: "4", name: "Debit Card" },
  ];

  const handleAddRow = () => {
    setItems([
      ...items,
      { amount: "", categoryId: "", paymentTypeId: "" }, // Add an empty row
    ]);
  };

  const handleDeleteRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={16} style={{ marginBottom: 10, fontWeight: "bold" }}>
        <Col span={6}>Amount</Col>
        <Col span={8}>Category</Col>
        <Col span={8}>Payment Type</Col>
        <Col span={2}></Col>
      </Row>
      <Form form={form} layout="vertical">
        {items.map((item, index) => (
          <Row
            key={index}
            gutter={16}
            align="middle"
            style={{ marginBottom: 10 }}
          >
            <Col span={6}>
              <Form.Item>
                <Input
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) =>
                    handleInputChange(index, "amount", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Select
                  placeholder="Select Category"
                  value={item.categoryId}
                  onChange={(value) =>
                    handleInputChange(index, "categoryId", value)
                  }
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Select
                  placeholder="Select Payment Type"
                  value={item.paymentTypeId}
                  onChange={(value) =>
                    handleInputChange(index, "paymentTypeId", value)
                  }
                  style={{ width: "100%" }}
                >
                  {paymentTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2} style={{paddingBottom:"25px"}}>
              <MinusCircleOutlined
                onClick={() => handleDeleteRow(index)}
                style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              />
            </Col>
          </Row>
        ))}
        <Row>
          <Col span={24}>
            <Button
              type="dashed"
              onClick={handleAddRow}
              block
              icon={<PlusOutlined />}
            >
              Add Row
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
