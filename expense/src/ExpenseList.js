import React, { useState } from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { db } from "./firebase"; // Import your Firebase configuration
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,Timestamp  } from "firebase/firestore";
import { dbSetting } from './dbSetting';

const { Option } = Select;

export const ExpenseList = ({ dataList,currentDate,categories }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(dataList);


  const paymentTypes = [
    { id: "1", name: "Visa" },
    { id: "2", name: "LOC" },
    { id: "3", name: "PC" },
    { id: "4", name: "Debit Card" },
    { id: "5", name: "Cash" },

  ];

  const handleAddRow = async () => {
    try {
      const currentDateTimestamp = Timestamp.fromDate(currentDate);
      const docRef = await addDoc(collection(db, dbSetting.ExpenseTable), {
        amount: "",
        categoryId: "",
        paymentTypeId: "",
        date:currentDateTimestamp,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
      });
      setItems([
        ...items,
        { id: docRef.id, amount: "", categoryId: "", paymentTypeId: "" }, // Add row with Firebase ID
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteRow = async (index) => {
    const item = items[index];
    if (item.id) {
      try {
        await deleteDoc(doc(db, dbSetting.ExpenseTable, item.id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleInputChange = async (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    // Update Firestore document
    const item = updatedItems[index];
    if (item.id) {
      try {
        await updateDoc(doc(db, dbSetting.ExpenseTable, item.id), {
          [field]: value,
          updatedOn: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
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
            key={item.id || index}
            gutter={16}
            align="middle"
            style={{ marginBottom: 10 }}
          >
            <Col span={6}>
            <Form.Item>
              <Input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                step="0.01" 
                min="0" 
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
            <Col span={2} style={{ paddingBottom: "25px" }}>
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
