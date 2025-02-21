import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Typography,Empty } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { db } from "../DataAcess/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { dbSetting } from "../DataAcess/dbSetting";
import CustomizedSelectWithScrollList from "../Components/CustomizedSelectWithScrollList"

const { Title } = Typography;

export const SaveList = ({ dataList, currentDate, savingType }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(dataList);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const handleAddRow = async () => {
    try {
      const currentDateTimestamp = Timestamp.fromDate(currentDate);
      const docRef = await addDoc(collection(db, dbSetting.SavingMasterTable), {
        amount: "",
        savingTypeId: "",
        date: currentDateTimestamp,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId:userId,
      });
      setItems([
        ...items,
        { id: docRef.id, amount: "", savingTypeId: "" }, 
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteRow = async (index) => {
    const item = items[index];
    if (item.id) {
      try {
        await deleteDoc(doc(db, dbSetting.SavingMasterTable, item.id));
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
        await updateDoc(doc(db, dbSetting.SavingMasterTable, item.id), {
          [field]: value,
          updatedOn: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    const total = items.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    setTotalAmount(total);
  }, [items]);

 
  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {items.length > 0 && (
        <>
         <Row style={{ marginTop: "10px", marginLeft: "45%" }}>
        <Col span={24}>
          <Row justify="end">
            <Title
              level={5}
              className="delius-regular"
              style={{ fontSize: "16px", color: "rgb(156, 57, 57)" }}
            >
              Total: {totalAmount.toFixed(2)} CAD
            </Title>
          </Row>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 10, fontWeight: "bold" }}>
        <Col span={6}><span className="delius-heading">Amount</span></Col>
        <Col span={8}><span className="delius-heading">Saving Plan</span></Col>
        <Col span={2}></Col>
      </Row>
        </>
      )}
      <div
        style={{
          maxHeight: "660px",
          overflowY: "auto", 
          paddingRight: "10px", 
        }}
      >
        <Form form={form} layout="vertical">
          {items.length > 0 ? (
            items.map((item, index) => (
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
                      className="delius-regular"
                      value={item.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      step="0.01"
                      min="0"
                      inputMode="decimal" 
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item>
                    <CustomizedSelectWithScrollList 
                      data={savingType} 
                      onSelectedKeyChange={(key)=>handleInputChange(index, "savingTypeId",key)} 
                      drawerText="Select Saving Plan" 
                      defaultValue={item.savingTypeId}
                    />
                  </Form.Item>
                </Col>
                <Col span={2} style={{ paddingBottom: "25px" }}>
                  <MinusCircleOutlined
                    onClick={() => handleDeleteRow(index)}
                    style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No Saving Plan enteries today"
            />
          )}
        </Form>
      </div>
      <Row>
        <Col span={24}>
          <Button
            type="dashed"
            onClick={handleAddRow}
            block
            icon={<PlusOutlined />}
          >
            <span className="delius-regular">Add Saving</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};
