import React, { useState } from "react";
import ExpenseCategory from "./ExpenseCategory";
import { Typography, Button, Card, Divider, Row, Col } from "antd";
import { auth } from "../DataAcess/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import PaymentType from "./PaymentType";
import IncomeType from "./IncomeType";

const { Title } = Typography;

const SettingScreen = ({ categoriesCollection, onCategoriesChange, paymentTypeCollection, onPaymentTypeChange,incomeTypeCollection,onIncomeTypeChange }) => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userId");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Back Button (visible when a component is selected) */}
      {activeComponent && (
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setActiveComponent(null)} 
          style={{ position: "absolute", top: 35, left: 30, fontSize: "18px" }}
        />
      )}

      {/* Show the title only when settings screen is visible */}
      {!activeComponent && (
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }} className="delius-swash-caps-regular">
          Settings
        </Title>
      )}

      {/* Show the settings card when no component is selected */}
      {!activeComponent && (
        <Card>
          <Row>
            <Col span={24} onClick={() => setActiveComponent("ExpenseCategory")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Expense Category</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
            <Divider />
            <Col span={24} onClick={() => setActiveComponent("PaymentType")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Payment Type</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
            <Divider />
            <Col span={24} onClick={() => setActiveComponent("IncomeType")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Income Type</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
          </Row>
        </Card>
      )}

      {/* Show selected component and hide settings */}
      {activeComponent === "ExpenseCategory" && (
        <div style={{ marginTop: "50px" }}><ExpenseCategory data={categoriesCollection} onCategoriesChange={onCategoriesChange} /></div> 
      )}
      {activeComponent === "PaymentType" && (
        <div style={{ marginTop: "50px" }}><PaymentType data={paymentTypeCollection} onPaymentTypeChange={onPaymentTypeChange} /></div> 
      )}
       {activeComponent === "IncomeType" && (
        <div style={{ marginTop: "50px" }}><IncomeType data={incomeTypeCollection} onIncomeTypeChange={onIncomeTypeChange} /></div> 
      )}
     

      {/* Logout Button only appears if no component is selected */}
      {!activeComponent && (
        <Button 
          type="primary" 
          danger 
          style={{ width: "100%", padding: "10px", fontSize: "16px",marginTop:"20px" }} 
          onClick={handleLogout}
          className="delius-regular"
        >
          Logout
        </Button>
      )}
    </div>
  );
};

export default SettingScreen;
